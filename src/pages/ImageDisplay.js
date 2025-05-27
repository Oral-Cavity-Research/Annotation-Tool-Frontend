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
    const [options, setOptions] = useState([]);
    const userData = useSelector(state => state.data);


    useEffect(()=>{
        getData();
        getOptions();
    },[id])

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
        }).catch(err=>{
            if(err.response) showMsg(err.response.data.message, "error")
            else showMsg("Error!", "error")
        })
    }

    const getOptions = ()=>{
        axios.post(`${process.env.REACT_APP_BE_URL}/option/get`,
        {},
        {
            headers: {
                'Authorization': `Bearer ${userData.accessToken.token}`,
                'email': userData.email,
            },
            withCredentials: true
        }).then(res=>{
            // var option1 = res.data?.find(item => item.name === "regions");
            // if(option1) {
            //     option1 = option1.options.filter(item => item.active);
            //     setRegions(option1);
            //     console.log(option1)
            // }

            const filteredData = res.data?.map(item => ({
                ...item,
                options: item.options?.filter(opt => opt.active) || []
            }));
            setRegions(filteredData.find(item => item.name === "regions").options)
            setOptions(filteredData)

        }).catch(err=>{
            if(err.response) showMsg(err.response.data.message, "error")
            else showMsg("Error!", "error")
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
                :<Canvas imagedata={data} regionNames={regions} options={options} diagnosis={[]} locations={[]}/>}
            </Box>
            <NotificationBar status={status} setStatus={setStatus}/>
        </div>
    );
}

export default ImageDisplay;
