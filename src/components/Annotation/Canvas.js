import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {Box, Button, ButtonBase, ButtonGroup, Chip,  Drawer,  IconButton, Menu, Select, Stack, Switch, TextField, Typography} from '@mui/material';
import RegionTable from './RegionTable';
import Help from './Help';
import ButtonPanel from './ButtonPanel';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import { stringToColor } from '../Utils';
import Actions from './Actions';
import EditHistory from './EditHistory';
import {ArrowDropDown, Cancel, Check, Close, ContactlessOutlined, NavigateBefore, NavigateNext, SaveAs, TextFields} from '@mui/icons-material';
import SaveChanges from './SaveChanges';
import { useSelector} from 'react-redux';
import { LoadingButton } from '@mui/lab';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import NotificationBar from '../NotificationBar';
import Prediction from './Prediction';

// global variables 
// todo: check whether we could use useStates instead
const statuses = ["New", "Changes Requested","Review Requested","Edited", "Approved", "Reviewed","Reopened"]
const categories = [
  // {value:"healthy", label:"Healthy"},
  // {value:"benign", label:"Benign"},
  // {value:"opmd", label:"OPMD"},
  // {value:"oca", label:"OCA"},
  {value:"acceptable", label:"Acceptable"},
  {value:"unacceptable", label:"Unacceptable"},
  {value:"unknown", label:"Unknown"}
]

const mouse = {x : 0, y : 0, button : 0, cursor: 'default'};
var regions = []
var isDragging = false;
var isSelected = false;
var isDrawing = true ;
var polygon
var dot
var canvas
var ctx = null
var selectedRegion

// return points as Json
const point = (x,y) => ({x,y});

// draw circle around given point
function drawCircle(ctx, pos, zoomLevel, size=2, color='red'){
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc((pos.x)*zoomLevel,(pos.y)*zoomLevel,size,0,Math.PI *2);
  ctx.fill();
  ctx.stroke();
}

// polygon class
class Polygon{
  constructor(ctx, color, type, filling_length = '', lateral_seal = '', irregularities = '', 
          voids = ''){
    this.shape = 'polygon'
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
    this.filling_length = filling_length;
    this.lateral_seal = lateral_seal;
    this.irregularities = irregularities;
    this.voids = voids;
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
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = this.color;
      this.ctx.fillStyle = this.transcolor
      for (const p of this.points) { this.ctx.lineTo((p.x)*this.scale,(p.y)*this.scale) }
      if(this.completed) this.ctx.closePath();
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
  update(opacity, polygonMode, dotMode, defaultColor, defaultType){
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

      // check if connecting to the first point
      if (!this.completed && this.points?.length> 2 && this.activePoint === this.points[0]) { drawCircle(this.ctx, this.points[0], this.scale, 4) }

      // if not ccompleted and mouse button clicked on first point complete the region
      if(!this.completed && this.points?.length> 2 && this.activePoint === this.points[0] && mouse.button){
        this.completed = true

        polygon = new Polygon(ctx, defaultColor, defaultType)
        polygon.scale = this.scale;
        regions.push(polygon)

      // if not dragging and mouse button clicked and when other regions are not selected add a point
      }else if (!isDragging && !isSelected && mouse.button && !this.completed && polygonMode) {
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
        for (const p of this.points) { drawCircle(this.ctx, p, this.scale, 4) }
        //var inside = this.isPointInPoly(mouse)
        if(this.activePoint ) mouse.cursor = "move"
      }

      this.mouse.lx = (mouse.x)/this.scale;
      this.mouse.ly = (mouse.y)/this.scale;
  }
  show(opacity){
    this.ctx.beginPath();
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = this.color;
    this.ctx.fillStyle = this.color.replace(')', ', 0.6)').replace('rgb', 'rgba');
    for (const p of this.points) { this.ctx.lineTo((p.x)*this.scale,(p.y)*this.scale) }
    if(this.completed) this.ctx.closePath();
    if(opacity) this.ctx.fill();
    this.ctx.stroke();
  }
}

// dot class
class Dot{
  constructor(ctx, color, type, filling_length = '', lateral_seal = '', irregularities = '', 
          voids = ''){
    this.shape = 'dot'
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
    this.filling_length = filling_length;
    this.lateral_seal = lateral_seal;
    this.irregularities = irregularities;
    this.voids = voids;
    this.scale = 1;
  }
  addPoint(p){ 
    this.points.push(point((p.x)/this.scale,(p.y)/this.scale)) 
    this.completed = true
  }
  
  draw(opacity) {
    for (const p of this.points) { drawCircle(this.ctx, p, this.scale, 5, this.color) }
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
  update(opacity, polygonMode, dotMode, defaultColor, defaultType){
      // line following the cursor
      if(!this.completed && this.points.length !== 0){
        isDrawing = true
        // this.ctx.strokeStyle = this.color;
        // this.ctx.beginPath();
        // this.ctx.moveTo(mouse.x,mouse.y)
        // this.ctx.lineTo((this.points[this.points.length-1].x)*this.scale,(this.points[this.points.length-1].y)*this.scale)
        // this.ctx.stroke();
      }else{
        isDrawing = false;
      }

      // if not dragging get the closest point to mouse
      if (!this.dragging) {  this.activePoint = this.closest(mouse) }

      // if not dragging and mouse button clicked and when other regions are not selected add a point
      if (!isDragging && !isSelected && mouse.button && !this.completed && dotMode) {
          this.addPoint(mouse);
          mouse.button = false;

          dot = new Dot(ctx, defaultColor, defaultType)
          dot.scale = this.scale;
          regions.push(dot)

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
        for (const p of this.points) { drawCircle(this.ctx, p, this.scale, 4) }
        //var inside = this.isPointInPoly(mouse)
        if(this.activePoint ) mouse.cursor = "move"
      }

      this.mouse.lx = (mouse.x)/this.scale;
      this.mouse.ly = (mouse.y)/this.scale;
  }
  show(opacity){
    for (const p of this.points) { drawCircle(this.ctx, p, this.scale, 5, this.color) }
  }
}

const Canvas = ({imagedata, regionNames, options}) => {  
  
  const [size, setSize] = useState({width: 1, height:1})
  const [data, setData] = useState(imagedata);
  const [showPoints, setShowPoints] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [labelType, setLabelType] = useState("name");
  const [defaultSettings, setDefaultSettings] = useState({type:regionNames[0].label, color: stringToColor(regionNames[0].label) });
  const [togglePanel, setTogglePanel] = useState(false);
  const [opacity, setOpacity] = useState(false);
  const [coordinates, setCoordinates] = useState([]);
  const [content, setContent] = useState("Action");
  const [labelVisibility, setLabelVisibility] = useState(false);
  const [polygonMode, setPolygonMode] = useState(false);
  const [dotMode, setDotMode] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [changed, setChanged] = useState({added:[] , same:[], deleted:[]});
  const [saving, setSaving] = useState(false);
  const [direction, setDirection] = useState(-1);
  const [status, setStatus] = useState({msg:"",severity:"success", open:false});
  const [loadingNav, setLoadingNav] = useState(false);
  const userData = useSelector(state => state.data);
  const [navigateThrough, setNavigateThrough] = useState(null);
  const [navigateTo, setNavigateTo] = useState({prev: null, next: null});
  const [publicAvailable, setPublicAvailable] = useState(imagedata.is_public)
  const [category, setCategory] = useState(imagedata.category)
  const [annotationOptions, setAnnotationOptions] = useState({
    filling_length: "", lateral_seal: "", voids: "",  irregularities: ""})
  const [clinicalDiagnosis, setClinicalDiagnosis] = useState(imagedata.clinical_diagnosis)

  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const readOnly = data.status === "Approved";

  const handlePrev = ()=>{
    
    if((changed.added?.length === 0 && changed.deleted?.length === 0) || readOnly){
      navigate("/image/"+ navigateTo.prev)
    }else{
      setContent("");
      setDirection(navigateTo.prev);
      setTogglePanel(true);
    }
  }

  const handleNext = ()=>{

    if((changed.added?.length === 0 && changed.deleted?.length === 0) || readOnly){
      navigate("/image/"+ navigateTo.next)
    }else{
      setContent("");
      setDirection(navigateTo.next);
      setTogglePanel(true);
    }
  }

  const handleAvailability = (e)=>{
    setPublicAvailable(e.target.checked)
    axios.post(`${process.env.REACT_APP_BE_URL}/image/availability/${data._id}`,
    {
        is_public: e.target.checked
    },
    { headers: {
        'Authorization': `Bearer ${userData.accessToken.token}`,
        'email': userData.email,
    }}).then(res=>{
    }).catch(err=>{
      if(err.response) showMsg(err.response.data?.message, "error")
      else  showMsg("Error in updating availability", "error")
    })
  }

  const handleCategoryUpdate = ()=>{
    const prevCategory = data.category
    setData({...data, category})
    axios.post(`${process.env.REACT_APP_BE_URL}/image/update/category/${data._id}`,
    {
      category,
      prevCategory 
    },
    { headers: {
        'Authorization': `Bearer ${userData.accessToken.token}`,
        'email': userData.email,
    }}).then(res=>{
        showMsg("Category is Updated", "success")
    }).catch(err=>{
      if(err.response) showMsg(err.response.data?.message, "error")
      else showMsg("Category update failed", "error")
      setData({...data, category:prevCategory})
    })
  }

  const handleClinicalDiagnosisUpdate = ()=>{
    const prevClinicalDiagnosis = data.clinical_diagnosis
    setData({...data, clinical_diagnosis:clinicalDiagnosis})
    axios.post(`${process.env.REACT_APP_BE_URL}/image/update/clinicaldiagnosis/${data._id}`,
    {
      clinicalDiagnosis,
      prevClinicalDiagnosis 
    },
    { headers: {
        'Authorization': `Bearer ${userData.accessToken.token}`,
        'email': userData.email,
    }}).then(res=>{
        showMsg("Clinical Diagnosis is Updated", "success")
    }).catch(err=>{
      if(err.response) showMsg(err.response.data?.message, "error")
      else showMsg("Clinical Diagnosis update failed", "error")
      setData({...data, clinical_diagnosis: prevClinicalDiagnosis})
    })
  }
  
  const handleSave = ()=>{

    if(userData?.permissions?.includes(90)){
      showMsg("Unauthorized Access","error")
      return;
    };

    if(changed.added?.length === 0 && changed.deleted?.length === 0) return;

    const coor = getCoordinates();
    setCoordinates(coor);

    setSaving(true);

    axios.post(`${process.env.REACT_APP_BE_URL}/image/annotate/${data._id}`,
    {
        location: data.location,
        clinical_diagnosis: data.clinical_diagnosis,
        annotation: coor,
        status: "Save",
    },
    { headers: {
        'Authorization': `Bearer ${userData.accessToken.token}`,
        'email': userData.email,
    }}).then(res=>{
        setData({...data, annotation: coor, status : "Edited"})
        check_changes();
        setTogglePanel(false);
        showMsg("Successful!",'success')
    }).catch(err=>{
      if(err.response) showMsg(err.response.data?.message, "error")
      else showMsg("Category update failed", "error")
    }).finally(()=>{
      setSaving(false)
    })
  }
  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setAnchorEl(null);
    set_types(regionNames[index].label);
    check_changes()
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getCoordinates = ()=>{
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
            "filling_length": region.filling_length,
            "lateral_seal": region.lateral_seal,
            "irregularities": region.irregularities,
            "voids": region.voids,
            "shape": region.shape,
            "annotations": pointArray,
            "bbox": bbox_arr
          }
        )
      }
    })

   return updated;
  }

  const canvaRef = useRef(null)

  const show_regions = () =>{
    if(isDrawing) return;

    setContent("Regions")

    var type = [];
    var bbox = [];
    var shape = [];
    var pointArrays = [];
    [...regions].forEach(region =>{
      if(region.completed){
        var pointArray = []
        var all_x = region.points.map((p) => p["x"]);
        var all_y = region.points.map((p) => p["y"]);
        var bbox_arr = [Math.round(Math.min(...all_x)), Math.round(Math.min(...all_y)), 
        Math.round(Math.max(...all_x)), Math.round(Math.max(...all_y))]
        for (const p of region.points) {
          pointArray.push(Math.round(p.x), Math.round(p.y))
        }
  
        // pointArrays.push(pointArray.toString())
        type.push(region.type)
        shape.push(region.shape)
        bbox.push(bbox_arr.toString()) 
      }
    })

    setShowPoints(
      type.map((points, index) =>
        <tr  key={index}>
          <td>{index+1}</td>
          <td>{shape[index]}</td>
          <td>{type[index]}</td>
          <td>[{bbox[index]}]</td>
          {/* <td>[{pointArrays[index]}]</td> */}
        </tr>
      )
    )

    setTogglePanel(true)
  }

  const show_actions = ()=>{
    setContent("Action");
    const coor = getCoordinates();
    setCoordinates(coor);
    setTogglePanel(true);
  }

  const show_image_annotations = ()=>{
    setContent("Image Label");
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

  const hideannotations = () =>{
    ctx.clearRect(0,0, canvas.width, canvas.height);
  }

  const show_prediction = () =>{
    setContent("Prediction")
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
    redraw_canvas();
    redraw_ids();
    check_changes();
  }

  const finish_drawing = () =>{
    [...regions].forEach(region => {
      if(region.shape === 'polygon' && region.points.length < 3) region.markedForDeletion = true;
      if(region.shape === 'dot' && region.points.length == 0) region.markedForDeletion = true;
      region.completed = true
      region.isSelected = false
    });

    if(polygonMode){
      polygon = new Polygon(ctx, defaultSettings.color, defaultSettings.type)
      polygon.scale = zoomLevel;
      regions.push(polygon)
    }else if (dotMode){
      dot = new Dot(ctx, defaultSettings.color, defaultSettings.type)
      dot.scale = zoomLevel;
      regions.push(dot)
    }
    
    redraw_canvas()
    redraw_ids()
    check_changes();
  }

  const handle_keyup = (e) =>{
  
    e.preventDefault()

    if(readOnly) return;
    
    if(e.key === "Enter") {
      finish_drawing()
    }

    if(e.key === "Escape") {
      
      [...regions].forEach(region => {
        if(!region.completed) region.markedForDeletion = true;
      });

      setDrawingMode(false, false)

      redraw_canvas()
      redraw_ids()

    }
  
    if(e.key === "Delete") {
      delete_selected()
      redraw_canvas()
      redraw_ids()
    }

    if(e.key === "+") {
      zoom_in()
    }

    if(e.key === "-") {
      zoom_out()
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

    check_changes(); 
  }

  const deselect_all = (e) =>{
    if (e.target.className !== 'drawing_area')  return;

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
    if(isDrawing || polygonMode || dotMode) return

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
        
        setAnnotationOptions({
          filling_length: selectedRegion.filling_length || "", 
          lateral_seal: selectedRegion.lateral_seal || "", 
          voids: selectedRegion.voids || "", 
          irregularities: selectedRegion.irregularities || ""
        })
        return
      // if a region is already selected that means
      // user needs to select another region or create a new region
      }else if(regions[i].isSelected){
        if(regions[i].shape === 'polygon' && regions[i].isPointInPoly(mouse)) selectedIndex = i;
        regions[i].isSelected = false;
        selectedRegion = null;
        break
      }
    }

    // select the next unselected region
    for(i=selectedIndex+1;i<regions.length;i++){
      if((regions[i].shape === 'polygon' && regions[i].isPointInPoly(mouse)) && regions[i].completed){
        regions[i].isSelected = true;
        isSelected = true;
        selectedRegion = regions[i]
        
        setAnnotationOptions({
          filling_length: selectedRegion.filling_length || "", 
          lateral_seal: selectedRegion.lateral_seal || "", 
          voids: selectedRegion.voids || "", 
          irregularities: selectedRegion.irregularities || ""
        })
        break
      }
    }
  }

  const handle_mouse = (e)=>{

    if(readOnly || ctx == null) return;
  
    var rect = canvas.getBoundingClientRect();

    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;

    if(e.type === "mousedown"){
        handleSelect()  
    }

    if(e.type === "mouseup"){
      check_changes()
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

  // change drawing mode
  useEffect(() => {
    mouse.cursor = "default"
    finish_drawing();
  }, [polygonMode, dotMode]);

  useEffect(() => {
    check_changes();
  }, [data]);

  useEffect(() => {
    setData(imagedata);
    setNavigateTo({prev:imagedata.prevImage, next:imagedata.nextImage})
    setNavigateThrough(imagedata.status)
  }, [imagedata]);

  useEffect(() => {
    if (navigateThrough === null) return;
    setLoadingNav(true);
    axios.get(`${process.env.REACT_APP_BE_URL}/image/navigation/${data._id}/${navigateThrough}`,
    { headers: {
        'Authorization': `Bearer ${userData.accessToken.token}`,
        'email': userData.email,
    }}).then(res=>{
        setNavigateTo({prev: res.data.prev, next: res.data.next})
    }).catch(err=>{
        showMsg("Error!","error")
    }).finally(()=>{
      setLoadingNav(false);
    })
  }, [navigateThrough]);

  const check_changes = ()=>{
    const newCoor = getCoordinates();
    const originalCoor = data.annotation;
    const same = []
    const deleted = []
    const added =[]

    originalCoor.forEach(element => {
      if(
        newCoor.some(e => 
        // e.name === element.name && e.filling_length === element.filling_length &&
        // e.annotations?.join("") === element.annotations?.join("")
        JSON.stringify(e) === JSON.stringify(element)
      )
      ){
        same.push(element);
      }else{
        deleted.push(element);
      }
    });

    newCoor.forEach(element => {
      if(!originalCoor.some(e => 
        // e.name === element.name && e.filling_length === element.filling_length &&
        // e.annotations?.join("") === element.annotations?.join("")
        JSON.stringify(e) === JSON.stringify(element)
      )
      ){
        added.push(element);
      }
    });

    setChanged({added, same, deleted});
  }

  // redraw the canvas
  const redraw_canvas = () =>{
    
    if(ctx === null) return;
    
    ctx.clearRect(0,0, canvas.width, canvas.height);
    
    if(readOnly || !(polygonMode || dotMode)) {mouse.cursor = "default"}
    else {mouse.cursor = "crosshair"}

    regions = regions.filter(region => !region.markedForDeletion);

    [...regions].forEach(region => {region.update(opacity, polygonMode, dotMode, defaultSettings.color, defaultSettings.type)})

    canvas.style.cursor = mouse.cursor;

  }

  // redraw the region ids
  const redraw_ids = () =>{

    if(!labelVisibility || ctx === null) return;
    

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
  const init_run = (initZoomLevel) => {
   
    canvas = canvaRef.current;
    ctx = canvas.getContext('2d');

    regions = [];

    if(data){
      [...data.annotation].forEach(region=>{
        var type = region.name
        var shape = region.shape
        var new_shape = null

        if(shape === 'polygon'){
          new_shape = new Polygon(ctx, stringToColor(type), type, 
          region.filling_length, region.lateral_seal, region.irregularities, 
          region.voids)
        }else{
          new_shape = new Dot(ctx, stringToColor(type), type,
          region.filling_length, region.lateral_seal, region.irregularities, 
          region.voids)
        }
        
        new_shape.scale = initZoomLevel;
        var points = []
        var oldAnnotations = region.annotations
        for(var i=0; i< oldAnnotations.length; i+=2){
          points.push(point(region.annotations[i], region.annotations[i+1]))
        }
        new_shape.points = points
        new_shape.completed = true;
        regions.push(new_shape)    
      })
    }

    // polygon = new Polygon(ctx, defaultSettings.color, defaultSettings.type)
    // polygon.scale = initZoomLevel;
    // regions.push(polygon)

    redraw_canvas()
    redraw_ids()
    check_changes();

  };

  // redraw if canvas size changed
  useEffect(()=>{
    if(size.height > 1  && size.width> 1){
      redraw_canvas()
      redraw_ids()
    }
  },[size, labelVisibility, opacity, labelType])
 
  // zoom in
  const zoom_in = ()=>{
    if(size.width > 2 * window.innerWidth) return

    setSize({
      width: size.width * 1.25 ,
      height: size.height * 1.25 
    });
    
    [...regions].forEach(region =>{
      region.scale = region.scale * 1.25;
    })

    setZoomLevel(zoomLevel * 1.25)
  }

  // zoom out
  const zoom_out = ()=>{
    if(size.width < window.innerWidth/4) return

    setSize({
      width: size.width / 1.25 ,
      height: size.height / 1.25 
    });
    
    [...regions].forEach(region =>{
      region.scale = region.scale / 1.25;
    })

    setZoomLevel(zoomLevel/1.25)
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
    check_changes();
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
   
    const drawingboard_width = matches? window.innerWidth - (300+20) : window.innerWidth - 20 ;
    const image_width = img.nativeEvent.srcElement.naturalWidth;


    var initZoomLevel = image_width > drawingboard_width ? (drawingboard_width / image_width): 1;

    setSize({
      width: img.nativeEvent.srcElement.naturalWidth * initZoomLevel,
      height: img.nativeEvent.srcElement.naturalHeight * initZoomLevel,
    });

    setZoomLevel(initZoomLevel);
    init_run(initZoomLevel);
  }

  // clear all regions
  // const clear_all = ()=>{
  //   [...regions].forEach(region => region.markedForDeletion = true);
  //   polygon = new Polygon(ctx, defaultSettings.color, defaultSettings.type)
  //   polygon.scale = zoomLevel;
  //   regions.push(polygon)
  //   redraw_canvas()
  //   check_changes();
  // }

  const show_diff = ()=>{

    if(ctx == null) return;

    ctx.clearRect(0,0, canvas.width, canvas.height);
    
    var diff = [];

    [...changed.added].forEach(region=>{
      var type = region.name
      var shape = null
      if(region.shape === 'polygon'){
        shape = new Polygon(ctx,'rgb(0, 255, 0)', type)
      }else{
        shape = new Dot(ctx,'rgb(0, 255, 0)', type)
      }
  
      shape.scale = zoomLevel;
      var points = []
      var oldAnnotations = region.annotations
      for(var i=0; i< oldAnnotations.length; i+=2){
        points.push(point(region.annotations[i], region.annotations[i+1]))
      }
      shape.points = points
      shape.completed = true;
      diff.push(shape)    
    });

    [...changed.deleted].forEach(region=>{
      var type = region.name
      var shape = null
      if(region.shape === 'polygon'){
        shape = new Polygon(ctx,'rgb(255, 0, 0)', type)
      }else{
        shape = new Dot(ctx,'rgb(255, 0, 0)', type)
      }
      
      shape.scale = zoomLevel;
      var points = []
      var oldAnnotations = region.annotations
      for(var i=0; i< oldAnnotations.length; i+=2){
        points.push(point(region.annotations[i], region.annotations[i+1]))
      }
      shape.points = points
      shape.completed = true;
      diff.push(shape)    
    });

    [...changed.same].forEach(region=>{
      var type = region.name
      var shape = null
      if(region.shape === 'polygon'){
        shape = new Polygon(ctx,'rgb(224, 224, 224)', type)
      }else{
        shape = new Dot(ctx,'rgb(224, 224, 224)', type)
      }
      
      shape.scale = zoomLevel;
      var points = []
      var oldAnnotations = region.annotations
      for(var i=0; i< oldAnnotations.length; i+=2){
        points.push(point(region.annotations[i], region.annotations[i+1]))
      }
      shape.points = points
      shape.completed = true;
      diff.push(shape)    
    });

    diff.forEach(region => {region.show(opacity)});
    redraw_ids();
  }

  const goBack = ()=>{
    const coor = getCoordinates();
    setCoordinates(coor);
    if((changed.added?.length === 0 && changed.deleted?.length === 0) || readOnly){
      if(imagedata.status === "Review Requested"){
        navigate("/home/requests");
      }else if(imagedata.status === "Approved"){
        navigate("/home/approved");
      }else{
        navigate("/home/images");
      }
    }else{
      setContent("");
      setDirection(-1);
      setTogglePanel(true);
    }
  }

  const showMsg = (msg, severity)=>{
    setStatus({msg, severity, open:true})
  }

  const handleNavigationChange =(event)=>{
    setNavigateThrough(event.target.value);
  }

  const handleCategoryChange =(event)=>{
    setCategory(event.target.value);
  }

  const handleClinicalDiagnosisChange = (event)=>{
    setClinicalDiagnosis(event.target.value);
  }


  const downloadImage = ()=>{
    if(userData?.permissions?.includes(90)){
      showMsg("Unauthorized Access","error")
      return;
    }
  }

  const downloadJsonFile = () => {
    if(userData?.permissions?.includes(90)){
      showMsg("Unauthorized Access","error")
      return;
    }

    const coor = getCoordinates();

    const jsonData = {
      image_name : data.image_name,
      age: data.age,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      location: data.location,
      clinical_diagnosis: data.clinical_diagnosis,
      annotation: coor,
    }

    const fileName = data.image_name?.split('.').slice(0, -1).join('.') + '.json'
    const jsonBlob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
    const url = URL.createObjectURL(jsonBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);

    downloadImage();
  };

  const setDrawingMode = (polygonState, dotState) =>{
    setPolygonMode(polygonState)
    setDotMode(dotState)
  }


  return (
    <>
    <div className='page_body' onMouseDown={(e)=>{deselect_all(e)}}>

        {/********************* side bar **********************/}
        <div className='top_bar'>
          <Stack direction='row' sx={{width:'100%'}} alignItems='center' style={{paddingInline:'10px'}} spacing={1}>
          {!readOnly && 
          <ButtonBase aria-controls="lock-menu" sx={{cursor:'pointer', textAlign:'left', bgcolor:'white', p:1, borderRadius:1}}
            aria-expanded={open ? 'true' : undefined} onClick={handleClickListItem}>
            
            <div className='color_square' style={{backgroundColor:stringToColor(selectedRegion?.type || regionNames[selectedIndex].label)}}></div>
            <Typography noWrap sx={{width:'100px'}}>{ selectedRegion?.type || regionNames[selectedIndex].label}</Typography>
          
          </ButtonBase>
          }

          <Menu id="lock-menu" anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            {regionNames.map((option, index) => (
              <MenuItem
                key={option.label}
                selected={index === selectedIndex}
                onClick={(event) => handleMenuItemClick(event, index)}
                sx={{width:'200px'}}
              >
                <div className='color_square' style={{backgroundColor:stringToColor(option.label)}}></div>{option.label}
              </MenuItem>
            ))}
          </Menu>

          {/******************* button pannel *************************/}
          <ButtonPanel func={{downloadJsonFile,finish_drawing,setDrawingMode,show_regions,show_history, zoom_in, zoom_out, move_selected, 
          delete_selected, show_help, show_label, label_type, opacity_change, show_actions, hideannotations}} labelVisibility={labelVisibility} readOnly={readOnly} polygonMode={polygonMode} dotMode={dotMode} status={data.last_comment?.action}/>
          
          {!readOnly &&
          <Box sx={{display: { xs: 'none', sm: 'block' } }} >
          {(changed.added?.length === 0 && changed.deleted?.length === 0)?
           <Chip size='small' label="Saved" color="success" onClick={show_diff}/>
            :
            <Chip size='small' label="Unsaved Changes" color="warning" onClick={show_diff}/>}
          </Box>
          }

          <div style={{flex: 1}}></div>
          <Box sx={{display: { xs: 'none', sm: 'block' } }} >
            <Stack direction='row' spacing={1}>
            {!(data.status === "Review Requested" || data.status === "Approved")?
              <ButtonGroup color='success' variant="contained">
                <LoadingButton loading={saving} variant='contained' onClick={handleSave}>Save</LoadingButton>
                <Button size='small'  onClick={show_actions}><ArrowDropDown/></Button>
              </ButtonGroup>
              :
              <Button size='small' color='success' endIcon={<ArrowDropDown/>} variant='contained' onClick={show_actions}>Action</Button>
            }
              <Button size='small' variant='outlined' color='inherit' onClick={goBack}>Close</Button>
            </Stack>
          </Box>
          <Box sx={{display: { xs: 'block', sm: 'none' } }} >
            <Stack direction='row' spacing={1}>
              <IconButton size='small' onClick={show_image_annotations}><TextFields color='inherit'/></IconButton>
              <IconButton size='small' onClick={show_actions}><SaveAs color='warning'/></IconButton>
              <IconButton size='small' onClick={goBack}><Cancel color='inherit' /></IconButton>
            </Stack>
          </Box>

          </Stack>
        </div>
        {/********************** working area **********************/}
        <div className="work_area">
        <div className='drawing'>
          {
            isSelected && 
            <Box className='annotation-box' sx={{background: selectedRegion.color.replace(')', ', 0.2)').replace('rgb', 'rgba')}}>
            <Stack direction='column' spacing={1}>
              <Typography variant='body2' color='black' noWrap>Filling Length:</Typography>
              <Select
                  fullWidth
                  variant= 'filled'
                  value={annotationOptions.filling_length}
                  size='small'
                  onChange={(event)=>{
                    selectedRegion.filling_length = event.target.value
                    setAnnotationOptions({...annotationOptions, filling_length: event.target.value})
                    check_changes()
                  }}
                  sx={{
                    backgroundColor: 'white',
                    '&:hover': {
                      backgroundColor: 'white',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'white',
                    }
                  }}
                >
                  <MenuItem value=""><em>N/A</em></MenuItem>
                  {
                    options.find(item => item.name === "filling_length").options.map((val, index)=>(
                      <MenuItem key={index} value={val.value}>{val.label}</MenuItem>
                    ))
                  }
              </Select>
              <Typography variant='body2' color='black' noWrap>Lateral Seal:</Typography>
              <Select
                  fullWidth
                  variant= 'filled'
                  value={annotationOptions.lateral_seal}
                  size='small'
                  onChange={(event)=>{
                    selectedRegion.lateral_seal = event.target.value
                    setAnnotationOptions({...annotationOptions, lateral_seal: event.target.value})
                    check_changes()
                  }}
                  sx={{
                    backgroundColor: 'white',
                    '&:hover': {
                      backgroundColor: 'white',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'white',
                    }
                  }}
                >
                  <MenuItem value=""><em>N/A</em></MenuItem>
                  {
                    options.find(item => item.name === "lateral_seal").options.map((val, index)=>(
                      <MenuItem key={index} value={val.value}>{val.label}</MenuItem>
                    ))
                  }
              </Select>
              <Typography variant='body2' color='black' noWrap>Irregularities:</Typography>
              <Select
                  fullWidth
                  variant= 'filled'
                  value={annotationOptions.irregularities}
                  size='small'
                  onChange={(event)=>{
                    selectedRegion.irregularities = event.target.value
                    setAnnotationOptions({...annotationOptions, irregularities: event.target.value})
                    check_changes()
                  }}
                  sx={{
                    backgroundColor: 'white',
                    '&:hover': {
                      backgroundColor: 'white',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'white',
                    }
                  }}
                >
                  <MenuItem value=""><em>N/A</em></MenuItem>
                  {
                    options.find(item => item.name === "irregularities").options.map((val, index)=>(
                      <MenuItem key={index} value={val.value}>{val.label}</MenuItem>
                    ))
                  }
              </Select>
              <Typography variant='body2' color='black' noWrap>Voids:</Typography>
              <Select
                  fullWidth
                  variant= 'filled'
                  value={annotationOptions.voids}
                  size='small'
                  onChange={(event)=>{
                    selectedRegion.voids = event.target.value
                    setAnnotationOptions({...annotationOptions, voids: event.target.value})
                    check_changes()
                  }}
                  sx={{
                    backgroundColor: 'white',
                    '&:hover': {
                      backgroundColor: 'white',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'white',
                    }
                  }}
                >
                  <MenuItem value=""><em>N/A</em></MenuItem>
                  {
                    options.find(item => item.name === "voids").options.map((val, index)=>(
                      <MenuItem key={index} value={val.value}>{val.label}</MenuItem>
                    ))
                  }
              </Select>
            </Stack>
            
          </Box>  }

          <div className='drawing_area'>
          <canvas className='main_canvas' onDoubleClick={(e)=>handle_mouse(e)} onMouseMove={(e)=>{handle_mouse(e)}} onMouseDown={(e)=>{handle_mouse(e)}} onMouseUp={(e)=>{handle_mouse(e)}} ref={canvaRef} width={size.width} height={size.height}>Sorry, Canvas functionality is not supported.</canvas>
  
          <img className="main_img" onLoad={(e)=>{get_dimensions(e)}}  width={size.width} height={size.height} src={data.img} alt="failed to load"/> 
          
          <Box sx={{display: { xs: 'block', sm: 'none' } }}>
          <Stack sx={{p:1, my:2}} direction='column' spacing={1}>
            <Select
              value={navigateThrough? navigateThrough: imagedata.status}
              size='small'
              onChange={handleNavigationChange}
            >
              {
                statuses.map((val, index)=>(
                  <MenuItem key={index} value={val}>{val}</MenuItem>
                ))
              }
            </Select>
            <Stack direction='row' spacing={1} justifyContent='center'>
              <LoadingButton loadingPosition="start" loading={loadingNav} size='small' onClick={handlePrev} color='inherit' disabled={navigateTo.prev === null} startIcon={<NavigateBefore/>} variant='contained'>Prev</LoadingButton>
              <LoadingButton loadingPosition="end" loading={loadingNav} size='small' onClick={handleNext} color='inherit' disabled={navigateTo.next === null} endIcon={<NavigateNext/>} variant='contained'>Next</LoadingButton>
            </Stack>
          </Stack>
          {/* <Box sx={{p:1, my:2}}>
            <Button fullWidth variant='contained' onClick={show_prediction} sx={{bgcolor:'var(--dark-color)'}} startIcon={<OnlinePrediction/>}>Prediction</Button>
          </Box> */}
          </Box>
          </div>
        </div>
        {/******************** image annotation ************************/} 
        <Box className='right_bar' sx={{display: { xs: 'none', sm: 'block' } }}>
        <Box px={1}>
                
          <Box sx={{bgcolor:'white', borderRadius:1, p:1}}>
          <Typography variant='body2' noWrap>Image Name:</Typography>
          <Typography variant='body2' noWrap>{data.image_name}</Typography>
          <br/>
          <Typography variant='body2' noWrap>Clinical Diagnosis:</Typography>
          {/* <Typography variant='body2' noWrap>{data.clinical_diagnosis}</Typography> */}
          <Stack direction='row' alignItems='center' spacing={1}>
            <TextField multiline value={clinicalDiagnosis} onChange={handleClinicalDiagnosisChange} size='small' variant='standard' fullWidth maxRows={4} />
            <IconButton 
              onClick={handleClinicalDiagnosisUpdate}
              disabled={data.clinical_diagnosis === clinicalDiagnosis}
              sx={{bgcolor:'var(--primary-color)', color:'white', "&:hover":{color:'var(--primary-color)'}}} size='small'>
              <Check fontSize='small' /></IconButton>
          </Stack>
          <br/>
          <Typography variant='body2' noWrap>Category:</Typography>
          <Stack direction='row' alignItems='center' spacing={1}>
            <Select
                fullWidth
                variant='standard'
                value={category}
                size='small'
                onChange={handleCategoryChange}
              >
                {
                  categories.map((val, index)=>(
                    <MenuItem key={index} value={val.value}>{val.label}</MenuItem>
                  ))
                }
            </Select>
            <IconButton 
              onClick={handleCategoryUpdate}
              disabled={data.category === category}
              sx={{bgcolor:'var(--primary-color)', color:'white', "&:hover":{color:'var(--primary-color)'}}} size='small'>
              <Check fontSize='small' /></IconButton>
          </Stack>
          <br/>
          <Typography variant='body2' noWrap>Make available for public:</Typography>
          <Switch checked={publicAvailable} onChange={handleAvailability} size='small'/>
          <br/>
          <br/>
          <Typography variant='body2'>Current Status:</Typography>
          <Chip size='small' label={data.status} sx={{bgcolor:'gray', color:'white'}} onClick={show_history}/>
          </Box>
          <Stack direction='column'  spacing={1} sx={{bgcolor:'#fbfbfb', borderRadius:1, p:1, my:2}}>
            <Select
              fullWidth
              value={navigateThrough? navigateThrough: imagedata.status}
              size='small'
              onChange={handleNavigationChange}
            >
              {
                statuses.map((val, index)=>(
                  <MenuItem key={index} value={val}>{val}</MenuItem>
                ))
              }
            </Select>
            <Stack direction='row' spacing={1}>
              <LoadingButton loading={loadingNav} loadingPosition="start" size='small' onClick={handlePrev} color='inherit' disabled={navigateTo.prev === null} startIcon={<NavigateBefore/>} fullWidth variant='contained'>Prev</LoadingButton>
              <LoadingButton loading={loadingNav} loadingPosition="end" size='small' onClick={handleNext} color='inherit' disabled={navigateTo.next === null} endIcon={<NavigateNext/>} fullWidth variant='contained'>Next</LoadingButton>
            </Stack>
          </Stack>
          {/* <Box sx={{bgcolor:'white', borderRadius:1, p:1, my:2}}>
            <Button fullWidth variant='contained' onClick={show_prediction} sx={{bgcolor:'var(--dark-color)'}} startIcon={<OnlinePrediction/>}>Prediction</Button>
          </Box> */}
          </Box>
        </Box>
        </div>
        {/********************** info panel **********************/}
        {
          
        <Drawer anchor='bottom' open={togglePanel} onClose={()=>setTogglePanel(false)}>
          <Box className='content_panel'>
           
            <div className='top_bar'>
            
            <Stack direction='row' sx={{width:'100%', paddingInline:'10px'}} justifyContent='space-between' alignItems='center' spacing={1}>
              <Typography noWrap variant='h5' sx={{width:'200px'}}>{content}</Typography>
              <IconButton sx={{m:1}} onClick={()=>setTogglePanel(false)}><Close/></IconButton>
            </Stack>
            
            </div>
            <div className='content_area'>
            <Box sx={{p:2}}>
            {content === "Help" && <Help/>}
            {content === "Prediction" && <Prediction  showMsg={showMsg} img={data.img} name={data.image_name}/>}
            {content === "Regions" && <RegionTable showPoints={showPoints}/>}
            {content === "Action" && <Actions 
              showMsg={showMsg}
              setTogglePanel={setTogglePanel}
              data={data} 
              setData={setData}
              coordinates={coordinates} 
              unsaved={changed.added?.length !== 0 || changed.deleted?.length !== 0}
              location={data.location} clinicalDiagnosis={data.clinical_diagnosis}
            />}
            {content === "History" && <EditHistory image={data}/>}
            {content === "" && <SaveChanges direction={direction} handleSave={handleSave} saving={saving}/>}
            {content === "Image Label" &&
            <div style={{padding:'10px'}}>
                
            <Box sx={{bgcolor:'#fbfbfb', borderRadius:1, p:1}}>
              <Typography variant='body2'><b>Current Status</b></Typography>
              <br/>
              <Typography variant='body2' color='green' noWrap>{data.status}</Typography>
              <br/>
              <Typography variant='body2'><b>Image Data</b></Typography>
              <br/>
              <Typography variant='body2' noWrap>Clinical Diagnosis:</Typography>
              <Typography variant='body2' noWrap>{data.clinical_diagnosis}</Typography>
              <br/>
              <Typography variant='body2' noWrap>Category:</Typography>
              <Stack direction='row' alignItems='center' spacing={1}>
                <Select
                    fullWidth
                    variant='standard'
                    value={category}
                    size='small'
                    onChange={handleCategoryChange}
                  >
                    {
                      categories.map((val, index)=>(
                        <MenuItem key={index} value={val.value}>{val.label}</MenuItem>
                      ))
                    }
                </Select>
                <IconButton 
                  onClick={handleCategoryUpdate}
                  disabled={data.category === category}
                  sx={{bgcolor:'var(--primary-color)', color:'white', "&:hover":{color:'var(--primary-color)'}}} size='small'>
                  <Check fontSize='small' /></IconButton>
              </Stack>
              <br/>
              <Typography variant='body2' noWrap>Image Name:</Typography>
              <Typography variant='body2' noWrap>{data.image_name}</Typography>
              <br/>
              <Typography variant='body2' noWrap>Make available for public:</Typography>
              <Switch checked={publicAvailable} onChange={handleAvailability} size='small'/>
            </Box>
            </div>
            }
            </Box>
            </div>
          </Box>
        </Drawer>
        }
    </div>
    <NotificationBar status={status} setStatus={setStatus}/>
    </>
  )
}

export default Canvas;
