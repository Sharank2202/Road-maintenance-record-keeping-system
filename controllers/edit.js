const AgentSupplier = require('../models/agent_supplier');
const SiteSupervisor = require('../models/site_supervisor');
const Equipment =require('../models/equipment')
const WorkOrder =require('../models/work_order');




exports.editAgentSupplier=(req,res)=>{
    id=req.params.id
    AgentSupplier.findByPk(id).then(agentSupplier =>{ 
        const as = {
              Name: agentSupplier.Name,
              Id: agentSupplier.Id,
              Adress: agentSupplier.Adress,
              Phone:agentSupplier.Phone,
              Email:agentSupplier.Email,
              Notes:agentSupplier.Notes
            }
    
        
    res.render('editAgentSupplier',{layout:'main-layout.handlebars' ,pageTitle:'Edit',
                                     AS:true,agentSupplier:as});
 })
    .catch(err => res.render('error',{layout:false,pageTitle:'Error',href:'/agentSupplier',message:'Sorry !!! Could Not Get this Agent'}))
    
 
 
 }



exports.editSiteSupervisor=(req,res) => {
    dssn=req.params.id
    SiteSupervisor.findOne({where:{DSSN:dssn},include:[{model:Department}]}).then(siteSupervisor => { 
        const cs = {
              FName: siteSupervisor.FName,
              LName: siteSupervisor.LName,
              DSSN: siteSupervisor.DSSN,
              Adress: siteSupervisor.Adress,
              Phone:siteSupervisor.Phone,
              WorkHours:siteSupervisor.WorkHours,
              Email:siteSupervisor.Email,
              Age:siteSupervisor.Age,
              Image:siteSupervisor.Image,
              RB:siteSupervisor.Department.Name =='R&B' ? true : false,
              MRTH:siteSupervisor.Department.Name =='MRTH' ? true:false,
              NHAI:siteSupervisor.Department.Name=='NHAI' ? true:false,
              IRCC:siteSupervisor.Department.Name == 'IRCC' ? true:false
            }
    
    console.log(cs)    
    res.render('editSiteSupervisor',{layout:'main-layout.handlebars' ,pageTitle:'Edit',
                                     CE:true,siteSupervisor:cs});
 })
 .catch(err => 
   {
   console.log(err)
   res.render('error',{layout:false,pageTitle:'Error',href:'/agentSupplier',message:'Sorry !!! Could Not Get this Engineer'})
   })
 
 }





 exports.editEquipment=(req,res)=>{
    code=req.params.id
    console.log("here")
    Equipment.findOne({where:{Code:code},include:[{model:Department}]}).then(equipment => {
        const eq = {
              Code: equipment.Code,
              Name: equipment.Name,
              Cost: equipment.Cost,
              InstallationDate: equipment.InstallationDate,
              WarrantyDate: equipment.WarrantyDate,
              ArrivalDate: equipment.InstallationDate,
              Model:equipment.Model,
              SerialNumber:equipment.SerialNumber,
              Manufacturer:equipment.Manufacturer,
              Location:equipment.Location,
              Notes:equipment.Notes,
              PM:equipment.PM,
              Image:equipment.Image,
              DepartmentCode:equipment.DepartmentCode,
              AgentSupplierId:equipment.AgentSupplierId,
              RB:equipment.Department.Name =='R&B' ? true : false,
              CSSD:equipment.Department.Name =='MRTH' ? true:false,
              NHAI:equipment.Department.Name=='NHAI' ? true:false,
              IRCC:equipment.Department.Name == 'IRCC' ? true:false
            }
   if(eq.PM =="Annualy"){
      res.render('editEquipment',{layout:'main-layout.handlebars' ,pageTitle:'Edit',
                                       Equipment:true,equipment:eq,A:true});

   }else{
      res.render('editEquipment',{layout:'main-layout.handlebars' ,pageTitle:'Edit',
            Equipment:true,equipment:eq,M:true});
   }     
   // res.render('editEquipment',{layout:'main-layout.handlebars' ,pageTitle:'Edit',
   //                                    Equipment:true,equipment:eq});  
    
        
 })
    .catch(err => console.log("ERROR!!!!!!",err) )

 }

exports.editWorkOrder=(req,res)=>{
   code = req.params.id
   WorkOrder.findByPk(code).then(workOrder=>{
      const wd = {
         Code:workOrder.Code,
         Cost:workOrder.Cost,
         StartDate:workOrder.StartDate,
         EndDate:workOrder.EndDate,
         Description:workOrder.Description,
         EquipmentCode:workOrder.EquipmentCode,
         Priority:workOrder.Priority,
         med:workOrder.Priority=='Medium'?true:false,
         high:workOrder.Priority=='High'?true:false,
         low:workOrder.Priority=='Low'?true:false,
         SiteSupervisorDSSN:workOrder.SiteSupervisorDSSN 

      }

   res.render('editWorkOrder',{layout:'main-layout.handlebars',pageTitle:'Edit',
                                       WO:true,workOrder:wd});



   })

     .catch(err=>console.log("errorrrrr",err))

}