import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import authSlice from './slices/authSlice';
import cryptoSlice from './slices/cryptoSlice';
import watchlistSlice from './slices/watchlistSlice';
import tradingSlice from './tradingSlice';
import notificationSlice from './slices/notificationSlice';
import { RootState } from '../types';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    crypto: cryptoSlice,
    watchlist: watchlistSlice,
    trading: tradingSlice,
    notifications: notificationSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;