
import React, {useEffect} from 'react';
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider , Outlet} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { trySilentRefresh } from './utils/authUtils';
import { setUserData } from './Reducers/userDataSlice';
import { useSelector} from 'react-redux';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import Home from './pages/Home';
import ImageDisplay from './pages/ImageDisplay';
import Layout from './pages/Layout';
import Images from './pages/Images';
import Requests from './pages/Requests';
import Approved from './pages/Approved';
import './App.css';
import MyWork from './pages/MyWork';
import Options from './pages/Options';

function App() { 
  const dispatch = useDispatch();
  const userData = useSelector(state => state.data);

  const silentRefresh = () => {

    trySilentRefresh().then(data => {
      if(data){
        dispatch(setUserData({
          ...userData, accessToken: data.accessToken
        }));
      }
    })
  }

  useEffect(() => {
    const interval = setInterval(() => {
      silentRefresh();
  }, 1000*2*60*60);
  
    return () => clearInterval(interval);
  }, [])

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<Outlet/>}>
        <Route index element={<LoginPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/' element={<Layout/>}>
          <Route path='/home' element={<Home/>}>
            <Route index element={<Images/>}/>
            <Route path='/home/images' element={<Images/>}/>
            <Route path='/home/requests' element={<Requests/>}/>
            <Route path='/home/approved' element={<Approved/>}/>
          </Route>
          <Route path='/mywork' element={<MyWork/>}>
            <Route index element={<Images/>}/>
            <Route path='/mywork/images' element={<Images/>}/>
            <Route path='/mywork/requests' element={<Requests/>}/>
            <Route path='/mywork/approved' element={<Approved/>}/>
          </Route>
          <Route path='/image/:id' element={<ImageDisplay/>}/>
          <Route path='/options' element={<Options/>}/>
        </Route>
        <Route path='/*' element={<NotFoundPage/>}/>
      </Route>
    )
  )

  return (
      <RouterProvider router={router}/>
  );
}

export default App;