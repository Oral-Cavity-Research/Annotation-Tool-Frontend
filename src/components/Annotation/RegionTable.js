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
                  <th>Region</th>
                  <th>Bounding Box</th>
                </tr>
                {showPoints}
              </tbody>
        </table>
    );
};

export default RegionTable;