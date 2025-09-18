import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { NotificationState, Notification, PriceAlert, NotificationSettings } from '../../types';

const initialState: NotificationState = {
  notifications: [],
  priceAlerts: [],
  settings: {
    priceAlerts: true,
    transactionUpdates: true,
    securityAlerts: true,
    marketNews: false,
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
  },
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      // Mock implementation - replace with actual service call
      return [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch notifications');
    }
  }
);

export const fetchPriceAlerts = createAsyncThunk(
  'notifications/fetchPriceAlerts',
  async (_, { rejectWithValue }) => {
    try {
      // Mock implementation - replace with actual service call
      return [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch price alerts');
    }
  }
);

export const createPriceAlert = createAsyncThunk(
  'notifications/createPriceAlert',
  async (alert: Omit<PriceAlert, 'id' | 'userId' | 'createdAt'>, { rejectWithValue }) => {
    try {
      // Mock implementation - replace with actual service call
      return alert;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create price alert');
    }
  }
);

export const updateNotificationSettings = createAsyncThunk(
  'notifications/updateSettings',
  async (settings: Partial<NotificationSettings>, { rejectWithValue }) => {
    try {
      // Mock implementation - replace with actual service call
      return settings;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update settings');
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.isRead = true;
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.isRead = true;
      });
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    // Fetch notifications
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload;
        state.error = null;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch price alerts
      .addCase(fetchPriceAlerts.fulfilled, (state, action) => {
        state.priceAlerts = action.payload;
        state.error = null;
      })
      .addCase(fetchPriceAlerts.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Create price alert
      .addCase(createPriceAlert.fulfilled, (state, action) => {
        // Mock implementation - add logic when service is ready
        state.error = null;
      })
      .addCase(createPriceAlert.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Update settings
      .addCase(updateNotificationSettings.fulfilled, (state, action) => {
        state.settings = { ...state.settings, ...action.payload };
        state.error = null;
      })
      .addCase(updateNotificationSettings.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { 
  clearError, 
  markAsRead, 
  markAllAsRead, 
  addNotification, 
  removeNotification 
} = notificationSlice.actions;

export default notificationSlice.reducer;