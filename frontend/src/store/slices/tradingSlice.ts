import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TradingState } from '../../types';

const initialState: TradingState = {
  portfolio: null,
  orders: [],
  transactions: [],
  recurringBuys: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchPortfolio = createAsyncThunk(
  'trading/fetchPortfolio',
  async (_, { rejectWithValue }) => {
    try {
      // Mock implementation - replace with actual service call
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch portfolio');
    }
  }
);

export const fetchOrders = createAsyncThunk(
  'trading/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      // Mock implementation - replace with actual service call
      return [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch orders');
    }
  }
);

export const fetchTransactions = createAsyncThunk(
  'trading/fetchTransactions',
  async (_, { rejectWithValue }) => {
    try {
      // Mock implementation - replace with actual service call
      return [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch transactions');
    }
  }
);

const tradingSlice = createSlice({
  name: 'trading',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch portfolio
    builder
      .addCase(fetchPortfolio.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPortfolio.fulfilled, (state, action) => {
        state.isLoading = false;
        state.portfolio = action.payload;
        state.error = null;
      })
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch orders
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Fetch transactions
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.transactions = action.payload;
        state.error = null;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = tradingSlice.actions;
export default tradingSlice.reducer;