import React, {useEffect, useState} from 'react';
import { useSelector} from 'react-redux';
import {Avatar, Box, Pagination, Skeleton, Stack, Typography} from '@mui/material';
import axios from 'axios';
import NotificationBar from '../components/NotificationBar';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

export default function Approved() {

    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState({msg:"",severity:"success", open:false});
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const userData = useSelector(state => state.data);
    const navigate = useNavigate();

    const showMsg = (msg, severity)=>{
        setStatus({msg, severity, open:true})
    }

    const handleClick = (index)=>{
        navigate("/image/"+index)
    }

    const getData = ()=>{
        setLoading(true);
        const path = window.location.pathname;
        if(path === "/mywork/approved"){
            axios.get(`${process.env.REACT_APP_BE_URL}/image/mywork/approved`,{
                params: { page: page},
                headers: {
                    'Authorization': `Bearer ${userData.accessToken.token}`,
                    'email': userData.email,
                },
                withCredentials: true
            }).then(res=>{
                setData(res.data);
            }).catch(err=>{
                if(err.response) showMsg(err.response.data?.message, "error")
                else alert(err)
            }).finally(()=>{
                setLoading(false);
            })
        }else{
            axios.get(`${process.env.REACT_APP_BE_URL}/image/approved`,{
                params: { page: page},
                headers: {
                    'Authorization': `Bearer ${userData.accessToken.token}`,
                    'email': userData.email,
                },
                withCredentials: true
            }).then(res=>{
                setData(res.data);
            }).catch(err=>{
                if(err.response) showMsg(err.response.data?.message, "error")
                else alert(err)
            }).finally(()=>{
                setLoading(false);
            })
        }
        
    }  

    const getCount = ()=>{
        const path = window.location.pathname;
        if(path === "/mywork/approved"){
            axios.get(`${process.env.REACT_APP_BE_URL}/image/mywork/count`,{
                params: {filter: "Approved"},
                headers: {
                    'Authorization': `Bearer ${userData.accessToken.token}`,
                    'email': userData.email,
                },
                withCredentials: true
            }).then(res=>{
                setCount(res.data.count);
            }).catch(err=>{
                if(err.response) showMsg(err.response.data.message, "error")
                else alert(err)
            })
        }else{
            axios.get(`${process.env.REACT_APP_BE_URL}/image/all/count`,{
                params: {filter: "Approved"},
                headers: {
                    'Authorization': `Bearer ${userData.accessToken.token}`,
                    'email': userData.email,
                },
                withCredentials: true
            }).then(res=>{
                setCount(res.data.count);
            }).catch(err=>{
                if(err.response) showMsg(err.response.data.message, "error")
                else alert(err)
            })
        }
    }  

    const changePage = (event, value) => {
        setPage(value);
    };

    useEffect(() => {
        getCount();
    }, []);

    useEffect(() => {
        getData();
    }, [page]);

  return (
    <>
    {
      (loading && data.length === 0)?
      <Stack direction='column' spacing={2} sx={{my:5}}>
        <Skeleton variant='rounded' width={'100%'} height={70} />
        <Skeleton variant='rounded' width={'100%'} height={70} />
        <Skeleton variant='rounded' width={'100%'} height={70} />
      </Stack>
      : 
      <> 
      <Typography variant='body2' color='GrayText' my={3}>Approved ({count})</Typography>
      <Box sx={{ width: '100%', bgcolor: 'background.paper'}}>
      {
        data.map((item, index)=>(
          <Box key={index} className="image_list" onClick={()=>handleClick(item._id)}>
            <Typography noWrap color='Highlight' fontWeight={700} variant='body2'>{item.last_comment?.title}</Typography>
            <Typography noWrap variant='body2'>{item.last_comment?.comment}</Typography>
            <Stack direction='row' alignItems='center' spacing={1} sx={{my:1}}>
            <Avatar sx={{width:'25px', height:'25px'}} src={item.last_comment?.annotator?.picture}></Avatar>
            <Typography noWrap variant='body2'>{item.last_comment?.annotator?.username}</Typography>
            <Typography noWrap variant='body2' color='GrayText' >{dayjs(item.updatedAt).format("DD/MM/YYYY")}</Typography>
            </Stack>
          </Box>
        ))
      }
    </Box>
    </>
    }
    <Stack direction='row' justifyContent='center' sx={{my:5}}>
        { count === 0 ?
            <Typography sx={{m:3}} variant='body2' color='GrayText'>{loading?"":`No Approved Images`}</Typography>
                :
            <Pagination size='small' count={(Math.floor((count-1)/18)+1)} page={Number(page)} onChange={changePage}></Pagination>
        }
    </Stack>
    <NotificationBar status={status} setStatus={setStatus}/>
    </>
  );
}
