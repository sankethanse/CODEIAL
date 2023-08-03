const User = require('../models/user')
const fs = require('fs');
const path=require('path');
// module.exports.profile = function(req, res){
//     return res.render('profile', {
//         title: "User Profile",
//     })
// }

module.exports.profile =async function(req, res){
    const user =await User.findById(req.params.id)
    // console.log(user);
        return res.render('profile', {
            title: 'User Profile',
            profile_user: user
        });

}

// module.exports.update = async function(req,res){
//     if(req.user.id == req.params.id){
//         await User.findByIdAndUpdate(req.params.id , req.body)
//         return res.redirect('back')
//     }
//     else{
//         return res.status(401).send('Unauthorised')
//     }
// }

module.exports.update = async function(req,res){
    if(req.user.id == req.params.id){
         try{
        let user = await User.findById(req.params.id);
        User.uploadedAvatar(req , res ,function(err){
            if(err){
                console.log('*****MulterError', err)
            }
            user.name = req.body.name;
            user.email = req.body.email;

            if(req.file){

                if (user.avatar){
                    fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                }

                // this is saving the path of the uploaded file into the avatar field in the user
                user.avatar = User.avatarPath + '/'+ req.file.filename
            }
            user.save();
            return res.redirect('back');
        })
    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
}
    else{
        return res.status(401).send('Unauthorised')
    }
}

module.exports.signUp= function(req,res){
    // console.log(req.cookies);
    // res.cookie('user_id',111)
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up',{
        title : "Codeial | Sign Up",
    })
}

module.exports.signIn= function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in',{
        title : "Codeial | Sign In",
    })
}

// module.exports.profile=  function(req,res){
//     if(req.cookies.user_id){
//         const user =  User.findById(req.cookies.user_id);
//         console.log(user)
//         if(user){
//             return res.render('profile',{
//                 title : "Codeial | Profile",
//                 user:user
//             })
//         }
//         else{
//             return res.redirect('/sign-in')
//         }
//     }
//     else{
//         return res.redirect('/sign-in')
//     }
// }

// module.exports.profile = async function(req, res){
//     if (req.cookies.user_id){
//         const user = await User.findById(req.cookies.user_id)
//             if (user){
//                 return res.render('profile', {
//                     title: "User Profile",
//                     user: user
//                 })
//             }else{
//                 return res.redirect('/users/sign-in');

//             }
//     }else{
//         return res.redirect('/users/sign-in');

//     }


    
// }



// get the sign up data
module.exports.create = function(req,res){
   if(req.body.password != req.body.confirm_password){
    return res.redirect('back')
   }
   console.log(req.body.password)
   const user = User.findOne({email: req.body.email})
    .then((user) =>{
    if(!user){
        User.create(req.body);
        return res.redirect('/users/sign-in');
    }else{
        return res.redirect('back')
    }})
    .catch((err) => console.log(err));
}

// module.exports.create = async function(req,res){
//     if(req.body.password != req.body.confirm_password){
//      return res.redirect('back')
//     }
//     const user =await User.findOne({email: req.body.email});
//      if(!user){
//          const newUser = await User.create(req.body)
//              return res.redirect('/sign-in')
//          }
//          else{
//          return res.redirect('back')
//          }
//  }

    

// get the sign in data (manual authentication)

// module.exports.createSession = function(req,res){
//     const user = User.findOne({email: req.body.email})
//     .then((user) =>{
//         if(user){
//             if(user.password != req.body.password){
//                 return res.redirect('back')
//                }
//                res.cookie('user_id',user.id)
//             return res.redirect('/profile');
//         }else{
//             return res.redirect('back')
//         }})
//         .catch((err) => console.log(err));
// }

// get the sign in data (express authentication)

module.exports.createSession = function(req,res){
    req.flash('success', 'Logged in Successfully')
    return res.redirect('/');
}

module.exports.destroySession = function(req, res, next){
    
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', 'You Have Logged Out!')
        res.redirect('/');
      });
    
  }
