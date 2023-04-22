import React, {useEffect, useState} from 'react';
import { useSelector} from 'react-redux';
import {Avatar, Box, Skeleton, Stack, Typography} from '@mui/material';
import axios from 'axios';
import config from '../config.json';
import NotificationBar from '../components/NotificationBar';
import { LoadingButton } from '@mui/lab';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

export default function Requests() {

    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState({msg:"",severity:"success", open:false});
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [noMore, setNoMore] = useState(false);
    const userData = useSelector(state => state.data);
    const navigate = useNavigate();

    const showMsg = (msg, severity)=>{
        setStatus({msg, severity, open:true})
    }

    const handleClick = (index)=>{
        navigate("/image/"+index)
    }

    const loadMore = () => {
        setLoading(true);
        setNoMore(false);
        const path = window.location.pathname;
        if(path === "/mywork/requests" || path === "/mywork"){
            axios.get(`${config['path']}/image/mywork/requests`,{
                params: { page: page + 1},
                headers: {
                    'Authorization': `Bearer ${userData.accessToken.token}`,
                    'email': userData.email,
                },
                withCredentials: true
            }).then(res=>{
                if(res.data?.length < 18) setNoMore(true);
                setData([...data, ...res.data]);
                setPage(page+1);
            }).catch(err=>{
                if(err.response) showMsg(err.response.data.message, "error")
                else alert(err)
            }).finally(()=>{
                setLoading(false);
            })
        }else{
            axios.get(`${config['path']}/image/requests`,{
                params: { page: page + 1},
                headers: {
                    'Authorization': `Bearer ${userData.accessToken.token}`,
                    'email': userData.email,
                },
                withCredentials: true
            }).then(res=>{
                if(res.data?.length < 18) setNoMore(true);
                setData([...data, ...res.data]);
                setPage(page+1);
            }).catch(err=>{
                if(err.response) showMsg(err.response.data.message, "error")
                else alert(err)
            }).finally(()=>{
                setLoading(false);
            })
        }
    };

    const getData = ()=>{
        setLoading(true);
        setNoMore(false);
        const path = window.location.pathname;
        if(path === "/mywork/requests" || path === "/mywork"){
            axios.get(`${config['path']}/image/mywork/requests`,{
                params: { page: 1},
                headers: {
                    'Authorization': `Bearer ${userData.accessToken.token}`,
                    'email': userData.email,
                },
                withCredentials: true
            }).then(res=>{
                if(res.data?.length < 18) setNoMore(true);
                setData(res.data);
            }).catch(err=>{
                if(err.response) showMsg(err.response.data?.message, "error")
                else alert(err)
            }).finally(()=>{
                setLoading(false);
            })
        }else{
            axios.get(`${config['path']}/image/requests`,{
                params: { page: 1},
                headers: {
                    'Authorization': `Bearer ${userData.accessToken.token}`,
                    'email': userData.email,
                },
                withCredentials: true
            }).then(res=>{
                if(res.data?.length < 18) setNoMore(true);
                setData(res.data);
            }).catch(err=>{
                if(err.response) showMsg(err.response.data?.message, "error")
                else alert(err)
            }).finally(()=>{
                setLoading(false);
            })
        }
        
    }  

    useEffect(() => {
        getData();
    }, []);

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
      <Box sx={{ width: '100%', bgcolor: 'background.paper', my:5}}>
      {
        data.map((item, index)=>(
          <Box key={index} className="image_list" onClick={()=>handleClick(item._id)}>
            <Typography noWrap color='Highlight' fontWeight={700} variant='body2'>{item.last_comment?.title}</Typography>
            <Typography noWrap variant='body2'>{item.last_comment?.comment}</Typography>
            <Stack direction='row' alignItems='center' spacing={1} sx={{my:1}}>
            <Avatar sx={{width:'25px', height:'25px'}} />
            <Typography noWrap variant='body2'>{item.last_comment?.annotator?.username}</Typography>
            <Typography noWrap variant='body2' color='GrayText' >{dayjs(item.updatedAt).format("DD/MM/YYYY")}</Typography>
            </Stack>
          </Box>
        ))
      }
    </Box>
    }
    <Stack direction='row' justifyContent='center' sx={{my:5}}>
        { data.length > 0 ?
            <LoadingButton disabled={noMore} loading={loading} sx={{mt:2}} onClick={loadMore}>Load More</LoadingButton>
                :
            <Typography sx={{m:3}} variant='body2' color='GrayText'>{loading?"":"No Requests"}</Typography>
        }
    </Stack>
    <NotificationBar status={status} setStatus={setStatus}/>
    </>
  );
}
