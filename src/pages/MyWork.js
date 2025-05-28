import React from 'react';
import {Stack, Divider, ListItem, ListItemText, ListItemButton, Typography, Paper} from '@mui/material';
import {NavLink, Outlet } from 'react-router-dom';
import { useSelector} from 'react-redux';
import { AccountCircleTwoTone } from '@mui/icons-material';

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
            <Stack direction='row' alignItems='end'>
                <AccountCircleTwoTone fontSize='large' sx={{color: 'rgb(17, 20, 53)'}}></AccountCircleTwoTone><Typography variant='h5' fontWeight='bold' color='rgb(17, 20, 53)'>{userData.username? `${userData.username}'s Work`:"My Work"}</Typography>
            </Stack>
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