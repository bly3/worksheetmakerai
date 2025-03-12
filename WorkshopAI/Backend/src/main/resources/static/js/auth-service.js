// authService.js - place in Frontend/static/js/

/**
 * Authentication Service
 * Handles all authentication related operations
 */
class AuthService {
    constructor() {
        this.API_URL = '/api';
        this.TOKEN_KEY = 'workshopai_auth_token';
        this.USER_KEY = 'workshopai_user';
    }

    /**
     * Register a new user
     * @param {string} username - Username
     * @param {string} email - Email
     * @param {string} password - Password
     * @returns {Promise} - Promise with response
     */
    async register(username, email, password) {
        try {
            const response = await fetch(`${this.API_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    email,
                    password
                }),
            });
            
            return await response.json();
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    /**
     * Login user
     * @param {string} username - Username
     * @param {string} password - Password
     * @returns {Promise} - Promise with user data
     */
    async login(username, password) {
        try {
            const response = await fetch(`${this.API_URL}/auth/signin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password
                }),
            });
            
            const data = await response.json();
            
            if (data.token) {
                localStorage.setItem(this.TOKEN_KEY, data.token);
                localStorage.setItem(this.USER_KEY, JSON.stringify(data));
                return data;
            }
            
            throw new Error(data.message || 'Login failed');
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    /**
     * Logout the current user
     */
    logout() {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        window.location.href = '/Frontend/LoginPage/loginPage.html';
    }

    /**
     * Request password reset
     * @param {string} email - User email
     * @returns {Promise} - Promise with response
     */
    async requestPasswordReset(email) {
        try {
            const response = await fetch(`${this.API_URL}/auth/reset-password-request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(email),
            });
            
            return await response.json();
        } catch (error) {
            console.error('Password reset request error:', error);
            throw error;
        }
    }

    /**
     * Reset password
     * @param {string} email - User email
     * @param {string} newPassword - New password
     * @returns {Promise} - Promise with response
     */
    async resetPassword(email, newPassword) {
        try {
            const response = await fetch(`${this.API_URL}/auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    newPassword
                }),
            });
            
            return await response.json();
        } catch (error) {
            console.error('Password reset error:', error);
            throw error;
        }
    }

    /**
     * Get current user
     * @returns {Object|null} - User object or null
     */
    getCurrentUser() {
        const user = localStorage.getItem(this.USER_KEY);
        return user ? JSON.parse(user) : null;
    }

    /**
     * Get authentication token
     * @returns {string|null} - Auth token or null
     */
    getToken() {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    /**
     * Check if user is logged in
     * @returns {boolean} - True if logged in
     */
    isLoggedIn() {
        return !!this.getToken();
    }

    /**
     * Redirect to login if not authenticated
     */
    requireAuth() {
        if (!this.isLoggedIn()) {
            window.location.href = '/Frontend/LoginPage/loginPage.html';
        }
    }
}

// Create a singleton instance
const authService = new AuthService();
