import React from 'react';
import {Preview,ZoomIn,CropFree,ZoomOut,Close, CancelOutlined, Style, Label} from '@mui/icons-material';
import {ArrowUpward, ArrowDownward, ArrowBack, ArrowForward, Opacity} from '@mui/icons-material';

const Help = () => {
    return (
        <div className='show_help'>
            <p style={{fontWeight: "700"}}>Keyboard Shortcuts</p>
            <table><tbody>
            <tr>
                <td><div className='key'>Enter</div></td><td> Finish Drawing</td>
            </tr>
            <tr>
                <td><div className='key'>Esc</div></td><td> Cancle Drawing</td>
            </tr>
            {/* <tr>
                <td><div className='key'>Space</div></td><td> Toggle Preview</td>
            </tr> */}
            <tr>
                <td><div className='key'>Delete</div></td><td> Delete the Selected Region</td>
            </tr>
            <tr>
                <td>
                <div style={{display: "flex", flexDirection: "row"}}>
                <div className="key">&larr;</div>&nbsp;<div className="key">&uarr;</div>&nbsp;<div className="key">&rarr;</div>&nbsp;<div className="key">&darr;</div>
                </div>
                </td>
                <td> Move the Selected Region by 1px</td>
            </tr>
            <tr>
                <td>
                <div style={{display: "flex", flexDirection: "row"}}>
                <div className='key'>Shift</div><div> + </div><div className="key">&larr;</div>&nbsp;<div className="key">&uarr;</div>&nbsp;<div className="key">&rarr;</div>&nbsp;<div className="key">&darr;</div>
                </div>
                </td>
                <td> Move the Selected Region by 10px</td>
            </tr>
            </tbody></table>
            <p style={{fontWeight: "700"}}>Button Panel</p>
            <table><tbody>
            <tr>
                <td>
                    <Preview style={{color:"gray"}}/>
                </td>
                <td> Show annotation coordinates</td>
            </tr>
            <tr>
                <td>
                    <ZoomIn style={{color:"gray"}}/><ZoomOut style={{color:"gray"}}/><CropFree style={{color:"gray"}}/>
                </td>
                <td> Zoom In, Zoom Out, Original Size</td>
            </tr>
            <tr>
                <td>
                    <ArrowUpward style={{color:"gray"}}/><ArrowDownward  style={{color:"gray"}}/>
                    <ArrowBack style={{color:"gray"}}/><ArrowForward style={{color:"gray"}}/>
                </td>
                <td>Move the selected region by 10px</td>
            </tr>
            <tr>
                <td>
                    <Close style={{color:"gray"}}/><CancelOutlined style={{color:"gray"}}/>
                </td>
                <td>Delete the selected region, Delete all regions</td>
            </tr>
            <tr>
                <td>
                    <Label style={{color:"gray"}}/><Style style={{color:"gray"}}/><Opacity style={{color:"gray"}}/>
                </td>
                <td>Toggle label visibility, Toggle label type, Toggle region fill</td>
            </tr>
            </tbody></table>
        </div>
    );
};


export default Help;