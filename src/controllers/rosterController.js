import Business from "../models/businessModel.js"
import Roster from '../models/rosterModel.js'
/* -------------------------------------------------- /api/roster/ -------------------------------------------------- */
// POST /
// Create new roster
const createNewRoster = async (req, res) => {
    const {employeeId, date, shiftStart, shiftEnd, breakTime} = req.body
    const loggedInUserID = req.user.id
    
    try{
        const businessId = await Business.findOne({ownerId: loggedInUserID}, { _id: 1 })

        const newRoster = new Roster({employeeId,
                                    businessId,
                                    date,
                                    shiftStart: new Date(shiftStart),
                                    shiftEnd: new Date(shiftEnd),
                                    breakTime}) 

        await newRoster.save()

        res.status(200).json({newRoster: newRoster})

    }catch(err){
        res.status(500).json({error: err.message})
    }
}


// GET /current-week
// Get current week roster by employeeId
const getCurrentWeekRosterByEmployeeId = async (req, res) => {
    const loggedInUserID = req.user.id

    
}


const getRosterByMonthAndYear = async (req, res) => {
    try{
        const loggedInUserID = req.user.id

        const businessId = await Business.findOne({ownerId: loggedInUserID}, { _id: 1 })

        const { year, month } = req.params;

        const yearNum = parseInt(year);
        const monthNum = parseInt(month);

        if (isNaN(yearNum) || isNaN(monthNum)) {
            return res.status(400).json({ error: 'Year and month must be numbers' });
        }

        if (monthNum < 1 || monthNum > 12) {
            return res.status(400).json({ error: 'Month must be between 1 and 12' });
        }

        if (yearNum < 2000 || yearNum > 9999) {
            return res.status(400).json({ error: 'Year must be a valid 4-digit number' });
        }

        const monthIndex = monthNum - 1;
        const startDate = new Date(yearNum, monthIndex, 1);
        const endDate = new Date(yearNum, monthIndex + 1, 1);

        const rosters = await Roster.find({
            date: {
              $gte: startDate,
              $lt: endDate
            },
            businessId: businessId
          })
          .populate('employeeId', ['firstName', 'lastName'])
          .sort({ date: 1, shiftStart: 1 });
    
        res.status(200).json(rosters);
    }catch(err) {
        console.log(err)
        res.status(500).json({error: err.message})
    }
}

const updateAssignedRoster = async (req, res) => {
    try {
        const loggedInUserID = req.user.id
        
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}


export {createNewRoster, getRosterByMonthAndYear, updateAssignedRoster}