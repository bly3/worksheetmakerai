// login.js - Handles user login functionality

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username-input');
    const passwordInput = document.getElementById('password-input');
    const loginButton = document.getElementById('login-button');
    
    // Check if user is already logged in
    const checkLoggedInUser = () => {
        const currentUser = localStorage.getItem('workshopAI_currentUser');
        if (currentUser) {
            // User is already logged in, redirect to main page
            window.location.href = '../Mainpage/mainpage.html';
        }
    };
    
    // Call this function when the page loads
    checkLoggedInUser();
    
    // Form submission handler
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const usernameOrEmail = usernameInput.value.trim();
        const password = passwordInput.value;
        
        // Basic validation
        if (!usernameOrEmail || !password) {
            showErrorMessage('Please enter both username/email and password.');
            return;
        }
        
        // Show loading state
        loginButton.disabled = true;
        loginButton.innerHTML = 'Logging in...';
        
        // Attempt to login
        loginUser(usernameOrEmail, password)
            .then(user => {
                // Store logged in user
                localStorage.setItem('workshopAI_currentUser', JSON.stringify(user));
                
                // Show success message
                showSuccessMessage('Login successful! Redirecting...');
                
                // Redirect to main page after a short delay
                setTimeout(() => {
                    window.location.href = '../Mainpage/mainpage.html';
                }, 1500);
            })
            .catch(error => {
                // Handle login error
                showErrorMessage(error.message || 'Login failed. Please check your credentials.');
                loginButton.disabled = false;
                loginButton.innerHTML = 'Login';
            });
    });
    
    // Simulated login function
    // In a real app, this would be an API call to your backend
    const loginUser = (usernameOrEmail, password) => {
        return new Promise((resolve, reject) => {
            // Simulate network delay
            setTimeout(() => {
                try {
                    // Retrieve users from localStorage
                    const users = JSON.parse(localStorage.getItem('workshopAI_users') || '[]');
                    
                    // Find user by username or email
                    const user = users.find(u => 
                        (u.username === usernameOrEmail || u.email === usernameOrEmail) && 
                        u.password === password
                    );
                    
                    if (user) {
                        // Return user without password
                        const { password, ...userWithoutPassword } = user;
                        resolve(userWithoutPassword);
                    } else {
                        reject(new Error('Invalid username/email or password.'));
                    }
                } catch (error) {
                    reject(new Error('Login failed. Please try again.'));
                }
            }, 1000);
        });
    };
    
    // Helper function to show error messages
    const showErrorMessage = (message) => {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'bg-red-500 text-white p-2 rounded-lg mb-4 text-sm';
        errorDiv.textContent = message;
        
        // Insert error message at the top of the form
        loginForm.insertBefore(errorDiv, loginForm.firstChild);
        
        // Remove the message after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    };
    
    // Helper function to show success messages
    const showSuccessMessage = (message) => {
        const successDiv = document.createElement('div');
        successDiv.className = 'bg-green-500 text-white p-2 rounded-lg mb-4 text-sm';
        successDiv.textContent = message;
        
        // Insert success message at the top of the form
        loginForm.insertBefore(successDiv, loginForm.firstChild);
    };
});