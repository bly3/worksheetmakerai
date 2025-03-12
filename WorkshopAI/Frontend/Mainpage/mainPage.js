// mainPage.js - Handles authentication and user session for main page

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const checkAuth = () => {
        const currentUser = JSON.parse(localStorage.getItem('workshopAI_currentUser') || 'null');
        
        if (!currentUser) {
            // No logged in user, redirect to login page
            window.location.href = '../LoginPage/loginPage.html';
            return null;
        }
        
        return currentUser;
    };
    
    // Get current user or redirect if not logged in
    const currentUser = checkAuth();
    
    // If we have a current user, update the UI
    if (currentUser) {
        // Update user avatar in sidebar
        const userAvatar = document.querySelector('.user-avatar');
        if (userAvatar) {
            userAvatar.textContent = currentUser.username.charAt(0).toUpperCase();
        }
        
        // Update username in sidebar
        const userInfoSpan = document.querySelector('.user-info span');
        if (userInfoSpan) {
            userInfoSpan.textContent = currentUser.username;
        }
        
        // Add logout functionality
        setupLogout();
    }
    
    // Set up logout functionality
    function setupLogout() {
        // Add logout item to sidebar if it doesn't exist
        const sidebarMenu = document.querySelector('.sidebar-menu');
        
        if (sidebarMenu && !document.querySelector('.logout-item')) {
            const logoutItem = document.createElement('div');
            logoutItem.className = 'menu-item logout-item';
            logoutItem.innerHTML = `
                <i class="fas fa-sign-out-alt"></i>
                <span>Logout</span>
            `;
            
            logoutItem.addEventListener('click', () => {
                // Clear current user from local storage
                localStorage.removeItem('workshopAI_currentUser');
                
                // Redirect to login page
                window.location.href = '../LoginPage/loginPage.html';
            });
            
            sidebarMenu.appendChild(logoutItem);
        }
    }
    
    // Handle YouTube URL submission
    const youtubeForm = document.getElementById('youtube-form');
    const youtubeUrlInput = document.getElementById('youtube-url');
    const addUrlButton = document.getElementById('add-url');
    const urlList = document.querySelector('.url-list');
    
    if (youtubeForm && youtubeUrlInput && addUrlButton) {
        // Store added URLs
        const addedUrls = [];
        
        // Add URL button click handler
        addUrlButton.addEventListener('click', () => {
            addYoutubeUrl();
        });
        
        // Also add on Enter key in the input field
        youtubeUrlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addYoutubeUrl();
            }
        });
        
        // Function to add a YouTube URL
        function addYoutubeUrl() {
            const url = youtubeUrlInput.value.trim();
            
            // Basic validation
            if (!url) {
                return;
            }
            
            // Simple YouTube URL validation
            if (!isValidYoutubeUrl(url)) {
                showMessage('Please enter a valid YouTube URL', 'error');
                return;
            }
            
            // Add to the list
            addedUrls.push(url);
            
            // Clear existing items and rebuild the list
            updateUrlList();
            
            // Clear the input
            youtubeUrlInput.value = '';
        }
        
        // Function to update the URL list in the UI
        function updateUrlList() {
            // Clear the list first
            const listContent = urlList.querySelector('h3').outerHTML;
            urlList.innerHTML = listContent;
            
            // Add each URL to the list
            addedUrls.forEach((url, index) => {
                const urlItem = document.createElement('div');
                urlItem.className = 'url-item';
                urlItem.innerHTML = `
                    <div>
                        <strong>Video ${index + 1}</strong>
                        <div style="color: var(--text-dim);">${url}</div>
                    </div>
                    <button data-index="${index}">Remove</button>
                `;
                
                urlList.appendChild(urlItem);
            });
            
            // Add event listeners to remove buttons
            document.querySelectorAll('.url-item button').forEach(button => {
                button.addEventListener('click', () => {
                    const index = parseInt(button.getAttribute('data-index'));
                    addedUrls.splice(index, 1);
                    updateUrlList();
                });
            });
        }
        
        // Function to validate YouTube URL
        function isValidYoutubeUrl(url) {
            const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
            return youtubeRegex.test(url);
        }
    }
    
    // Handle Generate Worksheet button
    const generateBtn = document.getElementById('generate-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            // In a real app, this would send the data to your backend
            // For now, we'll just simulate a generation
            generateBtn.disabled = true;
            generateBtn.textContent = 'Generating...';
            
            // Simulate API call delay
            setTimeout(() => {
                showMessage('Worksheet generated successfully!', 'success');
                generateBtn.disabled = false;
                generateBtn.textContent = 'Generate Worksheet';
                
                // Update preview with mock content
                updatePreview();
            }, 2000);
        });
    }
    
    // Update preview with mock content
    function updatePreview() {
        const previewContainer = document.querySelector('.preview-container');
        if (previewContainer) {
            previewContainer.innerHTML = `
                <div class="p-4">
                    <h3 class="text-xl font-bold mb-4">Sample Worksheet</h3>
                    
                    <div class="mb-6">
                        <p class="font-bold mb-2">1. What is the main concept discussed in the video?</p>
                        <div class="space-y-2">
                            <div class="flex items-center">
                                <input type="radio" id="q1a" name="q1" class="mr-2">
                                <label for="q1a">A) Concept A</label>
                            </div>
                            <div class="flex items-center">
                                <input type="radio" id="q1b" name="q1" class="mr-2">
                                <label for="q1b">B) Concept B</label>
                            </div>
                            <div class="flex items-center">
                                <input type="radio" id="q1c" name="q1" class="mr-2">
                                <label for="q1c">C) Concept C</label>
                            </div>
                            <div class="flex items-center">
                                <input type="radio" id="q1d" name="q1" class="mr-2">
                                <label for="q1d">D) Concept D</label>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mb-6">
                        <p class="font-bold mb-2">2. Fill in the blank: The process described occurs in the ________ stage.</p>
                        <input type="text" class="bg-gray-700 p-2 rounded w-full">
                    </div>
                    
                    <div>
                        <p class="font-bold mb-2">3. Briefly explain the relationship between concept X and concept Y:</p>
                        <textarea class="bg-gray-700 p-2 rounded w-full" rows="3"></textarea>
                    </div>
                </div>
            `;
        }
    }
    
    // Helper function to show messages
    function showMessage(message, type = 'info') {
        const container = document.querySelector('.main-content');
        if (!container) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
            type === 'error' ? 'bg-red-500' : 
            type === 'success' ? 'bg-green-500' : 
            'bg-blue-500'
        } text-white`;
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);
        
        // Remove the message after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
    
    // Handle tab switching in preview
    const tabs = document.querySelectorAll('.tab');
    if (tabs.length) {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                tabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // In a real app, you would switch the content here
                // For now, we'll just show a message
                const tabName = tab.textContent.trim();
                if (tabName === 'Answer Key') {
                    showMessage('Switched to Answer Key view', 'info');
                }
            });
        });
    }
});