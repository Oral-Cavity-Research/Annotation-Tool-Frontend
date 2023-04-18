import React from 'react';
import {IconButton,Tooltip} from '@mui/material';
import {Preview,ZoomIn,CropFree,ZoomOut,Close, CancelOutlined, HelpOutline, Style, History} from '@mui/icons-material';
import {ArrowUpward, ArrowDownward, ArrowBack, ArrowForward, Opacity, Check} from '@mui/icons-material';
import {Label, LabelOff} from '@mui/icons-material';

const ButtonPanel = ({func, labelVisibility, readOnly}) => {

    return (
        <div>       
            {!readOnly && <Tooltip enterNextDelay={1000} title="Clear All" placement="bottom-end" arrow><IconButton size='small' onClick={func.clear_all}><CancelOutlined fontSize='small' sx={{color:"var(--dark-color)"}} /></IconButton></Tooltip>}
            <Tooltip enterNextDelay={1000} title="Show Regions" placement="bottom-end" arrow><IconButton size='small' onClick={func.show_regions}><Preview fontSize='small' sx={{color:"var(--dark-color)"}}/></IconButton></Tooltip>
            {!readOnly && <Tooltip enterNextDelay={1000} title="Finish Drawing" placement="bottom-end" arrow><IconButton size='small' onClick={func.finish_drawing}><Check  fontSize='small' sx={{color:"var(--dark-color)"}}/></IconButton></Tooltip>}
            {!readOnly && <Tooltip enterNextDelay={1000} title="Clear Selected" placement="bottom-end" arrow><IconButton size='small' onClick={func.delete_selected}><Close  fontSize='small' sx={{color:"var(--dark-color)"}}/></IconButton></Tooltip>}
        
            
            <Tooltip enterNextDelay={1000} title="Zoom In" placement="bottom-end" arrow><IconButton size='small' onClick={func.zoom_in}><ZoomIn  fontSize='small' sx={{color:"var(--dark-color)"}}/></IconButton></Tooltip>
            <Tooltip enterNextDelay={1000} title="Zoom Out" placement="bottom-end" arrow><IconButton size='small' onClick={func.zoom_out}><ZoomOut  fontSize='small' sx={{color:"var(--dark-color)"}}/></IconButton></Tooltip>
            <Tooltip enterNextDelay={1000} title="Zoom Reset" placement="bottom-end" arrow><IconButton size='small' onClick={func.zoom_reset}><CropFree  fontSize='small' sx={{color:"var(--dark-color)"}}/></IconButton></Tooltip>
        
            
            {!readOnly && <Tooltip enterNextDelay={1000} title="Move Up" placement="bottom-end" arrow><IconButton size='small' onClick={()=>func.move_selected("ArrowUp", 10)}><ArrowUpward  fontSize='small' sx={{color:"var(--dark-color)"}}/></IconButton></Tooltip>}
            {!readOnly && <Tooltip enterNextDelay={1000} title="Move Down" placement="bottom-end" arrow><IconButton size='small' onClick={()=>func.move_selected("ArrowDown", 10)}><ArrowDownward  fontSize='small' sx={{color:"var(--dark-color)"}}/></IconButton></Tooltip>}
            {!readOnly && <Tooltip enterNextDelay={1000} title="Move Left" placement="bottom-end" arrow><IconButton size='small' onClick={()=>func.move_selected("ArrowLeft", 10)}><ArrowBack  fontSize='small' sx={{color:"var(--dark-color)"}}/></IconButton></Tooltip>}
            {!readOnly && <Tooltip enterNextDelay={1000} title="Clear Right" placement="bottom-end" arrow><IconButton size='small' onClick={()=>func.move_selected("ArrowRight", 10)}><ArrowForward  fontSize='small' sx={{color:"var(--dark-color)"}}/></IconButton></Tooltip>}
        
            
            <Tooltip enterNextDelay={1000} title="Toggle Label Visibility" placement="bottom-end" arrow><IconButton size='small' onClick={func.show_label}>{labelVisibility?<LabelOff  fontSize='small' sx={{color:"var(--dark-color)"}}/>:<Label   fontSize='small' sx={{color:"var(--dark-color)"}}/>}</IconButton></Tooltip>
            <Tooltip enterNextDelay={1000} title="Toggle label type" placement="bottom-end" arrow><IconButton size='small' onClick={func.label_type}><Style  fontSize='small' sx={{color:"var(--dark-color)"}}/></IconButton></Tooltip>
            <Tooltip enterNextDelay={1000} title="Opacity" placement="bottom-end" arrow><IconButton size='small' onClick={func.opacity_change}><Opacity  fontSize='small' sx={{color:"var(--dark-color)"}}/></IconButton></Tooltip>
        
            {/* <div style={{flex: 1}}></div> */}
            <Tooltip enterNextDelay={1000} title="Help" placement="bottom-end" arrow><IconButton size='small' onClick={func.show_help}><HelpOutline  fontSize='small' sx={{color:"var(--dark-color)"}}/></IconButton></Tooltip>
            <Tooltip enterNextDelay={1000} title="History" placement="bottom-end" arrow><IconButton size='small' onClick={func.show_history}><History  fontSize='small' sx={{color:"var(--dark-color)"}}/></IconButton></Tooltip>
                
        </div>
    );
};
export default ButtonPanel;