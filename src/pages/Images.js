import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Paper,Typography,Box, Grid, Stack, IconButton, MenuItem, Skeleton, Badge, Pagination} from '@mui/material';
import { FilterList } from '@mui/icons-material';
import { useSelector} from 'react-redux';
import NotificationBar from '../components/NotificationBar';
import axios from 'axios';
import { StyledMenu } from '../components/StyledMenu';

function Images() {

    const [data, setData] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState({msg:"",severity:"success", open:false});
    const userData = useSelector(state => state.data);
    const [filt, setFilt] = useState(null);
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [filtOptions, setFlitOptions] = useState([]);

    useEffect(()=>{
        const path = window.location.pathname;
        if(path === "/mywork/images" || path === "/mywork"){
            setFlitOptions(["All","Edited","Changes Requested","Reviewed"])
            setFilt("All")
        }else{
            setFlitOptions(["All","New","Edited","Changes Requested","Reviewed"])
            setFilt("New")
        }
    },[])

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
        setPage(1);
        handleClose();
    }

    const handleClick = (index)=>{
        navigate("/image/"+index)
    }

    const showMsg = (msg, severity)=>{
        setStatus({msg, severity, open:true})
    }

    const getData = ()=>{
        setLoading(true);
        const path = window.location.pathname;
        if(path === "/mywork/images" || path === "/mywork"){
            axios.get(`${process.env.REACT_APP_BE_URL}/image/mywork`,{
                params: { page: page, filter: filt},
                headers: {
                    'Authorization': `Bearer ${userData.accessToken.token}`,
                    'email': userData.email,
                },
                withCredentials: true
            }).then(res=>{
                setData(res.data);
            }).catch(err=>{
                if(err.response) showMsg(err.response.data.message, "error")
                else alert(err)
            }).finally(()=>{
                setLoading(false);
            })
        }else{
            axios.get(`${process.env.REACT_APP_BE_URL}/image/all`,{
                params: { page: page, filter: filt},
                headers: {
                    'Authorization': `Bearer ${userData.accessToken.token}`,
                    'email': userData.email,
                },
                withCredentials: true
            }).then(res=>{
                setData(res.data);
            }).catch(err=>{
                if(err.response) showMsg(err.response.data.message, "error")
                else alert(err)
            }).finally(()=>{
                setLoading(false);
            })
        }
    }  

    const getCount = ()=>{
        const path = window.location.pathname;
        if(path === "/mywork/images" || path === "/mywork"){
            axios.get(`${process.env.REACT_APP_BE_URL}/image/mywork/count`,{
                params: {filter: filt},
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
                params: {filter: filt},
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
        if(filt === null) return
        getCount();
    }, [filt]);

    useEffect(() => {
        if(filt === null) return
        getData();
    }, [page, filt]);

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
        >
        <Badge color='primary' badgeContent={count} max={99}>
        <FilterList/> 
        </Badge>
        </IconButton>
        <Typography variant='body2' color='GrayText'>{filt}</Typography>
        </Stack>
        <StyledMenu id="demo-customized-menu"  MenuListProps={{'aria-labelledby': 'demo-customized-button'}} anchorEl={anchorEl} open={open} onClose={handleClose}>
            {filtOptions.map((item,index)=>{ return(<MenuItem key={index} onClick={()=>handleFilter(item)}>{item}</MenuItem>)})}
        </StyledMenu>
        {
            (loading && data.length === 0)?
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
                    <Typography noWrap variant='body2'>{item.clinical_diagnosis}</Typography>
                </Box> 
                <div className='grid_item' onClick={()=>handleClick(item._id)} style={{
                    backgroundImage:`url(${process.env.REACT_APP_IMAGE_PATH}/${item.image_path}/${item.image_name})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }}>
                { 
                <div className={
                    (item.status === "Changes Requested" && filt === "All")? 'overlay red'
                    : (item.status === "Reviewed" && filt === "All")? 'overlay green'
                    : item.annotation?.length === 0? 'overlay orange'
                    : "nooverlay"
                }>
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
        { count === 0 ?
            <Typography sx={{m:3}} variant='body2' color='GrayText'>{loading?"":`No ${filt} Images`}</Typography>
                :
            <Pagination size='small' count={(Math.floor((count-1)/18)+1)} page={page} onChange={changePage}></Pagination>
        }
        </Stack>
        
        <NotificationBar status={status} setStatus={setStatus}/>
        </div>
    );
}

export default Images;