const Post = require("../models/post")
const User =require("../models/user")
module.exports.home=async function(req,res){
    // const posts = await Post.find({});
    // return res.render('homePage',{
    //     title : "Codeial | Home Page",
    //     posts: posts
    // })
     //populate user of each posts
    const posts = await Post.find({}).sort('-createdAt').populate('user').populate({path: 'comments', populate:{path:'user'}}).exec();
    // console.log(posts)
         const user =await User.find({})
        return res.render('homePage',{
                title : "Codeial | Home Page",
                posts: posts,
                all_user : user
            })
            
            
}



// module.exports.homeSignUp= function(req,res){
//     return res.redirect('/sign-up')
// }

// module.exports.homeSignIn= function(req,res){
//     return res.redirect('/sign-in')
// }
