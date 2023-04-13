import React from 'react';
import MuiAlert from '@mui/material/Alert';
import { Snackbar } from '@mui/material';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const NotificationBar = ({status, setStatus}) => {
    return (
        <Snackbar open={status.open} autoHideDuration={3000} onClose={()=>setStatus({msg:status.msg,severity:status.severity,open:false})} anchorOrigin={{ vertical: 'top',horizontal: 'right' }}>
            <Alert onClose={()=>setStatus({msg:status.msg,severity:status.severity,open:false})} severity={status.severity} sx={{ width: '100%' }}>{status.msg}</Alert>
        </Snackbar>
    );
};

export default NotificationBar;