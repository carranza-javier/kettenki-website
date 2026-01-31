// ========================================
// LUMIS KI-Assistent - JavaScript
// Handles API calls, UI updates, and i18n
// ========================================

// API Configuration
const API_CONFIG = {
    endpoint: 'https://c9e7xbpbba.execute-api.eu-central-1.amazonaws.com/ask',
    timeout: 10000, // 10 seconds
    headers: {
        'Content-Type': 'application/json'
    }
};

// Translations
const translations = {
    de: {
        subtitle: 'Dein intelligenter Kaffeebar-Assistent',
        inputLabel: 'Stelle deine Frage',
        placeholder: 'z.B. Wie bereite ich einen Bärner Mule zu?',
        examplesLabel: 'Beispiele:',
        example1: 'Frühschicht Aufgaben',
        example2: 'Bärner Mule Rezept',
        example3: 'Spätschicht Abschluss',
        askButton: 'Frage stellen',
        loading: 'Claude denkt nach...',
        answerTitle: 'Antwort',
        yourQuestion: 'Deine Frage:',
        newQuestion: 'Neue Frage stellen',
        retry: 'Erneut versuchen',
        poweredBy: 'Powered by',
        errorEmpty: 'Bitte gib eine Frage ein.',
        errorNetwork: 'Netzwerkfehler. Bitte überprüfe deine Internetverbindung.',
        errorTimeout: 'Die Anfrage hat zu lange gedauert. Bitte versuche es erneut.',
        errorGeneric: 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.',
        errorAPI: 'Die API konnte nicht erreicht werden. Bitte versuche es später erneut.'
    },
    en: {
        subtitle: 'Your intelligent coffee bar assistant',
        inputLabel: 'Ask your question',
        placeholder: 'e.g. How do I prepare a Berner Mule?',
        examplesLabel: 'Examples:',
        example1: 'Morning shift tasks',
        example2: 'Berner Mule recipe',
        example3: 'Evening shift closing',
        askButton: 'Ask question',
        loading: 'Claude is thinking...',
        answerTitle: 'Answer',
        yourQuestion: 'Your question:',
        newQuestion: 'Ask new question',
        retry: 'Try again',
        poweredBy: 'Powered by',
        errorEmpty: 'Please enter a question.',
        errorNetwork: 'Network error. Please check your internet connection.',
        errorTimeout: 'The request took too long. Please try again.',
        errorGeneric: 'An error occurred. Please try again later.',
        errorAPI: 'Could not reach the API. Please try again later.'
    }
};

// Example questions for each language
const exampleQuestions = {
    de: {
        example1: 'Welche Aufgaben muss ich während der Frühschicht erledigen?',
        example2: 'Wie bereite ich einen Bärner Mule zu?',
        example3: 'Was muss ich am Ende der Spätschicht machen?'
    },
    en: {
        example1: 'What tasks do I need to complete during the morning shift?',
        example2: 'How do I prepare a Berner Mule?',
        example3: 'What do I need to do at the end of the evening shift?'
    }
};

// Current language state
let currentLang = 'de';

// DOM Elements
const elements = {
    questionInput: document.getElementById('question-input'),
    askButton: document.getElementById('ask-button'),
    loading: document.getElementById('loading'),
    answerSection: document.getElementById('answer-section'),
    questionDisplay: document.getElementById('question-display'),
    answerDisplay: document.getElementById('answer-display'),
    errorMessage: document.getElementById('error-message'),
    errorText: document.getElementById('error-text'),
    retryButton: document.getElementById('retry-button'),
    newQuestionBtn: document.getElementById('new-question-btn'),
    langButtons: document.querySelectorAll('.lang-btn'),
    exampleChips: document.querySelectorAll('.example-chip')
};

// ========================================
// Internationalization (i18n)
// ========================================

/**
 * Updates all translatable text elements
 */
function updateTranslations() {
    const t = translations[currentLang];
    
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (t[key]) {
            element.textContent = t[key];
        }
    });
    
    // Update placeholder
    const placeholderKey = elements.questionInput.getAttribute('data-i18n-placeholder');
    if (placeholderKey && t[placeholderKey]) {
        elements.questionInput.placeholder = t[placeholderKey];
    }
    
    // Update example chip questions
    elements.exampleChips.forEach(chip => {
        const exampleKey = chip.getAttribute('data-i18n');
        if (exampleKey && exampleQuestions[currentLang][exampleKey]) {
            chip.setAttribute('data-question', exampleQuestions[currentLang][exampleKey]);
        }
    });
    
    // Update HTML lang attribute
    document.documentElement.lang = currentLang;
}

/**
 * Switches the current language
 */
function switchLanguage(lang) {
    if (lang === currentLang) return;
    
    currentLang = lang;
    
    // Update active button
    elements.langButtons.forEach(btn => {
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    updateTranslations();
}

// ========================================
// API Communication
// ========================================

/**
 * Calls the LUMIS AI API with a question
 * @param {string} question - The user's question
 * @returns {Promise<Object>} - API response
 */
async function askLUMIS(question) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
    
    try {
        const response = await fetch(API_CONFIG.endpoint, {
            method: 'POST',
            headers: API_CONFIG.headers,
            body: JSON.stringify({ question }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
        
    } catch (error) {
        clearTimeout(timeoutId);
        
        if (error.name === 'AbortError') {
            throw new Error('TIMEOUT');
        } else if (error.message.includes('Failed to fetch')) {
            throw new Error('NETWORK');
        } else {
            throw error;
        }
    }
}

/**
 * Formats the answer text with proper line breaks and lists
 * @param {string} text - Raw answer text
 * @returns {string} - Formatted HTML
 */
function formatAnswer(text) {
    if (!text) return '';
    
    // Split by double newlines to get paragraphs/sections
    let sections = text.split('\n\n');
    let html = '';
    
    sections.forEach(section => {
        section = section.trim();
        if (!section) return;
        
        // Check if this is a numbered list section
        const lines = section.split('\n');
        const isNumberedList = lines.every(line => {
            const trimmed = line.trim();
            return !trimmed || /^\d+\.|^-/.test(trimmed);
        });
        
        if (isNumberedList && lines.length > 1) {
            // Convert to ordered list
            html += '<ol>';
            lines.forEach(line => {
                line = line.trim();
                if (line) {
                    // Remove leading number/dash
                    line = line.replace(/^\d+\.\s*/, '').replace(/^-\s*/, '');
                    html += `<li>${escapeHtml(line)}</li>`;
                }
            });
            html += '</ol>';
        } else if (section.includes('\n')) {
            // Multiple lines but not a list - could be a header + items
            const firstLine = lines[0];
            const isHeader = firstLine.endsWith(':') || /^[A-ZÄÖÜ].*:$/.test(firstLine);
            
            if (isHeader && lines.length > 1) {
                html += `<p><strong>${escapeHtml(firstLine)}</strong></p>`;
                html += '<ul>';
                lines.slice(1).forEach(line => {
                    line = line.trim();
                    if (line) {
                        line = line.replace(/^\d+\.\s*/, '').replace(/^-\s*/, '');
                        html += `<li>${escapeHtml(line)}</li>`;
                    }
                });
                html += '</ul>';
            } else {
                // Just paragraphs with line breaks
                lines.forEach(line => {
                    line = line.trim();
                    if (line) {
                        html += `<p>${escapeHtml(line)}</p>`;
                    }
                });
            }
        } else {
            // Single paragraph
            html += `<p>${escapeHtml(section)}</p>`;
        }
    });
    
    return html;
}

/**
 * Escapes HTML special characters
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========================================
// UI State Management
// ========================================

/**
 * Shows the loading state
 */
function showLoading() {
    elements.loading.classList.remove('hidden');
    elements.answerSection.classList.add('hidden');
    elements.errorMessage.classList.add('hidden');
    elements.askButton.disabled = true;
}

/**
 * Hides the loading state
 */
function hideLoading() {
    elements.loading.classList.add('hidden');
    elements.askButton.disabled = false;
}

/**
 * Displays the answer
 * @param {string} question - The original question
 * @param {string} answer - The API response
 */
function showAnswer(question, answer) {
    hideLoading();
    
    elements.questionDisplay.textContent = question;
    elements.answerDisplay.innerHTML = formatAnswer(answer);
    
    elements.answerSection.classList.remove('hidden');
    elements.errorMessage.classList.add('hidden');
    
    // Scroll to answer
    setTimeout(() => {
        elements.answerSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }, 100);
}

/**
 * Displays an error message
 * @param {string} errorType - Type of error (EMPTY, NETWORK, TIMEOUT, etc.)
 */
function showError(errorType) {
    hideLoading();
    
    const t = translations[currentLang];
    let errorMsg = t.errorGeneric;
    
    switch (errorType) {
        case 'EMPTY':
            errorMsg = t.errorEmpty;
            break;
        case 'NETWORK':
            errorMsg = t.errorNetwork;
            break;
        case 'TIMEOUT':
            errorMsg = t.errorTimeout;
            break;
        case 'API':
            errorMsg = t.errorAPI;
            break;
    }
    
    elements.errorText.textContent = errorMsg;
    elements.errorMessage.classList.remove('hidden');
    elements.answerSection.classList.add('hidden');
}

/**
 * Resets the form to initial state
 */
function resetForm() {
    elements.questionInput.value = '';
    elements.answerSection.classList.add('hidden');
    elements.errorMessage.classList.add('hidden');
    elements.questionInput.focus();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========================================
// Main Question Handler
// ========================================

/**
 * Handles the question submission
 */
async function handleAsk() {
    const question = elements.questionInput.value.trim();
    
    // Validation
    if (!question) {
        showError('EMPTY');
        return;
    }
    
    // Show loading
    showLoading();
    
    try {
        // Call API
        const response = await askLUMIS(question);
        
        // Validate response
        if (!response || !response.answer) {
            throw new Error('Invalid API response');
        }
        
        // Display answer
        showAnswer(response.question || question, response.answer);
        
    } catch (error) {
        console.error('Error asking LUMIS:', error);
        
        // Determine error type
        if (error.message === 'TIMEOUT') {
            showError('TIMEOUT');
        } else if (error.message === 'NETWORK') {
            showError('NETWORK');
        } else {
            showError('API');
        }
    }
}

// ========================================
// Event Listeners
// ========================================

/**
 * Initialize all event listeners
 */
function initEventListeners() {
    // Ask button
    elements.askButton.addEventListener('click', handleAsk);
    
    // Enter key in textarea
    elements.questionInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAsk();
        }
    });
    
    // Example chips
    elements.exampleChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const question = chip.getAttribute('data-question');
            elements.questionInput.value = question;
            elements.questionInput.focus();
            
            // Auto-submit after a short delay
            setTimeout(() => {
                handleAsk();
            }, 300);
        });
    });
    
    // New question button
    elements.newQuestionBtn.addEventListener('click', resetForm);
    
    // Retry button
    elements.retryButton.addEventListener('click', handleAsk);
    
    // Language switcher
    elements.langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            switchLanguage(lang);
        });
    });
}

// ========================================
// Initialization
// ========================================

/**
 * Initialize the application
 */
function init() {
    console.log('🚀 LUMIS KI-Assistent initialized');
    
    // Set initial language
    updateTranslations();
    
    // Setup event listeners
    initEventListeners();
    
    // Focus on input
    elements.questionInput.focus();
    
    // Log configuration
    console.log('API Endpoint:', API_CONFIG.endpoint);
    console.log('Current Language:', currentLang);
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ========================================
// Service Worker Registration (Optional)
// Uncomment if you want offline support
// ========================================

/*
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.log('Service Worker registration failed'));
    });
}
*/
