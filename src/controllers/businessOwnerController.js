import Business from "../models/businessModel.js"
import User from '../models/userModel.js'
import Roster from '../models/rosterModel.js'
import Attendance from '../models/attendanceModel.js'
import bcrypt from 'bcryptjs'
import generateRandomPassword from '../utils/randomPassword.js'
import QRCODE from 'qrcode'
import generateDailyToken from "../utils/generateDailyToken.js"
import calculateHoursAndMinutes from "../utils/calculateHoursAndMinutes.js";
/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Employee >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */
// POST /employee
// Create a new employee
const createEmployee = async (req, res) => {
    try{
        const loggedInUserID = req.user.id

        const businessId = await Business.findOne({ownerId: loggedInUserID}, { _id: 1 })

        const {username, firstName, lastName, email, phoneNumber, position} = req.body

        let user = await User.findOne({username})
        if(user){
            return res.status(422).json({message: `${username} is taken!`})
        }


        user = new User({
            username: username,
            // password: await bcrypt.hash(generateRandomPassword(12), 10),
            password: await bcrypt.hash('password', 10),
            accountType: "EMPLOYEE",
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNumber: phoneNumber,
            position: position,
            businessId: businessId
        })

        await user.save();

        res.status(200).json({user: user})

    }catch(err){
        res.status(500).json({error: err.message})
    }
}

// PATCH /employee
// Update employee details
const updateEmployee = async (req, res) => {
    const loggedInUserID = req.user.id

    try{
        const businessId = await Business.findOne({ownerId: loggedInUserID}, { _id: 1 })
        const { username } = req.params;
        const { firstName, lastName, position, email, phoneNumber } = req.body;

        const user = await User.findOneAndUpdate({ username: username, businessId: businessId, accountType: "EMPLOYEE" }, 
                                                {firstName, lastName, position, email, phoneNumber},
                                                {new: true, select: '-password'});
        
        if(!user) return res.status(404).json({ message: 'Username is not found!'});

        res.status(200).json({updatedEmployee: user})

    } catch(err){
        res.status(500).json({error: err.message})
    }
}

// DELETE /employee
// Delete an employee 
const deleteEmployee = async (req, res) => {
    try{
        const loggedInUserID = req.user.id
        const businessId = await Business.findOne({ownerId: loggedInUserID}, { _id: 1 })

        const { username } = req.params

        const deletedEmployee = await User.findOneAndDelete({ username, businessId, accountType: "EMPLOYEE" })

        if(!deletedEmployee) return res.status(404).json({ message: `User ${username} is not found!` })

        res.status(200).json({deletedEmployee: deletedEmployee})
    } catch(err){
        res.status(500).json({error: err.message})
    }
}
/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Employee <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> QR Code >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */
// GET /qr-code
const generateQRCode = async (req, res) => {
    const qrConfig = {
        errorCorrectionLevel: "H",
        type: 'image/png',
        scale: 10,
    }

    try {
        const loggedInUserID = req.user.id;
        const businessId = await Business.findOne(
          { ownerId: loggedInUserID },
          { _id: 1 }
        );
    
        const qrCodeToken = generateDailyToken(businessId._id)
        
        const qrUrl = `http://localhost:3000/attendance?token=${qrCodeToken}`

        const qrCodeImage = await QRCODE.toDataURL(qrUrl, qrConfig)
        
        res.json({
            qrCode: qrCodeImage,
            qrCodeToken: qrCodeToken,
            expires: new Date(new Date().setHours(23, 59, 59, 999)).toISOString(),
        });
    
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to generate QR code' });
      }

}
/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< QR Code <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Business >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */
// Get /business
// Get bussines details
const getBusinessDetails = async (req, res) => {
    const loggedInUserID = req.user.id

    try {
        const business = await Business.findOne({ownerId: loggedInUserID}, {_id: 0, name: 1, code: 1, address: 1,location: 1})

        return res.status(200).json({business: business})

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}


const updateBusinessDetails = async (req, res) => {
    const loggedInUserID = req.user.id
    const {name, address, location} = req.body
    try {
        const business = await Business.findOneAndUpdate({ownerId: loggedInUserID}, {name, address, location},  {new: true})

        if(!business) return res.status(404).json({message: "Business Not Found"})
        
        res.status(200).json({business: {name: business.name, code: business.code, address: location.address, location: business.location}})
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}

/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Business <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */


/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Time Sheet >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */
const getTimeSheetByWeek = async (req, res) => {
    const loggedInUserID = req.user.id;

    const startDate = new Date(req.params.startDate);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);

    try {
        // Get the business ID for the logged-in user
        const business = await Business.findOne(
            { ownerId: loggedInUserID },
            { _id: 1 }
        );
        const businessId = business._id;

        // Fetch rosters and attendances for all employees under this business
        const rosters = await Roster.find({
            businessId: businessId,
            date: {
                $gte: startDate,
                $lte: endDate,
            },
        });

        const attendances = await Attendance.find({
            businessId: businessId,
            date: {
                $gte: startDate,
                $lte: endDate,
            },
        });

        // Fetch all employees for this business to get their names
        const employees = await User.find(
            { businessId: businessId },
            { _id: 1, firstName: 1, lastName: 1 }
        );
        // Create a map of employee IDs to full names
        const employeeNameMap = {};
        employees.forEach(emp => {
            employeeNameMap[emp._id.toString()] = `${emp.firstName} ${emp.lastName}`;
        });

        // Group data by employee
        const employeeTimesheets = {};

        // Process rosters
        rosters.forEach((roster) => {
            const employeeId = roster.employeeId.toString();
            if (!employeeTimesheets[employeeId]) {
                employeeTimesheets[employeeId] = {
                    weeklyData: {},
                    rosterTotalHours: 0,
                    actualTotalHours: 0
                };
            }
            const dateKey = roster.date.toISOString().split('T')[0];
            employeeTimesheets[employeeId].weeklyData[dateKey] = {
                ...employeeTimesheets[employeeId].weeklyData[dateKey],
                rosterStart: roster.shiftStart,
                rosterEnd: roster.shiftEnd
            };
        });

        // Process attendances
        attendances.forEach((att) => {
            const employeeId = att.employeeId.toString();
            if (!employeeTimesheets[employeeId]) {
                employeeTimesheets[employeeId] = {
                    weeklyData: {},
                    rosterTotalHours: 0,
                    actualTotalHours: 0
                };
            }
            const dateKey = att.date.toISOString().split('T')[0];
            employeeTimesheets[employeeId].weeklyData[dateKey] = {
                ...employeeTimesheets[employeeId].weeklyData[dateKey],
                actualStart: att.checkInTime || null,
                actualEnd: att.checkOutTime || null,
                totalHours: att.totalHours || null
            };
        });

        // Calculate hours and format response
        const result = Object.entries(employeeTimesheets).map(([employeeId, data]) => {
            const weeklyDataArray = [];
            let rosterTotalHours = 0;
            let actualTotalHours = 0;

            for (let i = 0; i < 7; i++) {
                const currentDate = new Date(startDate);
                currentDate.setDate(startDate.getDate() + i);
                const dateKey = currentDate.toISOString().split('T')[0];
                
                const dayData = data.weeklyData[dateKey] || {};

                // Calculate roster hours if present
                let rosterHours = null;
                if (dayData.rosterStart && dayData.rosterEnd) {
                    const start = new Date(dayData.rosterStart);
                    const end = new Date(dayData.rosterEnd);
                    rosterHours = calculateHoursAndMinutes(start, end);
                    rosterTotalHours += rosterHours;
                }

                // Add daily data to array
                weeklyDataArray.push({
                    date: dateKey,
                    rosterStart: dayData.rosterStart || null,
                    rosterEnd: dayData.rosterEnd || null,
                    actualStart: dayData.actualStart || null,
                    actualEnd: dayData.actualEnd || null,
                    totalHours: dayData.totalHours || null,
                });

                // Add actual hours to total
                if (dayData.totalHours) {
                    actualTotalHours += dayData.totalHours;
                }
            }

            return {
                employeeId,
                employeeName: employeeNameMap[employeeId] || 'Unknown Employee',
                weeklyData: weeklyDataArray,
                rosterTotalHours: Number(rosterTotalHours.toFixed(2)),
                actualTotalHours: Number(actualTotalHours.toFixed(2))
            };
        });

        res.status(200).json({
            timeSheets: result,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Time Sheet <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */


export {createEmployee, updateEmployee, deleteEmployee, generateQRCode, getBusinessDetails, updateBusinessDetails, getTimeSheetByWeek}