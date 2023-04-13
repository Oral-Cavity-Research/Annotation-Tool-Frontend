import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {Box, Button, ButtonBase, Menu, Select, Stack, Typography} from '@mui/material';
import RegionTable from './RegionTable';
import Help from './Help';
import ButtonPanel from './ButtonPanel';
import MenuItem from '@mui/material/MenuItem';
// import axios from 'axios';
import config from '../../config.json';
import NotificationBar from '../NotificationBar';
import { stringToColor } from '../Utils';
import Actions from './Actions';
import EditHistory from './EditHistory';

// global variables 
// todo: check whether we could use useStates instead
const regionNames = ["Oral Cavity", "Teeth","Enemal","Hard Plate","Mole","Soft Plate","Tongue","Stain","Uvula","Gingiva","Lips"]
const diagnosis =["Normal","OLP / LR", "OSMF/OSF","VBD", "RAU","MRG","FEP","PVL","SLE","OFG","OCA"]
const locations = ["Lips","Upper labial mucosa","Lower labial mucosa","L/S Buccal mucosa","R/S Buccal mucosa",
"Palate","Tongue-dorsum","Tongue-ventral","Alveolar ridge","Gingiva","Flour of the mouth"]

const mouse = {x : 0, y : 0, button : 0, cursor: 'crosshair'};
var regions = []
var isDragging = false;
var isSelected = false;
var isDrawing = true ;
var polygon
var canvas
var ctx
var selectedRegion

// return points as Json
const point = (x,y) => ({x,y});

// draw circle around given point
function drawCircle(ctx, pos,zoomLevel,size=4){
  ctx.strokeStyle = "red";
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc((pos.x)*zoomLevel,(pos.y)*zoomLevel,size,0,Math.PI *2);
  ctx.fill();
  ctx.stroke();
}

// polygon class
class Polygon{
  constructor(ctx, color, type){
    this.ctx = ctx;
    this.isSelected = false;
    this.points = [];
    this.mouse = {lx: 0, ly: 0}
    this.activePoint = undefined;
    this.dragging = false;
    this.completed = false;
    this.markedForDeletion = false;
    this.color = color;
    this.transcolor =  color.replace(')', ', 0.6)').replace('rgb', 'rgba')
    this.type = type;
    this.scale = 1;
  }
  addPoint(p){ 
    this.points.push(point((p.x)/this.scale,(p.y)/this.scale)) 
  }
  isPointInPoly(pt){
    for(var c = false, i = -1, l = this.points.length, j = l - 1; ++i < l; j = i)
        ((this.points[i].y <= (pt.y)/this.scale && (pt.y)/this.scale < this.points[j].y) || (this.points[j].y <= (pt.y)/this.scale && (pt.y)/this.scale <this.points[i].y))
        && ((pt.x)/this.scale < (this.points[j].x - this.points[i].x) * ((pt.y)/this.scale - this.points[i].y) / (this.points[j].y - this.points[i].y) + this.points[i].x)
        && (c = !c);
    return c;
  }
  draw(opacity) {
      this.ctx.beginPath();
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = this.color;
      this.ctx.fillStyle = this.transcolor
      for (const p of this.points) { this.ctx.lineTo((p.x)*this.scale,(p.y)*this.scale) }
      this.ctx.closePath();
      if(opacity) this.ctx.fill();
      this.ctx.stroke();
  }
  closest(pos, dist = 8) {
    var i = 0, index = -1;
    dist *= dist;
    for (const p of this.points) {
        var x = pos.x - (p.x)*this.scale;
        var y = pos.y - (p.y)*this.scale;
        var d2 =  x * x + y * y;
        if (d2 < dist) {
            dist = d2;
            index = i;
        }
        i++;
    }
    if (index > -1) { return this.points[index] }
  }
  update(opacity){
      // line following the cursor
      if(!this.completed && this.points.length !== 0){
        isDrawing = true
        this.ctx.strokeStyle = this.color;
        this.ctx.beginPath();
        this.ctx.moveTo(mouse.x,mouse.y)
        this.ctx.lineTo((this.points[this.points.length-1].x)*this.scale,(this.points[this.points.length-1].y)*this.scale)
        this.ctx.stroke();
      }else{
        isDrawing = false;
      }

      // if not dragging get the closest point to mouse
      if (!this.dragging) {  this.activePoint = this.closest(mouse) }

      // if not dragging and mouse button clicked and when other regions are not selected add a point
      if (this.activePoint === undefined && !isDragging && !isSelected && mouse.button && !this.completed) {
          this.addPoint(mouse);
          mouse.button = false;
      // if completed and dragging update the points
      } else if(this.activePoint && this.completed && this.isSelected ) {
          if (mouse.button) {
              isDragging = true;
              if(this.dragging) {
                this.activePoint.x += (mouse.x)/this.scale - this.mouse.lx;
                this.activePoint.y += (mouse.y)/this.scale - this.mouse.ly;
              } else {this.dragging = true}
          } else {
            this.dragging = false
            isDragging = false;
          }
      }
      this.draw(opacity);

      // indicate selection
      if(this.isSelected){
        for (const p of this.points) { drawCircle(this.ctx, p, this.scale) }
        //var inside = this.isPointInPoly(mouse)
        if(this.activePoint ) mouse.cursor = "move"
      }

      this.mouse.lx = (mouse.x)/this.scale;
      this.mouse.ly = (mouse.y)/this.scale;
  }
}

const Canvas = ({data}) => {  
  
  const [size, setSize] = useState({width: 1, height:1})
  const [orginalSize, setOriginalSize] = useState({width: 1, height:1})
  const [showPoints, setShowPoints] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [labelType, setLabelType] = useState("name");
  const [defaultSettings, setDefaultSettings] = useState({type:"Oral Cavity", color: stringToColor("Oral Cavity") });
  const [togglePanel, setTogglePanel] = useState(false);
  const [opacity, setOpacity] = useState(true);
  const [state, setState] = useState(0);
  const [status, setStatus] = useState({msg:"",severity:"success", open:false}) 
  const [content, setContent] = useState("Action");
  const [labelVisibility, setLabelVisibility] = useState(false);
  const [location, setLocation] = useState(data.location)
  const [clinicalDiagnosis, setClinicalDiagnosis] = useState(data.clinical_diagnosis);
  const [lesion, setLesion] = useState(data.lesions_appear);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  
  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setAnchorEl(null);
    set_types(regionNames[index]);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSave = ()=>{

    setState(1);

    var updated = [];

    [...regions].forEach((region, index) =>{
      if(region.completed){
        var pointArray = []
        var all_x = region.points.map((p) => p["x"]);
        var all_y = region.points.map((p) => p["y"]);
        var bbox_arr = [Math.round(Math.min(...all_x)), Math.round(Math.min(...all_y)), 
        Math.round(Math.max(...all_x)), Math.round(Math.max(...all_y))]
        for (const p of region.points) {
          pointArray.push(Math.round(p.x),Math.round(p.y))
        }
        updated.push(
          {
            "id":index,
            "name": region.type,
            "annotations": pointArray,
            "bbox": bbox_arr
          }
        )
      }
    })

    

    // axios.post(`${config['path']}/image/update`,
    //   {
    //     _id: data[imageIndex]._id,
    //     location:location,
    //     clinical_diagnosis:clinicalDiagnosis,
    //     lesions_appear:lesion,
    //     annotation: updated

    //   },
    //   { headers: {
    //       'Authorization': 'BEARER '+ JSON.parse(sessionStorage.getItem("info")).atoken,
    //       'email': JSON.parse(sessionStorage.getItem("info")).email,
    //   }}).then(res=>{
    //     showMsg("Image Data Updated", "success")
    //     // var temp = [...data]
    //     // temp[imageIndex].annotation = updated
    //     // temp[imageIndex].location= location
    //     // temp[imageIndex].clinical_diagnosis = clinicalDiagnosis
    //     // temp[imageIndex].lesions_appear = lesion
    //     // setData(temp);
    //     setOpen(false);
    //   }).catch(err=>{
    //       if(err.response) showMsg(err.response.data.message, "error")
    //       else alert(err)
    //   }).finally(()=>{
    //       setState(0);
    //   })
    
    setState(0);
  }

  const showMsg = (msg, severity)=>{
    setStatus({msg, severity, open:true})
  }

  const canvaRef = useRef(null)

  const show_regions = () =>{
    if(isDrawing) return;

    setContent("Regions")

    var type = [];
    var bbox = [];
    [...regions].forEach(region =>{
      if(region.completed){
        var pointArray = []
        var all_x = region.points.map((p) => p["x"]);
        var all_y = region.points.map((p) => p["y"]);
        var bbox_arr = [Math.round(Math.min(...all_x)), Math.round(Math.min(...all_y)), 
        Math.round(Math.max(...all_x)), Math.round(Math.max(...all_y))]
        for (const p of region.points) {
          pointArray.push(Math.round(p.x),Math.round(p.y))
        }
  
        type.push(region.type)
        bbox.push(bbox_arr.toString()) 
      }
    })

    setShowPoints(
      type.map((points, index) =>
        <tr  key={index}>
          <td>{index+1}</td>
          <td>{type[index]}</td>
          <td>[{bbox[index]}]</td>
        </tr>
      )
    )

    // if(type.length === 0) return
    setTogglePanel(true)
  }

  const show_actions = ()=>{
    setContent("Action");
    setTogglePanel(true);
  }

  const show_history = ()=>{
    setContent("History");
    setTogglePanel(true);
  }

  const show_help = () =>{
    setContent("Help")
    setTogglePanel(true)
  }

  const show_label = ()=>{
    setLabelVisibility(!labelVisibility)
  }

  const label_type = () =>{
    if(labelType === 'id') setLabelType('name')
    else setLabelType('id')
  }

  const opacity_change = ()=>{
    setOpacity(!opacity)
  }

  const delete_selected = () =>{
    if(selectedRegion){
      selectedRegion.markedForDeletion = true;
      isSelected = false;
    }
    redraw_canvas()
    redraw_ids()
  }

  const finish_drawing = () =>{
    [...regions].forEach(region => {
      if(region.points.length < 3) region.markedForDeletion = true;
      region.completed = true
      region.isSelected = false
    });

    polygon = new Polygon(ctx, defaultSettings.color, defaultSettings.type)
    polygon.scale = zoomLevel;
    regions.push(polygon)
    redraw_canvas()
    redraw_ids()
  }

  const handle_keyup = (e) =>{
  
    e.preventDefault()
    
    if(e.key === "Enter") {
      finish_drawing()
    }

    if(e.key === "Escape") {
      
      [...regions].forEach(region => {
        if(!region.completed) region.markedForDeletion = true;
      });
  
      polygon = new Polygon(ctx, defaultSettings.color, defaultSettings.type)
      polygon.scale = zoomLevel;
      regions.push(polygon)
      redraw_canvas()
      redraw_ids()

    }
  
    if(e.key === "Delete") {
      delete_selected()
      redraw_canvas()
      redraw_ids()
    }

    if ( e.key === 'ArrowRight' 
    || e.key === 'ArrowLeft'  
    || e.key === 'ArrowDown'  
    || e.key === 'ArrowUp' ) {
      e.preventDefault()
      var del = 1;
      if(e.shiftKey) del= 10;
      move_selected(e.key, del);
    }

    if(e.key === ' '){
      if(togglePanel) {
        setTogglePanel(false)
        return
      }
      show_actions();
    } 

  }

  const deselect_all = (e) =>{
    if (e.target.className !== 'page_body')  return;

    if(selectedRegion){
      selectedRegion.isSelected = false;
      isSelected = false;
    }

    selectedRegion = null;
    redraw_canvas()
    redraw_ids()
  }

  const handleSelect = () =>{

    isSelected = false;
    selectedRegion = null;

  
    //if drawing don't select
    if(isDrawing) return

    var selectedIndex = -1;
    var i;
    for(i=0; i< regions.length; i++){
      // if closest to a point select that region
      if((regions[i].closest(mouse)) && regions[i].completed){
        // set all are unselected
        [...regions].forEach(region => region.isSelected = false)
        // select only the closest region
        isSelected = true;
        regions[i].isSelected = true;
        selectedRegion = regions[i]
        return
      // if a region is already selected that means
      // user needs to select another region or create a new region
      }else if(regions[i].isSelected){
        if(regions[i].isPointInPoly(mouse)) selectedIndex = i;
        regions[i].isSelected = false;
        selectedRegion = null;
        break
      }
    }

    // select the next unselected region
    for(i=selectedIndex+1;i<regions.length;i++){
      if((regions[i].isPointInPoly(mouse)) && regions[i].completed){
        regions[i].isSelected = true;
        isSelected = true;
        selectedRegion = regions[i]
        break
      }
    }
  }

  const handle_mouse = (e)=>{
  
    var rect = canvas.getBoundingClientRect();

    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;

    if(e.type === "mousedown"){
        handleSelect()  
    }
    
    mouse.button = e.type === "mousedown" ? true : e.type === "mouseup" ? false : mouse.button;
    redraw_canvas()
    redraw_ids()
  }


  // event listner for keypress
  useEffect(() => {
    window.addEventListener("keyup", handle_keyup);
    return () => {
      window.removeEventListener("keyup", handle_keyup);
    };
  }, [handle_keyup]);


  // redraw the canvas
  const redraw_canvas = () =>{

    ctx.clearRect(0,0, canvas.width, canvas.height);
    mouse.cursor = "crosshair";

    regions = regions.filter(region => !region.markedForDeletion);

    [...regions].forEach(region => {region.update(opacity)})

    canvas.style.cursor = mouse.cursor;

  }

  // redraw the region ids
  const redraw_ids = () =>{

    if(!labelVisibility){
      // redraw_canvas()
      return
    } 

    var text, text_info, height, width;

    for(var i=0; i< regions.length; i++){
      if(regions[i].completed){
        if(labelType === 'id') text = (i+1).toString()
        else text = regions[i].type
        text_info = ctx.measureText(text);
        height = ctx.font.match(/\d+/).pop() || 10;
        width = text_info.width;
        ctx.fillStyle = "black";
        ctx.fillRect((regions[i].points[0].x)*regions[i].scale -1 , (regions[i].points[0].y)*regions[i].scale - height-2, width+2, height-(-2));
        ctx.fillStyle = "yellow";
        ctx.textBaseline = "bottom";
        ctx.fillText(text,(regions[i].points[0].x)*regions[i].scale, (regions[i].points[0].y)*regions[i].scale);
      }
    }
  }


  // initial run
  useEffect(() => {
   
  canvas = canvaRef.current;
  ctx = canvas.getContext('2d');

  regions = [];

  if(data){
    [...data.annotation].forEach(region=>{
      var type = region.name
      polygon = new Polygon(ctx, stringToColor(type), type)
      polygon.scale = zoomLevel;
      var points = []
      var oldAnnotations = region.annotations
      for(var i=0; i< oldAnnotations.length; i+=2){
        points.push(point(region.annotations[i], region.annotations[i+1]))
      }
      polygon.points = points
      polygon.completed = true;
      regions.push(polygon)    
    })
  }

  polygon = new Polygon(ctx, defaultSettings.color, defaultSettings.type)
  polygon.scale = zoomLevel;
  regions.push(polygon)

  redraw_canvas()
  redraw_ids()

  }, [data]);

  // redraw if canvas size changed
  useEffect(()=>{
    if(size.height > 1  && size.width> 1){
      redraw_canvas()
      redraw_ids()
    }
  },[size, labelVisibility, opacity, labelType])
 
  // zoom in
  const zoom_in = ()=>{
    if(zoomLevel > 4) return

    setSize({
      width: orginalSize.width * zoomLevel *1.5,
      height: orginalSize.height * zoomLevel *1.5
    });
    
    [...regions].forEach(region =>{
      region.scale = region.scale * 1.5;
    })

    setZoomLevel(zoomLevel*1.5)
  }

  // zoom out
  const zoom_out = ()=>{
    if(zoomLevel < 0.25) return

    setSize({
      width: orginalSize.width * zoomLevel /1.5 ,
      height: orginalSize.height * zoomLevel /1.5
    });
    
    [...regions].forEach(region =>{
      region.scale = region.scale / 1.5;
    })

    setZoomLevel(zoomLevel/1.5)
  }

  // zoom reset
  const zoom_reset = ()=>{
    if(zoomLevel === 1) return

    setSize({
      width: orginalSize.width ,
      height: orginalSize.height
    });
    
    [...regions].forEach(region =>{
      region.scale = 1
    })

    setZoomLevel(1)
  }

  // move the selected region
  const move_selected = (name, del) =>{
    if(!isSelected) return
    
    var move_x = 0;
    var move_y = 0;
    
    switch( name ) {
      case 'ArrowLeft':
        move_x = -del;
        break;
      case 'ArrowUp':
        move_y = -del;
        break;
      case 'ArrowRight':
        move_x =  del;
        break;
      case 'ArrowDown':
        move_y =  del;
        break;
      default:
        break;
      }

    var moved = []

    for (const p of selectedRegion.points) { 
      if(!validate_move((p.x + move_x) * zoomLevel, (p.y + move_y) * zoomLevel)) return
      moved.push({x: p.x + (move_x * zoomLevel), y:p.y + (move_y * zoomLevel)})
    }

    selectedRegion.points = moved
    redraw_canvas()
    redraw_ids()
  }

  // validate move
  const validate_move = (x,y)=>{
    if (x < 0 || y < 0 || x > size.width || y > size.height) {
      return false;
    }
    return true;
  }
  
  //set types
  const set_types = (name)=>{
    const color = stringToColor(name);
    setDefaultSettings({type:name, color: color});

    [...regions].forEach(region => {
      if(!region.completed){
        region.color = color
        region.transcolor = color.replace(')', ', 0.6)').replace('rgb', 'rgba')
        region.type = name
      }
    });

    if(selectedRegion){
      selectedRegion.color = color
      selectedRegion.transcolor = color.replace(')', ', 0.6)').replace('rgb', 'rgba')
      selectedRegion.type = name
    }

    redraw_canvas()
    redraw_ids()
  }

  // get the size of the image
  const get_dimensions = (img)=>{
    setOriginalSize({
      width: img.nativeEvent.srcElement.naturalWidth,
      height: img.nativeEvent.srcElement.naturalHeight,
    })
    setSize({
      width: img.nativeEvent.srcElement.naturalWidth,
      height: img.nativeEvent.srcElement.naturalHeight,
    })
  }

  // clear all regions
  const clear_all = ()=>{
    [...regions].forEach(region => region.markedForDeletion = true);
    polygon = new Polygon(ctx, defaultSettings.color, defaultSettings.type)
    polygon.scale = zoomLevel;
    regions.push(polygon)
    redraw_canvas()
  }

  const goBack = ()=>{
    navigate('/home/images');
  }

  return (
    <>
    <div className='page_body' onMouseDown={(e)=>{deselect_all(e)}}>

        {/********************* side bar **********************/}
        <div className='top_bar'>
          <Stack direction='row' sx={{width:'100%'}} alignItems='center' style={{paddingInline:'10px'}} spacing={1}>
          <ButtonBase aria-controls="lock-menu" sx={{cursor:'pointer', textAlign:'left', bgcolor:'white',p:1,borderRadius:1}}
            aria-expanded={open ? 'true' : undefined} onClick={handleClickListItem}>
            
            <div className='color_square' style={{backgroundColor:stringToColor(regionNames[selectedIndex])}}></div>
            <Typography noWrap sx={{width:'100px'}}>{regionNames[selectedIndex]}</Typography>
          
        </ButtonBase>

          <Menu id="lock-menu" anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            {regionNames.map((option, index) => (
              <MenuItem
                key={option}
                selected={index === selectedIndex}
                onClick={(event) => handleMenuItemClick(event, index)}
                sx={{width:'200px'}}
              >
                <div className='color_square' style={{backgroundColor:stringToColor(option)}}></div>{option}
              </MenuItem>
            ))}
          </Menu>

          {/******************* button pannel *************************/}
          <ButtonPanel func={{finish_drawing,show_regions,show_history, zoom_in, zoom_out, zoom_reset, move_selected, 
          delete_selected, show_help, clear_all, show_label, label_type, opacity_change, show_actions}} labelVisibility={labelVisibility}/>
          
          <div style={{flex: 1}}></div>
          <Button variant='contained' onClick={show_actions}>Action</Button>
          <Button variant='contained' color='inherit' onClick={goBack}>Cancle</Button>
          </Stack>
        </div>
        {/********************** working area **********************/}
        <div className="work_area">
        <div className='drawing'>
          <div style={{margin: '10px',position: 'relative'}}>
          <canvas className='main_canvas' onDoubleClick={(e)=>handle_mouse(e)} onMouseMove={(e)=>{handle_mouse(e)}} onMouseDown={(e)=>{handle_mouse(e)}} onMouseUp={(e)=>{handle_mouse(e)}} ref={canvaRef} width={size.width} height={size.height}>Sorry, Canvas functionality is not supported.</canvas>
  
          <img className="main_img" onLoad={(e)=>{get_dimensions(e)}}  width={size.width} height={size.height} src={data.img} alt="failed to load"/> 
          
          </div>
        </div>
        <div className='right_bar'>
        <div style={{padding:'10px'}}>
        
        {/******************** image annotation ************************/} 
        
          <Typography fontSize='small'>Location</Typography>
        
          <Select fullWidth size='small' value={location} onChange={(e)=>setLocation(e.target.value)} sx={{backgroundColor: "white", mb:1}}>
            {locations.map((name, index) =>{
              return (<MenuItem key={index} value={name}>{name}</MenuItem>)
            })}
          </Select>
        
          <Typography fontSize='small'>Clinical Diagnosis</Typography>
          <Select fullWidth size='small' value={clinicalDiagnosis} onChange={(e)=>setClinicalDiagnosis(e.target.value)} sx={{backgroundColor: "white", mb:1}}>
            {diagnosis.map((name, index) =>{
              return (<MenuItem key={index} value={name}>{name}</MenuItem>)
            })}
          </Select>

          <Typography fontSize='small'>Lesion Present</Typography>
          <Select fullWidth size='small'  value={lesion} onChange={(e)=>setLesion(e.target.value)} sx={{backgroundColor: "white", mb:1}}>
              <MenuItem value={false}>False</MenuItem>
              <MenuItem value={true}>True</MenuItem>
          </Select>
          </div>
        </div>
        </div>
        {/********************** info panel **********************/}
        {
          togglePanel &&
          <Box className='content_panel'>
           
            <div className='top_bar sticky'>
            <Stack direction='row' sx={{width:'100%', paddingInline:'10px'}} justifyContent='space-between' alignItems='center' spacing={1}>
              <Typography noWrap variant='h5' sx={{width:'200px'}}>{content}</Typography>
              <Button variant='contained' sx={{m:1}} onClick={()=>setTogglePanel(false)}>Back To Annotation</Button>
            </Stack>
            </div>
            <Box sx={{p:2}}>
            {content === "Help" && <Help/>}
            {content === "Regions" && <RegionTable showPoints={showPoints}/>}
            {content === "Action" && <Actions/>}
            {content === "History" && <EditHistory/>}
            </Box>
          </Box>
        }
    </div>

      <NotificationBar status={status} setStatus={setStatus}/>
    </>
  )
}

export default Canvas;