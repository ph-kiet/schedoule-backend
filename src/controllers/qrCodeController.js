import crypto from "crypto";
import Attendance from "../models/attendanceModel.js";
import User from "../models/userModel.js";
import calculateHoursAndMinutes from "../utils/calculateHoursAndMinutes.js";

const qrCheckIn = async (req, res) => {
  const { token } = req.body;
  const loggedInEmployeeID = req.user.id;

  if (!token || !loggedInEmployeeID) {
    return res.status(400).json({ error: "Token and employeeId are required" });
  }

  // If employee already checked in return attendance id
  const attendance = await checkIfCheckedIn(loggedInEmployeeID);
  if (attendance) {
    // Return if the employee already checked out for the day
    if (attendance.checkOutTime) {
      res.json({
        checkedOut: true,
        message: "Cannot check in again!",
      });
      return;
    }

    res.json({
      checkedIn: true,
      attendanceId: attendance._id,
    });
    return;
  }

  // Else employee will check in
  const [datePart, hashPart] = token.split(".");

  const today = new Date().toISOString().split("T")[0];
  let user = null
  try {
    user = await User.findOne({_id: loggedInEmployeeID}, { businessId: 1 })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to save check-in" });
  }

  // console.log(user)

  const validHash = crypto
    .createHmac("sha256", process.env.QR_CODE_SECRET)
    .update(datePart + user.businessId)
    .digest("hex")
    .slice(0, 10);
  
  if (datePart !== today || hashPart !== validHash) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  try {
    const attendance = await new Attendance({
      date: today,
      checkInTime: roundToQuarterHour(new Date()),
      checkOutTime: null,
      totalHours: 0,
      employeeId: loggedInEmployeeID,
      businessId: user.businessId,
    });

    attendance.save();

    res.json({
      success: true,
      checkInTime: attendance.checkInTime,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to save check-in" });
  }
};

const qrCheckOut = async (req, res) => {
  try {
    const attendance = await Attendance.findOne(req.attendanceId);

    // Return if the employee already checked out for the day
    if (attendance.checkOutTime) {
      res.json({
        checkedOut: true,
        message: "Cannot check in again!",
      });
      return;
    }

    // Set check out time
    attendance.checkOutTime = roundToQuarterHour(new Date());

    // Calculate total hours
    const checkIn = new Date(attendance.checkInTime)
    const checkOut = new Date(attendance.checkOutTime)
    const totalHours = calculateHoursAndMinutes(checkIn, checkOut)

    attendance.totalHours = totalHours.toFixed(2)

    await attendance.save()

    res.json({
      sucess: true,
      message: "Checked out successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// Ground the minutes to the nearest quarter. Ex 8:42 -> 8:45 | 8:37 -> 8:30
const roundToQuarterHour = (date) => {
  const newDate = new Date(date);
  const minutes = newDate.getMinutes();
  
  // Calculate which quarter hour is closest
  const quarter = Math.round(minutes / 15) * 15;
  
  // Set the minutes to the nearest quarter
  newDate.setMinutes(quarter);
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);
  
  return newDate;
};



const checkIfCheckedIn = async (employeeId) => {
  const date = new Date().toISOString().split("T")[0];
  let attendance = null;
  try {
    attendance = await Attendance.findOne({
      employeeId: employeeId,
      date: date,
    });
  } catch (error) {
    console.log(error);
  }
  return attendance;
};

export { qrCheckIn, qrCheckOut };
