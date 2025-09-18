from sqlalchemy import Column, Integer, String, DateTime, Boolean, Float, Text, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from .database import Base

class AccountStatus(enum.Enum):
    ACTIVE = "active"
    PENDING = "pending"
    SUSPENDED = "suspended"
    BLOCKED = "blocked"

class KYCStatus(enum.Enum):
    PENDING = "pending"
    VERIFIED = "verified"
    REJECTED = "rejected"

class OrderType(enum.Enum):
    BUY = "buy"
    SELL = "sell"
    CONVERT = "convert"

class OrderStatus(enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    FAILED = "failed"

class TransactionType(enum.Enum):
    BUY = "buy"
    SELL = "sell"
    CONVERT = "convert"
    DEPOSIT = "deposit"
    WITHDRAW = "withdraw"
    STAKE = "stake"
    UNSTAKE = "unstake"

class TransactionStatus(enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"

class NotificationType(enum.Enum):
    PRICE_ALERT = "price_alert"
    TRANSACTION = "transaction"
    SECURITY = "security"
    SYSTEM = "system"

# User Models
class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, unique=True, index=True)
    name = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)
    date_of_birth = Column(DateTime)
    account_status = Column(Enum(AccountStatus), default=AccountStatus.PENDING)
    kyc_status = Column(Enum(KYCStatus), default=KYCStatus.PENDING)
    default_currency = Column(String, default="USD")
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    two_factor_enabled = Column(Boolean, default=False)
    two_factor_secret = Column(String)
    failed_login_attempts = Column(Integer, default=0)
    locked_until = Column(DateTime)
    last_login = Column(DateTime)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    addresses = relationship("Address", back_populates="user")
    wallets = relationship("Wallet", back_populates="user")
    orders = relationship("Order", back_populates="user")
    transactions = relationship("Transaction", back_populates="user")
    watchlist_items = relationship("WatchlistItem", back_populates="user")
    notifications = relationship("Notification", back_populates="user")
    price_alerts = relationship("PriceAlert", back_populates="user")
    support_tickets = relationship("SupportTicket", back_populates="user")

class Address(Base):
    __tablename__ = "addresses"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    street = Column(String, nullable=False)
    city = Column(String, nullable=False)
    state = Column(String, nullable=False)
    country = Column(String, nullable=False)
    zip_code = Column(String, nullable=False)
    is_primary = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="addresses")

# Cryptocurrency Models
class Cryptocurrency(Base):
    __tablename__ = "cryptocurrencies"
    
    id = Column(String, primary_key=True, index=True)
    symbol = Column(String, nullable=False, index=True)
    name = Column(String, nullable=False)
    logo = Column(String)
    current_price = Column(Float, nullable=False)
    price_change_24h = Column(Float, default=0)
    price_change_percentage_24h = Column(Float, default=0)
    market_cap = Column(Float)
    volume_24h = Column(Float)
    circulating_supply = Column(Float)
    total_supply = Column(Float)
    max_supply = Column(Float)
    all_time_high = Column(Float)
    all_time_low = Column(Float)
    fully_diluted_valuation = Column(Float)
    total_value_locked = Column(Float)
    description = Column(Text)
    website = Column(String)
    whitepaper = Column(String)
    github = Column(String)
    is_active = Column(Boolean, default=True)
    last_updated = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    watchlist_items = relationship("WatchlistItem", back_populates="cryptocurrency")
    price_alerts = relationship("PriceAlert", back_populates="cryptocurrency")

# Trading Models
class Wallet(Base):
    __tablename__ = "wallets"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    currency = Column(String, nullable=False)
    balance = Column(Float, default=0.0)
    available_balance = Column(Float, default=0.0)
    locked_balance = Column(Float, default=0.0)
    address = Column(String)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="wallets")

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    type = Column(Enum(OrderType), nullable=False)
    order_type = Column(String, nullable=False)  # market, limit, stop-loss
    from_currency = Column(String, nullable=False)
    to_currency = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    price = Column(Float)
    stop_price = Column(Float)
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING)
    fee = Column(Float, default=0.0)
    created_at = Column(DateTime, server_default=func.now())
    completed_at = Column(DateTime)
    
    # Relationships
    user = relationship("User", back_populates="orders")

class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    type = Column(Enum(TransactionType), nullable=False)
    currency = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    fee = Column(Float, default=0.0)
    status = Column(Enum(TransactionStatus), default=TransactionStatus.PENDING)
    tx_hash = Column(String)
    created_at = Column(DateTime, server_default=func.now())
    completed_at = Column(DateTime)
    
    # Relationships
    user = relationship("User", back_populates="transactions")

# Watchlist Models
class WatchlistItem(Base):
    __tablename__ = "watchlist_items"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    coin_id = Column(String, ForeignKey("cryptocurrencies.id"), nullable=False)
    category = Column(String, default="Favorites")
    added_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="watchlist_items")
    cryptocurrency = relationship("Cryptocurrency", back_populates="watchlist_items")

# Notification Models
class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    type = Column(Enum(NotificationType), nullable=False)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    data = Column(Text)  # JSON data
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="notifications")

class PriceAlert(Base):
    __tablename__ = "price_alerts"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    coin_id = Column(String, ForeignKey("cryptocurrencies.id"), nullable=False)
    type = Column(String, nullable=False)  # above, below
    target_price = Column(Float, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    triggered_at = Column(DateTime)
    
    # Relationships
    user = relationship("User", back_populates="price_alerts")
    cryptocurrency = relationship("Cryptocurrency", back_populates="price_alerts")

# Support Models
class SupportTicket(Base):
    __tablename__ = "support_tickets"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    subject = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    status = Column(String, default="open")  # open, in_progress, resolved, closed
    priority = Column(String, default="medium")  # low, medium, high, urgent
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="support_tickets")
    responses = relationship("SupportResponse", back_populates="ticket")

class SupportResponse(Base):
    __tablename__ = "support_responses"
    
    id = Column(String, primary_key=True, index=True)
    ticket_id = Column(String, ForeignKey("support_tickets.id"), nullable=False)
    sender = Column(String, nullable=False)  # user, support, ai
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    ticket = relationship("SupportTicket", back_populates="responses")