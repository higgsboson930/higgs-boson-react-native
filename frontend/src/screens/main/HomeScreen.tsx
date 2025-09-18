import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchCoins } from '../../store/slices/cryptoSlice';
import { Cryptocurrency } from '../../types';

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const { coins, isLoading, error } = useAppSelector((state) => state.crypto);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    loadCoins();
  }, []);

  const loadCoins = () => {
    dispatch(fetchCoins({ page: 1, limit: 10 }));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    }).format(price);
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`;
  };

  const renderCoinItem = (coin: Cryptocurrency) => (
    <TouchableOpacity key={coin.id} style={styles.coinItem}>
      <View style={styles.coinHeader}>
        <View style={styles.coinInfo}>
          <Text style={styles.coinName}>{coin.name}</Text>
          <Text style={styles.coinSymbol}>{coin.symbol.toUpperCase()}</Text>
        </View>
        <View style={styles.priceInfo}>
          <Text style={styles.price}>{formatPrice(coin.currentPrice)}</Text>
          <Text
            style={[
              styles.percentage,
              coin.priceChangePercentage24h >= 0 ? styles.positive : styles.negative,
            ]}
          >
            {formatPercentage(coin.priceChangePercentage24h)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading && coins.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading market data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={loadCoins} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>
            Good {new Date().getHours() < 12 ? 'morning' : 'evening'}, {user?.name || 'Trader'}
          </Text>
          <Text style={styles.subtitle}>Track your crypto investments</Text>
        </View>

        {/* Portfolio Overview - Placeholder */}
        <View style={styles.portfolioCard}>
          <Text style={styles.portfolioTitle}>Portfolio Value</Text>
          <Text style={styles.portfolioValue}>$0.00</Text>
          <Text style={styles.portfolioChange}>+$0.00 (0.00%)</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Buy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Sell</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Convert</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Deposit</Text>
          </TouchableOpacity>
        </View>

        {/* Market Overview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Market Overview</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Failed to load market data</Text>
              <TouchableOpacity onPress={loadCoins} style={styles.retryButton}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.coinsList}>
              {coins.map(renderCoinItem)}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  portfolioCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  portfolioTitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  portfolioValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  portfolioChange: {
    fontSize: 16,
    color: '#10B981',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: '#3B82F6',
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  seeAll: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  coinsList: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
  },
  coinItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  coinHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  coinInfo: {
    flex: 1,
  },
  coinName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  coinSymbol: {
    fontSize: 14,
    color: '#6B7280',
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  percentage: {
    fontSize: 14,
    fontWeight: '500',
  },
  positive: {
    color: '#10B981',
  },
  negative: {
    color: '#EF4444',
  },
  errorContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});