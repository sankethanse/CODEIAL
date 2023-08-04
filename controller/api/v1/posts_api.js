const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index = async function(req, res){
    let posts = await Post.find({})
    .sort('-createdAt').populate('user')
    .populate({
        path: 'comments', 
        populate:{
          path:'user'
    }
});
    // const userSaved = await posts.save();
    // delete userSaved.password
    return res.status(200).json({
        message : "List of posts",
        posts : posts
    })
}

module.exports.destroy =async function(req,res){
    try{
        const post =await Post.findById(req.params.id)
        if(post.user == req.user.id){
            post.deleteOne();
            await Comment.deleteMany({post:req.params.id});

            return res.status(200).json({
                message : "post & associated comment deleted successfully"
            })
        }
        else{
            return res.status(401).json({
                message : "you cannot delete this post"
            })
        }
    }catch(err){
        console.log("****",err)
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
    
}