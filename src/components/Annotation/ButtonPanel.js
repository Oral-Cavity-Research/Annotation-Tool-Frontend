import React from 'react';
import {IconButton, Tooltip, Box, Menu, MenuItem, ListItemIcon, ListItemText, Divider, Button, ButtonGroup, Badge} from '@mui/material';
import {Preview,ZoomIn,ZoomOut,Close, HelpOutline, Style, Draw, Settings, OpenWith, Message, Download, ScatterPlot, Timeline, VisibilityOff} from '@mui/icons-material';
import {ArrowUpward, ArrowDownward, ArrowBack, ArrowForward, Opacity, Check} from '@mui/icons-material';
import {Label, LabelOff} from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';

const messageNeeded = ["Commented", "Changes Requested", "Reviewed"]

const ButtonPanel = ({func, labelVisibility, readOnly, polygonMode, dotMode, status}) => {

    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorSetNav, setAnchorSetNav] = React.useState(null);
    const [anchorMoveNav, setAnchorMoveNav] = React.useState(null);
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenSetMenu = (event) => {
        setAnchorSetNav(event.currentTarget);
    };

    const handleOpenMoveMenu = (event) => {
        setAnchorMoveNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseSetMenu = () => {
        setAnchorSetNav(null);
    };

    const handleCloseMoveMenu = () => {
        setAnchorMoveNav(null);
    };

    return (
        <div>
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>     
            {!readOnly && <Tooltip enterNextDelay={1000} title="Drawing polygon mode on / off" placement="bottom-end" arrow><Button size='small' 
            onClick={()=>func.setDrawingMode(!polygonMode, false)}
            sx={{
                height: 40,
                borderRadius: 1,
                marginRight: 0.5,
                bgcolor: polygonMode?"var(--dark-color)":"Background",
                "&:hover": {
                    backgroundColor: polygonMode?"var(--dark-color)":"Background"
                },
              }}
            ><Timeline fontSize='small' sx={{color:polygonMode?"white":'var(--dark-color)'}} /></Button></Tooltip>}
            {!readOnly && <Tooltip enterNextDelay={1000} title="Drawing dot mode on / off" placement="bottom-end" arrow><Button size='small' 
            onClick={()=>func.setDrawingMode(false, !dotMode)}
            sx={{
                height: 40,
                borderRadius: 1,
                marginRight: 0.5,
                bgcolor: dotMode?"var(--dark-color)":"Background",
                "&:hover": {
                    backgroundColor: dotMode?"var(--dark-color)":"Background"
                },
              }}
            ><ScatterPlot fontSize='small' sx={{color:dotMode?"white":'var(--dark-color)'}} /></Button></Tooltip>}
            <ButtonGroup 
                sx={{
                    height: 40,
                    '& .MuiButtonGroup-grouped': {
                        borderColor: "white",
                    },
                    '&:hover .MuiButtonGroup-grouped': {
                        borderColor: "white",
                    },
                }}
            >            
                <Tooltip enterNextDelay={1000} title="Show Regions" placement="bottom-end" arrow><Button size='small' onClick={func.show_regions}><Preview fontSize='small' sx={{color:"var(--dark-color)"}}/></Button></Tooltip>
                <Tooltip enterNextDelay={1000} title="Download Regions" placement="bottom-end" arrow><Button size='small' onClick={func.downloadJsonFile}><Download fontSize='small' sx={{color:"var(--dark-color)"}}/></Button></Tooltip>
                {!readOnly && <Tooltip enterNextDelay={1000} title="Finish Drawing" placement="bottom-end" arrow><Button size='small' onClick={func.finish_drawing}><Check  fontSize='small' sx={{color:"var(--dark-color)"}}/></Button></Tooltip>}
                {!readOnly && <Tooltip enterNextDelay={1000} title="Delete Selected" placement="bottom-end" arrow><Button size='small' onClick={func.delete_selected}><Close  fontSize='small' sx={{color:"var(--dark-color)"}}/></Button></Tooltip>}
            
                
                <Tooltip enterNextDelay={1000} title="Zoom In" placement="bottom-end" arrow><Button size='small' onClick={func.zoom_in}><ZoomIn  fontSize='small' sx={{color:"var(--dark-color)"}}/></Button></Tooltip>
                <Tooltip enterNextDelay={1000} title="Zoom Out" placement="bottom-end" arrow><Button size='small' onClick={func.zoom_out}><ZoomOut  fontSize='small' sx={{color:"var(--dark-color)"}}/></Button></Tooltip>
            
                
                {/* {!readOnly && <Tooltip enterNextDelay={1000} title="Move Up" placement="bottom-end" arrow><Button size='small' onClick={()=>func.move_selected("ArrowUp", 10)}><ArrowUpward  fontSize='small' sx={{color:"var(--dark-color)"}}/></Button></Tooltip>}
                {!readOnly && <Tooltip enterNextDelay={1000} title="Move Down" placement="bottom-end" arrow><Button size='small' onClick={()=>func.move_selected("ArrowDown", 10)}><ArrowDownward  fontSize='small' sx={{color:"var(--dark-color)"}}/></Button></Tooltip>}
                {!readOnly && <Tooltip enterNextDelay={1000} title="Move Left" placement="bottom-end" arrow><Button size='small' onClick={()=>func.move_selected("ArrowLeft", 10)}><ArrowBack  fontSize='small' sx={{color:"var(--dark-color)"}}/></Button></Tooltip>}
                {!readOnly && <Tooltip enterNextDelay={1000} title="Move Right" placement="bottom-end" arrow><Button size='small' onClick={()=>func.move_selected("ArrowRight", 10)}><ArrowForward  fontSize='small' sx={{color:"var(--dark-color)"}}/></Button></Tooltip>}
             */}
                
                {!readOnly &&
                <Tooltip enterNextDelay={1000} title="Move selected" placement="bottom-end" arrow>
                <Button
                    size="small"
                    aria-controls="menu-move"
                    aria-haspopup="true"
                    onClick={handleOpenMoveMenu}
                    color="inherit"
                    >
                    <OpenWith fontSize='small'/>
                </Button>
                </Tooltip>
                }
                <Menu
                    id="menu-move"
                    anchorEl={anchorMoveNav}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    open={Boolean(anchorMoveNav)}
                    onClose={handleCloseMoveMenu}
                >           
                    <MenuItem onClick={()=>func.move_selected("ArrowUp", 10)}>
                        <ListItemIcon> <ArrowUpward fontSize='small' sx={{color:"var(--dark-color)"}} /></ListItemIcon>
                        <ListItemText>Move Up</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={()=>func.move_selected("ArrowDown", 10)}>
                        <ListItemIcon> <ArrowDownward fontSize='small' sx={{color:"var(--dark-color)"}} /></ListItemIcon>
                        <ListItemText>Move Down</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={()=>func.move_selected("ArrowLeft", 10)}>
                        <ListItemIcon> <ArrowBack fontSize='small' sx={{color:"var(--dark-color)"}} /></ListItemIcon>
                        <ListItemText>Move Left</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={()=>func.move_selected("ArrowRight", 10)}>
                        <ListItemIcon> <ArrowForward fontSize='small' sx={{color:"var(--dark-color)"}} /></ListItemIcon>
                        <ListItemText>Move Right</ListItemText>
                    </MenuItem>
                </Menu>
                {/* <Tooltip enterNextDelay={1000} title="Toggle Label Visibility" placement="bottom-end" arrow><Button size='small' onClick={func.show_label}>{labelVisibility?<LabelOff  fontSize='small' sx={{color:"var(--dark-color)"}}/>:<Label   fontSize='small' sx={{color:"var(--dark-color)"}}/>}</Button></Tooltip>
                <Tooltip enterNextDelay={1000} title="Toggle label type" placement="bottom-end" arrow><Button size='small' onClick={func.label_type}><Style  fontSize='small' sx={{color:"var(--dark-color)"}}/></Button></Tooltip>
                <Tooltip enterNextDelay={1000} title="Opacity" placement="bottom-end" arrow><Button size='small' onClick={func.opacity_change}><Opacity  fontSize='small' sx={{color:"var(--dark-color)"}}/></Button></Tooltip> */}
        
                {/* <div style={{flex: 1}}></div> */}
                
                {messageNeeded.includes(status)?
                <Tooltip enterNextDelay={1000} title="Message" placement="bottom-end" arrow><Button size='small' onClick={func.show_history}>
                    <Badge badgeContent={1} color="error"><Message fontSize='small' sx={{color: "var(--dark-color)"}}/></Badge>
                </Button></Tooltip>
                :
                <Tooltip enterNextDelay={1000} title="Message" placement="bottom-end" arrow><Button size='small' onClick={func.show_history}>
                    <Message fontSize='small' sx={{color: "var(--dark-color)"}}/>
                </Button></Tooltip>}
                
                <Tooltip enterNextDelay={1000} title="Settings" placement="bottom-end" arrow>
                <Button
                    size="small"
                    aria-controls="menu-set"
                    aria-haspopup="true"
                    onClick={handleOpenSetMenu}
                    color="inherit"
                    >
                    <Settings fontSize='small'/>
                </Button>
                </Tooltip>
                <Menu
                    id="menu-set"
                    anchorEl={anchorSetNav}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    open={Boolean(anchorSetNav)}
                    onClose={handleCloseSetMenu}
                    onClick={handleCloseSetMenu}
                >           
                
                    <MenuItem onClick={func.show_label}>
                        <ListItemIcon>{labelVisibility?<LabelOff  fontSize='small' sx={{color:"var(--dark-color)"}}/>:<Label   fontSize='small' sx={{color:"var(--dark-color)"}}/>}</ListItemIcon>
                        <ListItemText>Label visibility</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={func.label_type}>
                        <ListItemIcon> <Style fontSize='small' sx={{color:"var(--dark-color)"}} /></ListItemIcon>
                        <ListItemText>Label Type</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={func.opacity_change}>
                        <ListItemIcon> <Opacity fontSize='small' sx={{color:"var(--dark-color)"}} /></ListItemIcon>
                        <ListItemText>Change Opacity</ListItemText>
                    </MenuItem>
                </Menu>

                <Tooltip enterNextDelay={1000} title="Help" placement="bottom-end" arrow><Button size='small' onClick={func.show_help}><HelpOutline  fontSize='small' sx={{color:"var(--dark-color)"}}/></Button></Tooltip>
                <Tooltip enterNextDelay={1000} title="Hide Annotations" placement="bottom-end" arrow><Button size='small' onClick={func.hideannotations}><VisibilityOff  fontSize='small' sx={{color:"var(--dark-color)"}}/></Button></Tooltip>

        </ButtonGroup>
        </Box>
        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="small"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon/>
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
              onClick={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
                maxHeight:'400px'
              }}
            >
              
            {!readOnly && 
            <MenuItem onClick={func.finish_drawing}>
                <ListItemIcon> <Check fontSize='small' sx={{color:"var(--dark-color)"}} /></ListItemIcon>
                <ListItemText>Finish Drawing</ListItemText>
            </MenuItem>}
            {!readOnly && 
            <MenuItem onClick={func.delete_selected}>
                <ListItemIcon> <Close fontSize='small' sx={{color:"var(--dark-color)"}} /></ListItemIcon>
                <ListItemText>Delete Selected</ListItemText>
            </MenuItem>}
            
            <Divider/>
            <MenuItem onClick={func.zoom_in}>
                <ListItemIcon> <ZoomIn fontSize='small' sx={{color:"var(--dark-color)"}} /></ListItemIcon>
                <ListItemText>Zoom In</ListItemText>
            </MenuItem>
            <MenuItem onClick={func.zoom_out}>
                <ListItemIcon> <ZoomOut fontSize='small' sx={{color:"var(--dark-color)"}} /></ListItemIcon>
                <ListItemText>Zoom Out</ListItemText>
            </MenuItem>
            <Divider/>
            {!readOnly && 
            <MenuItem onClick={()=>func.move_selected("ArrowUp", 10)}>
                <ListItemIcon> <ArrowUpward fontSize='small' sx={{color:"var(--dark-color)"}} /></ListItemIcon>
                <ListItemText>Move up</ListItemText>
            </MenuItem>}
            {!readOnly && 
            <MenuItem onClick={()=>func.move_selected("ArrowDown", 10)}>
                <ListItemIcon> <ArrowDownward fontSize='small' sx={{color:"var(--dark-color)"}} /></ListItemIcon>
                <ListItemText>Move down</ListItemText>
            </MenuItem>}
            {!readOnly && 
            <MenuItem onClick={()=>func.move_selected("ArrowLeft", 10)}>
                <ListItemIcon> <ArrowBack fontSize='small' sx={{color:"var(--dark-color)"}} /></ListItemIcon>
                <ListItemText>Move Left</ListItemText>
            </MenuItem>}
            {!readOnly && 
            <MenuItem onClick={()=>func.move_selected("ArrowRight", 10)}>
                <ListItemIcon> <ArrowForward fontSize='small' sx={{color:"var(--dark-color)"}} /></ListItemIcon>
                <ListItemText>Move Right</ListItemText>
            </MenuItem>}

            <Divider/>
            <MenuItem onClick={func.show_label}>
                <ListItemIcon> {labelVisibility?<LabelOff  fontSize='small' sx={{color:"var(--dark-color)"}}/>:<Label   fontSize='small' sx={{color:"var(--dark-color)"}}/>}</ListItemIcon>
                <ListItemText>Label Visibility</ListItemText>
            </MenuItem>
            <MenuItem onClick={func.label_type}>
                <ListItemIcon> <Style fontSize='small' sx={{color:"var(--dark-color)"}} /></ListItemIcon>
                <ListItemText>Label Type</ListItemText>
            </MenuItem>
            <MenuItem onClick={func.opacity_change}>
                <ListItemIcon> <Opacity fontSize='small' sx={{color:"var(--dark-color)"}} /></ListItemIcon>
                <ListItemText>Opacity</ListItemText>
            </MenuItem>

            <Divider/>
            <MenuItem onClick={func.show_regions}>
                <ListItemIcon> <Preview fontSize='small' sx={{color:"var(--dark-color)"}} /></ListItemIcon>
                <ListItemText>Show Regions</ListItemText>
            </MenuItem>
            <MenuItem onClick={func.downloadJsonFile}>
                <ListItemIcon> <Download fontSize='small' sx={{color:"var(--dark-color)"}} /></ListItemIcon>
                <ListItemText>Download Regions</ListItemText>
            </MenuItem>
            <Divider/>
            <MenuItem onClick={func.show_history}>
                <ListItemIcon> <Message fontSize='small' sx={{color:"var(--dark-color)"}} /></ListItemIcon>
                <ListItemText>Message History</ListItemText>
            </MenuItem>
            <MenuItem onClick={func.show_help}>
                <ListItemIcon> <HelpOutline fontSize='small' sx={{color:"var(--dark-color)"}} /></ListItemIcon>
                <ListItemText>Help</ListItemText>
            </MenuItem>
            <MenuItem onClick={func.hideannotations}>
                <ListItemIcon> <VisibilityOff fontSize='small' sx={{color:"var(--dark-color)"}} /></ListItemIcon>
                <ListItemText>Hide Annotations</ListItemText>
            </MenuItem>
            </Menu>
            
            {!readOnly && <Tooltip enterNextDelay={1000} title="Finish Drawing" placement="bottom-end" arrow><IconButton size='small' onClick={func.finish_drawing}><Check  fontSize='small' sx={{color:"var(--dark-color)"}}/></IconButton></Tooltip>}
            
            {!readOnly && <Tooltip enterNextDelay={1000} title="Drawing polygon mode on / off" placement="bottom-end" arrow><IconButton size='small' 
            onClick={()=>func.setDrawingMode(!polygonMode, false)}
            ><Timeline fontSize='small' sx={{color:polygonMode?'primary.main':'var(--dark-color)'}} /></IconButton></Tooltip>}
            {!readOnly && <Tooltip enterNextDelay={1000} title="Drawing dot mode on / off" placement="bottom-end" arrow><IconButton size='small' 
            onClick={()=>func.setDrawingMode(false, !dotMode)}
            ><ScatterPlot fontSize='small' sx={{color:dotMode?'primary.main':'var(--dark-color)'}} /></IconButton></Tooltip>}
            
          </Box>  
        </div>
    );
};
export default ButtonPanel;