import React, { useContext, useState, useEffect } from 'react';
import Context from '../utils/context';

import { Link } from 'react-router-dom';
import history from '../utils/history';
import axios from 'axios';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

const Profile = () => {
    const context = useContext(Context)

    const [stateLocal, setStateLocal] = useState({open: false,
                                                  post_id:null,
                                                  posts: []
                                                })

    useEffect(() => {
        const user_id = context.dbProfileState[0].user_id
        axios.get('/api/get/userposts', {params: {user_id: user_id}})
            .then((res) => setStateLocal({...stateLocal, posts: [...res.data] }))
            .catch((err) => console.log(err))
    });
    
    const handleClickOpen = (pid) => {
        setStateLocal({open: true, post_id: pid})
    }

    const handleClickClose = () => {
        setStateLocal({open: false, post_id: null})
    }

    const DeletePost = () => {
        const post_id = stateLocal.post_id
        axios.delete('api/delete/postcomments', {data: {post_id: post_id}} )
            .then(() => axios.delete('/api/delete/post', {data: {post_id: post_id}} ) 
                .then(res => console.log(res) ) )
            .catch(err => console.log(err))
            .then(() => handleClickClose())
            .then(() => setTimeout(() => history.replace('/'), 700) )
    }

    const RenderProfile = (props) => {
        return(
            <div>
                <h1>{props.profile.profile.nickname}</h1>
                <br />
                <img src={props.profile.profile.picture} alt="" />
                <br />
                <h4> {props.profile.profile.email} </h4>
                <br />
                <h5> { props.profile.profile.name } </h5>
                <br />
                <h6> Email Verified: </h6>
                { props.profile.profile.email_verified ? <p>Yes</p> : <p>No</p> }
                <br />
            </div>
        )
    }

    const RenderPosts = post => (
        <Card style={{width: '500px', height: '200px', marginBottom: '10px', paddingBottom: '80px'}}>
            <CardHeader
                title={<Link to={{pathname: '/post/' + post.post.pid, state: {post}}}>
                    {post.post.title}
                    </Link>}
                subheader={
                    <div className="FlexColumn">
                        <div className="FlexRow">
                            {post.post.date_created}
                        </div>
                        <div className="FlexRow">
                            <Link to={{pathname: '/editpost/' + post.post.pid, state:{post} }}>
                                <button>
                                    Edit
                                </button>
                            </Link>
                            <button onClick={() => handleClickOpen(post.post.pid) }>
                                Delete
                            </button>
                        </div>
                    </div>
                }
                />
            <br />
            <CardContent>
                <span style={{overflow: 'hidden'}}> {post.post.body} </span>
            </CardContent>
        </Card>
    );

    return(
        <div>
            <div>
                <RenderProfile profile={context.dbProfileState} />
            </div>
            <div>
                {stateLocal.posts
                    ? stateLocal.post.map(post =>
                        <RenderPosts post={post} key={post.pid} />
                    )
                    : null
                    }
            </div>
            <Dialog
                open={stateLocal.open}
                onClose={handleClickClose}
                aria-labelledby="alert-dialog-title"
                aria-describeby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title"> Confirm Delete? </DialogTitle>
                    <DialogContent>
                        <DialogContentText
                            id="alert-dialog-description"
                        >
                            Deleting Post
                        </DialogContentText>
                        <DialogActions>
                            <Button onClick={() => DeletePost()}> Agree </Button>
                            <Button onClick={() => handleClickClose()}> Cancel </Button>
                        </DialogActions>
                    </DialogContent>
            </Dialog>
        </div>
    )

}

export default (Profile);