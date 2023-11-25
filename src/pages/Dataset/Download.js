import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {ButtonBase, Stack } from '@mui/material';
import pdf from '../../Assets/pdf.png';
import lock from '../../Assets/padlock.png';
import json from '../../Assets/json.png';
import csv from '../../Assets/csv.png';
import zip from '../../Assets/zip.png';
import DownloadConfirm from './DownloadConfirm';

const Download = () => {

    const [open, setOpen] = React.useState(false);
    const [type, setType] = React.useState("");
    const navigate = useNavigate();

    const handleClickOpen = (type_) => {
        setOpen(true);
        setType(type_)
    };

    const handleGotoAgreement = ()=>{
        navigate("/dataset/agreement")
    }


    return (
    <>
        <div className="bodywidth clear">
        <div id="fulltext">
            <h3>Dataset Access</h3>
            <p>To access and download the files available on this page, you should visit the <NavLink to={'/dataset/agreement'}>OASIS dataset request server</NavLink> to acquire a passkey. This passkey is essential for accessing the files. Please be aware that the dataset's usage is restricted to academic research purposes. To obtain access, users are required to apply using their email address and provide a brief description of the intended use of the dataset, outlining the purpose of their study in a few sentences.</p>
            <Stack direction='row' alignItems='center' spacing={2}>
                <ButtonBase><div className='custom-button light' onClick={handleGotoAgreement}><img src={lock}/><div>Request Dataset</div></div></ButtonBase>
                <ButtonBase><a style={{textDecoration:'none'}} href={`${process.env.REACT_APP_IMAGE_PATH}OASISdataset End User Agreement.pdf`} target='_blank'><div className='custom-button light'><img src={pdf}/><div>License Agreement</div></div></a></ButtonBase>
            </Stack>
            <hr/>
            <h3>Image Dataset</h3>
            <p>The dataset consists of RGB images in the JPG format. Each image is named in the following format: z_xxx_yy.jpg, where 
                "z_xxx" represents a unique patient ID, and "yy" denotes the image ID. Landscape oriented images have a minimum resolution of
                1280 x 597 pixels, while portrait oriented images have a minimum resolution of 654 x 1174 pixels.
                See the <NavLink to={'/dataset/description'}>dataset description</NavLink> for more information.
            </p>
            <Stack direction='row' spacing={2}>
                <ButtonBase><div className='custom-button' onClick={()=>handleClickOpen("healthy")}><img src={zip}/><div>Healthy.zip (1.2 GB) </div></div></ButtonBase>
                <ButtonBase><div className='custom-button' onClick={()=>handleClickOpen("benign")}><img src={zip}/><div>Benign.zip (1.5 GB) </div></div></ButtonBase>
                <ButtonBase><div className='custom-button' onClick={()=>handleClickOpen("opmd")}><img src={zip}/><div>OPMD.zip (2.6 GB) </div></div></ButtonBase>
                <ButtonBase><div className='custom-button' onClick={()=>handleClickOpen("oca")}><img src={zip}/><div>OCA.zip (256 MB) </div></div></ButtonBase>
            </Stack>
            <hr/>
            <h3>Annotation Data</h3>
            <p>Annotations for the images are provided in the JSON (JavaScript Object Notation) file named Annotations.json. This file
                contains data points defining polygon-shaped regions and labels associated with annotations, following the COCO (Common
                Objects in Context) format, for each image in the dataset.
                See the <NavLink to={'/dataset/description'}>dataset description</NavLink> for more information.
            </p>
            <Stack direction='row' spacing={2}>
                <ButtonBase><div className='custom-button' onClick={()=>handleClickOpen("annotation")}><img src={json}/><div>Annotations.json</div></div></ButtonBase>
            </Stack>
            <hr/>
            <h3>Tabular Data</h3>
            <p>Two CSV (Comma Separated Values) files are included in the dataset, as follows:</p>
                <ol style={{margin:'0 0 0 50px'}}>
                    <li><p><strong>Imagewise_data.csv:</strong> This file contains information about individual images, including the image ID, category, clinical
                    diagnosis, and the number of annotated regions for each image.</p>
                    </li>
                    <li><p><strong>Patientwise_data.csv:</strong> This file contains patient-level metadata, including age, gender and total image count per patient.
                    Additionally, it includes binary indicators for risk factors such as smoking, chewing betel quid, and alcohol consumption.</p>
                    </li>
                </ol>
            <p>See the <NavLink to={'/dataset/description'}>dataset description</NavLink> for more information.</p>
            
            <Stack direction='row' spacing={2}>
                <ButtonBase><div className='custom-button' onClick={()=>handleClickOpen("imagewise")}><img src={csv}/><div>Imagewise_data.csv</div></div></ButtonBase>
                <ButtonBase><div className='custom-button' onClick={()=>handleClickOpen("patientwise")}><img src={csv}/><div>Patientwise_data.csv</div></div></ButtonBase>
            </Stack>
        </div>
        </div>
        <div style={{marginTop:'100px'}}></div>
        <DownloadConfirm open={open} setOpen={setOpen} type={type}/>
    </>
    );
    
};

export default Download;