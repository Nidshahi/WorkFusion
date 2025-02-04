import express from 'express';
const router = express.Router();
import userController from '../controllers/userController.js';
import { verifyToken } from '../middleware/verifyToken.js';
const { loginUser, registerUser,insertEmpData,departmentlist ,empData,makeGroup,getgdata,getEdata,getgbyid,Tasks,taskAssign,statusUpdate} = userController;
router.get('/departments',departmentlist);
router.post('/login', loginUser);
router.post(['/register','/login/register'],registerUser);
router.post('/uploadEmployees',verifyToken,insertEmpData);
router.get('/employees',empData);
router.post('/groups',verifyToken,makeGroup);
router.get('/groups',getgdata);
router.get('/groups/:id',getgbyid);
router.get('/employees/:empId',getEdata);
router.post('/tasks',Tasks);
router.get('/tasks/assigned',verifyToken,taskAssign);
router.put('/tasks/:taskId',verifyToken,statusUpdate)
export default router;