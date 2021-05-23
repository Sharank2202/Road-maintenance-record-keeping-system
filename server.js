const express = require('express');
const path = require('path')
const exphbs=require('express-handlebars');
const bodyParser=require('body-parser');
const multer =require('multer');
const DirName=require('./util/path');
const sequelize=require('./util/db')
const session=require('express-session');
const site_supervisor=require('./models/site_supervisor');
const department=require('./models/department');
const agent_supplier=require('./models/agent_supplier');
const equipment=require('./models/equipment');
const work_order=require('./models/work_order');
const daily_inspection=require('./models/daily_inspection');
const homeController=require('./routes/main');
const addController=require('./routes/add');
const deleteController=require('./routes/delete')
const editController=require('./routes/edit')
const reportController=require('./routes/report')




const app = express();
app.use(bodyParser.urlencoded({extended:false}))
app.use(session({secret:'anysecret',resave:false,saveUninitialized:false}));
const filestorage =multer.diskStorage ({
  destination:(req,file,cb) => {
    cb(null,'public/images');
  },
  filename:(req,file,cb) => {
    cb(null,'image'+'_'+file.originalname);
  }
})
const filefilter = ( req ,file,cb) => {
if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'  )
{
  cb(null,true);
} else{
 cb(null,false);
}
}

app.use(multer({storage:filestorage,fileFilter:filefilter}).single('image'));


app.use(express.static(DirName+'/public/'));
app.engine('handlebars', exphbs({layoutsDir:'views/layouts/',defaultLayout:'main-layout',partialsDir:'views/includes/'}));
app.set('view engine', 'handlebars');
app.set('views','views');



// app.use(multer({dest:'images/'}).single('image'))
app.use(reportController);
app.use(editController);
app.use(deleteController);
app.use(addController);
app.use(homeController);
app.use((req,res)=>{
  res.render('error',{layout:false,href:'/',pageTitle:'404 Error',message:'Sorry ! Could Not Get This Page'})
})

site_supervisor.belongsTo(department);
department.hasMany(site_supervisor);
work_order.belongsTo(site_supervisor);
site_supervisor.hasMany(work_order);
equipment.belongsTo(agent_supplier);
agent_supplier.hasMany(equipment);
equipment.belongsTo(department);
department.hasMany(equipment);
work_order.belongsTo(equipment);
equipment.hasMany(work_order);
daily_inspection.belongsTo(equipment);
equipment.hasMany(daily_inspection);
daily_inspection.belongsTo(site_supervisor);
site_supervisor.hasMany(daily_inspection)

// synchronizing with database 
sequelize.sync()
//sequelize.sync({force:true})
.then(res => {
    app.listen(5000,() => {
        console.log('Running at localhost:5000')
       })
      
    })
    .catch(err => {
      console.log("err:" ,err);
    })

