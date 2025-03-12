// mainPage.js - to be included in the main page

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in, redirect to login if not
    authService.requireAuth();
    
    // Get user info
    const user = authService.getCurrentUser();
    
    // Set user initial in the avatar
    const userAvatar = document.querySelector('.user-avatar');
    if (userAvatar && user) {
        userAvatar.textContent = user.username.charAt(0).toUpperCase();
    }
    
    // Video URL handling
    const youtubeUrlInput = document.getElementById('youtube-url');
    const addUrlButton = document.getElementById('add-url');
    const urlList = document.querySelector('.url-list');
    const generateButton = document.getElementById('generate-btn');
    
    // Form fields
    const worksheetTypeSelect = document.getElementById('worksheet-type');
    const numQuestionsInput = document.getElementById('num-questions');
    const difficultySelect = document.getElementById('difficulty');
    const formatSelect = document.getElementById('format');
    const additionalInstructionsText = document.getElementById('additional-instructions');
    
    // Preview elements
    const previewContainer = document.querySelector('.preview-container');
    const tabs = document.querySelectorAll('.tab');
    
    // Worksheet data
    let currentVideoUrls = [];
    let currentWorksheet = null;
    
    // Add URL button
    if (addUrlButton) {
        addUrlButton.addEventListener('click', function() {
            const url = youtubeUrlInput.value.trim();
            
            // Basic validation
            if (!url) {
                alert('Please enter a YouTube URL');
                return;
            }
            
            // Basic YouTube URL validation
            if (!url.includes('youtube.com/watch') && !url.includes('youtu.be/')) {
                alert('Please enter a valid YouTube URL');
                return;
            }
            
            // Add to list
            addVideoUrl(url);
            
            // Clear input
            youtubeUrlInput.value = '';
        });
    }
    
    // Generate Worksheet button
    if (generateButton) {
        generateButton.addEventListener('click', function() {
            if (currentVideoUrls.length === 0) {
                alert('Please add at least one YouTube video URL');
                return;
            }
            
            generateWorksheet();
        });
    }
    
    // Tab switching
    if (tabs) {
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs
                tabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Show appropriate content
                const isAnswerKey = this.textContent.includes('Answer Key');
                
                // Update preview content based on selected tab
                updatePreview(isAnswerKey);
            });
        });
    }
    
    // Function to add video URL to the list
    function addVideoUrl(url) {
        // Check if URL already exists
        if (currentVideoUrls.includes(url)) {
            alert('This URL has already been added');
            return;
        }
        
        // Create placeholder for video title (in a real app, you'd fetch the real title)
        const videoTitle = 'Video ' + (currentVideoUrls.length + 1);
        
        // Add to array
        currentVideoUrls.push(url);
        
        // Create list item
        const urlItem = document.createElement('div');
        urlItem.className = 'url-item';
        urlItem.innerHTML = `
            <div>
                <strong>${videoTitle}</strong>
                <div style="color: var(--text-dim);">${url}</div>
            </div>
            <button>Remove</button>
        `;
        
        // Add remove functionality
        const removeButton = urlItem.querySelector('button');
        removeButton.addEventListener('click', function() {
            const index = currentVideoUrls.indexOf(url);
            if (index !== -1) {
                currentVideoUrls.splice(index, 1);
            }
            urlItem.remove();
        });
        
        // Add to DOM
        urlList.appendChild(urlItem);
    }
    
    // Function to generate worksheet
    async function generateWorksheet() {
        try {
            // Show loading state
            generateButton.textContent = 'Generating...';
            generateButton.disabled = true;
            
            // Collect form data
            const worksheetData = {
                title: `Worksheet from ${currentVideoUrls.length} video(s)`,
                description: 'Generated worksheet',
                youtubeUrl: currentVideoUrls[0], // Primary URL
                questionType: worksheetTypeSelect.value,
                numberOfQuestions: parseInt(numQuestionsInput.value),
                difficultyLevel: difficultySelect.value,
                outputFormat: formatSelect.value,
                additionalInstructions: additionalInstructionsText.value,
                // In a real app, you would generate these with AI from the YouTube content
                worksheetContent: generateDummyWorksheet(),
                answerKey: generateDummyAnswerKey()
            };
            
            // Store current worksheet
            currentWorksheet = worksheetData;
            
            // Update preview
            updatePreview(false);
            
            // Reset button state
            generateButton.textContent = 'Generate Worksheet';
            generateButton.disabled = false;
            
            // Note: In a complete implementation, you would create the worksheet through the API:
            // await worksheetService.createWorksheet(worksheetData);
            
        } catch (error) {
            console.error('Error generating worksheet:', error);
            alert('Failed to generate worksheet: ' + (error.message || 'Please try again'));
            
            // Reset button state
            generateButton.textContent = 'Generate Worksheet';
            generateButton.disabled = false;
        }
    }
    
    // Function to update preview
    function updatePreview(showAnswerKey) {
        if (!currentWorksheet) {
            return;
        }
        
        const content = showAnswerKey ? currentWorksheet.answerKey : currentWorksheet.worksheetContent;
        
        previewContainer.innerHTML = `
            <div style="text-align: left; padding: 20px;">
                <h2 style="text-align: center; margin-bottom: 20px;">${currentWorksheet.title}</h2>
                <div style="margin-bottom: 10px;">
                    <strong>Type:</strong> ${currentWorksheet.questionType}
                    <span style="margin-left: 20px;"><strong>Difficulty:</strong> ${currentWorksheet.difficultyLevel}</span>
                </div>
                ${content}
            </div>
        `;
    }
    
    // Function to generate dummy worksheet content (in a real app, this would be AI-generated)
    function generateDummyWorksheet() {
        const questions = [];
        const questionType = worksheetTypeSelect.value;
        const numQuestions = parseInt(numQuestionsInput.value);
        
        for (let i = 1; i <= numQuestions; i++) {
            if (questionType === 'Multiple Choice') {
                questions.push(`
                    <div style="margin-bottom: 15px;">
                        <p><strong>${i}. What is an important concept from the video?</strong></p>
                        <div style="margin-left: 20px;">
                            <div><input type="radio" name="q${i}"> a) First option</div>
                            <div><input type="radio" name="q${i}"> b) Second option</div>
                            <div><input type="radio" name="q${i}"> c) Third option</div>
                            <div><input type="radio" name="q${i}"> d) Fourth option</div>
                        </div>
                    </div>
                `);
            } else if (questionType === 'Fill in the Blanks') {
                questions.push(`
                    <div style="margin-bottom: 15px;">
                        <p><strong>${i}. Complete the following sentence from the video:</strong></p>
                        <p>The main topic of the video is about ______________ and its relationship to ______________.</p>
                    </div>
                `);
            } else if (questionType === 'Short Answer') {
                questions.push(`
                    <div style="margin-bottom: 15px;">
                        <p><strong>${i}. Explain the following concept from the video:</strong></p>
                        <p>________________________________</p>
                        <p>________________________________</p>
                    </div>
                `);
            } else if (questionType === 'True/False') {
                questions.push(`
                    <div style="margin-bottom: 15px;">
                        <p><strong>${i}. Indicate whether the following statement is true or false:</strong></p>
                        <p>The video suggests that [statement related to video content].</p>
                        <div style="margin-left: 20px;">
                            <div><input type="radio" name="q${i}"> True</div>
                            <div><input type="radio" name="q${i}"> False</div>
                        </div>
                    </div>
                `);
            }
        }
        
        return questions.join('');
    }
    
    // Function to generate dummy answer key (in a real app, this would be AI-generated)
    function generateDummyAnswerKey() {
        const answers = [];
        const questionType = worksheetTypeSelect.value;
        const numQuestions = parseInt(numQuestionsInput.value);
        
        for (let i = 1; i <= numQuestions; i++) {
            if (questionType === 'Multiple Choice') {
                answers.push(`
                    <div style="margin-bottom: 15px;">
                        <p><strong>${i}. What is an important concept from the video?</strong></p>
                        <p>Answer: c) Third option</p>
                        <p><em>Explanation: This is the correct option based on the video content.</em></p>
                    </div>
                `);
            } else if (questionType === 'Fill in the Blanks') {
                answers.push(`
                    <div style="margin-bottom: 15px;">
                        <p><strong>${i}. Complete the following sentence from the video:</strong></p>
                        <p>The main topic of the video is about <u>key concept</u> and its relationship to <u>related concept</u>.</p>
                    </div>
                `);
            } else if (questionType === 'Short Answer') {
                answers.push(`
                    <div style="margin-bottom: 15px;">
                        <p><strong>${i}. Explain the following concept from the video:</strong></p>
                        <p><em>Sample answer: The concept refers to [explanation based on video content].</em></p>
                    </div>
                `);
            } else if (questionType === 'True/False') {
                answers.push(`
                    <div style="margin-bottom: 15px;">
                        <p><strong>${i}. Indicate whether the following statement is true or false:</strong></p>
                        <p>The video suggests that [statement related to video content].</p>
                        <p>Answer: True</p>
                        <p><em>Explanation: According to the video at [timestamp], this statement is accurate.</em></p>
                    </div>
                `);
            }
        }
        
        return answers.join('');
    }
    
    // Handle sidebar navigation (existing code from the HTML)
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function() {
            // Update active menu item
            document.querySelectorAll('.menu-item').forEach(menuItem => {
                menuItem.classList.remove('active');
            });
            this.classList.add('active');
            
            // Update page content
            const page = this.getAttribute('data-page');
            if (page) {
                document.querySelectorAll('.content').forEach(content => {
                    content.classList.remove('active');
                });
                document.getElementById(page + '-page')?.classList.add('active');
                
                // Update header title
                const pageTitle = document.querySelector('.page-title');
                if (pageTitle) {
                    pageTitle.textContent = page === 'converter' ? 'Create New Worksheet' : 'My Worksheets';
                }
                
                // If switching to worksheets page, load worksheets
                if (page === 'worksheets') {
                    loadWorksheets();
                }
            }
        });
    });
    
    // Function to load worksheets
    async function loadWorksheets() {
        // In a complete implementation, you would load worksheets from the API
        // const worksheets = await worksheetService.getAllWorksheets();
        
        // For now, we'll use the dummy worksheets already in the HTML
        // This would be replaced with real data in a complete implementation
    }
    
    // Initialize the page
    init();
    
    function init() {
        // Set up logout functionality
        const userInfo = document.querySelector('.user-info');
        if (userInfo) {
            userInfo.addEventListener('click', function() {
                if (confirm('Do you want to log out?')) {
                    authService.logout();
                }
            });
        }
    }
});
