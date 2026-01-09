import { api } from '@/lib/api';

// Define user type
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

// Helper function to extract user information from JWT token
export function getUserInfoFromToken(): UserProfile | null {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        // Decode JWT token to extract user information
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join('')
        );

        const decoded = JSON.parse(jsonPayload);

        // Since we only have the user ID in the JWT token, we'll return a partial profile
        // In a real app, you'd probably want to call an API endpoint to get full user details
        return {
          id: decoded.sub,
          name: localStorage.getItem('user_name') || 'User', // Fallback to stored name or generic
          email: localStorage.getItem('user_email') || 'user@example.com' // Fallback to stored email
        };
      } catch (error) {
        console.error('Error decoding JWT token:', error);
        return null;
      }
    }
  }
  return null;
}

// Function to store user information after successful login
export function storeUserInfo(profile: UserProfile) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user_name', profile.name);
    localStorage.setItem('user_email', profile.email);
  }
}

// Function to clear user information on logout
export function clearUserInfo() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_email');
  }
}

class UserService {
  // This could be expanded to call a backend endpoint to get user details
  async getCurrentUser(): Promise<UserProfile | null> {
    // For now, we'll use the info from the JWT token
    return getUserInfoFromToken();
  }
}

export const userService = new UserService();