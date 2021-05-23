const DirName=require('../util/path');
const express = require('express');
const router = express.Router();
const homeController=require('../controllers/home')




// app.get('/addDepartment',controller.addDepartment);
router.get('/department',homeController.department);
router.get('/equipment',homeController.equipment)
router.get('/workOrder',homeController.workOrder)
router.get('/agentSupplier',homeController.agentSupplier)
router.get('/siteSupervisor',homeController.siteSupervisor)
router.get('/installation',homeController.installation)
router.get('/dailyInspection',homeController.dailyInspection)
router.get('/home',homeController.home)
router.get('/engineer/dailyInspection',homeController.dailyInspectionEngineer)
router.post('/engineer/dailyInspection',homeController.dailyInspectionEngineerPost)
router.get('/engineer/workOrder',homeController.workorder)
router.get('/engineer/workOrder/description/:code',homeController.workorderDescription)
router.post('/signIn',homeController.signIn);
router.get('/',homeController.homeSignIn);










module.exports=router;