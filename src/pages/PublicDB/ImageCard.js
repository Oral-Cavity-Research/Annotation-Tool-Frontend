import React from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, List, ListItem, ListItemText, ListItemIcon, Button  } from '@mui/material';
import {saveAs} from "file-saver";

const masks = [
  { name: 'Healthy', color: '#FF0000' },
  { name: 'Benign', color: '#00FF00' },
  { name: 'OC', color: '#0000FF' },
];

const ImageCard = ({imagepath, imagename}) => {
  const cardStyle = {
    display: 'flex',
    maxWidth: '80%',
    width: "60%", // Set a fixed width
    margin: 'auto', // Center the card horizontally


  };

  const imageStyle = {
    padding: '20px',


  };

  const masksStyle = {
    padding: '20px',

  };

  
  const handleClick = (imagepath, imagename)=>{
    let url = `${process.env.REACT_APP_IMAGE_PATH}/${imagepath}/${imagename}`;
    saveAs(url, imagename);
   }

  return (
    <Card style={cardStyle}>
      <Grid container >
        <Grid item xs={12} md={8} style={imageStyle}>
          <CardMedia
            component="img"
            image={`${process.env.REACT_APP_IMAGE_PATH}/${imagepath}/${imagename}`}
            title="Failed to load the image"
            
          />
        </Grid>
        <Grid item xs={12} md={4} style={masksStyle}>
          <CardContent >
            <Typography variant="h6">Masks: </Typography>
            <List>
              {masks.map((mask, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        backgroundColor: mask.color,
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText primary={mask.name} />
                </ListItem>
              ))}
            </List>
          </CardContent>
          <Button variant="contained" color="primary" onClick={() => handleClick(imagepath, imagename)}>
          Download Image
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
};

export default ImageCard;
