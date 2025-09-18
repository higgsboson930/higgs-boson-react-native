import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Order, Transaction, Portfolio, TradingPair } from '../types';

export interface TradingState {
  orders: Order[];
  transactions: Transaction[];
  portfolio: Portfolio | null;
  tradingPairs: TradingPair[];
  activeOrders: Order[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TradingState = {
  orders: [],
  transactions: [],
  portfolio: null,
  tradingPairs: [],
  activeOrders: [],
  isLoading: false,
  error: null,
};

// Async thunks for API calls
export const fetchPortfolio = createAsyncThunk(
  'trading/fetchPortfolio',
  async (userId: string, { rejectWithValue }) => {
    try {
      // Mock API call - replace with actual implementation
      const response = await fetch(`/api/portfolio/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch portfolio');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue('Failed to fetch portfolio');
    }
  }
);

export const fetchOrders = createAsyncThunk(
  'trading/fetchOrders',
  async (userId: string, { rejectWithValue }) => {
    try {
      // Mock API call - replace with actual implementation
      const response = await fetch(`/api/orders/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue('Failed to fetch orders');
    }
  }
);

export const fetchTransactions = createAsyncThunk(
  'trading/fetchTransactions',
  async (userId: string, { rejectWithValue }) => {
    try {
      // Mock API call - replace with actual implementation
      const response = await fetch(`/api/transactions/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue('Failed to fetch transactions');
    }
  }
);

export const placeOrder = createAsyncThunk(
  'trading/placeOrder',
  async (orderData: Partial<Order>, { rejectWithValue }) => {
    try {
      // Mock API call - replace with actual implementation
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      if (!response.ok) {
        throw new Error('Failed to place order');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue('Failed to place order');
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'trading/cancelOrder',
  async (orderId: string, { rejectWithValue }) => {
    try {
      // Mock API call - replace with actual implementation
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to cancel order');
      }
      return orderId;
    } catch (error) {
      return rejectWithValue('Failed to cancel order');
    }
  }
);

export const fetchTradingPairs = createAsyncThunk(
  'trading/fetchTradingPairs',
  async (_, { rejectWithValue }) => {
    try {
      // Mock API call - replace with actual implementation
      const response = await fetch('/api/trading-pairs');
      if (!response.ok) {
        throw new Error('Failed to fetch trading pairs');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue('Failed to fetch trading pairs');
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
    updateOrderStatus: (state, action: PayloadAction<{ orderId: string; status: Order['status'] }>) => {
      const { orderId, status } = action.payload;
      const order = state.orders.find(o => o.id === orderId);
      if (order) {
        order.status = status;
        order.updatedAt = new Date().toISOString();
      }
      
      // Update active orders
      if (status === 'filled' || status === 'canceled' || status === 'rejected') {
        state.activeOrders = state.activeOrders.filter(o => o.id !== orderId);
      }
    },
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.unshift(action.payload);
    },
    updatePortfolioBalance: (state, action: PayloadAction<{ asset: string; balance: number }>) => {
      if (state.portfolio) {
        const wallet = state.portfolio.wallets.find(w => w.asset === action.payload.asset);
        if (wallet) {
          wallet.balance = action.payload.balance;
          wallet.updatedAt = new Date().toISOString();
        }
      }
    },
    setTradingPairs: (state, action: PayloadAction<TradingPair[]>) => {
      state.tradingPairs = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Portfolio
    builder
      .addCase(fetchPortfolio.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPortfolio.fulfilled, (state, action) => {
        state.isLoading = false;
        state.portfolio = action.payload;
      })
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Orders
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
        state.activeOrders = action.payload.filter((order: Order) => 
          order.status === 'new' || order.status === 'partially_filled'
        );
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Transactions
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Place Order
    builder
      .addCase(placeOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        const newOrder = action.payload;
        state.orders.unshift(newOrder);
        if (newOrder.status === 'new' || newOrder.status === 'partially_filled') {
          state.activeOrders.unshift(newOrder);
        }
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Cancel Order
    builder
      .addCase(cancelOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        const orderId = action.payload;
        
        // Update order status
        const order = state.orders.find(o => o.id === orderId);
        if (order) {
          order.status = 'canceled';
          order.updatedAt = new Date().toISOString();
        }
        
        // Remove from active orders
        state.activeOrders = state.activeOrders.filter(o => o.id !== orderId);
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Trading Pairs
    builder
      .addCase(fetchTradingPairs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTradingPairs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tradingPairs = action.payload;
      })
      .addCase(fetchTradingPairs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  updateOrderStatus,
  addTransaction,
  updatePortfolioBalance,
  setTradingPairs,
} = tradingSlice.actions;

export default tradingSlice.reducer;