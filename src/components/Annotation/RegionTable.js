import React from 'react';
import { Typography } from '@mui/material';

const RegionTable = ({showPoints}) => {
  
    return (
      showPoints?.length === 0 ?
        <Typography>No Regions yet</Typography>
        :
        <table className='show_regions'>
              <tbody>
                <tr>
                  <th>ID</th>
                  <th>Shape</th>
                  <th>Region</th>
                  <th>Bounding Box</th>
                  {/* <th>Points</th> */}
                </tr>
                {showPoints}
              </tbody>
        </table>
    );
};

export default RegionTable;