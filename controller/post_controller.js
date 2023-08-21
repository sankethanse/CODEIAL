const Post = require('../models/post')
const Comment = require('../models/comment')
const commentMailer = require('../mailers/comment_mailers');
module.exports.create = async function(req,res){
    try{
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });
        req.flash('success', 'Post Published');
        // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
        const resPost = await Post.findById(post.id).populate('user', 'name email');
        commentMailer.newPost(resPost)
        if(req.xhr){
            return res.status(200).json({
                
                data:{
                    post:resPost
                },
                message: "post created!" 
            })
            
        }
        
        return res.redirect('back');
    }catch(err){
        req.flash('error', err);
        return;
    }
    
}


module.exports.destroy =async function(req,res){
    try{
        const post =await Post.findById(req.params.id)
        if(post.user == req.user.id){
            post.deleteOne();
            await Comment.deleteMany({post:req.params.id});
            if(req.xhr){
                return res.status(200).json({
                    data:{
                        post_id:req.params.id
                    },
                    message: "post Deleted!" 
                })
                
            }
            req.flash('success', 'Post deleted!');

            return res.redirect('back');
        }
        else{
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error', err);
        return;
    }
    
}