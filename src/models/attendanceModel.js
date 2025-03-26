import mongoose from "mongoose";

const attendanceSchema = mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  checkInTime: {
    type: Date,
    required: false,
  },
  checkOutTime: {
    type: Date,
    required: false,
  },
  totalHours: {
    type: Number,
    required: false,
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
    required: true,
  },
});

export default mongoose.model("Attendance", attendanceSchema);
