const express = require('express');
const router = express.Router();
const deleteController=require('../controllers/delete')


router.get('/agentSupplier/delete/:id',deleteController.deleteAgentSupplier);
router.get('/siteSupervisor/delete/:id',deleteController.deleteSiteSupervisor);
router.get('/equipment/delete/:id',deleteController.deleteEquipment);
router.get('/workOrder/delete/:id',deleteController.deleteWorkOrder);





module.exports=router;