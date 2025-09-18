import * as SecureStore from 'expo-secure-store';
import { apiClient } from './apiClient';
import { LoginCredentials, RegisterCredentials, User, KYCData } from '../types';

interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    
    if (response.success && response.data) {
      await SecureStore.setItemAsync('auth_token', response.data.token);
      await SecureStore.setItemAsync('refresh_token', response.data.refreshToken);
      return response.data;
    }
    
    throw new Error(response.error || 'Login failed');
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', credentials);
    
    if (response.success && response.data) {
      await SecureStore.setItemAsync('auth_token', response.data.token);
      await SecureStore.setItemAsync('refresh_token', response.data.refreshToken);
      return response.data;
    }
    
    throw new Error(response.error || 'Registration failed');
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      await SecureStore.deleteItemAsync('auth_token');
      await SecureStore.deleteItemAsync('refresh_token');
    }
  }

  async refreshToken(): Promise<{ token: string; user?: User }> {
    const refreshToken = await SecureStore.getItemAsync('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post<{ token: string; user?: User }>('/auth/refresh', {
      refreshToken,
    });

    if (response.success && response.data) {
      await SecureStore.setItemAsync('auth_token', response.data.token);
      return response.data;
    }

    throw new Error(response.error || 'Token refresh failed');
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await apiClient.put<User>('/auth/profile', userData);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Profile update failed');
  }

  async submitKYC(kycData: KYCData): Promise<void> {
    const response = await apiClient.post('/auth/kyc', kycData);
    
    if (!response.success) {
      throw new Error(response.error || 'KYC submission failed');
    }
  }

  async uploadDocument(file: any, documentType: string): Promise<string> {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('type', documentType);

    const response = await apiClient.post<{ url: string }>('/auth/documents', formData);
    
    if (response.success && response.data) {
      return response.data.url;
    }
    
    throw new Error(response.error || 'Document upload failed');
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const response = await apiClient.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    
    if (!response.success) {
      throw new Error(response.error || 'Password change failed');
    }
  }

  async requestPasswordReset(email: string): Promise<void> {
    const response = await apiClient.post('/auth/forgot-password', { email });
    
    if (!response.success) {
      throw new Error(response.error || 'Password reset request failed');
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const response = await apiClient.post('/auth/reset-password', {
      token,
      newPassword,
    });
    
    if (!response.success) {
      throw new Error(response.error || 'Password reset failed');
    }
  }

  async enable2FA(): Promise<{ qrCode: string; secret: string }> {
    const response = await apiClient.post<{ qrCode: string; secret: string }>('/auth/2fa/enable');
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || '2FA setup failed');
  }

  async verify2FA(code: string): Promise<void> {
    const response = await apiClient.post('/auth/2fa/verify', { code });
    
    if (!response.success) {
      throw new Error(response.error || '2FA verification failed');
    }
  }

  async disable2FA(code: string): Promise<void> {
    const response = await apiClient.post('/auth/2fa/disable', { code });
    
    if (!response.success) {
      throw new Error(response.error || '2FA disable failed');
    }
  }

  async getStoredToken(): Promise<string | null> {
    return await SecureStore.getItemAsync('auth_token');
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getStoredToken();
    return !!token;
  }
}

export const authService = new AuthService();