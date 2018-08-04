
var mongoose = require("mongoose");
const schema = mongoose.Schema;

// creating schema
const userSchema = new schema({
  username: String,
  password: String,
  email: String,
  location: String,
  phone: String,
  usertype:String,
  appliedjobs:[String],
  savedjobs:[String]
});

mongoose.model('users',userSchema);

//job
const jobSchema = new schema({
    title: String,
    description: String,
    keyword: String,
    location: String
  });

  mongoose.model('jobs',jobSchema);