import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import dashboardReducer from './slices/dashboardSlice';
import agentReducer from './slices/agentSlice';
import adReducer from './slices/adSlice';
import userReducer from './slices/userSlice';
import creditReducer from './slices/creditSlice';
import blogReducer from './slices/blogSlice';
import siteContentReducer from './slices/siteContentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    agents: agentReducer,
    ads: adReducer,
    users: userReducer,
    credit: creditReducer,
    blogs: blogReducer,
    siteContent: siteContentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
