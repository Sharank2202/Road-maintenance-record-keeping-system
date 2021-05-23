const bcrypt = require('bcryptjs')
const Department = require('../models/department')
const AgentSupplier = require('../models/agent_supplier')
const SiteSupervisor=require('../models/site_supervisor')
const Equipment =require('../models/equipment')
const WorkOrders = require('../models/work_order')






exports.addDepartment=(req,res)=>{
 code=req.body.Code
 name=req.body.Name
 location=req.body.Location
 Department.create({Code:code,Name:name,Location:location}).then(dep =>{
 res.redirect('/department');
 }).catch(err=> {
    console.log("ERROR!!!!!!",err)
    })


}



exports.addAgentSupplier=(req,res)=>{
    id=req.body.Id
    name=req.body.Name
    address=req.body.Address
    phone=req.body.Phone
    email=req.body.Email
    notes=req.body.Notes
    AgentSupplier.findByPk(id).then(agentSupplier => {
        if(agentSupplier){
            agentSupplier.Id=id;
            agentSupplier.Name=name;
            agentSupplier.Address=address;
            agentSupplier.Phone=phone;
            agentSupplier.Email=email;
            agentSupplier.Notes=notes;
            return agentSupplier.save();
        }
        else{
            return AgentSupplier.create({Id:id,Name:name,Adress:address,
                    Phone:phone,Email:email,Notes:notes})
        }
   
   }).then(r => res.redirect('/agentSupplier'))
   .catch(err => console.log("ERROR!!!!!!",err))
}


exports.addSiteSupervisor=(req,res)=>{
    dssn=req.body.DSSN
    fname=req.body.FName
    lname=req.body.LName
    address=req.body.Address
    phone=req.body.Phone
    email=req.body.Email
    if(req.body.edit){
        image=req.body.Image
    }
    else{
        image=req.file.path.split('\\')
        if (image.length>1)
            image=req.file.path.split('\\').pop()
        else    
            image=req.file.path.split('/').pop()

    }
    age=req.body.Age
    workhours=req.body.workHours
    department=req.body.Department
    var departmentCode=null
    if(req.body.Password)   
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.Password, salt, (err, hash) => {
            pass=hash 
        });
        
    });
    
    
    
    Department.findOne({where:{Name:department}}).then(department => { 
        if (department){

            departmentCode=department.Code
            SiteSupervisor.findByPk(dssn).then(siteSupervisor=>{
                if(siteSupervisor){
                    siteSupervisor.DSSN=dssn
                    siteSupervisor.FName=fname
                    siteSupervisor.LName=lname
                    siteSupervisor.Adress=address
                    siteSupervisor.Phone=phone
                    siteSupervisor.Email=email
                    siteSupervisor.Image=image
                    siteSupervisor.Age=age
                    siteSupervisor.WorkHours=workhours
                    siteSupervisor.DepartmentCode=departmentCode
                    siteSupervisor.save().then(r => res.redirect('/siteSupervisor'))
                }
                else{
                    
                    SiteSupervisor.create({DSSN:dssn,FName:fname,
                            LName:lname,Adress:address,Phone:phone,Image:image,
                            Email:email,Age:age,WorkHours:workhours,
                            DepartmentCode:departmentCode,Password:pass
                        }).then(r => res.redirect('/siteSupervisor'))
                }
            })
        }
        else{
            res.render('error',{layout:false,pageTitle:'Error',href:'/siteSupervisor',message:'Sorry !!! Could Not Get this Department'})                

        }
    })
    .catch(err =>res.render('error',{layout:false,pageTitle:'Error',href:'/equipment',message:'Sorry !!! Could Not Get Site Supervisors'})                
    )

}

exports.addEquipment=(req,res) => {
    code=req.body.Code
    name=req.body.Name
    cost=req.body.Cost
    if(req.body.edit){
        image=req.body.Image
    }
    else{
        image=req.file.path.split('\\')
        if (image.length>1)
            image=req.file.path.split('\\').pop()
        else    
            image=req.file.path.split('/').pop()
    }
    model=req.body.Model
    serialnumber=req.body.SerialNumber
    installationdate=req.body.InstallationDate
    arrivaldate=req.body.ArrivalDate
    warrantydate=req.body.WarrantyDate
    manufacturer=req.body.Manufacturer
    location=req.body.Location
    department=req.body.Department
    agent=req.body.Agent
    pm=req.body.PM
    notes=req.body.Notes
    var departmentCode=null
    var agentCode=null
    Department.findOne({where:{Name:department}}).then(department => { 
        if (department){
            departmentCode=department.Code
            AgentSupplier.findOne({where:{Id:agent}}).then(agent =>{
                if(agent){
                    agentCode=agent.Id
                    Equipment.findByPk(code).then(equipment=>{
                        if(equipment){
                            equipment.Code=code
                            equipment.Name=name
                            equipment.Cost=cost
                            equipment.Image=image
                            equipment.Model=model
                            equipment.PM=pm
                            equipment.ArrivalDate=arrivaldate
                            equipment.WarrantyDate=warrantydate
                            equipment.Notes=notes
                            equipment.InstallationDate=installationdate
                            equipment.SerialNumber=serialnumber
                            equipment.Manufacturer=manufacturer
                            equipment.Location=location
                            equipment.DepartmentCode=departmentCode
                            equipment.AgentSupplierId=agentCode
                            equipment.save().then(equipment => res.redirect('/equipment'))
                        }
        
                        else
                        {
                            Equipment.create({Code:code,Name:name,Image:image,ArrivalDate:arrivaldate,WarrantyDate:warrantydate,PM:pm,
                                    Cost:cost,Model:model,SerialNumber:serialnumber,AgentSupplierId:agentCode,Notes:notes,
                                    Location:location,Manufacturer:manufacturer,InstallationDate:installationdate,DepartmentCode:departmentCode})
                                    .then(equipment => res.redirect('/equipment') )
                        }
                    })
                }
                else
                  res.render('error',{layout:false,pageTitle:'Error',href:'/equipment',message:'Sorry !!! Could Not Get this Agent'})                
            })
        }
        else{
            res.render('error',{layout:false,pageTitle:'Error',href:'/equipment',message:'Sorry !!! Could Not Get this Department'})
        }
    }).catch(err => {
        if(err)
         res.render('error',{layout:false,pageTitle:'Error',href:'/sparePart',message:'Sorry !!! Could Not Add This Engineer '})

          
    })

}

exports.addWorkOrder=(req,res) => {
    code =req.body.Code
    cost=req.body.Cost
    startdate=req.body.StartDATE
    enddate=req.body.EndDATE
    description=req.body.Description
    priority = req.body.Priority
    equipmentId=req.body.EquipmentCode
    engineerId=req.body.SiteSupervisorDSSN
    var equId=null
    var engId=null
    Equipment.findOne({where:{Code:equipmentId}}).then(equipment => { 
        if(equipment){
            equId=equipment.Code
            SiteSupervisor.findOne({where:{DSSN:engineerId}}).then(sitesupervisor =>{
                if(sitesupervisor){
                    engId = sitesupervisor.DSSN
                    WorkOrders.findByPk(code).then(workorder=>{
                        if(workorder){
                            workorder.StartDATE=startdate
                            workorder.EndDATE=enddate
                            workorder.Description=description
                            workorder.Cost=cost
                            workorder.EquipmentCode=equId
                            workorder.SiteSupervisorDSSN=engId
                            workorder.Priority=priority
                            workorder.save().then(workorder => res.redirect('/workOrder'))
                        }
                        else {
                            WorkOrders.create({StartDate:startdate,EndDate:enddate,Description:description,
                            Cost:cost,EquipmentCode:equId,SiteSupervisorDSSN:engId,Priority:priority})
                            .then(workorder => res.redirect('/workOrder') )
                            }
                   })
                }
            
       

                else
                  res.render('error',{layout:false,pageTitle:'Error',href:'/workOrder',message:'Sorry !!! Could Not Get this Engineer'})  
                  
                  
            })
            
        }
        else{
            res.render('error',{layout:false,pageTitle:'Error',href:'/workOrder',message:'Sorry !!! Could Not Get this Equipment'})
        }
    }).catch(err => {
        if(err)
         res.render('error',{layout:false,pageTitle:'Error',href:'/workOrder',message:'Sorry !!! Could Not Add This Work Order '})

          
    })

}