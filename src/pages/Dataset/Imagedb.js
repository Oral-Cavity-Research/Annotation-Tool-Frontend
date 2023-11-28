import React, { useState, useEffect } from 'react';
import ImageCard from './ImageCard';
import { Radio, FormControlLabel, FormGroup, Divider, Box } from '@mui/material';
import {Typography,Stack, Pagination, List, ListItem} from '@mui/material';
import axios from 'axios';
import NotificationBar from '../../components/NotificationBar';
import LoginConfirm from './LoginConfirm';

const Imagedb = () => {

  const [filtOptions, setFiltOptions] = useState('All');
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [userData, setUserData] = useState({email:null, accessToken: null});
  const [status, setStatus] = useState({msg:"",severity:"success", open:false});
  const limit = 10;

  const showMsg = (msg, severity)=>{
    setStatus({msg, severity, open:true})
  }

  const getData = ()=>{
    if(!userData.email){
      setOpen(true)
      return;
    }
    setData([])
    setLoading(true);
        axios.get(`${process.env.REACT_APP_BE_URL}/publicdb/image/filterimages`,{
            params: { page: page, category: filtOptions, limit: limit},
            headers: {
                'Authorization': `Bearer ${userData.accessToken}`,
                'email': userData.email,
            },
            withCredentials: true
        }).then(res=>{
            setData(res.data);
            console.log(res.data)

        }).catch(err=>{
            if(err.response) showMsg(err.response?.data?.message, "error")
            else showMsg("Error!", "error")
        }).finally(()=>{
            setLoading(false);
        })
    
}  

const getCount = ()=>{
      if(!userData.email) return
      axios.get(`${process.env.REACT_APP_BE_URL}/publicdb/image/count`,{
          params: {category: filtOptions},
          headers: {
              'Authorization': `Bearer ${userData.accessToken}`,
              'email': userData.email,
          },
          withCredentials: true
      }).then(res=>{
          setCount(res.data);
      }).catch(err=>{
          if(err.response) showMsg(err.response?.data?.message, "error")
          else showMsg("Error!", "error")
      })
  
}  

useEffect(() => {
  getData();
}, [page, filtOptions]);

useEffect(() => {
  getCount();
}, [filtOptions]);

useEffect(()=>{
  if(userData.email){
    getData();
    getCount();
    setOpen(false);
  }
},[userData])

  const options = [
    'All',
    'Healthy',
    'Benign',
    'OPMD',
    'OCA'
  ];

  const handleOptionChange = (event) => {
    setFiltOptions(event.target.value);
  };

  const changePage = (event, value) => {
    setPage(value);
};

  return (
    <div className="bodywidth clear">
      <div id='fulltext-nopad'>    
      <FormGroup row sx={{justifyContent:'center', mb:5}}>
        {options.map((option, index) => (
          <FormControlLabel
            key={index}
            value={option}
            control={<Radio size='small' color="primary" />}
            label={option}
            labelPlacement="bottom"
            checked={filtOptions === option}
            onChange={handleOptionChange}
          />
        ))}
      </FormGroup>
      <Stack direction='row' justifyContent='center' sx={{my:5}}>
        { count === 0 ?
            <Typography sx={{m:3}} variant='body2' color='GrayText'>{loading?"":`No ${filtOptions} Images`}</Typography>
                :
            <Pagination size='small' count={Math.ceil(count / 10)} page={page} onChange={changePage}></Pagination>
        }
      </Stack>
      
      <List>
      {data.map((item, index) => (        
        <ListItem key={index} style={{width: "100%"}}>
          
        {!item.annotation || item.annotation.length === 0 ? (
          <ImageCard imagepath={item.image_path} imagename={item.image_name} masks={[]} age={item.patient?.age} gender={item.patient?.gender} clinical={item.clinical_diagnosis} risks={item.patient?.risk_factors}/>

          ) : (
          <ImageCard imagepath={item.image_path} imagename={item.image_name} masks={item.annotation} age={item.patient?.age} gender={item.patient?.gender} clinical={item.clinical_diagnosis} risks={item.patient?.risk_factors}/>
          
      )}
      </ListItem>
    ))}
    </List>
      <Box p={5}>
        <Divider/>
        <br/>
        <Typography>Patients presenting to the Oral Medicine clinic, Teaching hospital Peradeniya, and the bystanders and relatives of patients  were recruited for this study.  Images inside the oral cavity were obtained by the dental surgeons in the clinic supervised by oral medicine specialists. Images were obtained using the camera of the mobile phones under the natural light/light source of the dental chair. Socio-demographic and clinical details of patients were obtained from medical records. Images were labeled, categorized, and annotated by two mid-career dental surgeons, supervised by two oral medicine specialists. </Typography>
      </Box>
      <NotificationBar status={status} setStatus={setStatus}/>
      <LoginConfirm open={open} setOpen={setOpen} setUserData={setUserData}/>
    </div>
  </div>  
  );
};

export default Imagedb;
