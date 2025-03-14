// registration.js - Handles user registration functionality

document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registration-form');
    const usernameInput = document.getElementById('username-input');
    const emailInput = document.getElementById('email-input');
    const passwordInput = document.getElementById('password-input');
    const registerButton = document.getElementById('register-button');
    
    // Input validation functions
    const validateUsername = (username) => {
        return username.length >= 3 && username.length <= 20;
    };
    
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    
    const validatePassword = (password) => {
        return password.length >= 6;
    };
    
    // Input event listeners for real-time validation
    usernameInput.addEventListener('input', () => {
        if (!validateUsername(usernameInput.value)) {
            usernameInput.parentElement.classList.add('border-red-500');
            usernameInput.parentElement.classList.remove('border-gray-700');
        } else {
            usernameInput.parentElement.classList.remove('border-red-500');
            usernameInput.parentElement.classList.add('border-gray-700');
        }
    });
    
    emailInput.addEventListener('input', () => {
        if (!validateEmail(emailInput.value)) {
            emailInput.parentElement.classList.add('border-red-500');
            emailInput.parentElement.classList.remove('border-gray-700');
        } else {
            emailInput.parentElement.classList.remove('border-red-500');
            emailInput.parentElement.classList.add('border-gray-700');
        }
    });
    
    passwordInput.addEventListener('input', () => {
        if (!validatePassword(passwordInput.value)) {
            passwordInput.parentElement.classList.add('border-red-500');
            passwordInput.parentElement.classList.remove('border-gray-700');
        } else {
            passwordInput.parentElement.classList.remove('border-red-500');
            passwordInput.parentElement.classList.add('border-gray-700');
        }
    });
    
    // Form submission handler
    registrationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        
        // Validate all inputs
        const isUsernameValid = validateUsername(username);
        const isEmailValid = validateEmail(email);
        const isPasswordValid = validatePassword(password);
        
        // If any validation fails, stop the submission
        if (!isUsernameValid || !isEmailValid || !isPasswordValid) {
            showErrorMessage('Please correct the highlighted fields.');
            return;
        }
        
        // Show loading state
        registerButton.disabled = true;
        registerButton.innerHTML = 'Registering...';
        
        // For now, we'll simulate a registration with localStorage
        // In a real app, you would make an API call to your backend
        registerUser(username, email, password)
            .then(response => {
                // Handle successful registration
                showSuccessMessage('Registration successful! Redirecting to login...');
                
                // Redirect to login page after a short delay
                setTimeout(() => {
                    window.location.href = '../LoginPage/loginPage.html';
                }, 1500);
            })
            .catch(error => {
                // Handle registration error
                showErrorMessage(error.message || 'Registration failed. Please try again.');
                registerButton.disabled = false;
                registerButton.innerHTML = 'Register';
            });
    });
    
    // Simulated user registration function
    // In a real app, this would be an API call to your backend
    const registerUser = (username, email, password) => {
        return new Promise((resolve, reject) => {
            // Simulate network delay
            setTimeout(() => {
                try {
                    // Check if user already exists in localStorage
                    const existingUsers = JSON.parse(localStorage.getItem('workshopAI_users') || '[]');
                    const userExists = existingUsers.some(user => 
                        user.username === username || user.email === email
                    );
                    
                    if (userExists) {
                        reject(new Error('Username or email already exists.'));
                        return;
                    }
                    
                    // Add new user
                    const newUser = {
                        id: Date.now().toString(),
                        username,
                        email,
                        // In a real app, NEVER store passwords in localStorage or in plain text
                        // This is just for demonstration purposes
                        password: password
                    };
                    
                    existingUsers.push(newUser);
                    localStorage.setItem('workshopAI_users', JSON.stringify(existingUsers));
                    
                    // Store current user
                    localStorage.setItem('workshopAI_currentUser', JSON.stringify({
                        id: newUser.id,
                        username: newUser.username,
                        email: newUser.email
                    }));
                    
                    resolve({ success: true });
                } catch (error) {
                    reject(new Error('Registration failed. Please try again.'));
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
        registrationForm.insertBefore(errorDiv, registrationForm.firstChild);
        
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
        registrationForm.insertBefore(successDiv, registrationForm.firstChild);
    };
});