const express = require('express');
const router = express.Router();
const editController=require('../controllers/edit')


router.get('/agentSupplier/edit/:id',editController.editAgentSupplier);
router.get('/siteSupervisor/edit/:id',editController.editSiteSupervisor);
router.get('/equipment/edit/:id',editController.editEquipment);
router.get('/workOrder/edit/:id',editController.editWorkOrder);








module.exports=router;