// forgotPassword.js - to be included in the forgot password page

document.addEventListener('DOMContentLoaded', function() {
    // Get the form elements
    const emailInput = document.querySelector('input[type="email"]');
    const resetButton = document.querySelector('button');
    
    // Add event listener to reset button
    resetButton.addEventListener('click', async function(e) {
        e.preventDefault();
        
        // Get email value
        const email = emailInput.value.trim();
        
        // Validate email
        if (!email) {
            alert('Please enter your email address');
            return;
        }
        
        // Validate email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        try {
            // Show loading state
            resetButton.textContent = 'Sending...';
            resetButton.disabled = true;
            
            // Call password reset API
            const response = await authService.requestPasswordReset(email);
            
            // Display success message
            alert(response.message || 'Reset link sent! Please check your email.');
            
            // Reset form
            emailInput.value = '';
            
            // Reset button state
            resetButton.textContent = 'Send Reset Link';
            resetButton.disabled = false;
            
        } catch (error) {
            // Display error message
            alert('Failed to send reset link: ' + (error.message || 'Please try again'));
            
            // Reset button state
            resetButton.textContent = 'Send Reset Link';
            resetButton.disabled = false;
        }
    });
});
