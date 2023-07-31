import React, { useState, useEffect } from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, List, ListItem, ListItemText, ListItemIcon, Button  } from '@mui/material';
import {saveAs} from "file-saver";
import { stringToColor } from '../../components/Utils';
import '../../App.css'

const ImageCard = ({imagepath, imagename, masks, age, gender, clinical, risks}) => {

  const uniqueMasks = [];
  const masksSet = new Set();

    masks.forEach((mask) => {
      if (!masksSet.has(mask.name)) {
        masksSet.add(mask.name);
        uniqueMasks.push(mask);
      }
    });


  const imageStyle = {
    padding: '20px',
    width: '100%',


  };

  const masksStyle = {
    padding: '20px',
    // margin: 'auto', // Center the card horizontally


  };

  const detailsStyle = {
    padding: '20px',
    margin: 'auto', // Center the card horizontally


  };

  const downloadImage = (imagepath, imagename)=>{
    let url = `${process.env.REACT_APP_IMAGE_PATH}/${imagepath}/${imagename}`;
    saveAs(url, imagename);
   }

   // *** this needs to be modified
   const downloadAnnotation = (imagepath, imagename)=>{
    let url = `${process.env.REACT_APP_IMAGE_PATH}/${imagepath}/${imagename}`;
    saveAs(url, imagename);
   }

  return (
    <Card className='cardStyle' >
  <Grid container >
    {/* Div for the First Grid */}
    <div className='square_div'>
    
      <Grid item xs={12} md={12} style={imageStyle}>
        <CardMedia
          component="img"
          image={`${process.env.REACT_APP_IMAGE_PATH}/${imagepath}/${imagename}`}
          title="Failed to load the image"
        />
      </Grid>
    </div>


    {/* Second Grid for the List of Three Items */}
    <Grid item xs={12} md={4} style={detailsStyle} >
      <CardContent>
        <Typography variant="h5">Patient Details: </Typography>
        <List>
          <ListItem>
            <ListItemText primary=
            {<table>
            <tbody>
              <tr>
                <td><b>Age: </b></td>
                <td>{age}</td>
              </tr>
            </tbody>
          </table>} 
          />
          </ListItem>
          <ListItem>
            <ListItemText primary={<table>
            <tbody>
              <tr>
                <td><b>Gender: </b></td>
                <td>{gender}</td>
              </tr>
            </tbody>
          </table>}/>
          </ListItem>
          <ListItem>
            <ListItemText primary={<table>
            <tbody>
              <tr>
                <td><b>Clinical Diagnosis: </b></td>
                <td>{clinical}</td>
              </tr>
            </tbody>
          </table>} />
          </ListItem>
          <ListItem>
            <ListItemText primary={<table>
            <tbody>
              <tr>
                <td><b>Risk Habits: </b></td>
                <td>{risks}</td>
              </tr>
            </tbody>
          </table>} />
          </ListItem>
        </List>
      </CardContent>
    </Grid>


    {/* Third Grid for the Masks */}
    <Grid item xs={12} md={4} style={masksStyle}>
      <CardContent>
        <Typography variant="h5">Masks: </Typography>
        <List>
        {uniqueMasks.length === 0 ? (
    <ListItem>
      <ListItemText primary="No annotations" />
    </ListItem>
  ) : (
    uniqueMasks.map((mask, index) => (
      <ListItem key={index}>
        <ListItemIcon>
          <div
            style={{
              width: '16px',
              height: '16px',
              backgroundColor: stringToColor(mask.name),
            }}
          />
        </ListItemIcon>
        <ListItemText primary={mask.name} />
      </ListItem>
    ))
  )}
        </List>
      </CardContent>
      <Button variant="contained" color="primary" onClick={() => downloadImage(imagepath, imagename)}>
        Download Image
      </Button>

      <div style={{ margin: '10px' }} />

      <Button variant="contained" color="primary" onClick={() => downloadAnnotation(imagepath, imagename)}>
        Download Annotation
      </Button>
    </Grid>
  </Grid>
</Card>

  );
};

export default ImageCard;
