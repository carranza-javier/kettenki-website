// ========================================
// LUMIS KI-Assistent - Professional Chat
// ========================================

// API Configuration
const API_CONFIG = {
    endpoint: 'https://c9e7xbpbba.execute-api.eu-central-1.amazonaws.com/ask',
    timeout: 30000,
    headers: { 'Content-Type': 'application/json' }
};

const MOCK_ENABLED = false;

// Translations
const translations = {
    de: {
        subtitle: 'Dein intelligenter Kaffeebar-Assistent',
        placeholder: 'Frage stellen...',
        example1: 'Frühschicht Aufgaben',
        example2: 'Bärner Mule Rezept',
        example3: 'Spätschicht Abschluss',
        loading: 'Denkt nach...',
        poweredBy: 'Powered by',
        errorEmpty: 'Bitte gib eine Frage ein.',
        errorNetwork: 'Netzwerkfehler. Bitte überprüfe deine Internetverbindung.',
        errorTimeout: 'Die Anfrage hat zu lange gedauert. Bitte versuche es erneut.',
        errorAPI: 'Die API konnte nicht erreicht werden. Bitte versuche es später erneut.'
    },
    en: {
        subtitle: 'Your intelligent coffee bar assistant',
        placeholder: 'Ask a question...',
        example1: 'Morning shift tasks',
        example2: 'Berner Mule recipe',
        example3: 'Evening shift closing',
        loading: 'Thinking...',
        poweredBy: 'Powered by',
        errorEmpty: 'Please enter a question.',
        errorNetwork: 'Network error. Please check your internet connection.',
        errorTimeout: 'The request took too long. Please try again.',
        errorAPI: 'Could not reach the API. Please try again later.'
    }
};

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

let currentLang = 'de';
let isFirstMessage = true;

// DOM Elements
const elements = {
    // Empty State
    emptyState: document.getElementById('empty-state'),
    initialInput: document.getElementById('initial-input'),
    initialSendBtn: document.getElementById('initial-send-btn'),
    
    // Chat State
    chatState: document.getElementById('chat-state'),
    messagesArea: document.getElementById('messages-area'),
    chatInput: document.getElementById('chat-input'),
    chatSendBtn: document.getElementById('chat-send-btn'),
    
    // Common
    langButtons: document.querySelectorAll('.lang-btn'),
    suggestionBtns: document.querySelectorAll('.suggestion-btn')
};

// ========================================
// State Management
// ========================================

function switchToChatState() {
    elements.emptyState.classList.add('hidden');
    elements.chatState.classList.remove('hidden');
    isFirstMessage = false;
    elements.chatInput.focus();
}

function getCurrentInput() {
    return isFirstMessage ? elements.initialInput : elements.chatInput;
}

function getCurrentSendBtn() {
    return isFirstMessage ? elements.initialSendBtn : elements.chatSendBtn;
}

// ========================================
// i18n
// ========================================

function updateTranslations() {
    const t = translations[currentLang];
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) el.textContent = t[key];
    });
    
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key]) el.placeholder = t[key];
    });
    
    elements.suggestionBtns.forEach(btn => {
        const key = btn.querySelector('[data-i18n]')?.getAttribute('data-i18n');
        if (key && exampleQuestions[currentLang][key]) {
            btn.setAttribute('data-question', exampleQuestions[currentLang][key]);
        }
    });
    
    document.documentElement.lang = currentLang;
}

function switchLanguage(lang) {
    if (lang === currentLang) return;
    currentLang = lang;
    
    elements.langButtons.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
    
    updateTranslations();
}

// ========================================
// API
// ========================================

async function askLUMIS(question) {
    if (MOCK_ENABLED && typeof mockAskLUMIS !== 'undefined') {
        console.log('🎭 MOCK MODE');
        return mockAskLUMIS(question);
    }

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
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        return await response.json();
    } catch (error) {
        clearTimeout(timeoutId);
        
        if (error.name === 'AbortError') throw new Error('TIMEOUT');
        if (error.message.includes('fetch')) throw new Error('NETWORK');
        throw error;
    }
}

// ========================================
// Text Formatting (RECOVERED FROM OLD CODE)
// ========================================

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
// Message Rendering
// ========================================

function createMessageElement(type, content) {
    const msg = document.createElement('div');
    msg.className = `message ${type}`;
    
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    
    if (type === 'loading') {
        bubble.innerHTML = `
            <div class="loading-dots">
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
            </div>
            <span class="loading-text">${translations[currentLang].loading}</span>
        `;
    } else if (type === 'error') {
        const textDiv = document.createElement('div');
        textDiv.className = 'message-text';
        textDiv.innerHTML = `⚠️ ${content}`;
        bubble.appendChild(textDiv);
    } else {
        const textDiv = document.createElement('div');
        textDiv.className = 'message-text';
        
        if (type === 'assistant') {
            // ⭐ FIXED: Now using formatAnswer to convert plain text to HTML
            textDiv.innerHTML = formatAnswer(content);
        } else {
            textDiv.textContent = content; // Plain text for user
        }
        
        bubble.appendChild(textDiv);
    }
    
    msg.appendChild(bubble);
    return msg;
}

function addMessage(type, content) {
    const msg = createMessageElement(type, content);
    elements.messagesArea.appendChild(msg);
    scrollToBottom();
    return msg;
}

function removeMessage(msgElement) {
    if (msgElement?.parentNode) {
        msgElement.parentNode.removeChild(msgElement);
    }
}

function scrollToBottom() {
    setTimeout(() => {
        elements.messagesArea.scrollTop = elements.messagesArea.scrollHeight;
    }, 50);
}

// ========================================
// Input Management
// ========================================

function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

function clearInput() {
    const input = getCurrentInput();
    input.value = '';
    autoResize(input);
}

function disableInput() {
    const input = getCurrentInput();
    const btn = getCurrentSendBtn();
    input.disabled = true;
    btn.disabled = true;
}

function enableInput() {
    const input = getCurrentInput();
    const btn = getCurrentSendBtn();
    input.disabled = false;
    btn.disabled = false;
    input.focus();
}

function getErrorMessage(type) {
    const t = translations[currentLang];
    return t[`error${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()}`] || t.errorAPI;
}

// ========================================
// Main Handler
// ========================================

async function handleSend() {
    const input = getCurrentInput();
    const question = input.value.trim();
    
    if (!question) {
        const errorMsg = addMessage('error', getErrorMessage('empty'));
        setTimeout(() => removeMessage(errorMsg), 3000);
        return;
    }
    
    // Switch to chat state on first message
    if (isFirstMessage) {
        switchToChatState();
    }
    
    // Add user message
    addMessage('user', question);
    clearInput();
    disableInput();
    
    // Add loading
    const loadingMsg = addMessage('loading', '');
    
    try {
        const response = await askLUMIS(question);
        
        removeMessage(loadingMsg);
        
        if (!response?.answer) throw new Error('Invalid response');
        
        addMessage('assistant', response.answer);
    } catch (error) {
        console.error('Error:', error);
        
        removeMessage(loadingMsg);
        
        let errorType = 'API';
        if (error.message === 'TIMEOUT') errorType = 'TIMEOUT';
        else if (error.message === 'NETWORK') errorType = 'NETWORK';
        
        addMessage('error', getErrorMessage(errorType));
    } finally {
        enableInput();
    }
}

// ========================================
// Event Listeners
// ========================================

function initEvents() {
    // Initial state
    elements.initialSendBtn.addEventListener('click', handleSend);
    elements.initialInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    });
    elements.initialInput.addEventListener('input', () => autoResize(elements.initialInput));
    
    // Chat state
    elements.chatSendBtn.addEventListener('click', handleSend);
    elements.chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    });
    elements.chatInput.addEventListener('input', () => autoResize(elements.chatInput));
    
    // Suggestions
    elements.suggestionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const question = btn.getAttribute('data-question');
            const input = getCurrentInput();
            input.value = question;
            autoResize(input);
            setTimeout(handleSend, 300);
        });
    });
    
    // Language
    elements.langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            switchLanguage(btn.getAttribute('data-lang'));
        });
    });
}

// ========================================
// Init
// ========================================

function init() {
    console.log('🚀 LUMIS initialized');
    console.log(MOCK_ENABLED ? '🎭 MOCK MODE' : '🌐 PRODUCTION');
    
    updateTranslations();
    initEvents();
    elements.initialInput.focus();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
