import React from 'react';
import Post from './post.js';

function PostsBody(props) {
    let postsArr = props.posts.reverse();
    return (
        <div id="posts_body">
            {postsArr.map(post => <Post key={post.id} post={post} />)}
        </div>
    );
}

export default PostsBody;