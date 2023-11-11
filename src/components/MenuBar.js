import * as React from 'react';
import {useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import logo from '../Assets/note.png';
import { useSelector} from 'react-redux';
import axios from 'axios';
import { Badge, Divider, ListItemAvatar, ListItemIcon, ListItemText, Stack } from '@mui/material';
import { Logout, Notifications, QuestionMark, RateReview } from '@mui/icons-material';

function MenuBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorElNotification, setAnchorElNotification] = React.useState(null);
  const [notificationTrigger, setNotificationTrigger] = React.useState(false);
  const [data, setData] = React.useState({});
  const userData = useSelector(state => state.data);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleOpenNotification = (event) => {
    setAnchorElNotification(event.currentTarget);
    setNotificationTrigger(!notificationTrigger)
  };

  const handleCloseNotification = () => {
    setAnchorElNotification(null);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = ()=>{
    axios.post(`${process.env.REACT_APP_BE_URL}/auth/revokeToken`, {},
    { headers: {
      'Authorization': `Bearer ${userData.accessToken.token}`,
      'email': userData.email,
    },
      withCredentials: true}
    )
    .then(()=>{
      sessionStorage.removeItem("info")
    }).finally(()=>{
      navigate("/");
    });
  };

  const handleGoToHome = ()=>{
    handleCloseNavMenu()
    navigate('/home');
  };

  const handleGoToMyWork = ()=>{
    handleCloseNavMenu()
    navigate('/mywork');
  };

  const handleGoToDB = ()=>{
    handleCloseNavMenu()
    navigate('/dataset/description');
  };

  const handleGoToAdmin = ()=>{
    handleCloseNavMenu()
    navigate('/admin');
  };

  const goToImages = ()=>{
    sessionStorage.setItem("allfilter", "Changes Requested");
    sessionStorage.setItem("allpage", 1);
    navigate('/home/images');
    handleCloseNotification();
  }

  const goToRequests = ()=>{
    navigate('/home/requests');
    handleCloseNotification();
  }

  React.useEffect(()=>{
    axios.get(`${process.env.REACT_APP_BE_URL}/image/notification`,{
      headers: {
          'Authorization': `Bearer ${userData.accessToken.token}`,
          'email': userData.email,
      },
      withCredentials: true
    }).then(res=>{
        setData(res.data);
    }).catch(err=>{
        console.log(err)
    })
  },[notificationTrigger])

  return (
    <AppBar position="fixed" sx={{background:'var(--dark-color)'}}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}>
            <img src={logo} alt='logo' style={{width:'40px', height:'40px'}}/>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              
              <MenuItem onClick={handleGoToHome}>
                <Typography textAlign="center">Home</Typography>
              </MenuItem>
              <MenuItem onClick={handleGoToMyWork}>
                <Typography textAlign="center">My Work</Typography>
              </MenuItem>
              <MenuItem onClick={handleGoToDB}>
                <Typography textAlign="center">Database</Typography>
              </MenuItem>
              <MenuItem onClick={handleGoToAdmin}>
                <Typography textAlign="center">Admin</Typography>
              </MenuItem>
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
           
            <Button onClick={handleGoToHome} sx={{ my: 2, color: 'white', display: 'block' }}>Home</Button>
            <Button onClick={handleGoToMyWork} sx={{ my: 2, color: 'white', display: 'block' }}>My Work</Button>
            <Button onClick={handleGoToAdmin} sx={{ my: 2, color: 'white', display: 'block' }}>Admin</Button>
            <Button onClick={handleGoToDB} sx={{ my: 2, color: 'white', display: 'block' }}>Database</Button>
          </Box>

          <Stack direction='row' alignItems='flex-end' justifyContent='center' spacing={3}>
              
              <IconButton size='small' onClick={handleOpenNotification}>
                <Badge color='error' badgeContent={(data.changes || data.reviews)? data.changes + data.reviews: 0}>
                  <Notifications color='secondary' />
                </Badge>
              </IconButton>
              <Menu
                sx={{ mt: '35px' }}
                id="notification-bar"
                PaperProps={{style:{minWidth:'200px', maxWidth:'300px'}}}
                anchorEl={anchorElNotification}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElNotification)}
                onClose={handleCloseNotification}
              >
                
                <MenuItem onClick={goToRequests}>
                    <ListItemAvatar><Badge color='error' max={999} badgeContent={data.reviews > 0? data.reviews:0}><RateReview color='success'/></Badge></ListItemAvatar>
                    <ListItemText primary="Review Requests" secondary={<Typography variant='body2' color='text.secondary' noWrap>{data.reviews > 0? `${data.reviews} image${data.reviews>1?'s':''} need review requests`:'No review requested'}</Typography>} />
                </MenuItem>
                <MenuItem onClick={goToImages}>
                    <ListItemAvatar><Badge color='error' max={999} badgeContent={data.changes > 0? data.changes:0}><QuestionMark color='error' /></Badge></ListItemAvatar>
                    <ListItemText primary="Changes Requests" secondary={<Typography variant='body2' color='text.secondary' noWrap>{data.changes > 0? `${data.changes} image${data.changes>1?'s':''} need changes`:'No changes requested'}</Typography>}/>
                </MenuItem>
                
              </Menu>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar src={userData.picture} alt={userData.username?userData.username:""}></Avatar>
              </IconButton>
           
              <Menu
                sx={{ mt: '35px'}}
                PaperProps={{style:{minWidth:'200px', maxWidth:'300px'}}}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                
                <MenuItem>
                  <Typography noWrap><b>{userData.username}</b></Typography>
                </MenuItem>
                <Divider/>
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon><Logout/></ListItemIcon>
                  <ListItemText>Logout</ListItemText>
                </MenuItem>
                
              </Menu>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default MenuBar;
