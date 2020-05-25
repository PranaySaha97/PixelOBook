let express= require('express')
let routing= express.Router()
let dbsetup= require('../public/javascripts/Model/dbSetup')
let user_mod= require('../public/javascripts/Model/user')
let User= require('../public/javascripts/utilities/User')
let multer= require('multer')

let storage= multer.diskStorage(
  {
    destination: function(req, file, cb){
      cb(null, 'uploads/profilePics/')
    },

    filename: function(req, file, cb){
      cb(null, new Date().toDateString() + file.originalname)
    }
  }
)
let upload= multer({
  storage: storage, 
  limits: {
  fileSize: 1024 * 1024 * 5,
  },
  fileFilter: (req, file, cb) =>{
    if(file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
      cb(null, true)
    }else{
      let err= new Error('Invalid file type.')
      err.status= 400
      cb(err , false)
    }
  }
})

routing.get('/setupDb', (req, res, next) => {
    dbsetup.setupDb().then((data) => {
        res.send(data)
    }).catch((err) => {
        next(err)
    })
})

routing.get('/fetchUsername/:username/:password', (req, res, next)=>{
    let username= req.params.username
    let password= req.params.password

    user_mod.findUser(username, password).then(
      (fullName)=>{
        res.json(fullName)
      }
    ).catch(
      (err)=>{
        next(err)
      }
    )
})


routing.post('/registerUser', upload.single('profilePic') , (req, res, next)=>{
    let user= new User(req.body)
    if (req.file){
      user.profilePic= req.file.path
    }
    user_mod.regUser(user).then(
      (data) => {
        res.json(data)
      }
    ).catch(
      (err) => {
        next(err)
      }
    )
})

module.exports= routing;
