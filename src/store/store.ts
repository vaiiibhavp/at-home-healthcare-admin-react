import { configureStore } from '@reduxjs/toolkit';
import { api } from '../services/api';
import { doctorsApi } from '../services/doctorsApi';
import { providersApi } from '../services/providersApi';
import { servicesApi } from '../services/servicesApi';
import { formMappingsApi } from '../services/formMappingsApi';
import { notificationsApi } from '../services/notificationsApi';
import { dashboardApi } from '../services/dashboardApi';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    api: api.reducer,
    doctorsApi: doctorsApi.reducer,
    providersApi: providersApi.reducer,
    servicesApi: servicesApi.reducer,
    formMappingsApi: formMappingsApi.reducer,
    notificationsApi: notificationsApi.reducer,
    dashboardApi: dashboardApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware, doctorsApi.middleware, providersApi.middleware, servicesApi.middleware, formMappingsApi.middleware, notificationsApi.middleware, dashboardApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
