const AgentSupplier = require('../models/agent_supplier')
const SiteSupervisor=require('../models/site_supervisor')
const Equipment =require('../models/equipment')
const WorkOrder=require('../models/work_order')


exports.deleteAgentSupplier=(req,res)=>{
    id=req.params.id
    AgentSupplier.findByPk(id).then(agentSupplier =>{ 
     agentSupplier.destroy().then(res.redirect('/agentSupplier'))
     
 })
     .catch(err => console.log("ERROR!!!!!!",err) )
 
 
 }


 exports.deleteSiteSupervisor=(req,res)=>{
    dssn=req.params.id
    SiteSupervisor.findByPk(dssn).then(siteSupervisor =>{ 
     siteSupervisor.destroy().then( res.redirect('/siteSupervisor'))
    
 })
    .catch(err => console.log("ERROR!!!!!!",err) )
 
 
 }


 exports.deleteEquipment=(req,res)=>{
    code=req.params.id
    Equipment.findByPk(code).then(equipment =>{ 
     equipment.destroy().then(res.redirect('/equipment'))
     
 })
    .catch(err => console.log("ERROR!!!!!!",err) )
 }

 exports.deleteWorkOrder=(req,res)=>{
    code=req.params.id
    WorkOrder.findByPk(code).then(workorder=>{ 
    console.log(code)
     workorder.destroy().then( res.redirect('/workOrder'))
    
 })
    .catch(err => console.log("ERROR!!!!!!",err) )
 }