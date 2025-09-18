import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CryptoState, Cryptocurrency, CryptoChart } from '../../types';
import { cryptoService } from '../../services/cryptoService';

const initialState: CryptoState = {
  coins: [],
  selectedCoin: null,
  chartData: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchCoins = createAsyncThunk(
  'crypto/fetchCoins',
  async (params: { page?: number; limit?: number; search?: string }, { rejectWithValue }) => {
    try {
      const response = await cryptoService.getCoins(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch coins');
    }
  }
);

export const fetchCoinById = createAsyncThunk(
  'crypto/fetchCoinById',
  async (coinId: string, { rejectWithValue }) => {
    try {
      const response = await cryptoService.getCoinById(coinId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch coin');
    }
  }
);

export const fetchCoinChart = createAsyncThunk(
  'crypto/fetchCoinChart',
  async (params: { coinId: string; timeframe: string }, { rejectWithValue }) => {
    try {
      const response = await cryptoService.getCoinChart(params.coinId, params.timeframe);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch chart data');
    }
  }
);

export const searchCoins = createAsyncThunk(
  'crypto/searchCoins',
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await cryptoService.searchCoins(query);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Search failed');
    }
  }
);

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedCoin: (state, action: PayloadAction<Cryptocurrency | null>) => {
      state.selectedCoin = action.payload;
    },
    clearSelectedCoin: (state) => {
      state.selectedCoin = null;
      state.chartData = null;
    },
    updateCoinPrice: (state, action: PayloadAction<{ coinId: string; price: number; change24h: number }>) => {
      const { coinId, price, change24h } = action.payload;
      const coinIndex = state.coins.findIndex(coin => coin.id === coinId);
      if (coinIndex !== -1) {
        state.coins[coinIndex].currentPrice = price;
        state.coins[coinIndex].priceChange24h = change24h;
      }
      if (state.selectedCoin && state.selectedCoin.id === coinId) {
        state.selectedCoin.currentPrice = price;
        state.selectedCoin.priceChange24h = change24h;
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch coins
    builder
      .addCase(fetchCoins.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCoins.fulfilled, (state, action) => {
        state.isLoading = false;
        state.coins = action.payload;
        state.error = null;
      })
      .addCase(fetchCoins.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch coin by ID
      .addCase(fetchCoinById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCoinById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedCoin = action.payload;
        state.error = null;
      })
      .addCase(fetchCoinById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch coin chart
      .addCase(fetchCoinChart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCoinChart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.chartData = action.payload;
        state.error = null;
      })
      .addCase(fetchCoinChart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Search coins
      .addCase(searchCoins.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchCoins.fulfilled, (state, action) => {
        state.isLoading = false;
        state.coins = action.payload;
        state.error = null;
      })
      .addCase(searchCoins.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  clearError, 
  setSelectedCoin, 
  clearSelectedCoin, 
  updateCoinPrice 
} = cryptoSlice.actions;

export default cryptoSlice.reducer;