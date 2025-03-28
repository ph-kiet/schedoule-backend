import Business from "../models/businessModel.js";
import User from "../models/userModel.js";
import Roster from "../models/rosterModel.js";
import Attendance from "../models/attendanceModel.js";
import calculateHoursAndMinutes from "../utils/calculateHoursAndMinutes.js";

const getAllEmployeesByBusinessCode = async (req, res) => {
  const loggedInUserID = req.user.id;

  try {
    const businessId = await Business.findOne(
      { ownerId: loggedInUserID },
      { _id: 1 }
    );

    const listOfEmployees = await User.find(
      { businessId: businessId, accountType: "EMPLOYEE" },
      { password: 0 }
    );

    res.status(200).json({ listOfEmployees: listOfEmployees });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTimeSheetByWeek = async (req, res) => {
  const loggedInUserID = req.user.id;

  const startDate = new Date(req.params.startDate);
  const endDate = new Date(startDate);

  endDate.setDate(startDate.getDate() + 6);
  endDate.setHours(23, 59, 59, 999);

  try {
    const rosters = await Roster.find({
      employeeId: loggedInUserID,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    const attendances = await Attendance.find({
      employeeId: loggedInUserID,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    // Create a map of attendance data by date (for efficient lookup)
    const attendanceMap = {};
    attendances.forEach((att) => {
      const dateKey = att.date.toISOString().split('T')[0]; // e.g., "2025-03-24"
      attendanceMap[dateKey] = {
        actualStart: att.checkInTime || null,
        actualEnd: att.checkOutTime || null,
        totalHours: att.totalHours || null,
      };
    });

    // Combine roster and attendance data
    const weeklyData = [];
    let rosterTotalHours = 0;
    let actualTotalHours = 0;

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateKey = currentDate.toISOString().split('T')[0];

      const roster = rosters.find((r) => r.date.toISOString().split('T')[0] === dateKey);
      const attendance = attendanceMap[dateKey] || {};

      // Calculate roster hours for this day if roster exists
      let rosterHours = null;
      if (roster) {
        const start = new Date(roster.shiftStart);
        const end = new Date(roster.shiftEnd);
        rosterHours = calculateHoursAndMinutes(start, end)// Convert ms to hours
        rosterTotalHours += rosterHours;
      }

      // Use attendance totalHours if available
      const actualHours = attendance.totalHours || null;
      if (actualHours !== null) {
        actualTotalHours += actualHours;
      }

      weeklyData.push({
        date: dateKey,
        rosterStart: roster ? roster.shiftStart : null,
        rosterEnd: roster ? roster.shiftEnd : null,
        actualStart: attendance.actualStart || null,
        actualEnd: attendance.actualEnd || null,
        totalHours: actualHours,
      });
    }

    // Round totals to 2 decimal places for readability
    rosterTotalHours = Number(rosterTotalHours.toFixed(2));
    actualTotalHours = Number(actualTotalHours.toFixed(2));

    res.status(200).json({
        weeklyData,
        rosterTotalHours,
        actualTotalHours,
      });
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
};

export { getAllEmployeesByBusinessCode, getTimeSheetByWeek };
