import React, { useState, useEffect } from 'react';
import ImageCard from './ImageCard';
import { Radio, FormControlLabel, FormGroup } from '@mui/material';
import {Paper,Typography,Box, Stack, IconButton, MenuItem, Skeleton, Badge, Pagination, List, ListItem} from '@mui/material';
import axios from 'axios';
import { useSelector} from 'react-redux';

const Imagedb = () => {

  const [filtOptions, setFiltOptions] = useState('All');
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const userData = useSelector(state => state.data);
  const limit = 10;
  const [status, setStatus] = useState({msg:"",severity:"success", open:false});

  const showMsg = (msg, severity)=>{
    setStatus({msg, severity, open:true})
}

  const getData = ()=>{
    setLoading(true);
        axios.get(`${process.env.REACT_APP_BE_URL}/publicdb/image/filterimages`,{
            params: { page: page, category: filtOptions, limit: limit},
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

const getCount = ()=>{
      axios.get(`${process.env.REACT_APP_BE_URL}/publicdb/image/count`,{
          params: {category: filtOptions},
          headers: {
              'Authorization': `Bearer ${userData.accessToken.token}`,
              'email': userData.email,
          },
          withCredentials: true
      }).then(res=>{
          setCount(res.data);
      }).catch(err=>{
          if(err.response) showMsg(err.response.data.message, "error")
          else alert(err)
      })
  
}  

useEffect(() => {
  getData();
}, [page, filtOptions]);

useEffect(() => {
  getCount();
}, [filtOptions]);


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
    <div>
      
      <FormGroup row sx={{justifyContent:'center', my:5}}>
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
      
      <List>
      {data.map((item, index) => (        
        
        <ListItem key={index} style={{width: "100%"}}>
          
        {!item.annotation || item.annotation.length === 0 ? (
          <ImageCard imagepath={item.image_path} imagename={item.image_name} masks={[]} age={item.age} gender={item.gender} clinical={item.clinical_diagnosis} risks={item.risk_habits}/>

          ) : (
          <ImageCard imagepath={item.image_path} imagename={item.image_name} masks={item.annotation} age={item.age} gender={item.gender} clinical={item.clinical_diagnosis} risks={item.risk_habits}/>
          
      )}
      </ListItem>))}
    </List>
      

      <Stack direction='row' justifyContent='center' sx={{my:5}}>
        { count === 0 ?
            <Typography sx={{m:3}} variant='body2' color='GrayText'>{loading?"":`No ${filtOptions} Images`}</Typography>
                :
            <Pagination size='small' count={Math.ceil(count / 10)} page={page} onChange={changePage}></Pagination>
        }
        </Stack>
    </div>
  );
};

export default Imagedb;
