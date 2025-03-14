// auth-utils.js - Shared authentication utilities for Workshop.AI

/**
 * Check if a user is currently logged in
 * @returns {Object|null} The current user object or null if not logged in
 */
function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem('workshopAI_currentUser'));
    } catch (e) {
        return null;
    }
}

/**
 * Logout the current user
 * @param {boolean} redirect - Whether to redirect to login page after logout
 */
function logout(redirect = true) {
    // Remove user from local storage
    localStorage.removeItem('workshopAI_currentUser');
    
    // Redirect to login page if requested
    if (redirect) {
        window.location.href = '../LoginPage/loginPage.html';
    }
}

/**
 * Check if user is authenticated and redirect if not
 * @param {string} redirectUrl - URL to redirect to if not authenticated
 * @returns {Object|null} The current user or null if not authenticated
 */
function requireAuth(redirectUrl = '../LoginPage/loginPage.html') {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        window.location.href = redirectUrl;
        return null;
    }
    
    return currentUser;
}

/**
 * Redirect authenticated users (e.g., from login page to main page)
 * @param {string} redirectUrl - URL to redirect to if authenticated
 * @returns {boolean} Whether the user was redirected
 */
function redirectIfAuthenticated(redirectUrl = '../Mainpage/mainpage.html') {
    const currentUser = getCurrentUser();
    
    if (currentUser) {
        window.location.href = redirectUrl;
        return true;
    }
    
    return false;
}

/**
 * Format error message for display
 * @param {Error|string} error - Error object or message
 * @returns {string} Formatted error message
 */
function formatErrorMessage(error) {
    if (typeof error === 'string') {
        return error;
    }
    
    return error.message || 'An unexpected error occurred';
}

// Export functions if using modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getCurrentUser,
        logout,
        requireAuth,
        redirectIfAuthenticated,
        formatErrorMessage
    };
}