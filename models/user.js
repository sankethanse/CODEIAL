const mongoose = require('mongoose')
const multer = require('multer');
const path = require('path');
const AVTAR_PATH = path.join('/uploads/users/avatars');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    avatar:{
        type: String
    }
    // confirm_password:{
    //     type: String,
    //     required: true
    // }
},
{
    timestamps: true
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'..', AVTAR_PATH))
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  });

  //static methods
  UserSchema.statics.uploadedAvatar = multer({storage:storage}).single('avatar');
  //path become publically available for file store
  UserSchema.statics.avatarPath = AVTAR_PATH;

const User = mongoose.model('User', UserSchema);

module.exports = User;