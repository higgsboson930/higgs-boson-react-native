import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store';
import { Order, Transaction } from '../../types';

export default function OrderHistoryScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'trades'>('orders');
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'filled' | 'cancelled'>('all');
  const [searchSymbol, setSearchSymbol] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const dispatch = useAppDispatch();
  const { orders, transactions, isLoading } = useAppSelector((state) => state.trading);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    loadOrderHistory();
  }, []);

  const loadOrderHistory = async () => {
    // Mock data loading - replace with actual API calls
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrderHistory();
    setRefreshing(false);
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return `${currency === 'USD' ? '$' : ''}${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    })}${currency !== 'USD' ? ` ${currency}` : ''}`;
  };

  const formatQuantity = (quantity: number) => {
    return quantity.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 8,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'filled': return '#10B981';
      case 'open': case 'pending': return '#F59E0B';
      case 'cancelled': case 'rejected': return '#EF4444';
      case 'partial': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  const cancelOrder = async (orderId: string) => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            try {
              // Mock cancel order - replace with actual API call
              await new Promise(resolve => setTimeout(resolve, 1000));
              Alert.alert('Success', 'Order cancelled successfully');
              loadOrderHistory();
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel order');
            }
          }
        }
      ]
    );
  };

  // Mock data
  const mockOrders: Order[] = [
    {
      id: '1',
      userId: user?.id || '1',
      symbol: 'BTC/USDT',
      side: 'buy',
      type: 'limit',
      quantity: 0.5,
      price: 44000,
      filledQuantity: 0.3,
      remainingQuantity: 0.2,
      status: 'partial',
      timeInForce: 'GTC',
      fee: 13.2,
      total: 22000,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
      id: '2',
      userId: user?.id || '1',
      symbol: 'ETH/USDT',
      side: 'sell',
      type: 'market',
      quantity: 2.0,
      price: 2500,
      filledQuantity: 2.0,
      remainingQuantity: 0,
      status: 'filled',
      timeInForce: 'IOC',
      fee: 5.0,
      total: 5000,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: '3',
      userId: user?.id || '1',
      symbol: 'BTC/USDT',
      side: 'buy',
      type: 'limit',
      quantity: 1.0,
      price: 43000,
      filledQuantity: 0,
      remainingQuantity: 1.0,
      status: 'open',
      timeInForce: 'GTC',
      fee: 0,
      total: 43000,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    },
  ];

  const mockTransactions: Transaction[] = [
    {
      id: '1',
      userId: user?.id || '1',
      orderId: '2',
      symbol: 'ETH/USDT',
      side: 'sell',
      quantity: 2.0,
      price: 2500,
      fee: 5.0,
      feeAsset: 'USDT',
      total: 4995,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: '2',
      userId: user?.id || '1',
      orderId: '1',
      symbol: 'BTC/USDT',
      side: 'buy',
      quantity: 0.3,
      price: 44000,
      fee: 13.2,
      feeAsset: 'USDT',
      total: 13200,
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
  ];

  const ordersData = orders || mockOrders;
  const transactionsData = transactions || mockTransactions;

  const filteredOrders = ordersData.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSymbol = !searchSymbol || order.symbol.toLowerCase().includes(searchSymbol.toLowerCase());
    return matchesStatus && matchesSymbol;
  });

  const filteredTransactions = transactionsData.filter(transaction => {
    const matchesSymbol = !searchSymbol || transaction.symbol.toLowerCase().includes(searchSymbol.toLowerCase());
    return matchesSymbol;
  });

  const showOrderDetailsModal = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Order History</Text>
        <TouchableOpacity>
          <Ionicons name="options" size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by symbol..."
            value={searchSymbol}
            onChangeText={setSearchSymbol}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {/* Tab Selector */}
      <View style={styles.tabSelector}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'orders' && styles.activeTab]}
          onPress={() => setActiveTab('orders')}
        >
          <Text style={[styles.tabText, activeTab === 'orders' && styles.activeTabText]}>
            Orders
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'trades' && styles.activeTab]}
          onPress={() => setActiveTab('trades')}
        >
          <Text style={[styles.tabText, activeTab === 'trades' && styles.activeTabText]}>
            Trades
          </Text>
        </TouchableOpacity>
      </View>

      {/* Status Filter (Orders only) */}
      {activeTab === 'orders' && (
        <View style={styles.statusFilter}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {(['all', 'open', 'filled', 'cancelled'] as const).map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.statusButton,
                  filterStatus === status && styles.statusButtonActive
                ]}
                onPress={() => setFilterStatus(status)}
              >
                <Text style={[
                  styles.statusButtonText,
                  filterStatus === status && styles.statusButtonTextActive
                ]}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Content */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {activeTab === 'orders' ? (
          // Orders List
          filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <TouchableOpacity
                key={order.id}
                style={styles.orderCard}
                onPress={() => showOrderDetailsModal(order)}
              >
                <View style={styles.orderHeader}>
                  <View style={styles.orderInfo}>
                    <Text style={styles.orderSymbol}>{order.symbol}</Text>
                    <View style={styles.orderMeta}>
                      <Text style={[
                        styles.orderSide,
                        order.side === 'buy' ? styles.buySide : styles.sellSide
                      ]}>
                        {order.side.toUpperCase()}
                      </Text>
                      <Text style={styles.orderType}>{order.type.toUpperCase()}</Text>
                    </View>
                  </View>
                  <View style={styles.orderStatus}>
                    <Text style={[
                      styles.statusText,
                      { color: getStatusColor(order.status) }
                    ]}>
                      {order.status.toUpperCase()}
                    </Text>
                    <Text style={styles.orderTime}>
                      {formatDate(order.createdAt)}
                    </Text>
                  </View>
                </View>

                <View style={styles.orderDetails}>
                  <View style={styles.orderDetailRow}>
                    <Text style={styles.orderDetailLabel}>Quantity:</Text>
                    <Text style={styles.orderDetailValue}>
                      {formatQuantity(order.quantity)}
                    </Text>
                  </View>
                  <View style={styles.orderDetailRow}>
                    <Text style={styles.orderDetailLabel}>Price:</Text>
                    <Text style={styles.orderDetailValue}>
                      {formatCurrency(order.price)}
                    </Text>
                  </View>
                  <View style={styles.orderDetailRow}>
                    <Text style={styles.orderDetailLabel}>Filled:</Text>
                    <Text style={styles.orderDetailValue}>
                      {formatQuantity(order.filledQuantity)} / {formatQuantity(order.quantity)}
                    </Text>
                  </View>
                  <View style={styles.orderDetailRow}>
                    <Text style={styles.orderDetailLabel}>Total:</Text>
                    <Text style={styles.orderDetailValue}>
                      {formatCurrency(order.total)}
                    </Text>
                  </View>
                </View>

                {order.status === 'open' && (
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => cancelOrder(order.id)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel Order</Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={48} color="#9CA3AF" />
              <Text style={styles.emptyStateText}>No orders found</Text>
            </View>
          )
        ) : (
          // Trades List
          filteredTransactions.length > 0 ? (
            filteredTransactions.map((trade) => (
              <View key={trade.id} style={styles.tradeCard}>
                <View style={styles.tradeHeader}>
                  <View style={styles.tradeInfo}>
                    <Text style={styles.tradeSymbol}>{trade.symbol}</Text>
                    <Text style={[
                      styles.tradeSide,
                      trade.side === 'buy' ? styles.buySide : styles.sellSide
                    ]}>
                      {trade.side.toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.tradeTime}>
                    {formatDate(trade.createdAt)}
                  </Text>
                </View>

                <View style={styles.tradeDetails}>
                  <View style={styles.tradeDetailRow}>
                    <Text style={styles.tradeDetailLabel}>Quantity:</Text>
                    <Text style={styles.tradeDetailValue}>
                      {formatQuantity(trade.quantity)}
                    </Text>
                  </View>
                  <View style={styles.tradeDetailRow}>
                    <Text style={styles.tradeDetailLabel}>Price:</Text>
                    <Text style={styles.tradeDetailValue}>
                      {formatCurrency(trade.price)}
                    </Text>
                  </View>
                  <View style={styles.tradeDetailRow}>
                    <Text style={styles.tradeDetailLabel}>Fee:</Text>
                    <Text style={styles.tradeDetailValue}>
                      {formatCurrency(trade.fee)} {trade.feeAsset}
                    </Text>
                  </View>
                  <View style={styles.tradeDetailRow}>
                    <Text style={styles.tradeDetailLabel}>Total:</Text>
                    <Text style={styles.tradeDetailValue}>
                      {formatCurrency(trade.total)}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="swap-horizontal-outline" size={48} color="#9CA3AF" />
              <Text style={styles.emptyStateText}>No trades found</Text>
            </View>
          )
        )}
      </ScrollView>

      {/* Order Details Modal */}
      <Modal
        visible={showOrderDetails}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Order Details</Text>
            <TouchableOpacity onPress={() => setShowOrderDetails(false)}>
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          {selectedOrder && (
            <ScrollView style={styles.modalContent}>
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Order Information</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Order ID:</Text>
                  <Text style={styles.detailValue}>{selectedOrder.id}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Symbol:</Text>
                  <Text style={styles.detailValue}>{selectedOrder.symbol}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Side:</Text>
                  <Text style={[
                    styles.detailValue,
                    selectedOrder.side === 'buy' ? styles.buySide : styles.sellSide
                  ]}>
                    {selectedOrder.side.toUpperCase()}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Type:</Text>
                  <Text style={styles.detailValue}>{selectedOrder.type.toUpperCase()}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status:</Text>
                  <Text style={[
                    styles.detailValue,
                    { color: getStatusColor(selectedOrder.status) }
                  ]}>
                    {selectedOrder.status.toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Execution Details</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Quantity:</Text>
                  <Text style={styles.detailValue}>
                    {formatQuantity(selectedOrder.quantity)}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Price:</Text>
                  <Text style={styles.detailValue}>
                    {formatCurrency(selectedOrder.price)}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Filled:</Text>
                  <Text style={styles.detailValue}>
                    {formatQuantity(selectedOrder.filledQuantity)}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Remaining:</Text>
                  <Text style={styles.detailValue}>
                    {formatQuantity(selectedOrder.remainingQuantity)}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Total:</Text>
                  <Text style={styles.detailValue}>
                    {formatCurrency(selectedOrder.total)}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Fee:</Text>
                  <Text style={styles.detailValue}>
                    {formatCurrency(selectedOrder.fee)}
                  </Text>
                </View>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Timestamps</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Created:</Text>
                  <Text style={styles.detailValue}>
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Updated:</Text>
                  <Text style={styles.detailValue}>
                    {new Date(selectedOrder.updatedAt).toLocaleString()}
                  </Text>
                </View>
              </View>

              {selectedOrder.status === 'open' && (
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => {
                    setShowOrderDetails(false);
                    cancelOrder(selectedOrder.id);
                  }}
                >
                  <Text style={styles.modalCancelButtonText}>Cancel Order</Text>
                </TouchableOpacity>
              )}
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
  searchSection: {
    padding: 16,
    backgroundColor: 'white',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#1F2937',
  },
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#3B82F6',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#3B82F6',
  },
  statusFilter: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  statusButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  statusButtonActive: {
    backgroundColor: '#3B82F6',
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  statusButtonTextActive: {
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderSymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  orderMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  orderSide: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  buySide: {
    backgroundColor: '#D1FAE5',
    color: '#065F46',
  },
  sellSide: {
    backgroundColor: '#FEE2E2',
    color: '#991B1B',
  },
  orderType: {
    fontSize: 12,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  orderStatus: {
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  orderTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  orderDetails: {
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
  },
  orderDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  orderDetailLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  orderDetailValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  cancelButton: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#DC2626',
  },
  tradeCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tradeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tradeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tradeSymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  tradeSide: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tradeTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  tradeDetails: {
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
    padding: 12,
  },
  tradeDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  tradeDetailLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  tradeDetailValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
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
  modalContent: {
    flex: 1,
    padding: 16,
  },
  detailSection: {
    marginBottom: 24,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  modalCancelButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  modalCancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});