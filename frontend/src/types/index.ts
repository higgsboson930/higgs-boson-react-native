// User Types
export interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  dateOfBirth?: string;
  accountStatus: 'active' | 'pending' | 'suspended' | 'blocked';
  address?: Address;
  defaultCurrency: string;
  kycStatus: 'pending' | 'verified' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface KYCData {
  email: string;
  phone: string;
  address: Address;
  dateOfBirth: string;
  income: string;
  region: string;
  documents: {
    faceVerification?: string;
    idDocument?: string;
    proofOfAddress?: string;
  };
}

// Authentication Types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  twoFactorCode?: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

// Security Types
export interface SecuritySettings {
  biometricEnabled: boolean;
  pinEnabled: boolean;
  twoFactorEnabled: boolean;
  passkeyEnabled: boolean;
}

// Cryptocurrency Types
export interface Cryptocurrency {
  id: string;
  symbol: string;
  name: string;
  logo: string;
  currentPrice: number;
  priceChange24h: number;
  priceChangePercentage24h: number;
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
  totalSupply?: number;
  maxSupply?: number;
  allTimeHigh: number;
  allTimeLow: number;
  fullyDilutedValuation?: number;
  totalValueLocked?: number;
  description: string;
  website?: string;
  whitepaper?: string;
  github?: string;
  lastUpdated: string;
}

export interface PriceData {
  timestamp: number;
  price: number;
  volume?: number;
}

export interface CryptoChart {
  coinId: string;
  timeframe: '1H' | '24H' | '7D' | '1M' | '3M' | '1Y' | 'ALL';
  data: PriceData[];
}

// Watchlist Types
export interface WatchlistItem {
  id: string;
  userId: string;
  coinId: string;
  cryptocurrency: Cryptocurrency;
  category?: string;
  addedAt: string;
}

export interface Watchlist {
  items: WatchlistItem[];
  categories: string[];
}

// Trading Types
export interface TradingPair {
  id: string;
  baseAsset: string;
  quoteAsset: string;
  symbol: string; // e.g., "BTC/USDT"
  status: 'active' | 'inactive' | 'delisted';
  minOrderSize: number;
  maxOrderSize: number;
  priceTickSize: number;
  quantityTickSize: number;
  makerFee: number;
  takerFee: number;
  lastPrice: number;
  priceChange24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
}

export interface OrderBook {
  symbol: string;
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  lastUpdateId: number;
  timestamp: string;
}

export interface OrderBookEntry {
  price: number;
  quantity: number;
  total: number;
}

export interface Trade {
  id: string;
  symbol: string;
  price: number;
  quantity: number;
  side: 'buy' | 'sell';
  timestamp: string;
  isBuyerMaker: boolean;
}

export interface Order {
  id: string;
  userId: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit' | 'stop_loss' | 'stop_loss_limit' | 'take_profit' | 'take_profit_limit' | 'trailing_stop';
  timeInForce: 'GTC' | 'IOC' | 'FOK' | 'GTD'; // Good Till Cancel, Immediate or Cancel, Fill or Kill, Good Till Date
  quantity: number;
  price?: number;
  stopPrice?: number;
  trailingDelta?: number;
  executedQuantity: number;
  filledQuantity: number;
  remainingQuantity: number;
  averagePrice: number;
  status: 'new' | 'partially_filled' | 'filled' | 'canceled' | 'rejected' | 'expired' | 'open' | 'partial';
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  fee: number;
  feeAsset: string;
  total: number;
  fills: OrderFill[];
}

export interface OrderFill {
  id: string;
  orderId: string;
  price: number;
  quantity: number;
  fee: number;
  feeAsset: string;
  timestamp: string;
  tradeId: string;
}

export interface Transaction {
  id: string;
  userId: string;
  orderId?: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'spot_trade' | 'deposit' | 'withdraw' | 'transfer' | 'stake' | 'unstake' | 'earn' | 'fee' | 'referral' | 'airdrop';
  asset: string;
  quantity: number;
  price: number;
  amount: number;
  fee: number;
  feeAsset: string;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'canceled';
  txHash?: string;
  networkConfirmations?: number;
  requiredConfirmations?: number;
  fromAddress?: string;
  toAddress?: string;
  memo?: string;
  createdAt: string;
  completedAt?: string;
  metadata?: Record<string, any>;
}

export interface Wallet {
  id: string;
  userId: string;
  asset: string;
  balance: number;
  totalBalance: number;
  availableBalance: number;
  lockedBalance: number;
  averageBuyPrice: number;
  totalValue: number;
  pnL: number;
  pnLPercentage: number;
  createdAt: string;
  updatedAt: string;
}

export interface Portfolio {
  id: string;
  userId: string;
  totalValue: number;
  totalPnL: number;
  totalPnLPercentage: number;
  wallets: Wallet[];
  positions: Position[];
  performance: PortfolioPerformance;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioPerformance {
  daily: { pnL: number; percentage: number };
  weekly: { pnL: number; percentage: number };
  monthly: { pnL: number; percentage: number };
  yearly: { pnL: number; percentage: number };
}

export interface PerformanceData {
  timestamp: string;
  totalValue: number;
  pnl: number;
  pnlPercentage: number;
}

export interface Position {
  id: string;
  userId: string;
  symbol: string;
  side: 'long' | 'short';
  size: number;
  entryPrice: number;
  markPrice: number;
  liquidationPrice?: number;
  margin: number;
  leverage: number;
  unrealizedPnl: number;
  realizedPnl: number;
  fee: number;
  funding: number;
  createdAt: string;
  updatedAt: string;
}

// Activity Types
export interface RecurringBuy {
  id: string;
  userId: string;
  coinId: string;
  amount: number;
  frequency: 'daily' | 'weekly' | 'monthly';
  nextExecutionDate: string;
  isActive: boolean;
  createdAt: string;
}

// Notification Types
export interface PriceAlert {
  id: string;
  userId: string;
  coinId: string;
  type: 'above' | 'below';
  targetPrice: number;
  isActive: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'price_alert' | 'transaction' | 'security' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data?: any;
}

export interface NotificationSettings {
  priceAlerts: boolean;
  transactionUpdates: boolean;
  securityAlerts: boolean;
  marketNews: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

// Support Types
export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  responses: SupportResponse[];
}

export interface SupportResponse {
  id: string;
  ticketId: string;
  sender: 'user' | 'support' | 'ai';
  message: string;
  createdAt: string;
}

export interface Feedback {
  id: string;
  userId: string;
  type: 'bug_report' | 'feature_request' | 'general';
  rating: number;
  message: string;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Navigation Types
export interface TabParamList {
  Home: undefined;
  Watchlist: undefined;
  Trading: undefined;
  Activity: undefined;
  Profile: undefined;
}

export interface RootStackParamList {
  MainTabs: undefined;
  Login: undefined;
  Register: undefined;
  KYC: undefined;
  CoinDetail: { coinId: string };
  Security: undefined;
  Notifications: undefined;
  Support: undefined;
  Chat: { ticketId?: string };
}

// Redux Store Types
export interface RootState {
  auth: AuthState;
  crypto: CryptoState;
  watchlist: WatchlistState;
  trading: TradingState;
  notifications: NotificationState;
}

export interface CryptoState {
  coins: Cryptocurrency[];
  selectedCoin: Cryptocurrency | null;
  chartData: CryptoChart | null;
  isLoading: boolean;
  error: string | null;
}

export interface WatchlistState {
  items: WatchlistItem[];
  categories: string[];
  isLoading: boolean;
  error: string | null;
}

export interface TradingState {
  portfolio: Portfolio | null;
  orders: Order[];
  transactions: Transaction[];
  recurringBuys: RecurringBuy[];
  isLoading: boolean;
  error: string | null;
}

export interface NotificationState {
  notifications: Notification[];
  priceAlerts: PriceAlert[];
  settings: NotificationSettings;
  isLoading: boolean;
  error: string | null;
}