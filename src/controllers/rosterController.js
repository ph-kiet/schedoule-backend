import Business from "../models/businessModel.js"
import Roster from '../models/rosterModel.js'
import User from '../models/userModel.js'
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
const getRosterByMonthAndYearByEmployeeId = async (req, res) => {
    try{
        const loggedInUserID = req.user.id

        const user = await User.findOne({_id: loggedInUserID}, { _id: 1, businessId: 1})

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
            employeeId: user.id,
            date: {
              $gte: startDate,
              $lt: endDate
            },
            businessId: user.businessId
          })
          .populate('employeeId', ['firstName', 'lastName'])
          .sort({ date: 1, shiftStart: 1 });
        res.status(200).json(rosters);
    }catch(err) {
        console.log(err)
        res.status(500).json({error: err.message})
    }
}

// GET /byMonthAndYear/:month/:year
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

// PUT /
// Update roster
const updateAssignedRoster = async (req, res) => {
    try {
        const loggedInUserID = req.user.id;
        const business = await Business.findOne({ ownerId: loggedInUserID }, { _id: 1 });

        const { rosters } = req.body;

        if (!Array.isArray(rosters) || rosters.length === 0) {
            return res.status(400).json({ error: "Rosters must be a non-empty array" });
        }

        const savedRosters = [];

        for (const roster of rosters) {
            const rosterData = {
                employeeId: roster.employeeId,
                businessId: business._id,
                date: new Date(roster.date),
                shiftStart: new Date(roster.shiftStart),
                shiftEnd: new Date(roster.shiftEnd),
                breakTime: roster.breakTime || 0,
            };

            let saved;
            if (roster.rosterId) {
                saved = await Roster.findByIdAndUpdate(
                    roster.rosterId,
                    rosterData,
                    { new: true }
                ).populate('employeeId', 'firstName lastName');
            } else {
                saved = await Roster.create(rosterData);
                await saved.populate('employeeId', 'firstName lastName'); // Populate after save
            }

            savedRosters.push(saved);
        }

        return res.status(200).json(savedRosters);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
};

// DELETE /
// Delete roster
const deleteRoster = async (req, res) => {
    try {
        const rosterId = req.params.id;
        const roster = await Roster.findByIdAndDelete(rosterId);
        if (!roster) {
          return res.status(404).json({ message: 'Roster not found' });
        }
        res.status(200).json({ message: 'Roster deleted successfully' });
      } catch (error) {
        console.error('Error deleting roster:', error);
        res.status(500).json({ message: 'Server error' });
      }
}

export {createNewRoster, getRosterByMonthAndYear, updateAssignedRoster, deleteRoster, getRosterByMonthAndYearByEmployeeId}