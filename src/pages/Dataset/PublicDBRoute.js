import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { ListItem, ListItemButton, ListItemText, Stack } from '@mui/material';
import './styles.css';
import icon from '../../Assets/favicon.svg'

const NavButton = ({path,name}) => (
    <ListItem disablePadding component={NavLink} to={path}
    sx={{width:'fit-content',color: 'var(--dark-color)'}}
    // style={({ isActive }) => ({
    //       borderBottom: isActive ? '2px solid var(--dark-color)' : '2px solid transparent',
          
    // })}
    >
      <ListItemButton sx={{p:1}}>
        <ListItemText primary={name}/>
      </ListItemButton>
    </ListItem>
)

const PublicDBRoute = () => {

    return (
    <div>
        <div id="headerwrap">
            <header id="mainheader" className="bodywidth clear"> <img src={icon} alt="" className="logo"/>
                <hgroup id="websitetitle">
                <h1><span className="bold">OASIS</span>dataset</h1>
                <h2>Annotated White Light Images of Oral Cancer</h2>
                </hgroup>
                <nav>
                <Stack direction='row'>
                    {/* <NavButton path={"/dataset"} name={"Home"}>Home</NavButton>     */}
                    <NavButton path={"/dataset/description"} name={"Description"}>Description</NavButton>  
                    <NavButton path={"/dataset/download"} name={"Download"}>Download</NavButton>   
                    <NavButton path={"/dataset/contacts"} name={"Contacts"}>Contacts</NavButton>   
                </Stack>
                </nav>
            </header>
        </div>
        <Outlet/>
        <div id="footerwrap">
        <footer id="mainfooter" className="bodywidth clear">
            <nav className="clear">
            <ul>
                <li><NavLink to={'/dataset'}>Home</NavLink></li>
                <li><NavLink to={'/dataset/description'}>Dataset Description</NavLink></li>
                <li><NavLink to={'/dataset/download'}>Downloads</NavLink></li>
                <li><NavLink to={'/dataset/contacts'}>Contacts</NavLink></li>
            </ul>
            </nav>
            <p className="copyright">&copy; Copyright 2023<span>|</span>OASIS-Dataset</p>
        </footer>
        </div>
    </div>
    );
    
};

export default PublicDBRoute;