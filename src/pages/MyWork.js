import React from 'react';
import {Stack, Divider, ListItem, ListItemText, ListItemButton, Typography, Paper} from '@mui/material';
import {NavLink, Outlet } from 'react-router-dom';
import { useSelector} from 'react-redux';

const NavButton = ({path,name}) => (
    <ListItem disablePadding component={NavLink} to={path}
    sx={{width:'fit-content',color: 'var(--dark-color)'}}
    style={({ isActive }) => ({
          borderBottom: isActive ? '2px solid var(--dark-color)' : '2px solid #fff',
          
    })}
    >
      <ListItemButton sx={{p:1}}>
        <ListItemText primary={name}/>
      </ListItemButton>
    </ListItem>
)


const MyWork = () => {

    const userData = useSelector(state => state.data);

    return (
        <div className='body'>
        <div className='content'>
            <Typography variant='h5'textTransform='uppercase' >{userData.username? userData.username:"My Work"}</Typography>
            <Paper sx={{p:2, my:2}}>
            <Stack direction='row' spacing={1}>
                <NavButton path={"/mywork/images"} name={"Images"}>Images</NavButton>
                <NavButton path={"/mywork/requests"} name={"Requests"}>Requests</NavButton>
                <NavButton path={"/mywork/approved"} name={"Approved"}>Approved</NavButton>
            </Stack>
            <Divider/>

            <Outlet/>
            </Paper>
        </div>
        </div>
    );
};

export default MyWork;