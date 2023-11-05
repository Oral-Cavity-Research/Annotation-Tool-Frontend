import React from 'react';
import datasetimg from '../../Assets/dataset.jpg';
import annotationimg from '../../Assets/annotation.png';

const Description = () => {

    return (
    <>
        <div className="bodywidth clear">
        <div id="fulltext">
        <h3>Dataset Summary</h3>
            <ul style={{marginLeft:'20px'}}>
            <li><p><strong>Healthy.zip:</strong> This file contains information about individual images, including the image ID, category, clinical diagnosis, and the number of annotated regions for each image.</p>
            </li>
            <li><p><strong>Benign.zip:</strong> Benign lesions included those that did not fall into either of the above categories, and healthy images were those that did not contain any visual changes to the mucosa.</p>
            </li>
            <li><p><strong>OPMD.zip:</strong>  a group of clinically-defined conditions associated with a risk of progression to oral squamous carcinoma. The OPMDs in this dataset include oral submucosal fibrosis (OSMF), leukoplakia, erythroplakia, and oral lichen planus (OLP)</p>
            </li>
            <li><p><strong>OCA.zip:</strong> OCA included histopathologically confirmed oral squamous cell carcinomas.</p>
            </li>
            <li><p><strong>Annotation.json:</strong> Annotations for the images are provided in the JSON (JavaScript Object Notation) file named Annotations.json.</p>
            </li>
            <li><p><strong>Imagewise_data.csv:</strong> This file contains information about individual images, including the image ID, category, clinical
            diagnosis, and the number of annotated regions for each image.</p>
            </li>
            <li><p><strong>Patientwise_data.csv:</strong> This file contains patient-level metadata, including age, gender and total image count per patient.
            Additionally, it includes binary indicators for risk factors such as smoking, chewing betel quid, and alcohol consumption.</p>
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
            <table>
                <tbody>
                    <tr>
                        <th>Column Name</th>
                        <th>Description</th>
                    </tr>
                    <tr>
                        <td>Image ID</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Category</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Clinical Diagnosis</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>No of Regions</td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
            <hr/>
            <h3>Patientwise Data</h3>
            <p>Patientwise_data.csv file contains patient-level metadata, including age, gender and total image count per patient.
            Additionally, it includes binary indicators for risk factors such as smoking, chewing betel quid, and alcohol consumption.</p>
            <table>
                <tbody>
                    <tr>
                        <th>Column Name</th>
                        <th>Description</th>
                    </tr>
                    <tr>
                        <td>Patient ID</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Age</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Gender</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Smoking</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Chewing_Betel_Quid</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Severity</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Image Count</td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
        </div>
        <div style={{marginTop:'100px'}}></div>
    </>
    );
    
};

export default Description;