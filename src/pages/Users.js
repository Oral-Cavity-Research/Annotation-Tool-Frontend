import React, { useState, useEffect} from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, IconButton,
    LinearProgress, Menu, MenuItem, OutlinedInput} from '@mui/material';
import { InputAdornment} from '@mui/material';
import {Avatar, Typography, Stack} from '@mui/material';
import axios from 'axios';
import NotificationBar from '../components/NotificationBar';
import { DataGrid } from '@mui/x-data-grid';
import { FilterList, Search } from '@mui/icons-material';
import { useSelector} from 'react-redux';

const Users = () => {

    const [users, setUsers] = useState([]);
    const [status, setStatus] = useState({msg:"",severity:"success", open:false}) 
    const [loading, setLoading] = useState(true);
    const [filt, setFilt] = useState('');
    const [filtOptions, setFiltOptions] = useState(["All"]);
    const [role, setRole] = useState("All");
    const [userInfo, setUserInfo] = useState({});
    const userData = useSelector(state => state.data);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [dialogOpen, setDialogOpen] = React.useState(false);

    const open = Boolean(anchorEl);

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleFilter = (name)=>{
        setRole(name);
        handleClose();
    }

    const handleChange = (e) => {
        setFilt(e.target.value);
    };

    const showMsg = (msg, severity)=>{
        setStatus({msg, severity, open:true})
    }

    const handleRowClick = (params) => {
        setUserInfo(params.row)
        setDialogOpen(true)
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
          field: 'username',
          headerName: 'Name',
          type:'string',
          flex: 1,
          disableColumnMenu: true,
        },
        {
          field: 'reg_no',
          headerName: 'SLMC Reg No',
          flex: 1,
          disableColumnMenu: true,
        },
        {
          field: 'hospital',
          headerName: 'Hospital',
          flex: 1,
          disableColumnMenu: true,
        }
    ];

    useEffect(()=>{

        setLoading(true);

        axios.get(`${process.env.REACT_APP_BE_URL}/admin/users/role/${role}`,
        { headers: {
            'Authorization': `Bearer ${userData.accessToken.token}`,
            'email': userData.email,
        }}
        ).then(res=>{
            setUsers(res.data)
            setLoading(false);
        }).catch(err=>{
            if(err.response) showMsg(err.response.data.message, "error")
            else alert(err)
            
        })
    },[role])

    useEffect(()=>{

        axios.get(`${process.env.REACT_APP_BE_URL}/admin/roles`,
        { headers: {
            'Authorization': `Bearer ${userData.accessToken.token}`,
            'email': userData.email,
        }}
        ).then(res=>{
            var options = ["All"]
            res.data.forEach(ele => {
                options.push(ele.role)
            });
            setFiltOptions(options);
        }).catch(err=>{
            if(err.response) showMsg(err.response.data.message, "error")
            else alert(err)
            
        })
    },[])
  

    return (
        <Box sx={{my:2}}>    
        <Stack direction='row' justifyContent='space-between' sx={{mb:2}}>
            <Stack direction='row' alignItems='center' spacing={1}>
            <IconButton
                    id="fade-button"
                    aria-controls={open ? 'fade-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
            ><FilterList/></IconButton>
            <Typography color='GrayText' variant='body2' >{role}</Typography>
            </Stack>
            
             <Menu id="fade-menu" MenuListProps={{ 'aria-labelledby': 'fade-button'}} anchorEl={anchorEl} open={open} onClose={handleClose}>
                {filtOptions.map((item,index)=>{ return(<MenuItem key={index} onClick={()=>handleFilter(item)}>{item}</MenuItem>)})}
            </Menu>

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
                rows={users}
                columns={columns}
                onRowClick={handleRowClick}
                hideFooter={users.length < 100}
                autoHeight={true}
                disableSelectionOnClick
                experimentalFeatures={{ newEditingApi: true }}
                getRowId={(rows) => rows._id}

                loading={loading}   // you need to set your boolean loading
                filterModel={{
                    items: [{ field: 'username',  operator: "contains", value: filt }]
                }}

                sx={{
                    cursor:'pointer',
                    "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {outline: "none !important"},
                    ".MuiDataGrid-columnSeparator": {display: "none !important"},
                }}
                components={{
                    NoRowsOverlay: () => (
                      <Stack height="100%" alignItems="center" justifyContent="center">
                        No {role==="All"?"Clinicians":role}
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
                    User Information
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
                {/* <Button onClick={handleDialogClose} color='error' variant='contained'>Remove User</Button> */}
                <Button size='small' onClick={handleDialogClose} variant='contained' autoFocus>Ok</Button>
                </DialogActions>
            </Dialog>
            </Box>
    );
};;

export default Users;