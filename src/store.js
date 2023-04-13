import userDataSlice from './Reducers/userDataSlice';
import storageSession from 'reduxjs-toolkit-persist/lib/storage/session'
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';


import { configureStore } from "@reduxjs/toolkit";

const persistConfig = {
  key: 'root',
  storage: storageSession,
}
const persistedReducer = persistReducer(persistConfig, userDataSlice)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk]
})

export const persistor = persistStore(store)
