let express= require('express')
let routing= express.Router()
let dbsetup= require('../public/javascripts/Model/dbSetup')
let user_mod= require('../public/javascripts/Model/user')
let User= require('../public/javascripts/utilities/User')
let Post = require('../public/javascripts/utilities/Post')
let multer= require('multer')

let storage= multer.diskStorage(
  {
    destination: function(req, file, cb){
      cb(null, 'uploads/')
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

routing.get('/fetchUserDet/:username', (req, res, next)=>{
    let username= req.params.username

    user_mod.findUser(username).then(
      (userDet)=>{
        res.json(userDet)
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
      user.profilePic= req.file.paths
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

routing.put('/editProfilePic/:uname', upload.single('profilePic'), (req, res, next) => {
  
  let uname= req.params.uname
  let newPath= req.file.path
  user_mod.updateProfilePic(uname, newPath).then(
    (data) => {
      res.send(data)
    }
  ).catch(
    (err) => {
      next(err)
    }
  )
})

routing.put('/editFullName/:uname', (req, res, next) => {
  
  let uname= req.params.uname
  let fullName= req.body.fullName
  user_mod.updateFullName(uname, fullName).then(
    (data) => {
      res.send(data)
    }
  ).catch(
    (err) => {
      next(err)
    }
  )
})

routing.put('/editBio/:uname', (req, res, next) => {
  
  let uname= req.params.uname
  let bio= req.body.bio
  user_mod.updateBio(uname, bio).then(
    (data) => {
      res.send(data)
    }
  ).catch(
    (err) => {
      next(err)
    }
  )
})

routing.put('/uploadPost/:userName', upload.single('postImg'), (req, res, next) => {
  let userName = req.params.userName
  let newPost = new Post(req.body)
  newPost.postImg = req.file.path
  newPost.uploadTime = new Date().toLocaleDateString()
  newPost.postName =  req.file.filename
  user_mod.addPost(userName, newPost).then(
    (data) => {
      res.send(data)
    }
  ).catch (
    (err) => {
      next(err)
    }
  )
})

routing.get('/fetchAllPosts', (req, res, next) => {
  user_mod.fetchAllPost().then(
    (data) => {
      res.json(data)
    }
  ).catch (
    (err) => {
      next(err)
    }
  )
})

routing.get('/fetchAllUserNames', (req, res, next) => {
  user_mod.fetchAllUserNames().then(
    (data) => {
      res.json(data)
    }
  ).catch (
    (err) => {
      next(err)
    }
  )
})

routing.put('/followUser/:uname/:to_follow', (req, res, next) =>{
  let uname= req.params.uname
  let to_follow= req.params.to_follow

  user_mod.followUser(uname, to_follow).then(
    (data) => {
      res.send(data)
    }
  ).catch(
    (err) => {
      next(err)
    }
  )
})

routing.get('/getFollowersPosts/:uname', (req, res, next) => {
  let uname= req.params.uname
  user_mod.getFollowersPost(uname).then(
    (posts) =>{
      res.json(posts)
    }
  ).catch(
    (err) => {
      next(err)
    }
  )
})

routing.get('/getMyPosts/:uname', (req, res, next) => {
  let uname= req.params.uname
  user_mod.getMyPost(uname).then(
    (posts) => {
      res.json(posts)
    }
  ).catch(
    (err) => {
      next(err)
    }
  )
})
module.exports= routing;
