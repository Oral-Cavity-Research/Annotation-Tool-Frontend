import React, { useEffect, useState } from 'react';
import Canvas from '../components/Annotation/Canvas';
import { useParams } from 'react-router-dom';
import { useSelector} from 'react-redux';
import { Box, CircularProgress} from '@mui/material';
import NotificationBar from '../components/NotificationBar';
import axios from 'axios';
import ImageIcon from '@mui/icons-material/Image';

function ImageDisplay() {

    const {id} = useParams();
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState({msg:"",severity:"success", open:false});
    const [regions, setRegions] = useState([]);
    // const [locations, setLocations] = useState([]);
    // const [diagnosis, setDiagnosis] = useState([]);
    const [readOnly, setReadOnly] = useState(false);
    const userData = useSelector(state => state.data);


    useEffect(()=>{
        getData();
        getOptions();
    },[])

    const getData = ()=>{
        setLoading(true);
        axios.get(`${process.env.REACT_APP_BE_URL}/image/data/${id}`,{
            headers: {
                'Authorization': `Bearer ${userData.accessToken.token}`,
                'email': userData.email,
            },
            withCredentials: true
        }).then(res=>{
            res.data.img = `${process.env.REACT_APP_IMAGE_PATH}/${res.data.image_path}/${res.data.image_name}`
            setData(res.data);
            setLoading(false);
            if(res.data.status === "Review Requested"||
            res.data.status === "Approved"){
                setReadOnly(true);
            }
        }).catch(err=>{
            if(err.response) showMsg(err.response.data.message, "error")
            else alert(err)
        })
    }

    const getOptions = ()=>{
        axios.post(`${process.env.REACT_APP_BE_URL}/option/get`,
        {
            option_names:["regions","diagnosis","locations"]
        },
        {
            headers: {
                'Authorization': `Bearer ${userData.accessToken.token}`,
                'email': userData.email,
            },
            withCredentials: true
        }).then(res=>{
            var option1 = res.data.find(item => item.name === "regions");
            // var option2 = res.data.find(item=>item.name=="locations");
            // var option3 = res.data.find(item=>item.name=="diagnosis");
            if(option1) {
                option1 = option1.options.filter(item => item.active);
                setRegions(option1);
            }
            // if(option2){
            //     option2 = option2.options.filter(item => item.active);
            //     setLocations(option2);
            // }
            // if(option3){
            //     option3 = option3.options.filter(item => item.active);
            //     setDiagnosis(option3);
            // }
        }).catch(err=>{
            if(err.response) showMsg(err.response.data.message, "error")
            else alert(err)
        })
    }

    const showMsg = (msg, severity)=>{
        setStatus({msg, severity, open:true})
    }
    
    return (
        <div>
            <Box className='body'>
                {(loading || regions.length === 0)? 
                <Box sx={{ display: 'flex', justifyContent:'center', alignItems:'center', height:'100%' }}>
                <Box sx={{position: 'relative'}}>
                    <ImageIcon fontSize='large' color='disabled' className='center'/>
                    <CircularProgress size={100}/>
                </Box>
                </Box>
                :<Canvas data={data} readOnly={readOnly} regionNames={regions} diagnosis={[]} locations={[]}/>}
            </Box>
            {/* <Box className='body' sx={{display: { xs: 'block', sm: 'none' } }} >
                <Box sx={{ display: 'flex', justifyContent:'center', alignItems:'center', height:'100%' }}>
                <Box sx={{position: 'relative', textAlign:'center'}}>
                    <ImageNotSupported fontSize='large' color='primary' />
                    <Typography>Not available for mobile view</Typography>
                </Box>
                </Box>
            </Box> */}
            <NotificationBar status={status} setStatus={setStatus}/>
        </div>
    );
}

export default ImageDisplay;
