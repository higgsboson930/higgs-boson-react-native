import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store';
import { TradingPair, Order, OrderBook } from '../../types';

interface TradingScreenProps {
  route?: {
    params?: {
      symbol?: string;
    };
  };
}

export default function TradingScreen({ route }: TradingScreenProps) {
  const [selectedPair, setSelectedPair] = useState<TradingPair | null>(null);
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop_loss'>('market');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [stopPrice, setStopPrice] = useState('');
  const [orderBook, setOrderBook] = useState<OrderBook | null>(null);
  const [showOrderBook, setShowOrderBook] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const dispatch = useAppDispatch();
  const { portfolio, orders, isLoading } = useAppSelector((state) => state.trading);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Initialize with symbol from route params or default
    const symbol = route?.params?.symbol || 'BTC/USDT';
    loadTradingPair(symbol);
    loadOrderBook(symbol);
  }, [route?.params?.symbol]);

  const loadTradingPair = async (symbol: string) => {
    // Mock trading pair data - replace with actual API call
    const mockPair: TradingPair = {
      id: '1',
      baseAsset: 'BTC',
      quoteAsset: 'USDT',
      symbol: 'BTC/USDT',
      status: 'active',
      minOrderSize: 0.001,
      maxOrderSize: 100,
      priceTickSize: 0.01,
      quantityTickSize: 0.00001,
      makerFee: 0.001,
      takerFee: 0.001,
      lastPrice: 45000,
      priceChange24h: 1200,
      volume24h: 25000,
      high24h: 46000,
      low24h: 43500,
    };
    setSelectedPair(mockPair);
    setPrice(mockPair.lastPrice.toString());
  };

  const loadOrderBook = async (symbol: string) => {
    // Mock order book data - replace with actual API call
    const mockOrderBook: OrderBook = {
      symbol,
      bids: [
        { price: 44950, quantity: 0.5, total: 22475 },
        { price: 44940, quantity: 1.2, total: 53928 },
        { price: 44930, quantity: 0.8, total: 35944 },
        { price: 44920, quantity: 2.1, total: 94332 },
        { price: 44910, quantity: 0.3, total: 13473 },
      ],
      asks: [
        { price: 45000, quantity: 0.7, total: 31500 },
        { price: 45010, quantity: 1.1, total: 49511 },
        { price: 45020, quantity: 0.9, total: 40518 },
        { price: 45030, quantity: 1.5, total: 67545 },
        { price: 45040, quantity: 0.6, total: 27024 },
      ],
      lastUpdateId: 123456789,
      timestamp: new Date().toISOString(),
    };
    setOrderBook(mockOrderBook);
  };

  const calculateTotal = () => {
    const qty = parseFloat(quantity) || 0;
    const prc = parseFloat(price) || 0;
    return qty * prc;
  };

  const getAvailableBalance = () => {
    if (!portfolio || !selectedPair) return 0;
    
    const asset = side === 'buy' ? selectedPair.quoteAsset : selectedPair.baseAsset;
    const wallet = portfolio.wallets.find(w => w.asset === asset);
    return wallet?.availableBalance || 0;
  };

  const handlePlaceOrder = async () => {
    if (!selectedPair || !quantity) {
      Alert.alert('Error', 'Please enter all required fields');
      return;
    }

    if (orderType !== 'market' && !price) {
      Alert.alert('Error', 'Please enter price for limit orders');
      return;
    }

    const availableBalance = getAvailableBalance();
    const total = calculateTotal();

    if (side === 'buy' && total > availableBalance) {
      Alert.alert('Insufficient Balance', `You need ${total.toFixed(2)} ${selectedPair.quoteAsset} but only have ${availableBalance.toFixed(2)}`);
      return;
    }

    if (side === 'sell' && parseFloat(quantity) > availableBalance) {
      Alert.alert('Insufficient Balance', `You need ${quantity} ${selectedPair.baseAsset} but only have ${availableBalance.toFixed(8)}`);
      return;
    }

    setIsPlacingOrder(true);

    try {
      // Mock order placement - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        'Order Placed',
        `${side.toUpperCase()} ${quantity} ${selectedPair.baseAsset} ${orderType === 'market' ? 'at market price' : `at ${price} ${selectedPair.quoteAsset}`}`,
        [{ text: 'OK', onPress: () => clearForm() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const clearForm = () => {
    setQuantity('');
    if (orderType === 'market') {
      setPrice(selectedPair?.lastPrice.toString() || '');
    }
    setStopPrice('');
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    });
  };

  const formatQuantity = (quantity: number) => {
    return quantity.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 8,
    });
  };

  if (!selectedPair) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading trading pair...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.pairInfo}>
            <Text style={styles.pairSymbol}>{selectedPair.symbol}</Text>
            <Text style={styles.pairPrice}>${formatPrice(selectedPair.lastPrice)}</Text>
            <Text style={[
              styles.priceChange,
              selectedPair.priceChange24h >= 0 ? styles.positive : styles.negative
            ]}>
              {selectedPair.priceChange24h >= 0 ? '+' : ''}
              ${formatPrice(selectedPair.priceChange24h)} (
              {((selectedPair.priceChange24h / (selectedPair.lastPrice - selectedPair.priceChange24h)) * 100).toFixed(2)}%)
            </Text>
          </View>
          <TouchableOpacity
            style={styles.orderBookButton}
            onPress={() => setShowOrderBook(true)}
          >
            <Ionicons name="list" size={24} color="#3B82F6" />
          </TouchableOpacity>
        </View>

        {/* Order Type Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Type</Text>
          <View style={styles.orderTypeSelector}>
            {(['market', 'limit', 'stop_loss'] as const).map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.orderTypeButton,
                  orderType === type && styles.orderTypeButtonActive
                ]}
                onPress={() => setOrderType(type)}
              >
                <Text style={[
                  styles.orderTypeText,
                  orderType === type && styles.orderTypeTextActive
                ]}>
                  {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Side Selector */}
        <View style={styles.section}>
          <View style={styles.sideSelector}>
            <TouchableOpacity
              style={[styles.sideButton, styles.buyButton, side === 'buy' && styles.sideButtonActive]}
              onPress={() => setSide('buy')}
            >
              <Text style={[styles.sideText, side === 'buy' && styles.sideTextActive]}>
                Buy {selectedPair.baseAsset}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sideButton, styles.sellButton, side === 'sell' && styles.sideButtonActive]}
              onPress={() => setSide('sell')}
            >
              <Text style={[styles.sideText, side === 'sell' && styles.sideTextActive]}>
                Sell {selectedPair.baseAsset}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Form */}
        <View style={styles.section}>
          {orderType !== 'market' && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Price ({selectedPair.quoteAsset})</Text>
              <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                placeholder="0.00"
                keyboardType="numeric"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          )}

          {orderType === 'stop_loss' && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Stop Price ({selectedPair.quoteAsset})</Text>
              <TextInput
                style={styles.input}
                value={stopPrice}
                onChangeText={setStopPrice}
                placeholder="0.00"
                keyboardType="numeric"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Quantity ({selectedPair.baseAsset})</Text>
            <TextInput
              style={styles.input}
              value={quantity}
              onChangeText={setQuantity}
              placeholder="0.00000000"
              keyboardType="numeric"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Order Summary */}
          <View style={styles.orderSummary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Available:</Text>
              <Text style={styles.summaryValue}>
                {formatQuantity(getAvailableBalance())} {side === 'buy' ? selectedPair.quoteAsset : selectedPair.baseAsset}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total:</Text>
              <Text style={styles.summaryValue}>
                {formatPrice(calculateTotal())} {selectedPair.quoteAsset}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Fee:</Text>
              <Text style={styles.summaryValue}>
                {formatPrice(calculateTotal() * selectedPair.takerFee)} {selectedPair.quoteAsset}
              </Text>
            </View>
          </View>

          {/* Place Order Button */}
          <TouchableOpacity
            style={[
              styles.placeOrderButton,
              side === 'buy' ? styles.buyOrderButton : styles.sellOrderButton,
              (isPlacingOrder || !quantity) && styles.disabledButton
            ]}
            onPress={handlePlaceOrder}
            disabled={isPlacingOrder || !quantity}
          >
            {isPlacingOrder ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.placeOrderText}>
                {side === 'buy' ? 'Buy' : 'Sell'} {selectedPair.baseAsset}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Available Balance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Balances</Text>
          <View style={styles.balanceCard}>
            <View style={styles.balanceRow}>
              <Text style={styles.balanceAsset}>{selectedPair.baseAsset}</Text>
              <Text style={styles.balanceAmount}>
                {formatQuantity(portfolio?.wallets.find(w => w.asset === selectedPair.baseAsset)?.availableBalance || 0)}
              </Text>
            </View>
            <View style={styles.balanceRow}>
              <Text style={styles.balanceAsset}>{selectedPair.quoteAsset}</Text>
              <Text style={styles.balanceAmount}>
                {formatQuantity(portfolio?.wallets.find(w => w.asset === selectedPair.quoteAsset)?.availableBalance || 0)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Order Book Modal */}
      <Modal
        visible={showOrderBook}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{selectedPair.symbol} Order Book</Text>
            <TouchableOpacity onPress={() => setShowOrderBook(false)}>
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>
          
          {orderBook && (
            <ScrollView style={styles.orderBookContent}>
              {/* Asks */}
              <Text style={styles.orderBookTitle}>Asks (Sell Orders)</Text>
              {orderBook.asks.slice().reverse().map((ask, index) => (
                <View key={index} style={styles.orderBookRow}>
                  <Text style={[styles.orderBookPrice, styles.askPrice]}>
                    {formatPrice(ask.price)}
                  </Text>
                  <Text style={styles.orderBookQuantity}>
                    {formatQuantity(ask.quantity)}
                  </Text>
                  <Text style={styles.orderBookTotal}>
                    {formatPrice(ask.total)}
                  </Text>
                </View>
              ))}
              
              {/* Spread */}
              <View style={styles.spreadRow}>
                <Text style={styles.spreadText}>
                  Spread: ${formatPrice(orderBook.asks[0]?.price - orderBook.bids[0]?.price || 0)}
                </Text>
              </View>
              
              {/* Bids */}
              <Text style={styles.orderBookTitle}>Bids (Buy Orders)</Text>
              {orderBook.bids.map((bid, index) => (
                <View key={index} style={styles.orderBookRow}>
                  <Text style={[styles.orderBookPrice, styles.bidPrice]}>
                    {formatPrice(bid.price)}
                  </Text>
                  <Text style={styles.orderBookQuantity}>
                    {formatQuantity(bid.quantity)}
                  </Text>
                  <Text style={styles.orderBookTotal}>
                    {formatPrice(bid.total)}
                  </Text>
                </View>
              ))}
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>
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
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  pairInfo: {
    flex: 1,
  },
  pairSymbol: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  pairPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  priceChange: {
    fontSize: 14,
    fontWeight: '500',
  },
  positive: {
    color: '#10B981',
  },
  negative: {
    color: '#EF4444',
  },
  orderBookButton: {
    padding: 8,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  orderTypeSelector: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
  },
  orderTypeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  orderTypeButtonActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  orderTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  orderTypeTextActive: {
    color: '#1F2937',
  },
  sideSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  sideButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
  },
  buyButton: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  sellButton: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  sideButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  sideText: {
    fontSize: 16,
    fontWeight: '600',
  },
  sideTextActive: {
    color: 'white',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  orderSummary: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  placeOrderButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buyOrderButton: {
    backgroundColor: '#10B981',
  },
  sellOrderButton: {
    backgroundColor: '#EF4444',
  },
  disabledButton: {
    opacity: 0.5,
  },
  placeOrderText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  balanceCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  balanceAsset: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  balanceAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  orderBookContent: {
    flex: 1,
    padding: 16,
  },
  orderBookTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    marginTop: 16,
  },
  orderBookRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  orderBookPrice: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  askPrice: {
    color: '#EF4444',
  },
  bidPrice: {
    color: '#10B981',
  },
  orderBookQuantity: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    color: '#6B7280',
  },
  orderBookTotal: {
    flex: 1,
    textAlign: 'right',
    fontSize: 14,
    color: '#374151',
  },
  spreadRow: {
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    marginVertical: 8,
  },
  spreadText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
});