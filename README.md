# Crypto Trading Platform

A comprehensive mobile crypto trading platform built with React Native frontend and Python backend on AWS Lambda.

## 🏗️ Architecture Overview

### Frontend
- **React Native** with TypeScript
- **Expo** for development and deployment
- **Redux Toolkit** for state management
- **React Navigation** for routing
- **Biometric authentication** (Face ID/Touch ID)
- **Real-time price charts** and data visualization

### Backend
- **FastAPI** Python framework
- **AWS Lambda** serverless functions
- **PostgreSQL** database on AWS RDS
- **JWT** authentication with refresh tokens
- **2FA** support (TOTP)

### Infrastructure
- **AWS API Gateway** for API management
- **AWS Cognito** for user authentication
- **AWS S3** for file storage
- **AWS SES** for email notifications
- **AWS SNS** for SMS notifications
- **CloudFormation** for infrastructure as code

## 🚀 Features

### 1. User Authentication & Management
- ✅ User registration and login
- ✅ Email and phone verification
- ✅ KYC (Know Your Customer) verification
- ✅ Biometric authentication (Face ID/Touch ID)
- ✅ PIN authentication
- ✅ Two-factor authentication (2FA)
- ✅ Passkey authentication
- ✅ Profile management

### 2. Cryptocurrency Information
- ✅ Real-time cryptocurrency prices
- ✅ Interactive price charts
- ✅ Comprehensive coin information
- ✅ Market statistics and analytics
- ✅ News and social media links

### 3. Watchlist Management
- ✅ Personal watchlist creation
- ✅ Advanced search and filtering
- ✅ Category-based organization
- ✅ Real-time price updates

### 4. Trading Features
- ✅ Buy/Sell cryptocurrency
- ✅ Crypto-to-crypto conversion
- ✅ Fiat deposits and withdrawals
- ✅ Staking services
- ✅ Order management (Market, Limit, Stop-loss)
- ✅ Portfolio tracking

### 5. Activity Tracking
- ✅ Open orders monitoring
- ✅ Recurring buy setups
- ✅ Transaction history
- ✅ Portfolio performance

### 6. Notifications System
- ✅ Price alerts
- ✅ Push notifications
- ✅ Email/SMS notifications
- ✅ Custom notification preferences

### 7. Support Center
- ✅ AI-powered chatbot
- ✅ Support ticket management
- ✅ Feedback system
- ✅ Help documentation

### 8. Wallet Management
- ✅ Multi-currency wallet support
- ✅ QR code generation/scanning
- ✅ Transaction history
- ✅ Wallet security features

## 📁 Project Structure

```
crypto-trading-platform/
├── frontend/                 # React Native mobile app
│   ├── app/                 # Expo Router pages
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── screens/         # Screen components
│   │   ├── store/           # Redux store and slices
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Utility functions
│   │   └── hooks/           # Custom React hooks
│   ├── assets/              # Images, fonts, etc.
│   └── package.json
├── backend/                 # Python Lambda backend
│   ├── src/
│   │   ├── core/            # Core configuration
│   │   ├── database/        # Database models and setup
│   │   ├── routers/         # API route handlers
│   │   ├── services/        # Business logic services
│   │   ├── schemas/         # Pydantic schemas
│   │   └── main.py          # FastAPI application
│   └── requirements.txt
├── infrastructure/          # AWS CloudFormation templates
│   └── template.yaml
├── deploy.sh               # Deployment script
└── README.md
```

## 🛠️ Development Setup

### Prerequisites

1. **Node.js** (v18 or higher)
2. **Python** (3.11 or higher)
3. **AWS CLI** configured with appropriate credentials
4. **SAM CLI** for AWS Lambda deployment
5. **Expo CLI** for React Native development
6. **PostgreSQL** (for local development)

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npx expo start
   ```

5. Run on device/simulator:
   - **iOS**: Press `i` in the terminal or scan QR code with Camera app
   - **Android**: Press `a` in the terminal or scan QR code with Expo Go app

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\\Scripts\\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create environment file:
   ```bash
   cp .env.example .env
   ```

5. Set up local database:
   ```bash
   # Install PostgreSQL and create database
   createdb crypto_trading
   
   # Run database migrations
   alembic upgrade head
   ```

6. Start local development server:
   ```bash
   uvicorn src.main:app --reload
   ```

## 🚀 Deployment

### AWS Infrastructure Deployment

1. Ensure AWS CLI is configured:
   ```bash
   aws configure
   ```

2. Run the deployment script:
   ```bash
   ./deploy.sh -e development -s crypto-trading-dev -p your_db_password -j your_jwt_secret
   ```

3. The script will:
   - Build the backend application
   - Deploy AWS infrastructure using CloudFormation
   - Create necessary AWS resources (Lambda, RDS, S3, etc.)
   - Configure API Gateway
   - Create environment file for frontend

### Frontend Deployment

1. Build for production:
   ```bash
   cd frontend
   npx expo build:ios    # For iOS
   npx expo build:android # For Android
   ```

2. Submit to app stores:
   ```bash
   npx expo submit:ios    # Submit to App Store
   npx expo submit:android # Submit to Google Play
   ```

## 🔧 Configuration

### Environment Variables

#### Frontend (.env)
```
EXPO_PUBLIC_API_URL=https://your-api-gateway-url.com
EXPO_PUBLIC_ENVIRONMENT=development
```

#### Backend (.env)
```
ENVIRONMENT=development
DATABASE_URL=postgresql://user:password@localhost:5432/crypto_trading
SECRET_KEY=your-secret-key-change-in-production
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-s3-bucket-name
COINGECKO_API_KEY=your-coingecko-api-key
COINMARKETCAP_API_KEY=your-coinmarketcap-api-key
```

## 🔐 Security Features

- **JWT Authentication** with refresh tokens
- **Biometric Authentication** (Face ID/Touch ID)
- **PIN Authentication**
- **Two-Factor Authentication** (TOTP)
- **Passkey Authentication**
- **Rate Limiting** on API endpoints
- **Input Validation** and sanitization
- **SQL Injection** protection
- **CORS** configuration
- **Encryption** at rest and in transit

## 📊 External Integrations

### Crypto Data Providers
- **CoinGecko API** for cryptocurrency data
- **CoinMarketCap API** for market data

### KYC/Identity Verification
- Integration ready for services like Jumio, Onfido, or Veriff

### Payment Processors
- Integration ready for Stripe, PayPal, or other payment providers

### Notification Services
- **AWS SES** for email notifications
- **AWS SNS** for SMS notifications
- **Firebase Cloud Messaging** for push notifications

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm test                    # Run unit tests
npm run test:e2e           # Run end-to-end tests
```

### Backend Testing
```bash
cd backend
pytest                     # Run all tests
pytest --cov=src          # Run tests with coverage
```

## 📈 Monitoring and Analytics

- **AWS CloudWatch** for application monitoring
- **AWS X-Ray** for distributed tracing
- **Custom metrics** for business intelligence
- **Error tracking** with Sentry (optional)

## 🔄 CI/CD Pipeline

The project is ready for CI/CD integration with:
- **GitHub Actions**
- **AWS CodePipeline**
- **Jenkins**

Example workflow includes:
1. Code quality checks (linting, testing)
2. Security scanning
3. Automated deployment to staging
4. Manual approval for production deployment

## 📚 API Documentation

Once deployed, API documentation is available at:
- **Development**: `https://your-api-url/docs`
- **Interactive API**: `https://your-api-url/redoc`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation in the app's support section

## 🗺️ Roadmap

### Phase 1 (Current) - Foundation ✅
- [x] Basic authentication system
- [x] Cryptocurrency data integration
- [x] Basic trading functionality
- [x] Watchlist management

### Phase 2 - Advanced Features
- [ ] Advanced trading features (derivatives, options)
- [ ] Social trading features
- [ ] Portfolio analytics and insights
- [ ] Advanced charting tools

### Phase 3 - Ecosystem Expansion
- [ ] DeFi integration
- [ ] NFT marketplace
- [ ] Lending and borrowing
- [ ] Cross-chain trading

### Phase 4 - Enterprise Features
- [ ] Institutional trading
- [ ] API for third-party integrations
- [ ] Advanced security features
- [ ] Compliance and regulatory features

---

Built with ❤️ for the crypto community