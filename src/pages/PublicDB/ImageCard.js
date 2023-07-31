import React, { useState, useEffect } from 'react';
import { Grid, Card, Typography, Button, Stack } from '@mui/material';
import {saveAs} from "file-saver";
import { stringToColor } from '../../components/Utils';
import '../../App.css'
import { Download } from '@mui/icons-material';

const ImageCard = ({imagepath, imagename, masks, age, gender, clinical, risks}) => {

  const [imageWidth, setImageWidth] = useState(0);
  const [polygons, setPolygons] = useState(<></>);
  const uniqueMasks = [];
  const masksSet = new Set();

  masks.forEach((mask) => {
    if (!masksSet.has(mask.name)) {
      masksSet.add(mask.name);
      uniqueMasks.push(mask);
    }
  });

  const downloadImage = (imagepath, imagename)=>{
    let url = `${process.env.REACT_APP_IMAGE_PATH}/${imagepath}/${imagename}`;
    saveAs(url, imagename);
   }

  // *** this needs to be modified
  const downloadAnnotation = (imagepath, imagename)=>{
  let url = `${process.env.REACT_APP_IMAGE_PATH}/${imagepath}/${imagename}`;
  saveAs(url, imagename);
  }

  // Function to draw polygons in the SVG
  useEffect(()=>{

    if (imageWidth === 0) return;

    const svg = document.getElementById("polygonSVG");
    const svgWidth = svg.clientWidth;

    var regions = []
    masks.forEach((item) => {
      const { annotations, name } = item;
      const scaled = annotations.map((element) => Math.round(element * svgWidth / imageWidth));
      console.log(annotations)
      console.log(scaled)
      console.log(svgWidth, imageWidth)
      var pointstring = scaled.join(',');
      regions.push(
        <polygon points={pointstring} strokeWidth={2} fill='transparent' stroke={stringToColor(name)}></polygon>
      )
    })
  
    setPolygons(regions)

  },[imageWidth])

  // get the size of the image
  const get_dimensions = (img)=>{
    const image_width = img.nativeEvent.srcElement.naturalWidth;
    setImageWidth(image_width);
  }

  return (
  <Card className='cardStyle' >
  <Grid container spacing={2}>
    {/* Div for the First Grid */}
    <Grid item xs={12} md={4}>
    <div className='square_div'>
        <svg id="polygonSVG">
        {polygons}
        </svg>
        <img onLoad={(e)=>{get_dimensions(e)}} src={`${process.env.REACT_APP_IMAGE_PATH}/${imagepath}/${imagename}`} alt='Failed to load the image'/>
    </div>
    </Grid>


    {/* Second Grid for the List of Three Items */}
    <Grid item xs={12} md={4} >
        <table style={{tableLayout:'fixed', width: "100%", wordWrap:'break-word'}}>
            <tbody>
              <tr>
                <td><Typography><b>Age: </b></Typography></td>
                <td><Typography>{age}</Typography></td>
              </tr>
              <tr>
                <td><Typography><b>Gender: </b></Typography></td>
                <td><Typography>{gender}</Typography></td>
              </tr>
              <tr>
                <td><Typography><b>Clinical Diagnosis: </b></Typography></td>
                <td><Typography>{clinical}</Typography></td>
              </tr>
              <tr>
                <td><Typography><b>Risk Habits: </b></Typography></td>
                <td><Typography>{risks}</Typography></td>
              </tr>
            </tbody>
          </table>
    </Grid>


    {/* Third Grid for the Masks */}
    <Grid item xs={12} md={4}>
    {uniqueMasks.length === 0 ? (
      <Typography>No Annotations</Typography>
  ) : (
    <table style={{tableLayout:'fixed', width: "100%", wordWrap:'break-word'}}>
      <tbody>
    {uniqueMasks.map((mask, index) => (
      <tr key={index}>
          <td style={{width:'25px'}}><div
            style={{
              width: '16px',
              height: '16px',
              backgroundColor: stringToColor(mask.name),
            }}
          /></td>
        <td><Typography>{mask.name}</Typography></td>
        </tr>
    ))}
    </tbody>
    </table>
  )}
    <Stack my={2} spacing={1} alignItems='flex-start' direction='column'>
      <Button startIcon={<Download/>} size='small' variant="contained" color="inherit" onClick={() => downloadImage(imagepath, imagename)}>
        Image
      </Button>

      <Button startIcon={<Download/>} size='small' variant="contained" color="inherit" onClick={() => downloadAnnotation(imagepath, imagename)}>
        Annotations
      </Button>
    </Stack>
    </Grid>
  </Grid>
</Card>

  );
};

export default ImageCard;
