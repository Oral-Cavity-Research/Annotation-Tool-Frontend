import React, { useState, useEffect} from 'react';
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, LinearProgress, OutlinedInput, Paper, Typography} from '@mui/material';
import {InputAdornment} from '@mui/material';
import {Avatar, Stack} from '@mui/material';
import axios from 'axios';
import NotificationBar from '../components/NotificationBar';
import { DataGrid } from '@mui/x-data-grid';
import { Search } from '@mui/icons-material';
import { useSelector} from 'react-redux';
import { LoadingButton } from '@mui/lab';

const UserRequests = () => {

    const [request, setRequests] = useState([]);
    const [status, setStatus] = useState({msg:"",severity:"success", open:false}) 
    const [loading, setLoading] = useState(true);
    const [filt, setFilt] = useState('');
    const [state, setState] = useState(0);
    const selectorData = useSelector(state => state.data);
    const [userData, setUserData] = useState(selectorData);
    const [userInfo, setUserInfo] = useState({});
    const [dialogOpen, setDialogOpen] = React.useState(false);

    const handleDialogClose = () => {
        setDialogOpen(false);
    };


    const handleChange = (e) => {
        setFilt(e.target.value);
    };

    const columns = [
        {
          field: "_id",
          headerName: "Avatar",
          sortable: false,
          disableColumnMenu: true,
          renderCell: ({ row }) =>
            <Avatar src={row.picture} />
        },
        {
          field: "username",
          headerName: "Name",
          flex: 1,
          disableColumnMenu: true,
        },
        {
          field: 'reg_no',
          headerName: 'SLMC Reg No',
          flex: 1,
          disableColumnMenu: true
        },
        {
          field: 'hospital',
          headerName: 'Hospital',
          flex: 1,
          disableColumnMenu: true
        },
    ];

    const showMsg = (msg, severity)=>{
        setStatus({msg, severity, open:true})
    }

    const handleClick = (params) => {
        setUserInfo(params.row)
        setDialogOpen(true)
    };

    const handleAccept = ()=>{

      // const formData = new FormData(formRef.current);

      // if(formData.get('role')===""){
      //     showMsg("Add a user role","error");
      //     return
      // }

      setState(1);

      axios.post(`${process.env.REACT_APP_BE_URL}/admin/accept/${userInfo._id}`,
      {
        username: userInfo.username,
        role: "System Admin",
        reason: ""
      },
      { headers: {
          'Authorization': `Bearer ${userData.accessToken.token}`,
          'email': userData.email,
      }}
      ).then(res=>{
          showMsg(res.data.message, "success");
          setDialogOpen(false)
      }).catch(err=>{
          if(err.response) showMsg(err.response.data?.message, "error")
          else alert(err)
      }).finally(()=>{
        setState(0);
      })

  }

  const handleReject = ()=>{

      setState(2);
      
      axios.post(`${process.env.REACT_APP_BE_URL}/admin/requests/${userInfo._id}`,
      {
          reason: "reason"
      },
      { headers: {
          'Authorization': `Bearer ${userData.accessToken.token}`,
          'email': userData.email,
      }}
      ).then(res=>{
          showMsg(res.data.message, "success")
          setDialogOpen(false)
      }).catch(err=>{
          if(err.response) showMsg(err.response.data.message)
          else alert(err)
      }).finally(()=>{
        setState(0);
      })
  }

    useEffect(()=>{
        setLoading(true);
        setUserData(selectorData);
        axios.get(`${process.env.REACT_APP_BE_URL}/admin/requests`,
        { headers: {
            'Authorization': `Bearer ${userData.accessToken.token}`,
            'email': userData.email,
        }}
        ).then(res=>{
            setRequests(res.data);
            setLoading(false);
        }).catch(err=>{
            if(err.response) showMsg(err.response.data?.message, "error")
            else alert(err)
            
        })
    },[state])
  

    return (  
        <Box sx={{my:2}}> 
        <Stack direction='row' justifyContent='flex-end' sx={{mb:2}} >
        <FormControl sx={{width: '30ch' }} variant="outlined">
          <OutlinedInput
            placeholder='Search by name'
            size='small'
            inputProps={{ maxLength: 20}}
            onChange={(e)=>handleChange(e)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                >
                  <Search/>
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        </Stack>
        <DataGrid
                rows={request}
                columns={columns}
                autoHeight={true}
                disableSelectionOnClick
                onRowClick={handleClick}
                experimentalFeatures={{ newEditingApi: true }}
                getRowId={(row) =>  row._id}
                hideFooter={request.length < 100}
                loading={loading}   // you need to set your boolean loading
                filterModel={{
                    items: [{ field: 'username', operator: 'contains', value: filt }]
                }}

                sx={{
                    cursor:'pointer',
                    "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {outline: "none !important"},
                    ".MuiDataGrid-columnSeparator": {display: "none !important"},
                    '& .RaDatagrid-clickableRow': { cursor: 'default' },
                }}
                components={{
                    NoRowsOverlay: () => (
                      <Stack height="100%" alignItems="center" justifyContent="center">
                        No new requests
                      </Stack>
                    ),
                    NoResultsOverlay: () => (
                      <Stack height="100%" alignItems="center" justifyContent="center">
                        filter returns no result
                      </Stack>
                    ),
                    LoadingOverlay: () => (
                        <LinearProgress/>
                    )
                  }}
            />
            <NotificationBar status={status} setStatus={setStatus}/>
            <Dialog
                open={dialogOpen}
                onClose={handleDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
            >
                <DialogTitle id="alert-dialog-title">
                    Request Information
                </DialogTitle>
                <DialogContent>
                    <Stack direction='row' alignItems='center' spacing={4}>
                        <Avatar sx={{width:'60px', height:'60px'}} src={userInfo.picture}/>
                        <table style={{tableLayout:'fixed', width: "100%", wordWrap:'break-word'}}>
                            <tbody>
                                <tr>
                                    <td><Typography>User Name: </Typography></td>
                                    <td><Typography>{userInfo.username}</Typography></td>
                                </tr>
                                <tr>
                                    <td><Typography>SLMC: </Typography></td>
                                    <td><Typography>{userInfo.reg_no}</Typography></td>
                                </tr>
                                <tr>
                                    <td><Typography>Hospital: </Typography></td>
                                    <td><Typography>{userInfo.hospital}</Typography></td>
                                </tr>
                                <tr>
                                    <td><Typography>Contact No: </Typography></td>
                                    <td><Typography>{userInfo.contact_no}</Typography></td>
                                </tr>
                            </tbody>
                        </table>
                    </Stack>
                    
                </DialogContent>
                <DialogActions>
                <LoadingButton loading={state === 2} disabled={state === 1} size='small'  onClick={handleReject} color='error' variant='contained'>Reject</LoadingButton>
                <LoadingButton loading={state === 1} disabled={state === 2} size='small' onClick={handleAccept} variant='contained' color='success' autoFocus>Accept</LoadingButton>
                <Button size='small' onClick={handleDialogClose} variant='contained' color='inherit' autoFocus>Cancle</Button>
                </DialogActions>
            </Dialog>
            </Box>
    );
};;

export default UserRequests;