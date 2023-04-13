import React from 'react';
import {Stack, Divider, ListItem, ListItemText, ListItemButton, Badge, Typography} from '@mui/material';
import {NavLink, Outlet } from 'react-router-dom';

const NavButton = ({path,name}) => (
    <ListItem disablePadding component={NavLink} to={path}
    sx={{width:'fit-content',color: 'var(--dark-color)'}}
    style={({ isActive }) => ({
          borderBottom: isActive ? '2px solid var(--dark-color)' : '2px solid #f5f5f5',
          
    })}
    >
      <ListItemButton sx={{p:1}}>
        <ListItemText primary={name}/>
      </ListItemButton>
    </ListItem>
)


const Home = () => {
    return (
        <div className='body'>
        <div className='content'>
            <Typography variant='h5'>Home</Typography>
            <Stack direction='row' spacing={1}>
                <NavButton path={"/home/images"} name={"Images"}>Images</NavButton>
                <NavButton path={"/home/requests"} name={"Requests"}>Requests</NavButton>
                <NavButton path={"/home/approved"} name={"Approved"}>Approved</NavButton>
            </Stack>
            <Divider/>

            <Outlet/>
        </div>
        </div>
    );
};

export default Home;