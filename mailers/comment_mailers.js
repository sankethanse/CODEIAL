const nodemailer = require('../config/nodemailer');


exports.newComment = (comment) =>{
    console.log('inside newComment mailer', comment);
    nodemailer.transporter.sendMail({
        from : 'sankethanse@gmail.com',
        to : comment.user.email,
        subject: 'New Comment published',
        html:'<h1>yup, your comment is now published</h1>'
    }, (err,info)=>{
        if(err){
            console.log('error is sending mail', err);
            return;
        }
        console.log('Message Sent', info);
        return;
    });
}

exports.newPost = (post) =>{
    console.log('inside newComment mailer', comment);
    nodemailer.transporter.sendMail({
        from : 'sankethanse@gmail.com',
        to : post.user.email,
        subject: 'New Post published',
        html:'<h1>yup, your Post is now published</h1>'
    }, (err,info)=>{
        if(err){
            console.log('error is sending mail', err);
            return;
        }
        console.log('Message Sent', info);
        return;
    });
}