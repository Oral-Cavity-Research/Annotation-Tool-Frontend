import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import { useSelector} from 'react-redux';
import {List,ListItem , ListItemAvatar,Skeleton, Stack, Typography} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { CheckCircle, Comment, LockOpen,QuestionMark, RateReview, Save } from '@mui/icons-material';
import axios from 'axios';
import NotificationBar from '../NotificationBar';
import dayjs from 'dayjs';

const Icon = (name)=>{
  if(name === "New") return <Avatar sx={{bgcolor: 'black'}} ><LockOpen/></Avatar>
  else if(name === "Edited") return <Avatar sx={{bgcolor: 'orange'}} ><Save/></Avatar>
  else if(name === "Commented") return <Avatar sx={{bgcolor:'blueviolet'}} ><Comment /></Avatar>
  else if(name === "Marked As Resolved") return <Avatar sx={{bgcolor: 'blueviolet'}} ><CheckCircle/></Avatar>
  else if(name === "Approved") return <Avatar sx={{bgcolor: 'green'}} ><CheckCircle/></Avatar>
  else if(name === "Reviewed") return <Avatar sx={{bgcolor: 'red'}} ><RateReview/></Avatar>
  else if(name === "Reopened") return <Avatar sx={{bgcolor: 'black'}} ><LockOpen/></Avatar>
  else if(name === "Review Requested") return <Avatar sx={{bgcolor: 'green'}} ><QuestionMark/></Avatar>
  else if(name === "Changes Requested") return <Avatar sx={{bgcolor: 'red'}} ><QuestionMark/></Avatar>
  else return <Avatar sx={{bgcolor: 'gray'}} ><QuestionMark/></Avatar>
}

export default function EditHistory({image}) {

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({msg:"",severity:"success", open:false});
  const [data, setData] = useState([]);
  const userData = useSelector(state => state.data);
  const {id} = useParams();

  const showMsg = (msg, severity)=>{
    setStatus({msg, severity, open:true})
  }

  useEffect(()=>{
    setLoading(true);
    axios.get(`${process.env.REACT_APP_BE_URL}/image/action/${id}`,{
        headers: {
            'Authorization': `Bearer ${userData.accessToken.token}`,
            'email': userData.email,
        },
        withCredentials: true
    }).then(res=>{
        setData(res.data);
        setLoading(false);
    }).catch(err=>{
        if(err.response) showMsg(err.response.data.message, "error")
        else alert(err)
    })
  },[userData])

  return (
    <>
    {
      loading?
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <ListItem>
        <ListItemAvatar>
          <Skeleton variant='circular' width={40} height={40}/>
        </ListItemAvatar>
        <Skeleton variant='rectangular' width={'100%'} height={40} />
      </ListItem>
      <ListItem>
        <ListItemAvatar>
          <Skeleton variant='circular' width={40} height={40}/>
        </ListItemAvatar>
        <Skeleton variant='rectangular' width={'100%'} height={40} />
      </ListItem>
      <ListItem>
        <ListItemAvatar>
          <Skeleton variant='circular' width={40} height={40}/>
        </ListItemAvatar>
        <Skeleton variant='rectangular' width={'100%'} height={40} />
      </ListItem>
      </List>
      : 
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {
        data.map((item, index)=>(
          <ListItem key={index}>
            <ListItemAvatar>
              {Icon(item.action)}
            </ListItemAvatar>
              <Stack direction='column'>
                <Typography variant='body2'><b>{item.title}</b></Typography>
                <Typography variant='body2' color='GrayText'>{item.comment}</Typography>
                <Typography variant='body2' color='GrayText'>{item.action} {item.annotator?.username? `by ${item.annotator.username}`:""}</Typography>
                <Typography variant='body2' color='GrayText'>{dayjs(item.createdAt).format("DD/MM/YYYY")}</Typography>
              </Stack>
          </ListItem>
        ))
      } 
        <ListItem>
          <ListItemAvatar>
            {Icon("New")}
          </ListItemAvatar>
          <Stack direction='column'>
            <Typography variant='body2'><b>Created</b></Typography>
            <Typography variant='body2' color='GrayText'>{dayjs(image.createdAt).format("DD/MM/YYYY")}</Typography>
          </Stack>
        </ListItem>
      </List>
    }
    
    <NotificationBar status={status} setStatus={setStatus}/>
    </>
  );
}
