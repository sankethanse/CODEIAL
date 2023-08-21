const Comment = require('../models/comment');
const Post = require('../models/post')
const commentMailer = require('../mailers/comment_mailers');

module.exports.create =async function(req,res){
    try{
        const post =await Post.findById(req.body.post)
        req.flash('success', 'Comment published!');
        if(post){
            let comment = await Comment.create({
                content : req.body.content,
                post : req.body.post,
                user : req.user._id
            });
            post.comments.push(comment);
            post.save();
            comment = await comment.populate('user', 'name email');
            commentMailer.newComment(comment);
            res.redirect('/');
        }
    }catch(err){
        req.flash('error', err);
        return;
    }
}


module.exports.destroy =async function(req,res){
    try{
        const comment =await Comment.findById(req.params.id)

    if(comment.user == req.user.id){
        let postId = comment.post;
        comment.deleteOne();
        await Post.findByIdAndUpdate(postId, {$pull: {comments: req.params.id}})
        req.flash('success', 'Comment deleted!');
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