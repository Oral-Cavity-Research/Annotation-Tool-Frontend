import React from 'react';
import datasetimg from '../../Assets/dataset.jpg';
import annotationimg from '../../Assets/annotation.png';

const Description = () => {

    return (
    <>
        <div className="bodywidth clear">
        <div id="fulltext">
        <h3>Dataset Summary</h3>
            <p>The dataset consists of 3,000 high-quality white light images (WLI) of oral cavities taken with mobile phone cameras from the Sri Lankan population. The WLI are categorized into healthy, benign, oral potentially malignant disorders (OPMD), and oral cancer (OCA) by domain experts. Each WLI contains annotations for oral cavity and lesion boundaries in COCO format. Additionally, patient metadata, such as age, sex, diagnosis, and risk factors like smoking, alcohol consumption, and betel quid chewing, is included in the meta-data files.</p>
            <ul style={{marginLeft:'20px'}}>
            <li><p><strong>Healthy.zip: </strong>Folder of images of the healthy oral mucosa.</p>
            </li>
            <li><p><strong>Benign.zip: </strong>Folder of images containing benign lesions in the oral mucosa.</p>
            </li>
            <li><p><strong>OPMD.zip: </strong>Folder of images with OPMD.</p>
            </li>
            <li><p><strong>OCA.zip: </strong>Folder of images with histopathologically confirmed oral squamous cell carcinoma.</p>
            </li>
            <li><p><strong>Annotation.json: </strong>Annotations for the images provided in the JSON (JavaScript Object Notation) file.</p>
            </li>
            <li><p><strong>Imagewise_data.csv: </strong>File including the image ID, category, clinical diagnosis, and the number of annotated regions for each image.</p>
            </li>
            <li><p><strong>Patientwise_data.csv: </strong>File containing patient-level metadata, including age, sex, and total image count per patient. Additionally, it includes binary indicators for risk factors such as smoking, chewing betel quid, and alcohol consumption.</p>
            </li>
            </ul>
            <hr/>
            <h3>Image Dataset</h3>
            <p>The dataset consists of RGB images in the JPG format. Each image is named in the following format: z_xxx_yy.jpg, where 
                "z_xxx" represents a unique patient ID, and "yy" denotes the image ID. Landscape oriented images have a minimum resolution of
                1280 x 597 pixels, while portrait oriented images have a minimum resolution of 654 x 1174 pixels.</p>
                <img src={datasetimg} width='50%'/>
            <hr/>
            <h3>Annotations</h3>
            <p> Annotations for the images are provided in the JSON (JavaScript Object Notation) file named Annotations.json. This file
                contains data points defining polygon-shaped regions and labels associated with annotations, following the COCO (Common
                Objects in Context) format, for each image in the dataset.</p>
                <img src={annotationimg} width='50%'/>
            <hr/>
            <h3>Imagewise Data</h3>
            <p>Imagewise_data.csv file contains information about individual images, including the image ID, category, clinical
            diagnosis, and the number of annotated regions for each image.</p>
            <p>When an OCA patient has a lesion on the left side of the oral cavity and the right side is not affected, the images of the left side may be categorized as OCA, while those of the right side may be categorized as healthy.</p>
            <div className='formattedtable'>
            <table>
                <tbody>
                    <tr>
                        <th>Column Name</th>
                        <th>Description</th>
                    </tr>
                    <tr>
                        <td>Image ID</td>
                        <td>A unique ID to identify the images (String)</td>
                    </tr>
                    <tr>
                        <td>Category</td>
                        <td>Category based on the clinical diagnosis of the images (String)</td>
                    </tr>
                    <tr>
                        <td>Clinical Diagnosis</td>
                        <td>Additional diagnostic information recorded by dental surgeons supervised by specialists (String)</td>
                    </tr>
                    <tr>
                        <td>No of Regions</td>
                        <td>Number of annotation regions included (Integer)</td>
                    </tr>
                </tbody>
            </table>
            </div>
            <hr/>
            <h3>Patientwise Data</h3>
            <p>Patientwise_data.csv file contains patient-level metadata, including age, sex and total image count per patient.
            Additionally, it includes binary indicators for risk factors such as smoking, chewing betel quid, and alcohol consumption.</p>
            <div className='formattedtable'>
            <table>
                <tbody>
                    <tr>
                        <th>Column Name</th>
                        <th>Description</th>
                    </tr>
                    <tr>
                        <td>Patient ID</td>
                        <td>A unique ID to identify patients (String)</td>
                    </tr>
                    <tr>
                        <td>Age</td>
                        <td>Patients' age (Integer)</td>
                    </tr>
                    <tr>
                        <td>Sex</td>
                        <td>Male / female status assigned at birth (String)</td>
                    </tr>
                    <tr>
                        <td>Smoking</td>
                        <td>Indication of whether the patient smokes (Boolean)</td>
                    </tr>
                    <tr>
                        <td>Chewing_Betel_Quid</td>
                        <td>Indication of whether the patient chews betel quid (Boolean)</td>
                    </tr>
                    <tr>
                        <td>Alcohol</td>
                        <td>Indication of whether the patient uses alcohol (Boolean)</td>
                    </tr>
                    <tr>
                        <td>Image Count</td>
                        <td>No of images of a patient (Integer)</td>
                    </tr>
                </tbody>
            </table>
            </div>
        </div>
        </div>
        <div style={{marginTop:'100px'}}></div>
    </>
    );
    
};

export default Description;