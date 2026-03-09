import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import stockReducer from './stockSlice';
import portfolioReducer from './portfolioSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        stocks: stockReducer,
        portfolio: portfolioReducer,
    },
});
