import React, { useContext, useState, useEffect} from 'react';

import { Link } from 'react-router-dom';
import axios from 'axios';
import history from '../../utils/history';
import Context from '../../utils/context';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const ShowPost = (props) => {
    const context = useContext(context)

    const [stateLocal, setStateLocal] = useState({ comment: '',
                                                   fetched: false,
                                                   cid: 0,
                                                   delete_comment_id:0,
                                                   edit_comment_id: 0,
                                                   edit_comment: '',
                                                   comments_arr: null,
                                                   cur_user_id: null,
                                                   like_post: true,
                                                   likes: 0,
                                                   like_user_ids: [],
                                                   post_title: null,
                                                   post_body: null,
                                                   post_author: null,
                                                   post_id: null
                                                })

    useEffect(() => {
        if(props.location.state && !stateLocal.fetched){
            setStateLocal({...stateLocal,
                            fetched: true,
                            likes: props.location.state.post.post.likes,
                            like_user_ids: props.location.state.post.post.like_user_id,
                            post_title: props.location.state.post.post.title,
                            post_body: props.location.state.post.post.body,
                            post_author: props.location.state.post.post.author,
                            post_id: props.location.state.post.post.pid})
        }
    }, [stateLocal, props.location])

    useEffect(()=> {
        if(!props.location.state && !stateLocal.fetched){
            const post_id = props.location.pathname.substring(6)

            axios.get('/api/get/post',
                        {params: {post_id: post_id}} )
                .then(res => res.data.length !== 0
                    ? setStateLocal({...stateLocal,
                            fetched: true,
                            likes: res.data[0].likes,
                            like_user_ids: res.data[0].like_user_id,
                            post_title: res.data[0].title,
                            post_body: res.data[0].body,
                            post_author: res.data[0].author,
                            post_id: res.data[0].pid
                        })
                    : null
                    )
                .catch((err) => console.log(err) )
        }
    }, [stateLocal, props.location])

    useEffect(() => {
        if(!stateLocal.comments_arr) {
            if(props.location.state) {
                const post_id = props.location.pathname.substring(6)
                axios.get('/api/get/allpostcomments',
                        {params: {post_id: post_id}} )
                    .then(res => res.data.length !== 0
                            ? setStateLocal({...stateLocal, comments_arr: [...res.data]})
                            : null )
                    .catch((err) => console.log(err))
            }
        }
    }, [props.location,stateLocal])

    const handleCommentSubmit = (submitted_comment) => {
        if(stateLocal.comments_arr) {
            setStateLocal({...stateLocal, comments_arr: [submitted_comment,
                                                        ...stateLocal.comments_arr]})
        } else {
            setStateLocal({...stateLocal, comments_arr: [submitted_comment]})
        }
    };

    const handleCommentUpdate = (comment) => {
        const commentIndex = stateLocal.comments_arr.findIndex(com => com.cid === comment.cid)
        var newArr = [...stateLocal.comments_arr]
        newArr[commentIndex] = comment

        setTimeout(() => setStateLocal({...stateLocal, comments_arr: [...newArr], edit_comment_id: 0 }), 100)
    };

    const handleCommentDelete = (cid) => {
        setStateLocal({...stateLocal, delete_comment_id: cid})
        const newArr = stateLocal.comments_arr.filter(com => com.cid !== cid)
        setStateLocal({...stateLocal, comments_arr: newArr})
    };

    const handleEditFormClose = () => {
        setStateLocal({...stateLocal, edit_comment_id: 0})
    }

    const RenderComments = (props) => {
        return(
            <div className={stateLocal.delete_comment_id === props.comment.cid
                                ? "FadeOutComment"
                                : "CommentStyles"}>
                <div>
                    <p>{props.comment.comment}</p>
                    <small>
                        {props.comment.date_created === 'Just Now'
                         ? <div> {props.comment.isEdited
                                ? <span> Edited </span>
                                : <span> Just Now </span>}</div>
                         : props.comment.date_created
                        }
                    </small>
                    <p> By: {props.comment.author}</p>
                </div>  
            </div>
            
        )
    }
}