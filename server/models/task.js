import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  taskName: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Manager',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending',
  },
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);
export default Task;