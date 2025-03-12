// login.js - to be included in the login page

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    if (authService.isLoggedIn()) {
        window.location.href = '../Mainpage/mainpage.html';
        return;
    }
    
    // Get the login form elements
    const usernameInput = document.querySelector('input[type="text"]');
    const passwordInput = document.querySelector('input[type="password"]');
    const loginButton = document.querySelector('button');
    
    // Add event listener to login button
    loginButton.addEventListener('click', async function(e) {
        e.preventDefault();
        
        // Get input values
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        
        // Validate inputs
        if (!username || !password) {
            alert('Please enter both username and password');
            return;
        }
        
        try {
            // Show loading state
            loginButton.textContent = 'Logging in...';
            loginButton.disabled = true;
            
            // Call login API
            await authService.login(username, password);
            
            // Redirect to main page on success
            window.location.href = '../Mainpage/mainpage.html';
        } catch (error) {
            // Display error message
            alert('Login failed: ' + (error.message || 'Invalid credentials'));
            
            // Reset button state
            loginButton.textContent = 'Login';
            loginButton.disabled = false;
        }
    });
});
