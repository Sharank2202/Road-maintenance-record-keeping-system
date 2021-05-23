const bcrypt = require('bcryptjs')
const Department =require('../models/department');
const AgentSupplier =require('../models/agent_supplier');
const SiteSupervisor =require('../models/site_supervisor');
const Equipment =require('../models/equipment');
const WorkOrder=require('../models/work_order');
const DailyInspection = require('../models/daily_inspection');
const moment=require('moment')

exports.homeSignIn=(req,res) => {
    res.render('newHome',{layout:false});
}


exports.signIn=(req,res) => {
   email=req.body.email
   pass=req.body.password
   if(email == 'admin@gmail.com' && pass==0000){
    res.redirect('/home');  
   }
   else{
       if(email == 'admin@gmail.com' && pass != 0000){
        res.redirect('/views/error.handlebars');
    }
    else{
        SiteSupervisor.findOne({where:{Email:email}}).then(sitesupervisor => {
            if(sitesupervisor){
             bcrypt.compare(pass, sitesupervisor.Password).then(result => {
                 if(result){
                  req.session.DSSN=sitesupervisor.DSSN
                  res.redirect('/engineer/dailyInspection');  
                 }
                 else
                 res.redirect('/views/error.handlebars');    
                 })
            }
            else
            res.redirect('/views/error.handlebars');  
        })
    }
   }
   
}

exports.home=(req,res) =>{
    res.render('home',{pageTitle:'Home',Home:true});
}
exports.dailyInspectionEngineer=(req,res) =>{
    engineerId=req.session.DSSN
    Equipment.findAll({include:[{model:Department}]}).then(equipments => {
        const eqs=equipments.map(equipment => {
            return{
                Name:equipment.Name,
                Code:equipment.Code,
                Department:equipment.Department.Name
            }
        })
        SiteSupervisor.findByPk(engineerId).then(engineer => {
            const Engineer ={
                Image:engineer.Image,
                FName:engineer.FName,
                LName:engineer.LName
            }
        res.render('dailyInspectionForm',{layout:'siteSupervisorLayout',pageTitle:'Daily Inspection',
        DI:true,equipments:eqs,Engineer:Engineer})
        })
    })
}

exports.dailyInspectionEngineerPost=(req,res) =>{
 code = req.body.Code
 date = req.body.DATE
 q1 = req.body.Q1
 q2 = req.body.Q2
 q3 = req.body.Q3
 q4 = req.body.Q4
 q5 = req.body.Q5
 q6 = req.body.Q6
 q7 = req.body.Q7
 q8 = req.body.Q8
 equipmentId = req.body.Device
 engineerId=req.session.DSSN


 q1 = q1 == "on" ? "on": "off"
 q2 = q2 == "on" ? "on": "off"
 q3 = q3 == "on" ? "on": "off"
 q4 = q4 == "on" ? "on": "off"
 q5 = q5 == "on" ? "on": "off"
 q6 = q6 == "on" ? "on": "off"
 q7 = q7 == "on" ? "on": "off"
 q8 = q8 == "on" ? "on": "off"

 
     

 
 Equipment.findByPk(equipmentId).then(equipment => { 
     if(equipment){
         SiteSupervisor.findByPk(engineerId).then(sitesupervisor =>{
             if(sitesupervisor){
                    DailyInspection.create({DATE:date,Q1:q1,Q2:q2,Q3:q3,Q4:q4,Q5:q5,Q6:q6,Q7:q7,Q8:q8,EquipmentCode:equipmentId,SiteSupervisorDSSN:engineerId})
                        .then(dailyinspection => res.redirect('/engineer/dailyInspection') )
            }
            else{
                res.render('error',{layout:false,pageTitle:'Error',href:'/engineer/dailyInspection',message:'Sorry !!! Could Not Get this Engineer'})
            } 
         })   
     }
     else{
         res.render('error',{layout:false,pageTitle:'Error',href:'/engineer/dailyInspection',message:'Sorry !!! Could Not Get this Equipment'})
     }
 }).catch(err => {
     if(err){
         console.log(err)
      res.render('error',{layout:false,pageTitle:'Error',href:'/engineer/dailyInspection',message:'Sorry !!! Could Not Add This Report '})
     }
       
 })

}

exports.department=(req,res)=>{
Department.findAll({
    include:[{model:SiteSupervisor},{model:Equipment}]
    }).then(departments => {
        const deps = departments.map(department => {       
            return {
                        Name: department.Name,
                        Code: department.Code,
                        Location: department.Location,
                        Engineers:department.SiteSupervisors.length,
                        Equipments:department.Equipment.length
                    }
                })      

    res.render('department',{pageTitle:'Department',
                            Department:true,
                            departments:deps,
                            hasDepartment:deps.length>0});
                    
}).catch(err => {
    if(err){
        console.log(err)    
        res.render('error',{layout:false,pageTitle:'Error',href:'/home',message:'Sorry !!! Could Not Get Departments'})
     }
    })


}

exports.siteSupervisor=(req,res)=>{
    SiteSupervisor.findAll({include:[{model:Department}]}).then(siteSupervisors=>{
        const sitesupervisors=siteSupervisors.map(sitesupervisor => {     
            return{
                DSSN:sitesupervisor.DSSN,
                FName:sitesupervisor.FName,
                LName:sitesupervisor.LName,
                Image:sitesupervisor.Image,
                Adress:sitesupervisor.Adress,
                Phone:sitesupervisor.Phone,
                Email:sitesupervisor.Email,
                Age:sitesupervisor.Age,
                WorkHours:sitesupervisor.WorkHours,
                DepartmentCode:sitesupervisor.Department.Name
            }

        })
        res.render('siteSupervisor',{pageTitle:'Site Supervisor',CE:true,
                                siteSupervisors:sitesupervisors,hasEngineers:sitesupervisors.length>0});
    })
    .catch(err => {
        if(err)
         res.render('error',{layout:false,pageTitle:'Error',href:'/home',message:'Sorry !!! Could Not Get Engineers'})
    })
    
}

exports.agentSupplier=(req,res)=>{
    AgentSupplier.findAll().then(agentsuppliers => {
        const as = agentsuppliers.map(agentsupplier => {
                  return {
                    Name: agentsupplier.Name,
                    Id: agentsupplier.Id,
                    Adress: agentsupplier.Adress,
                    Phone:agentsupplier.Phone,
                    Email:agentsupplier.Email,
                    Notes:agentsupplier.Notes
                  }
                })

    res.render('agentSupplier',{pageTitle:'Suppliers',
                                AS:true,agentSuppliers:as,
                                hasAgentSupplier:as.length>0});
    }).catch(err => {
        if(err)
        res.render('error',{layout:false,pageTitle:'Error',href:'/home',message:'Sorry !!! Could Not Get Suppliers'})
    })
}

exports.workOrder=(req,res)=>{

  WorkOrder.findAll({include:[{model:SiteSupervisor},{model:Equipment}]}).then(workorders => {
        const wd = workorders.map(workD => {
                  return {
                    Code:workD.Code,
                    Cost:workD.Cost,
                    StartDate:workD.StartDate,
                    EndDate:workD.EndDate,
                    med:workD.Priority=='Medium'?true:false,
                    high:workD.Priority=='High'?true:false,
                    low:workD.Priority=='Low'?true:false,
                    EquipmentCode:workD.Equipment.Code,
                    EquipmentName:workD.Equipment.Name,
                    EquipmentImage:workD.Equipment.Image,
                    Priority:workD.Priority,
                    Description:workD.Description,
                    SiteSupervisor:workD.SiteSupervisor.FName+' '+workD.SiteSupervisor.LName,
                    SiteSupervisorImage:workD.SiteSupervisor.Image             
                  }
                })

        SiteSupervisor.findAll().then(siteSupervisors => {
            const en=siteSupervisors.map(siteSupervisor => {
                return {
                    FName:siteSupervisor.FName,
                    LName:siteSupervisor.LName,
                    DSSN:siteSupervisor.DSSN
                }
            })
        Equipment.findAll({include:[{model:Department}]}).then(equipments => {
            const eq = equipments.map(equipment => {
                return{
                    Code:equipment.Code,
                    Name:equipment.Name,
                    DepartmentName:equipment.Department.Name
                }
            }) 
            res.render('workOrder',{pageTitle:'WorkOrder',
                                        WorkOrder:true,Workorders:wd,
                                        hasWorkOrder:wd.length>0,WO:true,Engineers:en,Equipments:eq});
        })    
        })       

    }).catch(err => {
        if(err)
          console.log(err)
          res.render('error',{layout:false,pageTitle:'Error',href:'/home',message:'Sorry !!! Could Not Get WorkOrders'})
    })

}

exports.equipment=(req,res)=>{
    Equipment.findAll({
        include:[{model:Department},{model:AgentSupplier}]
        }).then(equipments => {
        const eq = equipments.map(equipment => {
                  return {
                    Code: equipment.Code,
                    Name: equipment.Name,
                    Cost: equipment.Cost,
                    PM:equipment.PM,
                    Image:equipment.Image,
                    InstallationDate: equipment.InstallationDate,
                    ArrivalDate:equipment.ArrivalDate,
                    WarrantyDate:equipment.WarrantyDate,
                    Model:equipment.Model,
                    SerialNumber:equipment.SerialNumber,
                    Manufacturer:equipment.Manufacturer,
                    Location:equipment.Location,
                    Notes:equipment.Notes,
                    DepartmentCode:equipment.Department.dataValues.Name,
                    AgentSupplierId:equipment.AgentSupplier.dataValues.Name
                  }
                })

            AgentSupplier.findAll().then(agents => {
                const ag = agents.map(agent => {
                    return {
                        Name:agent.Name,
                        Id:agent.Id
                    }
                })        
        res.render('equipment',{pageTitle:'Equipment',Equipment:true,
                                equipments:eq,hasEquipments:eq.length>0,Agents:ag});
            })               
    }).catch( err => {
        if(err)
         res.render('error',{layout:false,pageTitle:'Error',href:'/home',message:'Sorry !!! Could Not Get Equipments'})
        })


   
}


exports.installation=(req,res)=>{
    Equipment.findAll({
        include:[{model:Department},{model:AgentSupplier}]
        }).then(equipments => {
        const eq = equipments.map(equipment => {
                  return {
                    Code: equipment.Code,
                    Name: equipment.Name,
                    Cost: equipment.Cost,
                    PM:equipment.PM,
                    Image:equipment.Image,
                    InstallationDate: equipment.InstallationDate,
                    ArrivalDate:equipment.ArrivalDate,
                    WarrantyDate:equipment.WarrantyDate,
                    Model:equipment.Model,
                    SerialNumber:equipment.SerialNumber,
                    Manufacturer:equipment.Manufacturer,
                    Location:equipment.Location,
                    Notes:equipment.Notes,
                    DepartmentCode:equipment.Department.dataValues.Name,
                    AgentSupplierId:equipment.AgentSupplier.dataValues.Name
                  }
                })
        res.render('installationTable',{pageTitle:'Installation',Reports:true,
                                reports:eq,hasReports:eq.length>0});
    }).catch( err => {
        if(err)
         res.render('error',{layout:false,pageTitle:'Error',href:'/',message:'Sorry !!! Could Not Get Reports'})
        })
}

exports.dailyInspection=(req,res)=>{
 DailyInspection.findAll({include:[{model:Equipment},{model:SiteSupervisor}]})
 .then(reports => {
    const reps=reports.map(report => {
        return{
            Code:report.Code,
            DATE:report.DATE,
            Engineer:report.SiteSupervisor.FName +' '+ report.SiteSupervisor.LName ,
            Equipment:report.Equipment.Name,
            eq:true,
            EquipmentModel:report.Equipment.Model
        }

 })
 res.render('dailyinspectionTable',{pageTitle:'Daily Inspection',
    Reports:true,eq:true,reports:reps,hasReports:reps.length>0 })  
}).catch(err => {
    res.render('error',{layout:false,pageTitle:'Error',href:'/',message:'Sorry !!! Could Not Get Report'})

})

}


exports.workorder=(req,res) =>{
dssn=req.session.DSSN
WorkOrder.findAll({where:{SiteSupervisorDSSN:dssn}}).then(orders => {
    var events=orders.map(order => {
        return{
            title:order.Description,
            color:order.Priority == 'Low' ? 'green' :order.Priority == 'High' ? 'red': 'blue' ,
            start:(order.StartDate.split('-')[0]+'-'+order.StartDate.split('-')[1]+'-'+order.StartDate.split('-')[2])+' '+'00:00:00Z',
            end:(order.EndDate.split('-')[0]+'-'+order.EndDate.split('-')[1]+'-'+order.EndDate.split('-')[2])+' '+'23:00:00Z',
            url:'/engineer/workOrder/description/'+order.Code
        }

    })

    SiteSupervisor.findByPk(engineerId).then(engineer => {
        const Engineer ={
            Image:engineer.Image,
            FName:engineer.FName,
            LName:engineer.LName
        }
        
    res.render('calender',{layout:false,WO:true,events:events,pageTitle:'calender',Engineer:Engineer})
    })

}).catch(err => {
    res.render('error',{layout:false,pageTitle:'Error',href:'/',message:'Sorry !!! Could Not Get Orders'})

})

}

exports.workorderDescription=(req,res)=>{
    code=req.params.code
    engineerId=req.session.DSSN
    WorkOrder.findOne({where:{Code:code},include:[{model:Equipment}]}).then(order => {
        var order={
            Code:order.Code,
            EquipmentName:order.Equipment.Name,
            EquipmentModel:order.Equipment.Model,
            EquipmentCode:order.Equipment.Code,
            Priority:order.Priority,
            Cost:order.Cost,
            StartDate:order.StartDate,
            EndDate:order.EndDate,
            Description:order.Description

        }
        SiteSupervisor.findByPk(engineerId).then(engineer => {
            const Engineer ={
                Image:engineer.Image,
                FName:engineer.FName,
                LName:engineer.LName
            }
        res.render('workOrderDetails',{layout:'siteSupervisorLayout',pageTitle:'Work Order',
                WO:true,order:order,Engineer,Engineer})
        })    
    }).catch(err => {
        res.render('error',{layout:false,pageTitle:'Error',href:'/',message:'Sorry !!! Could Not Get Work Orders'})

    })
}





