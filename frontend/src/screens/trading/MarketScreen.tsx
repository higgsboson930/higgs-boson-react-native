import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../../store';
import { TradingPair, Cryptocurrency } from '../../types';

interface MarketDataItem extends Cryptocurrency {
  symbol: string;
  symbol_short: string;
  volume24h: number;
  priceChange1h: number;
  priceChange7d: number;
  marketCapRank: number;
  isWatched?: boolean;
}

export default function MarketScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'market_cap' | 'price' | 'change_24h' | 'volume'>('market_cap');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFavorites, setShowFavorites] = useState(false);

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.crypto);

  useEffect(() => {
    loadMarketData();
  }, []);

  const loadMarketData = async () => {
    // Mock market data - replace with actual API call
    // This would typically dispatch an action to fetch real market data
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMarketData();
    setRefreshing(false);
  };

  const formatPrice = (price: number) => {
    if (price < 0.01) {
      return `$${price.toFixed(8)}`;
    } else if (price < 1) {
      return `$${price.toFixed(4)}`;
    } else {
      return `$${price.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    } else {
      return `$${marketCap.toLocaleString()}`;
    }
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) {
      return `$${(volume / 1e9).toFixed(2)}B`;
    } else if (volume >= 1e6) {
      return `$${(volume / 1e6).toFixed(2)}M`;
    } else if (volume >= 1e3) {
      return `$${(volume / 1e3).toFixed(2)}K`;
    } else {
      return `$${volume.toLocaleString()}`;
    }
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`;
  };

  const getPercentageColor = (percentage: number) => {
    return percentage >= 0 ? '#10B981' : '#EF4444';
  };

  const toggleWatchlist = async (crypto: MarketDataItem) => {
    // Mock watchlist toggle - replace with actual API call
    console.log(`Toggle watchlist for ${crypto.symbol}`);
  };

  const navigateToTrading = (symbol: string) => {
    router.push(`/trading?symbol=${symbol}`);
  };

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // Mock market data
  const mockMarketData: MarketDataItem[] = [
    {
      id: '1',
      symbol: 'BTC/USDT',
      name: 'Bitcoin',
      symbol_short: 'BTC',
      logo: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
      currentPrice: 45000,
      marketCap: 875000000000,
      marketCapRank: 1,
      volume24h: 28000000000,
      circulatingSupply: 19500000,
      priceChange24h: 1200,
      priceChangePercentage24h: 2.74,
      priceChange1h: 0.5,
      priceChange7d: -3.2,
      allTimeHigh: 69000,
      allTimeLow: 3200,
      description: 'Bitcoin is a decentralized digital currency.',
      lastUpdated: new Date().toISOString(),
      isWatched: true,
    },
    {
      id: '2',
      symbol: 'ETH/USDT',
      name: 'Ethereum',
      symbol_short: 'ETH',
      logo: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
      currentPrice: 2500,
      marketCap: 300000000000,
      marketCapRank: 2,
      volume24h: 15000000000,
      circulatingSupply: 120000000,
      priceChange24h: -50,
      priceChangePercentage24h: -1.96,
      priceChange1h: 0.2,
      priceChange7d: 5.8,
      allTimeHigh: 4800,
      allTimeLow: 85,
      description: 'Ethereum is a decentralized platform.',
      lastUpdated: new Date().toISOString(),
      isWatched: false,
    },
    {
      id: '3',
      symbol: 'BNB/USDT',
      name: 'BNB',
      symbol_short: 'BNB',
      logo: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
      currentPrice: 320,
      marketCap: 52000000000,
      marketCapRank: 3,
      volume24h: 1200000000,
      circulatingSupply: 163000000,
      priceChange24h: 8,
      priceChangePercentage24h: 2.56,
      priceChange1h: -0.1,
      priceChange7d: 1.2,
      allTimeHigh: 690,
      allTimeLow: 0.1,
      description: 'BNB is the native token of Binance.',
      lastUpdated: new Date().toISOString(),
      isWatched: true,
    },
  ];

  const marketData = mockMarketData;

  const filteredData = marketData
    .filter((item: MarketDataItem) => {
      const matchesSearch = !searchQuery || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.symbol_short.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFavorites = !showFavorites || item.isWatched;
      return matchesSearch && matchesFavorites;
    })
    .sort((a: MarketDataItem, b: MarketDataItem) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'market_cap':
          aValue = a.marketCap || 0;
          bValue = b.marketCap || 0;
          break;
        case 'price':
          aValue = a.currentPrice;
          bValue = b.currentPrice;
          break;
        case 'change_24h':
          aValue = a.priceChangePercentage24h;
          bValue = b.priceChangePercentage24h;
          break;
        case 'volume':
          aValue = a.volume24h || 0;
          bValue = b.volume24h || 0;
          break;
        default:
          return 0;
      }
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

  const renderMarketItem = ({ item }: { item: MarketDataItem }) => (
    <TouchableOpacity
      style={styles.marketItem}
      onPress={() => navigateToTrading(item.symbol)}
    >
      <View style={styles.marketItemLeft}>
        <View style={styles.marketItemHeader}>
          <Text style={styles.marketItemSymbol}>{item.symbol_short}</Text>
          <TouchableOpacity
            style={styles.watchlistButton}
            onPress={() => toggleWatchlist(item)}
          >
            <Ionicons
              name={item.isWatched ? 'star' : 'star-outline'}
              size={16}
              color={item.isWatched ? '#F59E0B' : '#9CA3AF'}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.marketItemName}>{item.name}</Text>
        <Text style={styles.marketItemRank}>#{item.marketCapRank}</Text>
      </View>

      <View style={styles.marketItemCenter}>
        <Text style={styles.marketItemPrice}>{formatPrice(item.currentPrice)}</Text>
        <Text style={[
          styles.marketItemChange,
          { color: getPercentageColor(item.priceChangePercentage24h) }
        ]}>
          {formatPercentage(item.priceChangePercentage24h)}
        </Text>
      </View>

      <View style={styles.marketItemRight}>
        <Text style={styles.marketItemVolume}>{formatVolume(item.volume24h || 0)}</Text>
        <Text style={styles.marketItemMarketCap}>{formatMarketCap(item.marketCap || 0)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Markets</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.headerButton, showFavorites && styles.headerButtonActive]}
            onPress={() => setShowFavorites(!showFavorites)}
          >
            <Ionicons
              name={showFavorites ? 'star' : 'star-outline'}
              size={20}
              color={showFavorites ? '#F59E0B' : '#6B7280'}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="options" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search cryptocurrencies..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9CA3AF"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Sort Header */}
      <View style={styles.sortHeader}>
        <TouchableOpacity
          style={[styles.sortButton, styles.sortButtonLeft]}
          onPress={() => handleSort('market_cap')}
        >
          <Text style={styles.sortButtonText}>Name</Text>
          {sortBy === 'market_cap' && (
            <Ionicons
              name={sortOrder === 'asc' ? 'chevron-up' : 'chevron-down'}
              size={12}
              color="#6B7280"
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => handleSort('price')}
        >
          <Text style={styles.sortButtonText}>Price</Text>
          {sortBy === 'price' && (
            <Ionicons
              name={sortOrder === 'asc' ? 'chevron-up' : 'chevron-down'}
              size={12}
              color="#6B7280"
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => handleSort('change_24h')}
        >
          <Text style={styles.sortButtonText}>24h</Text>
          {sortBy === 'change_24h' && (
            <Ionicons
              name={sortOrder === 'asc' ? 'chevron-up' : 'chevron-down'}
              size={12}
              color="#6B7280"
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.sortButton, styles.sortButtonRight]}
          onPress={() => handleSort('volume')}
        >
          <Text style={styles.sortButtonText}>Volume</Text>
          {sortBy === 'volume' && (
            <Ionicons
              name={sortOrder === 'asc' ? 'chevron-up' : 'chevron-down'}
              size={12}
              color="#6B7280"
            />
          )}
        </TouchableOpacity>
      </View>

      {/* Market Data List */}
      <FlatList
        data={filteredData}
        renderItem={renderMarketItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    padding: 4,
  },
  headerButtonActive: {
    backgroundColor: '#FEF3C7',
    borderRadius: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#1F2937',
  },
  sortHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    gap: 4,
  },
  sortButtonLeft: {
    flex: 2,
  },
  sortButtonRight: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sortButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  listContainer: {
    paddingBottom: 20,
  },
  marketItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  marketItemLeft: {
    flex: 2,
  },
  marketItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  marketItemSymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginRight: 8,
  },
  watchlistButton: {
    padding: 2,
  },
  marketItemName: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  marketItemRank: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  marketItemCenter: {
    flex: 1,
    alignItems: 'flex-end',
  },
  marketItemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  marketItemChange: {
    fontSize: 12,
    fontWeight: '500',
  },
  marketItemRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  marketItemVolume: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  marketItemMarketCap: {
    fontSize: 10,
    color: '#9CA3AF',
  },
});