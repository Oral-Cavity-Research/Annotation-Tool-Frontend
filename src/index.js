import React from 'react';
import ReactDOM from 'react-dom/client';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import { persistor, store } from './store';
import { PersistGate } from 'redux-persist/integration/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import './index.css';

const theme = createTheme({
  palette: {
    primary: {main: '#48A9E6',contrastText: '#ffffff'},
    secondary: {main: 'rgb(235, 235, 236)',contrastText: '#ffffff'},
    warning: {main: 'rgb(241, 143, 1)',contrastText: '#ffffff'},
    light: {main: 'rgb(168,199,236)',contrastText: '#ffffff'},
  },
  components:{
    MuiToolbar: {
    styleOverrides: {
      regular: {
        height: "50px !important",
        background: 'var(--dark-color)',
        minHeight: "50px !important",
        "@media (min-width: 600px)": {
          minHeight: "50px",
        }
      },
    },
  }
}
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <React.StrictMode>
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </React.StrictMode>
      </PersistGate>
      </Provider>
  </GoogleOAuthProvider>
);
