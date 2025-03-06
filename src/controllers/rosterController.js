

/* -------------------------------------------------- /api/roster/ -------------------------------------------------- */
// POST /
// Create new roster
const createNewRoster = async (req, res) => {
    const {employeeId, businessId, date, shiftStart, shiftEnd, breakTime} = req.body
    
}


// GET /current-week
// Get current week roster by employeeId
const getCurrentWeekRosterByEmployeeId = async (req, res) => {
    const userId = req.user.id
    

}

export {createNewRoster}