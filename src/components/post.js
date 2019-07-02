import React from 'react';

function Post(props) {
    return (
        <div className="row">
            <div className="col-12">
                <div className="post card text-center w-75 mx-auto my-4" id={props.post.id} style={{'maxWidth': '500px'}}>
                    <div className="card-header">
                        <h4 className="float-left">{props.post.title}</h4>
                        <h4 className="float-right mr-2">{props.post.day}</h4>
                    </div>

                    <div className="card-body">
                        <img className="mb-4 text-center" src={props.post.image} alt="todays post" width='100%' />
                        <p>{props.post.caption}</p>
                    </div>

                    <div className="card-footer text-muted">
                        {props.post.date_posted}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Post;