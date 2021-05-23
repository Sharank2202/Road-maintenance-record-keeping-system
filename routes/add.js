const express = require('express');
const router = express.Router();
const addController=require('../controllers/add')

router.post('/department/add',addController.addDepartment)
router.post('/agentSupplier/add',addController.addAgentSupplier)
router.post('/siteSupervisor/add',addController.addSiteSupervisor)
router.post('/equipment/add',addController.addEquipment)
router.post('/workOrder/add',addController.addWorkOrder)


module.exports=router;