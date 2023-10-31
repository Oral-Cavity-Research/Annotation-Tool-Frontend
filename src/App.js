
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
import ProtectedRoute from './components/ProtectedRoute';
import SignuPage from './pages/SignupPage';
import Admin from './pages/Admin';
import Users from './pages/Users';
import UserRequests from './pages/UserRequests';
import PublicDBRoute from './pages/Dataset/PublicDBRoute';
import Download from './pages/Dataset/Download';
import Contacts from './pages/Dataset/Contacts';

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
        <Route path='/signup' element={<SignuPage/>}/>
        <Route path='/' element={<ProtectedRoute><Layout/></ProtectedRoute>}>
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
          <Route path='/admin' element={<Admin/>}>
            <Route index element={<UserRequests/>}/>
            <Route path='/admin/requests' element={<UserRequests/>}/>
            <Route path='/admin/users' element={<Users/>}/>
            <Route path='/admin/options' element={<Options/>}/>
          </Route>
        </Route>
        {/* <Route path='/imagedb' element={<Imagedb/>}/> */}
        <Route path='/dataset' element={<PublicDBRoute/>}>
            <Route index element={<div/>}/>
            <Route  path='/dataset/download' element={<Download/>}/>
            <Route path='/dataset/description'  element={<div/>}/>
            <Route path='/dataset/contacts'  element={<Contacts/>}/>
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