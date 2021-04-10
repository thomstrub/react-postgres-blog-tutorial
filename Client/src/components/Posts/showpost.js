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

    useEffect(() => {})
}