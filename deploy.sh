#!/bin/bash

# Crypto Trading Platform - Deployment Script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
ENVIRONMENT="development"
STACK_NAME=""
AWS_REGION="us-east-1"
DB_PASSWORD=""
JWT_SECRET=""

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to show usage
usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -e, --environment    Environment (development, staging, production)"
    echo "  -s, --stack-name     CloudFormation stack name"
    echo "  -r, --region         AWS region (default: us-east-1)"
    echo "  -p, --db-password    Database password"
    echo "  -j, --jwt-secret     JWT secret key"
    echo "  -h, --help           Show this help message"
    echo ""
    echo "Example:"
    echo "  $0 -e development -s crypto-trading-dev -p mypassword123 -j mysecret123"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -e|--environment)
            ENVIRONMENT="$2"
            shift 2
            ;;
        -s|--stack-name)
            STACK_NAME="$2"
            shift 2
            ;;
        -r|--region)
            AWS_REGION="$2"
            shift 2
            ;;
        -p|--db-password)
            DB_PASSWORD="$2"
            shift 2
            ;;
        -j|--jwt-secret)
            JWT_SECRET="$2"
            shift 2
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        *)
            print_error "Unknown option $1"
            usage
            exit 1
            ;;
    esac
done

# Validate required parameters
if [ -z "$STACK_NAME" ]; then
    print_error "Stack name is required"
    usage
    exit 1
fi

if [ -z "$DB_PASSWORD" ]; then
    print_error "Database password is required"
    usage
    exit 1
fi

if [ -z "$JWT_SECRET" ]; then
    print_error "JWT secret is required"
    usage
    exit 1
fi

print_status "Starting deployment for environment: $ENVIRONMENT"
print_status "Stack name: $STACK_NAME"
print_status "AWS Region: $AWS_REGION"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    print_error "AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if SAM CLI is installed
if ! command -v sam &> /dev/null; then
    print_error "SAM CLI is not installed. Please install it first."
    exit 1
fi

# Verify AWS credentials
print_status "Verifying AWS credentials..."
if ! aws sts get-caller-identity &> /dev/null; then
    print_error "AWS credentials not configured. Please run 'aws configure'"
    exit 1
fi

# Build the backend
print_status "Building backend application..."
cd backend
pip install -r requirements.txt
cd ..

# Deploy the infrastructure
print_status "Deploying infrastructure..."
sam deploy \
    --template-file infrastructure/template.yaml \
    --stack-name "$STACK_NAME" \
    --region "$AWS_REGION" \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides \
        Environment="$ENVIRONMENT" \
        DBPassword="$DB_PASSWORD" \
        JWTSecretKey="$JWT_SECRET" \
    --no-confirm-changeset \
    --no-fail-on-empty-changeset

if [ $? -eq 0 ]; then
    print_status "Deployment successful!"
    
    # Get stack outputs
    print_status "Getting stack outputs..."
    API_GATEWAY_URL=$(aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --region "$AWS_REGION" \
        --query "Stacks[0].Outputs[?OutputKey=='ApiGatewayUrl'].OutputValue" \
        --output text)
    
    DB_ENDPOINT=$(aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --region "$AWS_REGION" \
        --query "Stacks[0].Outputs[?OutputKey=='DatabaseEndpoint'].OutputValue" \
        --output text)
    
    S3_BUCKET=$(aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --region "$AWS_REGION" \
        --query "Stacks[0].Outputs[?OutputKey=='S3BucketName'].OutputValue" \
        --output text)
    
    echo ""
    print_status "Deployment Information:"
    echo "API Gateway URL: $API_GATEWAY_URL"
    echo "Database Endpoint: $DB_ENDPOINT"
    echo "S3 Bucket: $S3_BUCKET"
    echo ""
    
    # Create environment file for frontend
    print_status "Creating environment file for frontend..."
    cat > frontend/.env << EOF
EXPO_PUBLIC_API_URL=$API_GATEWAY_URL
EXPO_PUBLIC_ENVIRONMENT=$ENVIRONMENT
EOF
    
    print_status "Environment file created at frontend/.env"
    
else
    print_error "Deployment failed!"
    exit 1
fi

print_status "Deployment completed successfully!"