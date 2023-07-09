import { ModelTraining } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Grid, Typography } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { useSelector} from 'react-redux';

const Prediction = ({img, name, showMsg}) => {

    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    const userData = useSelector(state => state.data);

    const getPrediction = ()=>{

        setLoading(true)

        const imageName = name.split('.').slice(0, -1).join('.')

        axios.post(`${process.env.REACT_APP_BE_URL}/model/classify`,
        {
            filename: imageName
        },
        { headers: {
            'Authorization': `Bearer ${userData.accessToken.token}`,
            'email': userData.email,
        }}).then(res=>{
            setData(res.data)
            if(res.data.error){
                showMsg(res.data.error, "error")
            }
        }).catch(err=>{
            if(err.response) showMsg(err.response.data?.message, "error")
            else alert(err)
        }).finally(()=>{
            setLoading(false);
        })
    }

    return (
        <div>
            <Grid container spacing={{ xs: 2, md: 3 }}>
                <Grid item sm={12} md={6}>
                    <img src={img} style={{maxHeight:'100%',maxWidth:'100%'}}/>
                </Grid>
                <Grid item  sm={12} md={6}>
                    <LoadingButton loadingPosition='start' loading={loading} onClick={getPrediction} size='large' color='success' variant='contained' sx={{mb:2}} startIcon={<ModelTraining/>} fullWidth>Predict</LoadingButton>
                    {
                        data.result &&
                        <>
                            <Typography>Class: {data.result}</Typography>
                            <Typography></Typography>
                        </>
                    }
                    
                </Grid>
            </Grid>
        </div>
    );
};


export default Prediction;