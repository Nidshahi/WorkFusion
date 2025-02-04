import mongoose from 'mongoose';

const managerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  employees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }] // Array of employees managed by the manager
});

const Manager = mongoose.model('Manager', managerSchema);
export default Manager;