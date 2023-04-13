import React from 'react';
import Canvas from '../components/Annotation/Canvas';
import { useParams } from 'react-router-dom';

function Image() {

    const {id} = useParams();

    const data={
        img: `https://s3-us-west-2.amazonaws.com/s.cdpn.io/150150/bug-${id%18 +1}.jpg`, 
        location:'', 
        clinical_diagnosis:'',
        lesions_appear: true, 
        annotation:[]
    }
    
    return (
        <div>
            <div className='body'>
                <Canvas data={data}/>
            </div>
        </div>
    );
}

export default Image;