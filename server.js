var express = require('express'),
    app=express(),
    mongoose=require('mongoose'),
    bodyParser=require('body-parser'),
    cors=require('cors');

    mongoose.Promise = global.Promise;
    mongoose.Promise=require('q').Promise;


app.use(cors());

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/jobportal');
var db=mongoose.connection;


require("./model/schema.js");
const user_model = mongoose.model("users");
const postjob_model=mongoose.model("jobs");



//REGISTRATION
//

app.post("/register", function (req, res) {
    var newUser = {
      username: req.body.registerform.username,
      password: req.body.registerform.password,
      email: req.body.registerform.email,
      location: req.body.registerform.location,
      phone: req.body.registerform.phone,
      usertype: req.body.registerform.usertype
    };
    new user_model(newUser).save().then(function (user) {
      res.send(true);
      console.log(user);
    });
  });




//LOGIN
//

app.post("/login", function (req, res) {
    user_model.findOne({username: req.body.loginform.username})
    .then(user => {
      if (
        user.username == req.body.loginform.username &&
        user.password == req.body.loginform.password
      ) {
        res.send(user);
      } else {
        res.send(false);
      }
    });
  });




//COMPANY
//

app.get("/jobs", function (req, res) {
    postjob_model.find({}).then(jobs => {
      //console.log(jobs);
      res.send(jobs);
    }).catch(() => {
      res.send("not jobs");
    })
  
  });




//POST JOB
//
app.post("/postjob", function (req, res) {
    
    var newJob = {
        title: req.body.postjob.title,
        description: req.body.postjob.description,
        keyword: req.body.postjob.keyword,
        location: req.body.postjob.location
    }
    
    new postjob_model(newJob).save().then(function (job) {
        //console.log(job);
        res.send(true);
    }, 
    function (error){
        console.log("data not saved");
    });

});




  
//JOBSEEKER
//-

app.get("/users/:username", function (req, res) {
    
    user_model.findOne({username: req.params.username})
    .then(user => {
        res.send(user);
    })
    .catch(() => {
        res.send("user not found");
    })

});



//saving the job
//
app.get("/save/:id/:user", function(req, res){
    console.log(req.params.id);
    user_model.findOne({ username: req.params.user })
    .then((userdata) => {
        //console.log(userdata);
        if (userdata.savedjobs.includes(req.params.id)) {
            
            var index = userdata.savedjobs.indexOf(req.params.id);
            //console.log(index);
        if (index > -1) {
            userdata.savedjobs.splice(index, 1);
          }
        }
        else {
          userdata.savedjobs.push(req.params.id);
          //console.log(userdata.savedjobs);
        }
        //console.log("after:"+user);
        userdata.save().then((updateddata) => {
            //console.log(updateddata);
          res.send(updateddata);
        },
        function (error){
            console.log("data not saved in saved jobs");
        });
    })
    .catch(()=>{
        res.send("user not found");
    });

});



//applying for job
//
app.get("/apply/:id/:user", function(req, res) {

    user_model.findOne({ username: req.params.user})
    .then((userdata) => {

        //console.log(userdata);
        if (userdata.appliedjobs.includes(req.params.id)) {

          var index = userdata.appliedjobs.indexOf(req.params.id);

          if (index > -1) {

            userdata.appliedjobs.splice(index, 1);
          }
        }
        else {
          userdata.appliedjobs.push(req.params.id);
          //console.log(userdata.appliedjobs);
        }

        userdata.save().then((updateddata) => {
            //console.log(updateddata);
          res.send(updateddata);
        },
        function(err){
            console.log('data not saved in appliedjobs');
        })
    })
    .catch(()=>{
        res.send("user not found");
    });
  
  });




//saved jobs

app.get("/savedjobs/:user", function(req, res){
    user_model.findOne({username: req.params.user})
    .then((userdata) => {
        //console.log(userdata);
        postjob_model.find({_id: { $in: userdata.savedjobs }})
        .then((users) => {
            console.log(users);
            res.send(users);
        })
        .catch(()=>{
            res.send("users not found");
        })
    })
    .catch(()=>{
        res.send("userdata not found");
    });

});




//Applied jobs
/
app.get("/appliedjobs/:user", (req, res) => {

    user_model.findOne({username: req.params.user})
    .then((userdata) => {
        //console.log(userdata);
        postjob_model.find({_id: { $in: userdata.appliedjobs }})
        .then((users) => {
            //console.log(users);
            res.send(users);
        })
        .catch(()=>{
            res.send("users not found");
        });
    })
    .catch(()=>{
        res.send("userdata not found");
    });
});






//SEARCH JOB
//
app.get('/search/:title/:keyword/:location',function(req,res){
    req.params.title=="undefined"?req.params.title="":req.params.title=req.params.title;
    req.params.keyword=="undefined"?req.params.keyword="":req.params.keyword=req.params.keyword;
    req.params.location=="undefined"?req.params.location="":req.params.location=req.params.location;

    //console.log("modified",req.params);     

    postjob_model.find({

        title: new RegExp('.*'+req.params.title+'.*', "i"),
        keyword: new RegExp('.*'+req.params.keyword+'.*', "i"),
        location: new RegExp('.*'+req.params.location+'.*', "i")

      })
      .then((jobs)=>{

      console.log(jobs);
      res.send(jobs);

    })
    .catch((err)=>{
        console.log(err);
    });
  })


  
//

db.on('error',function(){
    console.log('error');

});
db.on('open',function(){
    console.log('connection established!!');

});


app.get('/',function(req,resp){

    resp.sendFile(__dirname+'/index.html');
})



app.listen(3000,function(){
    console.log("server running @localhost:3000")
})