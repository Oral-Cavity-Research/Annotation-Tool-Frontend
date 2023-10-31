import React from 'react';
import { NavLink } from 'react-router-dom';

const Contacts = () => {

    return (
    <>
        <div className="bodywidth clear">
        <div id="fulltext">
        <h3>Contacts</h3>
            <ul style={{marginLeft:'20px'}}>
            <li>For any inquiries regarding the dataset that are not addressed in the dataset description, please don't hesitate to reach out via email to <span className="blue">ocr.tech.team@gmail.com</span>.</li>
            <li>If you require further information about OASIS-Annotator or are interested in collaborating to enhance the dataset through the addition of new annotations, please feel free to get in touch with us at <span className="blue">ocr.tech.team@gmail.com</span>.</li>
            </ul>
            <hr/>
            <h3>Credits</h3>
            <p>Maecenas eu purus ipsum, non accumsan metus. Mauris augue dui, condimentum quis aliquam non, tincidunt id tortor. Donec dignissim sem sed nisl luctus scelerisque. Cras lacinia aliquam orci ac ultricies. Vestibulum ac lacus eu nisi commodo sollicitudin. Curabitur at consectetur leo. Donec augue velit, ornare in fermentum quis, tristique id augue.</p>
            <p>Cras sem est, luctus ac pharetra id, feugiat id enim. Nullam at massa felis, vitae hendrerit tellus. Sed placerat arcu sed risus commodo iaculis. Aenean at felis enim. Mauris eget est in diam sagittis ultrices sit amet eu mi. Sed ultrices, orci et tincidunt fringilla, diam diam consequat elit, vel tempus mauris mi vitae sem. Ut lectus est, commodo a pulvinar at, faucibus et ligula.</p>
        </div>
        </div>
        <div style={{marginTop:'100px'}}></div>
    </>
    );
    
};

export default Contacts;