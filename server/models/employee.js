import mongoose, { mongo } from 'mongoose';

const employeeSchema = new mongoose.Schema({
  id:{type:Number,required:true},
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  department: { type: String, required: true },
  phone: { type: Number, required: true },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'Manager' ,required:false},
  tasks:[{type:mongoose.Schema.Types.ObjectId,ref:'Task'}] // Reference to the manager
});


const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;