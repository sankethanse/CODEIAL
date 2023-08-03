{   
    // method to submit the form data for new post using ajax
    let createPost = function(){
        let newPostForm = $('#new-post-form')

        newPostForm.submit (function(e){
            e.preventDefault();
            $.ajax({
                type : 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function(data){
                  console.log(data);
                  let newPost= newPostDom(data.data.post);
                  $('#post-list-container>ul').prepend(newPost);
                  deletePost($('.delete-post-button',newPost));

                //   new PostComments(data.data.post._id);
                  new Noty({
                    theme: 'relax',
                    text: "Post published!",
                    type: 'success',
                    layout: 'topRight',
                    timeout: 1500
                    
                }).show();
                },
                error : function(error){
                   console.log(error.responseText);
                }
            })
        });
    }
      

    //method to create post in dom
    let newPostDom = function(post){
        return $(`<li id="post-${post._id}">
        <p>
            <small>
                <a class="delete-post-button" href="/posts/destroy/${post._id}">X</a>
            </small>
        ${ post.content}
        <br>
        <small>
            ${post.user.name}
        </small>
        </p>
        <div class="post-comments">
            <form action="/comments/create" method="POST">
                <input type="text" name="content" placeholder="Type here to add comment..." required>
                <input type="hidden" name="post" value="${ post._id}">
                <input type="submit" value="Add Comment">
            </form> 
            <div class="post-comments-list">
                <ul id="post-comments-${post._id}">
                </ul>
            </div>
        </div>
    </li>`)
    }




    //method to delete post from DOM
    let deletePost= function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                //from href we get value of a tag
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#post-${data.data.post_id}`).remove();
                    new Noty({
                        theme: 'relax',
                        text: "Post Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                  },
                  error : function(error){
                     console.log(error.responseText);
                  }
            })
        })
    }

    createPost();
}