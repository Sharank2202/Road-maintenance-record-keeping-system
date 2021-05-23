const express = require('express');
const router = express.Router();
const reportController=require('../controllers/report')


router.get('/report/department/equipments/:code',reportController.departmentEquipmentsReport);
router.get('/report/department/engineers/:code',reportController.departmentEngineersReport);
router.get('/report/agent/equipments/:Id',reportController.agentEquipmentsReport);
router.get('/report/equipment/installation/:Id',reportController.equipmentInstallationReport);
router.get('/report/equipment/dailyInspection/:Id',reportController.equipmentDailyInspectionReport);
router.get('/report/dailyInspection/:code',reportController.dailyInspectionReport);

module.exports=router;