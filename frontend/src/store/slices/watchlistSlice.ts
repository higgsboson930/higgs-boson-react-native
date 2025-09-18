import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { WatchlistState, WatchlistItem } from '../../types';

const initialState: WatchlistState = {
  items: [],
  categories: ['Favorites', 'DeFi', 'NFT', 'Gaming'],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchWatchlist = createAsyncThunk(
  'watchlist/fetchWatchlist',
  async (_, { rejectWithValue }) => {
    try {
      // Mock implementation - replace with actual service call
      return [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch watchlist');
    }
  }
);

export const addToWatchlist = createAsyncThunk(
  'watchlist/addToWatchlist',
  async (params: { coinId: string; category?: string }, { rejectWithValue }) => {
    try {
      // Mock implementation - replace with actual service call
      return params;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add to watchlist');
    }
  }
);

export const removeFromWatchlist = createAsyncThunk(
  'watchlist/removeFromWatchlist',
  async (itemId: string, { rejectWithValue }) => {
    try {
      // Mock implementation - replace with actual service call
      return itemId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to remove from watchlist');
    }
  }
);

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addCategory: (state, action: PayloadAction<string>) => {
      if (!state.categories.includes(action.payload)) {
        state.categories.push(action.payload);
      }
    },
    removeCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(cat => cat !== action.payload);
    },
  },
  extraReducers: (builder) => {
    // Fetch watchlist
    builder
      .addCase(fetchWatchlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWatchlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchWatchlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Add to watchlist
      .addCase(addToWatchlist.fulfilled, (state, action) => {
        // Mock implementation - add logic when service is ready
        state.error = null;
      })
      .addCase(addToWatchlist.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Remove from watchlist
      .addCase(removeFromWatchlist.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
        state.error = null;
      })
      .addCase(removeFromWatchlist.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError, addCategory, removeCategory } = watchlistSlice.actions;
export default watchlistSlice.reducer;