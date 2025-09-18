import { apiClient } from './apiClient';
import { Cryptocurrency, CryptoChart, PaginatedResponse } from '../types';

class CryptoService {
  async getCoins(params: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<Cryptocurrency[]> {
    const response = await apiClient.get<PaginatedResponse<Cryptocurrency>>('/crypto/coins', params);
    
    if (response.success && response.data) {
      return response.data.data;
    }
    
    throw new Error(response.error || 'Failed to fetch coins');
  }

  async getCoinById(coinId: string): Promise<Cryptocurrency> {
    const response = await apiClient.get<Cryptocurrency>(`/crypto/coins/${coinId}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch coin');
  }

  async getCoinChart(coinId: string, timeframe: string): Promise<CryptoChart> {
    const response = await apiClient.get<CryptoChart>(`/crypto/coins/${coinId}/chart`, {
      timeframe,
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch chart data');
  }

  async searchCoins(query: string): Promise<Cryptocurrency[]> {
    const response = await apiClient.get<Cryptocurrency[]>('/crypto/search', {
      q: query,
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Search failed');
  }

  async getTrendingCoins(): Promise<Cryptocurrency[]> {
    const response = await apiClient.get<Cryptocurrency[]>('/crypto/trending');
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch trending coins');
  }

  async getTopGainers(): Promise<Cryptocurrency[]> {
    const response = await apiClient.get<Cryptocurrency[]>('/crypto/top-gainers');
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch top gainers');
  }

  async getTopLosers(): Promise<Cryptocurrency[]> {
    const response = await apiClient.get<Cryptocurrency[]>('/crypto/top-losers');
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch top losers');
  }

  async getMarketStats(): Promise<{
    totalMarketCap: number;
    totalVolume24h: number;
    bitcoinDominance: number;
    activeCoins: number;
  }> {
    const response = await apiClient.get('/crypto/market-stats');
    
    if (response.success && response.data) {
      return response.data as any;
    }
    
    throw new Error(response.error || 'Failed to fetch market stats');
  }

  async getCoinNews(coinId: string): Promise<{
    id: string;
    title: string;
    summary: string;
    url: string;
    publishedAt: string;
    source: string;
  }[]> {
    const response = await apiClient.get(`/crypto/coins/${coinId}/news`);
    
    if (response.success && response.data) {
      return response.data as any;
    }
    
    throw new Error(response.error || 'Failed to fetch coin news');
  }

  async getCoinSocials(coinId: string): Promise<{
    twitter?: string;
    telegram?: string;
    discord?: string;
    reddit?: string;
    github?: string;
    website?: string;
  }> {
    const response = await apiClient.get(`/crypto/coins/${coinId}/socials`);
    
    if (response.success && response.data) {
      return response.data as any;
    }
    
    throw new Error(response.error || 'Failed to fetch coin socials');
  }

  // Mock data for development - remove when connecting to real API
  async getMockCoins(): Promise<Cryptocurrency[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'bitcoin',
            symbol: 'BTC',
            name: 'Bitcoin',
            logo: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
            currentPrice: 45000,
            priceChange24h: 1200,
            priceChangePercentage24h: 2.74,
            marketCap: 850000000000,
            volume24h: 25000000000,
            circulatingSupply: 19500000,
            totalSupply: 21000000,
            maxSupply: 21000000,
            allTimeHigh: 69000,
            allTimeLow: 65,
            description: 'Bitcoin is the first successful internet money based on peer-to-peer technology...',
            website: 'https://bitcoin.org',
            github: 'https://github.com/bitcoin/bitcoin',
            lastUpdated: new Date().toISOString(),
          },
          {
            id: 'ethereum',
            symbol: 'ETH',
            name: 'Ethereum',
            logo: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
            currentPrice: 3200,
            priceChange24h: -80,
            priceChangePercentage24h: -2.44,
            marketCap: 380000000000,
            volume24h: 15000000000,
            circulatingSupply: 120000000,
            allTimeHigh: 4800,
            allTimeLow: 0.43,
            description: 'Ethereum is a decentralized platform that runs smart contracts...',
            website: 'https://ethereum.org',
            github: 'https://github.com/ethereum/go-ethereum',
            lastUpdated: new Date().toISOString(),
          },
        ]);
      }, 1000);
    });
  }
}

export const cryptoService = new CryptoService();