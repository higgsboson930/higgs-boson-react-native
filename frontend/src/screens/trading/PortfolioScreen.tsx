import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store';
import { Portfolio, Position, PortfolioPerformance } from '../../types';

export default function PortfolioScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [timeFrame, setTimeFrame] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1D');

  const dispatch = useAppDispatch();
  const { portfolio, isLoading } = useAppSelector((state) => state.trading);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    loadPortfolioData();
  }, []);

  const loadPortfolioData = async () => {
    // Mock portfolio data - replace with actual API call
    // This would typically dispatch an action to fetch real portfolio data
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPortfolioData();
    setRefreshing(false);
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return `${currency === 'USD' ? '$' : ''}${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}${currency !== 'USD' ? ` ${currency}` : ''}`;
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`;
  };

  const formatQuantity = (quantity: number) => {
    return quantity.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 8,
    });
  };

  // Mock data for demonstration
  const mockPortfolio: Portfolio = {
    id: '1',
    userId: user?.id || '1',
    totalValue: 125000.50,
    totalPnL: 12500.25,
    totalPnLPercentage: 11.11,
    wallets: [
      {
        id: '1',
        userId: user?.id || '1',
        asset: 'BTC',
        totalBalance: 2.5,
        availableBalance: 2.3,
        lockedBalance: 0.2,
        averageBuyPrice: 42000,
        totalValue: 112500,
        pnL: 12500,
        pnLPercentage: 12.5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        userId: user?.id || '1',
        asset: 'ETH',
        totalBalance: 5.0,
        availableBalance: 4.8,
        lockedBalance: 0.2,
        averageBuyPrice: 2500,
        totalValue: 12500,
        pnL: 0,
        pnLPercentage: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    positions: [
      {
        id: '1',
        userId: user?.id || '1',
        symbol: 'BTC/USDT',
        side: 'long',
        size: 2.5,
        entryPrice: 42000,
        markPrice: 45000,
        liquidationPrice: 35000,
        margin: 21000,
        pnL: 7500,
        pnLPercentage: 35.71,
        leverage: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    performance: {
      daily: { pnL: 1250, percentage: 1.01 },
      weekly: { pnL: 3750, percentage: 3.09 },
      monthly: { pnL: 8500, percentage: 7.29 },
      yearly: { pnL: 12500, percentage: 11.11 },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const portfolioData = portfolio || mockPortfolio;

  const getPerformanceData = () => {
    switch (timeFrame) {
      case '1D': return portfolioData.performance.daily;
      case '1W': return portfolioData.performance.weekly;
      case '1M': return portfolioData.performance.monthly;
      case '1Y': return portfolioData.performance.yearly;
      default: return portfolioData.performance.daily;
    }
  };

  const performanceData = getPerformanceData();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Portfolio Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Total Portfolio Value</Text>
          <Text style={styles.summaryValue}>
            {formatCurrency(portfolioData.totalValue)}
          </Text>
          <View style={styles.summaryChange}>
            <Text style={[
              styles.summaryChangeText,
              performanceData.pnL >= 0 ? styles.positive : styles.negative
            ]}>
              {formatCurrency(performanceData.pnL)} ({formatPercentage(performanceData.percentage)})
            </Text>
            <Text style={styles.summaryTimeFrame}>{timeFrame}</Text>
          </View>
        </View>

        {/* Time Frame Selector */}
        <View style={styles.timeFrameSelector}>
          {(['1D', '1W', '1M', '3M', '1Y'] as const).map((frame) => (
            <TouchableOpacity
              key={frame}
              style={[
                styles.timeFrameButton,
                timeFrame === frame && styles.timeFrameButtonActive
              ]}
              onPress={() => setTimeFrame(frame)}
            >
              <Text style={[
                styles.timeFrameText,
                timeFrame === frame && styles.timeFrameTextActive
              ]}>
                {frame}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Holdings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Holdings</Text>
            <TouchableOpacity>
              <Ionicons name="options" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          {portfolioData.wallets.map((wallet) => (
            <View key={wallet.id} style={styles.holdingCard}>
              <View style={styles.holdingHeader}>
                <View style={styles.holdingInfo}>
                  <Text style={styles.holdingAsset}>{wallet.asset}</Text>
                  <Text style={styles.holdingBalance}>
                    {formatQuantity(wallet.totalBalance)} {wallet.asset}
                  </Text>
                </View>
                <View style={styles.holdingValue}>
                  <Text style={styles.holdingValueText}>
                    {formatCurrency(wallet.totalValue)}
                  </Text>
                  <Text style={[
                    styles.holdingPnL,
                    wallet.pnL >= 0 ? styles.positive : styles.negative
                  ]}>
                    {formatPercentage(wallet.pnLPercentage)}
                  </Text>
                </View>
              </View>
              
              <View style={styles.holdingDetails}>
                <View style={styles.holdingDetailRow}>
                  <Text style={styles.holdingDetailLabel}>Available:</Text>
                  <Text style={styles.holdingDetailValue}>
                    {formatQuantity(wallet.availableBalance)} {wallet.asset}
                  </Text>
                </View>
                <View style={styles.holdingDetailRow}>
                  <Text style={styles.holdingDetailLabel}>Locked:</Text>
                  <Text style={styles.holdingDetailValue}>
                    {formatQuantity(wallet.lockedBalance)} {wallet.asset}
                  </Text>
                </View>
                <View style={styles.holdingDetailRow}>
                  <Text style={styles.holdingDetailLabel}>Avg. Buy Price:</Text>
                  <Text style={styles.holdingDetailValue}>
                    {formatCurrency(wallet.averageBuyPrice)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Positions */}
        {portfolioData.positions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Open Positions</Text>
            
            {portfolioData.positions.map((position) => (
              <View key={position.id} style={styles.positionCard}>
                <View style={styles.positionHeader}>
                  <View style={styles.positionInfo}>
                    <Text style={styles.positionSymbol}>{position.symbol}</Text>
                    <View style={styles.positionSide}>
                      <Text style={[
                        styles.positionSideText,
                        position.side === 'long' ? styles.longSide : styles.shortSide
                      ]}>
                        {position.side.toUpperCase()}
                      </Text>
                      <Text style={styles.positionLeverage}>
                        {position.leverage}x
                      </Text>
                    </View>
                  </View>
                  <View style={styles.positionPnL}>
                    <Text style={[
                      styles.positionPnLText,
                      position.pnL >= 0 ? styles.positive : styles.negative
                    ]}>
                      {formatCurrency(position.pnL)}
                    </Text>
                    <Text style={[
                      styles.positionPnLPercentage,
                      position.pnL >= 0 ? styles.positive : styles.negative
                    ]}>
                      {formatPercentage(position.pnLPercentage)}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.positionDetails}>
                  <View style={styles.positionDetailRow}>
                    <Text style={styles.positionDetailLabel}>Size:</Text>
                    <Text style={styles.positionDetailValue}>
                      {formatQuantity(position.size)}
                    </Text>
                  </View>
                  <View style={styles.positionDetailRow}>
                    <Text style={styles.positionDetailLabel}>Entry:</Text>
                    <Text style={styles.positionDetailValue}>
                      {formatCurrency(position.entryPrice)}
                    </Text>
                  </View>
                  <View style={styles.positionDetailRow}>
                    <Text style={styles.positionDetailLabel}>Mark:</Text>
                    <Text style={styles.positionDetailValue}>
                      {formatCurrency(position.markPrice)}
                    </Text>
                  </View>
                  <View style={styles.positionDetailRow}>
                    <Text style={styles.positionDetailLabel}>Liqd.:</Text>
                    <Text style={styles.positionDetailValue}>
                      {formatCurrency(position.liquidationPrice)}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.positionActions}>
                  <TouchableOpacity style={styles.positionActionButton}>
                    <Text style={styles.positionActionText}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.positionActionButton}>
                    <Text style={styles.positionActionText}>Add Margin</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Performance Chart Placeholder */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Chart</Text>
          <View style={styles.chartPlaceholder}>
            <Ionicons name="trending-up" size={48} color="#9CA3AF" />
            <Text style={styles.chartPlaceholderText}>
              Chart will be implemented with react-native-chart-kit
            </Text>
          </View>
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
  scrollContent: {
    padding: 16,
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  summaryChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryChangeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  summaryTimeFrame: {
    fontSize: 14,
    color: '#6B7280',
  },
  positive: {
    color: '#10B981',
  },
  negative: {
    color: '#EF4444',
  },
  timeFrameSelector: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  timeFrameButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  timeFrameButtonActive: {
    backgroundColor: '#3B82F6',
  },
  timeFrameText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  timeFrameTextActive: {
    color: 'white',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  holdingCard: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 16,
    marginBottom: 16,
  },
  holdingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  holdingInfo: {
    flex: 1,
  },
  holdingAsset: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  holdingBalance: {
    fontSize: 14,
    color: '#6B7280',
  },
  holdingValue: {
    alignItems: 'flex-end',
  },
  holdingValueText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  holdingPnL: {
    fontSize: 14,
    fontWeight: '500',
  },
  holdingDetails: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
  },
  holdingDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  holdingDetailLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  holdingDetailValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  positionCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  positionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  positionInfo: {
    flex: 1,
  },
  positionSymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  positionSide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  positionSideText: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  longSide: {
    backgroundColor: '#D1FAE5',
    color: '#065F46',
  },
  shortSide: {
    backgroundColor: '#FEE2E2',
    color: '#991B1B',
  },
  positionLeverage: {
    fontSize: 12,
    color: '#6B7280',
  },
  positionPnL: {
    alignItems: 'flex-end',
  },
  positionPnLText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  positionPnLPercentage: {
    fontSize: 12,
    fontWeight: '500',
  },
  positionDetails: {
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
    padding: 8,
    marginBottom: 12,
  },
  positionDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  positionDetailLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  positionDetailValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  positionActions: {
    flexDirection: 'row',
    gap: 8,
  },
  positionActionButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  positionActionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  chartPlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  chartPlaceholderText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});