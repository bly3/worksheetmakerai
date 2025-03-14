// forgotPassword.js - Handles password reset functionality

document.addEventListener('DOMContentLoaded', () => {
    const resetForm = document.getElementById('reset-form');
    const emailInput = document.getElementById('email-input');
    const resetButton = document.getElementById('reset-button');
    
    // Form submission handler
    resetForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get email value
        const email = emailInput.value.trim();
        
        // Validate email
        if (!validateEmail(email)) {
            showErrorMessage('Please enter a valid email address.');
            return;
        }
        
        // Show loading state
        resetButton.disabled = true;
        resetButton.innerHTML = 'Sending...';
        
        // Attempt to send reset email
        sendResetEmail(email)
            .then(() => {
                // Show success message
                showSuccessMessage('Password reset link sent! Please check your email.');
                
                // Clear the form
                emailInput.value = '';
                
                // Reset button after a delay
                setTimeout(() => {
                    resetButton.disabled = false;
                    resetButton.innerHTML = 'Send Reset Link';
                }, 3000);
            })
            .catch(error => {
                // Handle error
                showErrorMessage(error.message || 'Failed to send reset email. Please try again.');
                resetButton.disabled = false;
                resetButton.innerHTML = 'Send Reset Link';
            });
    });
    
    // Validate email function
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    
    // Simulated send reset email function
    // In a real app, this would be an API call to your backend
    const sendResetEmail = (email) => {
        return new Promise((resolve, reject) => {
            // Simulate network delay
            setTimeout(() => {
                try {
                    // Retrieve users from localStorage
                    const users = JSON.parse(localStorage.getItem('workshopAI_users') || '[]');
                    
                    // Check if email exists
                    const userExists = users.some(user => user.email === email);
                    
                    if (userExists) {
                        // In a real app, this would send an actual email
                        console.log(`Password reset requested for email: ${email}`);
                        resolve();
                    } else {
                        // In a real app, for security reasons, you might not want to reveal 
                        // whether an email exists or not. Here we're simulating success even if
                        // the email doesn't exist in our "database".
                        console.log(`Password reset requested for non-existent email: ${email}`);
                        resolve();
                    }
                } catch (error) {
                    reject(new Error('Error processing your request. Please try again.'));
                }
            }, 1500);
        });
    };
    
    // Helper function to show error messages
    const showErrorMessage = (message) => {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'bg-red-500 text-white p-2 rounded-lg mb-4 text-sm';
        errorDiv.textContent = message;
        
        // Insert error message at the top of the form
        resetForm.insertBefore(errorDiv, resetForm.firstChild);
        
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
        resetForm.insertBefore(successDiv, resetForm.firstChild);
    };
});