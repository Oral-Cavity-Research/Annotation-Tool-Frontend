import React, {useState} from 'react';
import {Paper,Typography,Box, Grid, Stack, IconButton, Menu, MenuItem} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {useNavigate} from 'react-router-dom';
import { FilterList } from '@mui/icons-material';

const filtOptions = ["All","New","Edited"]

function Images() {

    const [data, setData] = useState(tmpdata);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [filt, setFilt] = React.useState("All");
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
        <Menu id="fade-menu" MenuListProps={{ 'aria-labelledby': 'fade-button'}} anchorEl={anchorEl} open={open} onClose={handleClose}>
            {filtOptions.map((item,index)=>{ return(<MenuItem key={index} onClick={()=>handleFilter(item)}>{item}</MenuItem>)})}
        </Menu>
        <Grid container spacing={{ xs: 2, md: 3 }}>
            {data.map((item, index) => (
            <Grid item xs={6} sm={3} md={2} key={index}>
                <Paper className='card'>
                <Box sx={{p:1}}>
                    <Typography variant='body2'>{item.location}</Typography>
                    <Typography variant='body2'>{item.clinical_diagnosis}</Typography>
                </Box> 
                <div className='grid_item' onClick={()=>handleClick(index)} style={{
                    background:`url(${item.img})`,
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

        <Stack direction='row' justifyContent='center' sx={{my:5}}>
            <LoadingButton>Load More</LoadingButton>
        </Stack>
        </div>
    );
}

export default Images;


const tmpdata=[
    {img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/150150/bug-1.jpg", location:'location', clinical_diagnosis:'diagnosis',lesions_appear:'true', annotation:[]},
    {img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/150150/bug-2.jpg", location:'location', clinical_diagnosis:'diagnosis',lesions_appear:'true', annotation:[]},
    {img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/150150/bug-3.jpg", location:'location', clinical_diagnosis:'diagnosis',lesions_appear:'true', annotation:[]},
    {img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/150150/bug-4.jpg", location:'location', clinical_diagnosis:'diagnosis',lesions_appear:'true', annotation:[]},
    {img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/150150/bug-5.jpg", location:'location', clinical_diagnosis:'diagnosis',lesions_appear:'true', annotation:[]},
    {img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/150150/bug-6.jpg", location:'location', clinical_diagnosis:'diagnosis',lesions_appear:'true', annotation:[]},
    {img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/150150/bug-7.jpg", location:'location', clinical_diagnosis:'diagnosis',lesions_appear:'true', annotation:[]},
    {img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/150150/bug-8.jpg", location:'location', clinical_diagnosis:'diagnosis',lesions_appear:'true', annotation:[]},
    {img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/150150/bug-9.jpg", location:'location', clinical_diagnosis:'diagnosis',lesions_appear:'true', annotation:[]},
    {img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/150150/bug-10.jpg", location:'location', clinical_diagnosis:'diagnosis',lesions_appear:'true', annotation:[]},
    {img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/150150/bug-11.jpg", location:'location', clinical_diagnosis:'diagnosis',lesions_appear:'true', annotation:[]},
    {img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/150150/bug-12.jpg", location:'location', clinical_diagnosis:'diagnosis',lesions_appear:'true', annotation:[]},
    {img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/150150/bug-13.jpg", location:'location', clinical_diagnosis:'diagnosis',lesions_appear:'true', annotation:[]},
    {img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/150150/bug-14.jpg", location:'location', clinical_diagnosis:'diagnosis',lesions_appear:'true', annotation:[]},
    {img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/150150/bug-15.jpg", location:'location', clinical_diagnosis:'diagnosis',lesions_appear:'true', annotation:[]},
    {img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/150150/bug-16.jpg", location:'location', clinical_diagnosis:'diagnosis',lesions_appear:'true', annotation:[]},
    {img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/150150/bug-17.jpg", location:'location', clinical_diagnosis:'diagnosis',lesions_appear:'true', annotation:[]},
    {img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/150150/bug-18.jpg", location:'location', clinical_diagnosis:'diagnosis',lesions_appear:'true', annotation:[]},
    {img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/150150/bug-1.jpg", location:'location', clinical_diagnosis:'diagnosis',lesions_appear:'true', annotation:[]},
    {img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/150150/bug-2.jpg", location:'location', clinical_diagnosis:'diagnosis',lesions_appear:'true', annotation:[]},
    ];