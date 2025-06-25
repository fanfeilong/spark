// AI Interface Module
class SparkAIInterface {
    constructor() {
        this.currentSection = 'create';
        this.isGenerating = false;
        this.demoManager = null;
        this.chatHistory = [];
        
        this.init();
    }
    
    init() {
        this.setupNavigation();
        this.setupChatInterface();
        this.setupViewportControls();
        this.setupModals();
        this.loadExistingDemoManager();
        this.restoreChatHistory();
        this.checkPendingDemo();
    }
    
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = link.getAttribute('href').substring(1);
                this.navigateToSection(sectionId);
            });
        });
    }
    
    navigateToSection(sectionId) {
        // Hide all sections
        const sections = document.querySelectorAll('main > section');
        sections.forEach(section => {
            section.classList.add('hidden');
        });
        
        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.remove('hidden');
        }
        
        // Update nav state
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
        
        this.currentSection = sectionId;
    }
    
    setupChatInterface() {
        const promptInput = document.getElementById('promptInput');
        const sendBtn = document.getElementById('sendBtn');
        const suggestionChips = document.querySelectorAll('.suggestion-chip');
        
        if (!promptInput || !sendBtn) {
            console.log('⚠️ Chat interface elements not found, skipping setup');
            return;
        }
        
        // Send button click
        sendBtn.addEventListener('click', () => {
            this.handleUserMessage();
        });
        
        // Enter key to send (Ctrl+Enter for new line)
        promptInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.ctrlKey && !e.shiftKey) {
                e.preventDefault();
                this.handleUserMessage();
            }
        });
        
        // Suggestion chips (initial ones)
        suggestionChips.forEach(chip => {
            chip.addEventListener('click', (e) => {
                console.log('🎯 Initial suggestion chip clicked');
                e.preventDefault();
                e.stopPropagation();
                
                const prompt = chip.getAttribute('data-prompt');
                console.log(`📝 Setting prompt: ${prompt}`);
                promptInput.value = prompt;
                this.handleUserMessage();
            });
        });
        
        // Action buttons
        const voiceBtn = document.getElementById('voiceBtn');
        const imageBtn = document.getElementById('imageBtn');
        const magicBtn = document.getElementById('magicBtn');
        
        if (voiceBtn) voiceBtn.addEventListener('click', () => this.handleVoiceInput());
        if (imageBtn) imageBtn.addEventListener('click', () => this.handleImageUpload());
        if (magicBtn) magicBtn.addEventListener('click', () => this.showAISuggestions());
    }
    
    setupViewportControls() {
        const resetViewBtn = document.getElementById('resetViewBtn');
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        const shareBtn = document.getElementById('shareBtn');
        const downloadBtn = document.getElementById('downloadBtn');
        
        const regenerateBtn = document.getElementById('regenerateBtn');
        const variantBtn = document.getElementById('variantBtn');
        const enhanceBtn = document.getElementById('enhanceBtn');
        
        resetViewBtn.addEventListener('click', () => this.resetView());
        fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        shareBtn.addEventListener('click', () => this.shareCreation());
        downloadBtn.addEventListener('click', () => this.downloadCreation());
        
        regenerateBtn.addEventListener('click', () => this.regenerateCreation());
        variantBtn.addEventListener('click', () => this.createVariant());
        enhanceBtn.addEventListener('click', () => this.enhanceCreation());
    }
    
    setupModals() {
        const helpBtn = document.getElementById('helpBtn');
        const loginBtn = document.getElementById('loginBtn');
        const helpModal = document.getElementById('helpModal');
        
        helpBtn.addEventListener('click', () => {
            this.showModal(helpModal);
        });
        
        loginBtn.addEventListener('click', () => {
            this.showLoginPrompt();
        });
        
        // Close modal handlers
        const modalCloses = document.querySelectorAll('.modal-close');
        modalCloses.forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                this.hideModal(modal);
            });
        });
        
        // Click outside to close
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideModal(e.target);
            }
        });
    }
    
    loadExistingDemoManager() {
        // Wait for demo manager to be available
        const checkDemoManager = () => {
            if (window.sparkDemoApp) {
                this.demoManager = window.sparkDemoApp;
                console.log('✅ AI Interface connected to demo manager');
            } else {
                setTimeout(checkDemoManager, 100);
            }
        };
        checkDemoManager();
    }
    
    async handleUserMessage() {
        const promptInput = document.getElementById('promptInput');
        const message = promptInput.value.trim();
        
        if (!message) return;
        
        // Add user message to chat
        this.addMessageToChat(message, 'user');
        
        // Clear input
        promptInput.value = '';
        
        // Show loading state
        this.setViewportState('loading');
        this.setGeneratingStatus(true);
        
        // Process the message (currently simulate with existing demos)
        await this.processUserMessage(message);
    }
    
    async processUserMessage(message) {
        console.log(`🔍 Processing user message: "${message}"`);
        const chatMessages = document.getElementById('chatMessages');
        
        // Simulate AI processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Try to match message to existing demos
        const demoMatch = this.matchMessageToDemo(message);
        console.log('🎯 Demo match result:', demoMatch);
        
        if (demoMatch) {
            // Show matching demo
            this.addMessageToChat(`I found a perfect match! Let me show you ${demoMatch.title}.`, 'ai');
            await this.loadDemoWithRefresh(demoMatch.demo);
        } else {
            // Show fallback response
            this.addMessageToChat(
                `I understand you want to create "${message}". While I'm still learning to generate 3D content from scratch, let me show you some examples that might inspire you!`,
                'ai'
            );
            
            // Show suggestion for closest demo
            const suggestions = this.getSuggestions(message);
            this.addMessageToChat('', 'ai', suggestions);
        }
        
        this.setGeneratingStatus(false);
    }
    
    matchMessageToDemo(message) {
        const lowerMessage = message.toLowerCase();
        
        const demoMap = {
            'butterfly': { demo: 'basic-butterfly', title: 'a beautiful butterfly' },
            'robot': { demo: 'multiple-splats', title: 'robot characters' },
            'cat': { demo: 'color-editing', title: 'an interactive cat' },
            'color': { demo: 'color-editing', title: 'color editing demo' },
            'fire': { demo: 'animation', title: 'a fireplace scene' },
            'landscape': { demo: 'shader-graph', title: 'a mystical landscape' },
            'valley': { demo: 'shader-graph', title: 'a valley scene' },
            'food': { demo: 'food-gallery', title: 'food gallery' },
            'gallery': { demo: 'food-gallery', title: 'a content gallery' }
        };
        
        for (const [keyword, demo] of Object.entries(demoMap)) {
            if (lowerMessage.includes(keyword)) {
                return demo;
            }
        }
        
        return null;
    }
    
    getSuggestions(message) {
        return [
            { text: '🦋 Try "Show me a butterfly"', prompt: 'Show me a beautiful butterfly' },
            { text: '🤖 Or "Create a robot"', prompt: 'Create a futuristic robot character' },
            { text: '🎨 Maybe "Color editing demo"', prompt: 'Show me color editing capabilities' }
        ];
    }
    
    async loadDemo(demoId) {
        const canvas = document.getElementById('threeCanvas');
        const welcomeState = document.getElementById('welcomeState');
        const loadingState = document.getElementById('loadingState');
        
        if (!canvas || !welcomeState || !loadingState) {
            console.error('❌ Required viewport elements not found');
            return;
        }
        
        try {
            // Update status
            this.updateGenerationInfo(demoId);
            
            // Load demo using existing demo manager
            if (this.demoManager) {
                console.log(`🎬 Loading demo ${demoId} in AI interface`);
                
                // Use the existing demo manager but avoid page refresh
                const success = await this.demoManager.loadDemoById(demoId, canvas);
                
                if (success) {
                    // Hide welcome and loading states
                    welcomeState.classList.add('hidden');
                    loadingState.classList.add('hidden');
                    
                    // Show canvas
                    canvas.classList.remove('hidden');
                    
                    this.setViewportState('canvas');
                    console.log(`✅ Successfully loaded ${demoId} in AI interface`);
                } else {
                    throw new Error('Demo loading failed');
                }
            } else {
                throw new Error('Demo manager not available');
            }
        } catch (error) {
            console.error('❌ Failed to load demo:', error);
            
            // Show error state
            this.addMessageToChat('Sorry, I encountered an error loading that demo. Let me try showing you the examples instead.', 'ai');
            
            // Fallback to examples section
            this.navigateToSection('examples');
        }
    }

    // Load demo with page refresh strategy (preserves chat history)
    async loadDemoWithRefresh(demoId) {
        console.log(`🔄 Loading demo ${demoId} with refresh strategy`);
        
        // First try direct loading
        try {
            const canvas = document.getElementById('threeCanvas');
            if (this.demoManager && canvas) {
                // Check if this is the first demo load
                const hasLoadedBefore = sessionStorage.getItem('sparkAI_hasLoadedDemo');
                
                if (!hasLoadedBefore) {
                    // First load - try direct loading
                    console.log('🎯 First demo load, trying direct method');
                    sessionStorage.setItem('sparkAI_hasLoadedDemo', 'true');
                    await this.loadDemo(demoId);
                    return;
                } else {
                    // Subsequent load - use refresh strategy
                    console.log('🔄 Subsequent demo load, using refresh strategy');
                    
                    // Save the demo to load after refresh
                    sessionStorage.setItem('sparkAI_pendingDemo', demoId);
                    
                    // Add a loading message
                    this.addMessageToChat('Loading your 3D creation... This will just take a moment!', 'ai');
                    
                    // Refresh the page after a short delay
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                    return;
                }
            }
        } catch (error) {
            console.error('❌ Direct demo loading failed, using refresh strategy:', error);
        }
        
        // Fallback to refresh strategy
        sessionStorage.setItem('sparkAI_pendingDemo', demoId);
        this.addMessageToChat('Preparing your 3D creation... Refreshing for optimal performance!', 'ai');
        
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    }
    
    addMessageToChat(message, type = 'ai', suggestions = null) {
        const chatMessages = document.getElementById('chatMessages');
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'avatar';
        avatar.textContent = type === 'ai' ? '🤖' : '👤';
        
        const content = document.createElement('div');
        content.className = 'content';
        
        const messageP = document.createElement('p');
        messageP.textContent = message;
        content.appendChild(messageP);
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        
        chatMessages.appendChild(messageDiv);
        
        // Save to chat history
        const historyItem = {
            message,
            type,
            timestamp: Date.now(),
            suggestions: suggestions
        };
        this.chatHistory.push(historyItem);
        this.saveChatHistory();
        
        // Add suggestions if provided
        if (suggestions && suggestions.length > 0) {
            this.addSuggestionsToChat(suggestions);
        }
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    addSuggestionsToChat(suggestions) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) {
            console.error('❌ Chat messages container not found');
            return;
        }
        
        const lastMessage = chatMessages.lastElementChild;
        if (!lastMessage) {
            console.error('❌ No last message found to add suggestions to');
            return;
        }
        
        const content = lastMessage.querySelector('.content');
        if (!content) {
            console.error('❌ No content area found in last message');
            return;
        }
        
        const suggestionsDiv = document.createElement('div');
        suggestionsDiv.className = 'suggestions';
        
        suggestions.forEach(suggestion => {
            const chip = document.createElement('span');
            chip.className = 'suggestion-chip';
            chip.textContent = suggestion.text;
            chip.setAttribute('data-prompt', suggestion.prompt);
            
                            chip.addEventListener('click', (e) => {
                    console.log(`🔄 Suggestion clicked: ${suggestion.prompt}`);
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const promptInput = document.getElementById('promptInput');
                    if (promptInput) {
                        promptInput.value = suggestion.prompt;
                        this.handleUserMessage();
                    } else {
                        console.error('❌ Prompt input not found');
                    }
                });
            
            suggestionsDiv.appendChild(chip);
        });
        
        content.appendChild(suggestionsDiv);
        console.log(`✅ Added ${suggestions.length} suggestions to chat`);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    setViewportState(state) {
        const welcomeState = document.getElementById('welcomeState');
        const loadingState = document.getElementById('loadingState');
        const canvas = document.getElementById('threeCanvas');
        
        // Hide all states
        welcomeState.classList.add('hidden');
        loadingState.classList.add('hidden');
        canvas.classList.add('hidden');
        
        // Show target state
        switch (state) {
            case 'welcome':
                welcomeState.classList.remove('hidden');
                break;
            case 'loading':
                loadingState.classList.remove('hidden');
                this.animateLoadingSteps();
                break;
            case 'canvas':
                canvas.classList.remove('hidden');
                break;
        }
    }
    
    animateLoadingSteps() {
        const steps = document.querySelectorAll('.step');
        steps.forEach(step => step.classList.remove('active'));
        
        // Animate steps sequentially
        setTimeout(() => steps[0]?.classList.add('active'), 0);
        setTimeout(() => {
            steps[0]?.classList.remove('active');
            steps[1]?.classList.add('active');
        }, 1000);
        setTimeout(() => {
            steps[1]?.classList.remove('active');
            steps[2]?.classList.add('active');
        }, 2000);
    }
    
    setGeneratingStatus(isGenerating) {
        const statusIndicator = document.getElementById('statusIndicator');
        const sendBtn = document.getElementById('sendBtn');
        
        this.isGenerating = isGenerating;
        
        if (isGenerating) {
            statusIndicator.textContent = 'Generating...';
            statusIndicator.className = 'status-indicator generating';
            sendBtn.disabled = true;
        } else {
            statusIndicator.textContent = 'Ready';
            statusIndicator.className = 'status-indicator';
            sendBtn.disabled = false;
        }
    }
    
    updateGenerationInfo(demoId) {
        const currentModel = document.getElementById('currentModel');
        const renderTime = document.getElementById('renderTime');
        
        // Simulate model info based on demo
        const modelMap = {
            'basic-butterfly': 'Butterfly.spz',
            'multiple-splats': 'RobotHead.spz',
            'color-editing': 'Cat.ply',
            'animation': 'Forge.splat',
            'shader-graph': 'Valley.ksplat',
            'food-gallery': 'Food.spz'
        };
        
        currentModel.textContent = modelMap[demoId] || 'Unknown';
        renderTime.textContent = `${(Math.random() * 2 + 0.5).toFixed(1)}s`;
    }
    
    // Viewport control handlers
    resetView() {
        if (this.demoManager && this.demoManager.currentDemo) {
            this.demoManager.currentDemo.resetCamera();
        }
    }
    
    toggleFullscreen() {
        const viewportContainer = document.getElementById('viewportContainer');
        if (!document.fullscreenElement) {
            viewportContainer.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
    
    shareCreation() {
        if (navigator.share) {
            navigator.share({
                title: 'Spark AI Studio Creation',
                text: 'Check out this 3D creation made with Spark AI Studio!',
                url: window.location.href
            });
        } else {
            // Fallback: copy URL to clipboard
            navigator.clipboard.writeText(window.location.href);
            this.showToast('URL copied to clipboard!');
        }
    }
    
    downloadCreation() {
        this.showToast('Download feature coming soon!');
    }
    
    regenerateCreation() {
        const lastMessage = this.getLastUserMessage();
        if (lastMessage) {
            this.addMessageToChat('Let me create a new variation for you...', 'ai');
            this.processUserMessage(lastMessage);
        }
    }
    
    createVariant() {
        this.addMessageToChat('Creating a variant with different lighting and angles...', 'ai');
        // Simulate variant creation
        setTimeout(() => {
            this.setGeneratingStatus(false);
        }, 1500);
    }
    
    enhanceCreation() {
        this.addMessageToChat('Enhancing the current creation with better quality...', 'ai');
        // Simulate enhancement
        setTimeout(() => {
            this.setGeneratingStatus(false);
        }, 2000);
    }
    
    // Voice input handler
    handleVoiceInput() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                const promptInput = document.getElementById('promptInput');
                promptInput.value = transcript;
            };
            
            recognition.start();
        } else {
            this.showToast('Voice input not supported in this browser');
        }
    }
    
    // Image upload handler
    handleImageUpload() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                this.addMessageToChat(`I received your image "${file.name}". Image-to-3D generation is coming soon!`, 'ai');
            }
        };
        
        input.click();
    }
    
    // AI suggestions handler
    showAISuggestions() {
        const suggestions = [
            'Create a majestic dragon with golden scales',
            'Show me a cozy cottage in a forest',
            'Generate a futuristic spaceship',
            'Make a beautiful flower garden',
            'Create an underwater coral reef scene'
        ];
        
        const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
        const promptInput = document.getElementById('promptInput');
        promptInput.value = randomSuggestion;
    }
    
    // Utility methods
    getLastUserMessage() {
        const userMessages = document.querySelectorAll('.user-message .content p');
        return userMessages.length > 0 ? userMessages[userMessages.length - 1].textContent : null;
    }
    
    showModal(modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    hideModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    showLoginPrompt() {
        this.showToast('Login feature coming soon!');
    }
    
    showToast(message) {
        // Simple toast notification
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #333;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // Save chat history to sessionStorage
    saveChatHistory() {
        try {
            sessionStorage.setItem('sparkAI_chatHistory', JSON.stringify(this.chatHistory));
        } catch (error) {
            console.warn('Failed to save chat history:', error);
        }
    }

    // Restore chat history from sessionStorage
    restoreChatHistory() {
        try {
            const saved = sessionStorage.getItem('sparkAI_chatHistory');
            if (saved) {
                this.chatHistory = JSON.parse(saved);
                console.log(`📚 Restored ${this.chatHistory.length} chat messages`);
                
                // Re-render chat messages
                const chatMessages = document.getElementById('chatMessages');
                if (chatMessages) {
                    // Clear existing messages
                    chatMessages.innerHTML = '';
                    
                    // Re-add all messages
                    this.chatHistory.forEach(item => {
                        this.renderChatMessage(item);
                    });
                    
                    // Scroll to bottom
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }
            }
        } catch (error) {
            console.warn('Failed to restore chat history:', error);
            this.chatHistory = [];
        }
    }

    // Render a single chat message (for restoration)
    renderChatMessage(historyItem) {
        const chatMessages = document.getElementById('chatMessages');
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${historyItem.type}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'avatar';
        avatar.textContent = historyItem.type === 'ai' ? '🤖' : '👤';
        
        const content = document.createElement('div');
        content.className = 'content';
        
        const messageP = document.createElement('p');
        messageP.textContent = historyItem.message;
        content.appendChild(messageP);
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        
        chatMessages.appendChild(messageDiv);
        
        // Add suggestions if they exist
        if (historyItem.suggestions && historyItem.suggestions.length > 0) {
            const suggestionsDiv = document.createElement('div');
            suggestionsDiv.className = 'suggestions';
            
            historyItem.suggestions.forEach(suggestion => {
                const chip = document.createElement('span');
                chip.className = 'suggestion-chip';
                chip.textContent = suggestion.text;
                chip.setAttribute('data-prompt', suggestion.prompt);
                
                chip.addEventListener('click', (e) => {
                    console.log(`🔄 Restored suggestion clicked: ${suggestion.prompt}`);
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const promptInput = document.getElementById('promptInput');
                    if (promptInput) {
                        promptInput.value = suggestion.prompt;
                        this.handleUserMessage();
                    }
                });
                
                suggestionsDiv.appendChild(chip);
            });
            
            content.appendChild(suggestionsDiv);
        }
    }

    // Check for pending demo load after page refresh
    checkPendingDemo() {
        const pendingDemo = sessionStorage.getItem('sparkAI_pendingDemo');
        if (pendingDemo) {
            console.log(`🔄 Found pending demo after refresh: ${pendingDemo}`);
            
            // Clear the pending demo
            sessionStorage.removeItem('sparkAI_pendingDemo');
            
            // Wait a moment for everything to initialize, then load the demo
            setTimeout(async () => {
                try {
                    // Switch to create section
                    this.navigateToSection('create');
                    
                    // Show loading state
                    this.setViewportState('loading');
                    
                    // Load the demo
                    const canvas = document.getElementById('threeCanvas');
                    if (canvas && this.demoManager) {
                        console.log(`🎬 Loading pending demo: ${pendingDemo}`);
                        const success = await this.demoManager.loadDemoById(pendingDemo, canvas);
                        
                        if (success) {
                            this.setViewportState('canvas');
                            this.updateGenerationInfo(pendingDemo);
                            console.log(`✅ Successfully loaded pending demo: ${pendingDemo}`);
                            
                            // Add a restoration message to chat
                            this.addMessageToChat(`✨ Demo restored after refresh! Now showing: ${this.getDemoTitle(pendingDemo)}`, 'ai');
                        } else {
                            throw new Error('Failed to load pending demo');
                        }
                    }
                } catch (error) {
                    console.error('❌ Failed to load pending demo:', error);
                    this.setViewportState('welcome');
                    this.addMessageToChat('Sorry, I had trouble restoring the demo after refresh. Please try again!', 'ai');
                }
            }, 1000);
        }
    }

    // Get demo title by ID
    getDemoTitle(demoId) {
        const titleMap = {
            'basic-butterfly': 'Beautiful Butterfly',
            'multiple-splats': 'Robot Characters',
            'color-editing': 'Interactive Cat',
            'animation': 'Fireplace Scene',
            'shader-graph': 'Mystical Valley',
            'food-gallery': 'Food Gallery',
            'multi-view': 'Multi-view Scene'
        };
        return titleMap[demoId] || demoId;
    }

    // Clear chat history
    clearChatHistory() {
        this.chatHistory = [];
        sessionStorage.removeItem('sparkAI_chatHistory');
        
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            chatMessages.innerHTML = '';
        }
        
        console.log('🧹 Chat history cleared');
    }
}

// Add test functions for debugging chat history
window.testChatHistory = function() {
    if (window.sparkAI) {
        console.log('📚 Current chat history:', window.sparkAI.chatHistory);
        console.log('💾 SessionStorage chat:', sessionStorage.getItem('sparkAI_chatHistory'));
        console.log('🎯 Pending demo:', sessionStorage.getItem('sparkAI_pendingDemo'));
        console.log('📊 Has loaded demo before:', sessionStorage.getItem('sparkAI_hasLoadedDemo'));
    } else {
        console.error('❌ Spark AI not initialized');
    }
};

window.clearAISession = function() {
    sessionStorage.removeItem('sparkAI_chatHistory');
    sessionStorage.removeItem('sparkAI_pendingDemo');
    sessionStorage.removeItem('sparkAI_hasLoadedDemo');
    console.log('🧹 AI session data cleared');
};

// Add test function for debugging
window.testAIDemo = async function(demoId) {
    console.log(`🧪 Testing demo load: ${demoId}`);
    if (window.sparkAI && window.sparkAI.demoManager) {
        const canvas = document.getElementById('threeCanvas');
        if (canvas) {
            console.log('🎯 Found canvas, attempting load...');
            const result = await window.sparkAI.demoManager.loadDemoById(demoId, canvas);
            console.log('📊 Result:', result);
            
            if (result) {
                // Manually set viewport state
                window.sparkAI.setViewportState('canvas');
                console.log('✅ Demo should be visible now');
            }
        } else {
            console.error('❌ Canvas not found');
        }
    } else {
        console.error('❌ AI interface or demo manager not available');
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if we're on a page with the AI interface
    if (document.getElementById('promptInput')) {
        window.sparkAI = new SparkAIInterface();
        console.log('🤖 Spark AI Interface initialized');
        console.log('💡 Test demo loading with: testAIDemo("basic-butterfly")');
    }
});

// Add slideIn animation to document
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style); 