import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Paper,Typography,Box, Grid, Stack, IconButton, MenuItem, Skeleton} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { FilterList } from '@mui/icons-material';
import { useSelector} from 'react-redux';
import NotificationBar from '../components/NotificationBar';
import axios from 'axios';
import config from '../config.json';
import { StyledMenu } from '../components/StyledMenu';

const filtOptions = ["All","New","Edited"]

function Images() {

    const [data, setData] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState({msg:"",severity:"success", open:false});
    const userData = useSelector(state => state.data);
    const [filt, setFilt] = useState("New");
    const [page, setPage] = useState(1);
    const [noMore, setNoMore] = useState(false);

    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    
    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleFilter = (name)=>{
        setFilt(name);
        handleClose();
    }

    const handleClick = (index)=>{
        navigate("/image/"+index)
    }

    const showMsg = (msg, severity)=>{
        setStatus({msg, severity, open:true})
    }

    const loadMore = () => {
        setLoading(true);
        setNoMore(false);
        axios.get(`${config['path']}/image/all`,{
            params: { page: page + 1, filter: filt},
            headers: {
                'Authorization': `Bearer ${userData.accessToken.token}`,
                'email': userData.email,
            },
            withCredentials: true
        }).then(res=>{
            if(res.data?.length < 20) setNoMore(true);
            setData([...data, ...res.data]);
            setPage(page+1);
        }).catch(err=>{
            if(err.response) showMsg(err.response.data.message, "error")
            else alert(err)
        }).finally(()=>{
            setLoading(false);
        })
    };

    const getData = ()=>{
        setLoading(true);
        setNoMore(false);
        axios.get(`${config['path']}/image/all`,{
            params: { page: 1, filter: filt},
            headers: {
                'Authorization': `Bearer ${userData.accessToken.token}`,
                'email': userData.email,
            },
            withCredentials: true
        }).then(res=>{
            if(res.data?.length < 20) setNoMore(true);
            setData(res.data);
        }).catch(err=>{
            if(err.response) showMsg(err.response.data.message, "error")
            else alert(err)
        }).finally(()=>{
            setLoading(false);
        })
    }  
    
    useEffect(() => {
        getData();
    }, [filt]);

    return (
        <div>
        <Stack direction='row-reverse' alignItems='center'  spacing={1}>
        <IconButton
            id="fade-button"
            aria-controls={open ? 'fade-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleOpen}
            sx={{my:1}}
        ><FilterList/></IconButton>
        <Typography variant='body2' color='GrayText'>{filt}</Typography>
        </Stack>
        <StyledMenu id="demo-customized-menu"  MenuListProps={{'aria-labelledby': 'demo-customized-button'}} anchorEl={anchorEl} open={open} onClose={handleClose}>
            {filtOptions.map((item,index)=>{ return(<MenuItem key={index} onClick={()=>handleFilter(item)}>{item}</MenuItem>)})}
        </StyledMenu>
        {
            loading?
            <Grid container spacing={{ xs: 2, md: 3 }}>
            {Array.from(Array(12)).map((_, index) => (
            <Grid item xs={6} sm={3} md={2} key={index}>
            <Paper className='card'>
                <Box sx={{p:1}}>
                    <Skeleton variant="text"/>
                    <Skeleton variant="text"/>
                </Box> 
                <div className='grid_item'>
                    <Skeleton variant="rectangular" width={'100%'} height={"100%"} />
                </div>
            </Paper>
            </Grid>
            ))}
        </Grid>
        :
        <Grid container spacing={{ xs: 2, md: 3 }}>
            {data.map((item, index) => (
            <Grid item xs={6} sm={3} md={2} key={index}>
                <Paper className='card'>
                <Box sx={{p:1}}>
                    <Typography variant='body2'>{item.location}</Typography>
                    <Typography variant='body2'>{item.clinical_diagnosis}</Typography>
                </Box> 
                <div className='grid_item' onClick={()=>handleClick(item._id)} style={{
                    background:`url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/150150/bug-${index%18 + 1}.jpg)`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }}>
                {item.annotation?.length === 0 && 
                <div className='overlay'>
                <svg>
                    <polygon points="0,0,70,0,70,70"/>
                </svg>
                </div>
                }
                </div>                  
            </Paper>
            </Grid>
            ))}
        </Grid>
        }

        <Stack direction='row' justifyContent='center' sx={{my:5}}>
        { data.length > 0 ?
            <LoadingButton disabled={noMore} loading={loading} sx={{mt:2}} onClick={loadMore}>Load More</LoadingButton>
                :
            <Typography sx={{m:3}} variant='body2' color='GrayText'>{loading?"":"No Images"}</Typography>
        }
        </Stack>
        
        <NotificationBar status={status} setStatus={setStatus}/>
        </div>
    );
}

export default Images;