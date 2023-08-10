import { ModelTraining } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Grid, Stack, Typography } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { useSelector} from 'react-redux';

const getCategory = (result)=>{
    let maxKey = '';
    let maxValue = -Infinity;

    for (const key in result) {
        if (result[key] > maxValue) {
            maxValue = result[key];
            maxKey = key;
        }
    }

    return maxKey

}

const Prediction = ({img, name, showMsg}) => {

    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    const userData = useSelector(state => state.data);

    const getPrediction = ()=>{

        setLoading(true)
        setData({});

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
            setData({})
        }).finally(()=>{
            setLoading(false);
        })
    }

    return (
        <div>
            <Grid container>
                <Grid item sm={12} md={6} sx={{position:'relative'}}>
                    <img src={img} style={{maxHeight:'100%',maxWidth:'100%'}}/>
                   {loading && <div className='loading-predicton' style={{position:'absolute', width:'100%', height:'100%', top:0}}>
                    </div>}
                </Grid>
                <Grid item  sm={12} md={6} px={2}>
                    <LoadingButton loadingPosition='start' loading={loading} onClick={getPrediction} size='large' color='success' variant='contained' sx={{mb:2}} startIcon={<ModelTraining/>} fullWidth>Predict</LoadingButton>
                    {
                        data.result &&
                        <>
                        <table style={{tableLayout:'fixed', width: "100%", wordWrap:'break-word'}}>
                        <tbody>
                            <tr>
                                <td><Typography>Healthy: </Typography></td>
                                <td><Typography>{Math.round(data.result.healthy * 100)/100}</Typography></td>
                            </tr>
                            <tr>
                                <td><Typography>Benign: </Typography></td>
                                <td><Typography>{Math.round(data.result.benign * 100)/100}</Typography></td>
                            </tr>
                            <tr>
                                <td><Typography>OPMD: </Typography></td>
                                <td><Typography>{Math.round(data.result.opmd * 100)/100}</Typography></td>
                            </tr>
                        </tbody>
                    </table>
                    <br/>
                    <Stack direction='row' spacing={2}>
                    <Typography variant='h6'>Category: </Typography>
                    <Typography variant='h6' color='error'>{getCategory(data.result)}</Typography>
                    </Stack>
                    </>
                    }
                    
                </Grid>
            </Grid>
        </div>
    );
};


export default Prediction;