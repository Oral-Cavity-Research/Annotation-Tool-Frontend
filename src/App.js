
import React, {useEffect} from 'react';
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider , Outlet} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { trySilentRefresh } from './utils/authUtils';
import { setUserData } from './Reducers/userDataSlice';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import Home from './pages/Home';
import Image from './pages/Image';
import Layout from './pages/Layout';
import Images from './pages/Images';
import Requests from './pages/Requests';
import Approved from './pages/Approved';
import './App.css';

function App() { 
  const dispatch = useDispatch();

  const silentRefresh = () => {

    trySilentRefresh().then(data => {
      if(data){
        dispatch(setUserData({
          _id: data.ref._id,
          username: data.ref.username,
          email: data.ref.email,
          roles: data.ref.role,
          permissions: data.permissions,
          accessToken: data.accessToken,
          reg_no: data.ref.reg_no
        }));
      }
    })
  }

  useEffect(() => {
    setTimeout(() => {
      silentRefresh();
    }, 1000*60*2);
  });

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
          <Route path='image/:id' element={<Image/>}/>
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