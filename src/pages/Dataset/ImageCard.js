import React, { useState, useEffect } from 'react';
import { Grid, Card, Typography, Button, Stack, IconButton, Tooltip } from '@mui/material';
import {saveAs} from "file-saver";
import { stringToColor } from '../../components/Utils';
import '../../App.css'
import { Download, Visibility, VisibilityOff } from '@mui/icons-material';

const ImageCard = ({imagepath, imagename, masks, age, gender, clinical, risks}) => {

  const [imageWidth, setImageWidth] = useState(0);
  const [addMasks, setAddMasks] = useState(false);
  const [polygons, setPolygons] = useState(<></>);
  const uniqueMasks = [];
  const masksSet = new Set();

  masks.forEach((mask) => {
    if (!masksSet.has(mask.name)) {
      masksSet.add(mask.name);
      uniqueMasks.push(mask);
    }
  });

  const downloadfiles = () =>{
    let url = `${process.env.REACT_APP_IMAGE_PATH}/${imagepath}/${imagename}`;
    saveAs(url, imagename);

    downloadJsonFile();
  }

  const toggleMasks = () =>{
    setAddMasks(!addMasks)
  }

  // Function to draw polygons in the SVG
  useEffect(()=>{

    if (imageWidth === 0 || !addMasks) return;

    const svg = document.getElementById("polygonSVG");
    const svgWidth = svg.clientWidth;

    var regions = []
    masks.forEach((item, index) => {
      const { annotations, name } = item;
      const scaled = annotations.map((element) => Math.round(element * svgWidth / imageWidth));
      var pointstring = scaled.join(',');
      regions.push(
        <polygon key={index} points={pointstring} strokeWidth={4} fill='transparent' stroke={stringToColor(name)}></polygon>
      )
    })
  
    setPolygons(regions)

  },[imageWidth, imagename, masks, addMasks])

  // get the size of the image
  const get_dimensions = (img)=>{
    const image_width = img.nativeEvent.srcElement.naturalWidth;
    setImageWidth(image_width);
  }

  const downloadJsonFile = () => {
    const jsonData = {
      image_name : imagename,
      clinical_diagnosis: clinical,
      age: age,
      gender: gender,
      risks: risks,
      annotation : masks
    }

    const fileName = imagename.split('.').slice(0, -1).join('.') + '.json'
    const jsonBlob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
    const url = URL.createObjectURL(jsonBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };
  

  return (
  <Card className='cardStyle' >
  <Grid container spacing={2}>
    {/* Div for the First Grid */}
    <Grid item xs={12} md={4}>
    <div className='square_div'>
        {addMasks && <svg id="polygonSVG">
          {polygons}
        </svg>}
        <img onLoad={(e)=>{get_dimensions(e)}} src={`${process.env.REACT_APP_IMAGE_PATH}/${imagepath}/${imagename}`} alt='Failed to load the image'/>
    </div>
    </Grid>


    {/* Second Grid for the List of Three Items */}
    <Grid item xs={12} md={6}>
        <table style={{tableLayout:'fixed', width: "100%", wordWrap:'break-word'}}>
            <tbody>
              <tr>
                <td><Typography><b>Image ID: </b></Typography></td>
                <td><Typography>{imagename}</Typography></td>
              </tr>
              <tr>
                <td><Typography><b>Age: </b></Typography></td>
                <td><Typography>{age}</Typography></td>
              </tr>
              <tr>
                <td><Typography><b>Sex: </b></Typography></td>
                <td><Typography>{gender === "M"? "Male": "Female"}</Typography></td>
              </tr>
              <tr>
                <td><Typography><b>Clinical Diagnosis: </b></Typography></td>
                <td><Typography>{clinical}</Typography></td>
              </tr>
              <tr>
                <td valign='top'><Typography><b>Risk Habits: </b></Typography></td>
                <td>
                  {risks?.length > 0 && 
                  <>
                  <Typography>Alcohol: {risks[0]["alcohol"]}</Typography>
                  <Typography>Betel Chewing: {risks[0]["betel_quid"]}</Typography>
                  <Typography>Smoking: {risks[0]["smoking"]}</Typography>
                  </>
                  }
                </td>
              </tr>
            </tbody>
          </table>
    </Grid>


    {/* Third Grid for the Masks */}
    <Grid item xs={12} md={2}>
    <Stack mb={2} spacing={1} alignItems='flex-start' direction='row'>
      <Tooltip title='Toggle Mask Visibility'><IconButton onClick={toggleMasks}>{addMasks? <VisibilityOff/>:<Visibility/>}</IconButton></Tooltip>
      <Tooltip title="Download Image and Annotations"><IconButton><Download onClick={downloadfiles}/></IconButton></Tooltip>
    </Stack>
    {addMasks && <div>
    {uniqueMasks.length === 0 ? (
        <Typography>No Annotations</Typography>
    ) : (
      <table style={{tableLayout:'fixed', width: "100%", wordWrap:'break-word'}}>
        <tbody>
      {uniqueMasks.map((mask, index) => (
        <tr key={index}>
            <td style={{width:'25px', paddingTop:'5px', verticalAlign:'top'}}><div
              style={{
                width: '16px',
                height: '16px',
                backgroundColor: stringToColor(mask.name),
              }}
            /></td>
          <td style={{verticalAlign:'top'}}><Typography>{mask.name}</Typography></td>
          </tr>
      ))}
      </tbody>
      </table>
    )}
    </div>}
    </Grid>
  </Grid>
</Card>

  );
};

export default ImageCard;
