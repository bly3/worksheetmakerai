// register.js - to be included in the registration page

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    if (authService.isLoggedIn()) {
        window.location.href = '../Mainpage/mainpage.html';
        return;
    }
    
    // Get the registration form elements
    const usernameInput = document.querySelector('input[type="text"]');
    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = document.querySelector('input[type="password"]');
    const registerButton = document.querySelector('button');
    
    // Add event listener to register button
    registerButton.addEventListener('click', async function(e) {
        e.preventDefault();
        
        // Get input values
        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        
        // Validate inputs
        if (!username || !email || !password) {
            alert('Please fill in all fields');
            return;
        }
        
        // Validate email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // Validate password length
        if (password.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }
        
        try {
            // Show loading state
            registerButton.textContent = 'Registering...';
            registerButton.disabled = true;
            
            // Call register API
            const response = await authService.register(username, email, password);
            
            // Check response
            if (response.message) {
                alert(response.message);
                
                // Redirect to login page on success
                if (response.message.includes('successfully')) {
                    window.location.href = '../LoginPage/loginPage.html';
                    return;
                }
            }
            
            // Reset button state
            registerButton.textContent = 'Register';
            registerButton.disabled = false;
            
        } catch (error) {
            // Display error message
            alert('Registration failed: ' + (error.message || 'Please try again'));
            
            // Reset button state
            registerButton.textContent = 'Register';
            registerButton.disabled = false;
        }
    });
});
