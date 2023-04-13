import { createSlice } from '@reduxjs/toolkit';

export const userDataSlice = createSlice({
    name: 'userData',
    initialState: {
        data: {
            id: '',
            username: '',
            email: '',
            roles: [],
            accessToken: {},
            reg_no: ''
        },
    },
    reducers: {
        setUsername: (state, action) => {
            state.data.username = action.payload;
        },
        setUserData: (state, action) => {
            state.data = action.payload;
        },
        setAccessToken: (state, action) => {
            state.data.accessToken = action.payload;
        }
    },
});

export const { 
    setUserData,
    setAccessToken,
} = userDataSlice.actions;

export default userDataSlice.reducer;