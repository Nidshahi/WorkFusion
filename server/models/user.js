import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name:{type:String,required:true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:{type:String,enum:['employee','manager'],required:true},
  employee_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
  manager_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Manager', default: null },
  
});
// pre-save middleware that runs before the document is saved.
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
const User = mongoose.model('User', userSchema);
export default User;