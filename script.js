// Toast Notification System
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${getToastIcon(type)}"></i>
        <span>${message}</span>
    `;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function getToastIcon(type) {
    switch(type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        case 'info': return 'fa-info-circle';
        default: return 'fa-info-circle';
    }
}

// Code Formatting
function formatCode() {
    const editor = document.getElementById('editor');
    const code = editor.value;
    try {
        const formatted = formatCodeByLanguage(code, document.getElementById('languageSelect').value);
        editor.value = formatted;
        showToast('Code formatted successfully!', 'success');
    } catch (error) {
        showToast('Error formatting code: ' + error.message, 'error');
    }
}

function formatCodeByLanguage(code, language) {
    // Basic formatting for demonstration
    const lines = code.split('\n');
    let formatted = '';
    let indent = 0;
    
    for (let line of lines) {
        line = line.trim();
        if (line.includes('}')) indent--;
        formatted += '    '.repeat(indent) + line + '\n';
        if (line.includes('{')) indent++;
    }
    
    return formatted;
}

// Auto Save Feature
let autoSaveInterval;
function toggleAutoSave() {
    const isAutoSave = document.getElementById('autoSaveSwitch').checked;
    if (isAutoSave) {
        autoSaveInterval = setInterval(saveCode, 30000); // Save every 30 seconds
        showToast('Auto save enabled', 'success');
    } else {
        clearInterval(autoSaveInterval);
        showToast('Auto save disabled', 'warning');
    }
    localStorage.setItem('autoSave', isAutoSave);
}

// Enhanced Code Running
function runCode() {
    const code = document.getElementById('editor').value;
    const language = document.getElementById('languageSelect').value;
    const outputArea = document.getElementById('output');
    const runButton = document.querySelector('.run-btn');

    outputArea.innerHTML = '';
    outputArea.classList.remove('fade-in');
    void outputArea.offsetWidth;
    outputArea.classList.add('fade-in');

    if (!code.trim()) {
        showToast('No code to run', 'warning');
        return;
    }

    runButton.disabled = true;
    runButton.innerHTML = '<div class="loading"></div> Running...';

    try {
        if (language === 'javascript') {
            const result = eval(code);
            outputArea.innerHTML = result;
            showToast('Code executed successfully!', 'success');
        } else if (language === 'html') {
            const iframe = document.createElement('iframe');
            iframe.srcdoc = code;
            iframe.style.width = "100%";
            iframe.style.height = "500px";
            outputArea.appendChild(iframe);
            showToast('HTML rendered successfully!', 'success');
        } else if (language === 'css') {
            const iframe = document.createElement('iframe');
            iframe.srcdoc = `<style>${code}</style><div class="test">Test CSS Output</div>`;
            iframe.style.width = "100%";
            iframe.style.height = "500px";
            outputArea.appendChild(iframe);
            showToast('CSS applied successfully!', 'success');
        } else {
            outputArea.innerHTML = `Running code is only available for JavaScript, HTML, and CSS at the moment.`;
            showToast('Language not supported for running', 'warning');
        }
    } catch (error) {
        outputArea.innerHTML = `Error: ${error.message}`;
        showToast('Error running code: ' + error.message, 'error');
    } finally {
        setTimeout(() => {
            runButton.disabled = false;
            runButton.innerHTML = '<i class="fas fa-play"></i> Run';
        }, 500);
    }
}

// Code Export
function downloadCode() {
    const code = document.getElementById('editor').value;
    const language = document.getElementById('languageSelect').value;
    let fileExtension = '';

    switch (language) {
        case 'lua': fileExtension = '.lua'; break;
        case 'python': fileExtension = '.py'; break;
        case 'javascript': fileExtension = '.js'; break;
        case 'ruby': fileExtension = '.rb'; break;
        case 'php': fileExtension = '.php'; break;
        case 'java': fileExtension = '.java'; break;
        case 'cpp': fileExtension = '.cpp'; break;
        case 'html': fileExtension = '.html'; break;
        case 'css': fileExtension = '.css'; break;
        case 'bash': fileExtension = '.sh'; break;
        case 'swift': fileExtension = '.swift'; break;
        case 'typescript': fileExtension = '.ts'; break;
        case 'go': fileExtension = '.go'; break;
        case 'kotlin': fileExtension = '.kt'; break;
        default:
            showToast("Unknown language selected", "error");
            return;
    }

    if (code.trim() === "") {
        showToast("Please write some code before exporting", "warning");
        return;
    }

    const blob = new Blob([code], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `code${fileExtension}`;
    link.click();
    showToast('Code exported successfully!', 'success');
}

// Code Management
function clearEditor() {
    if (confirm('Are you sure you want to clear the editor?')) {
        document.getElementById('editor').value = '';
        updateLineCount();
        showToast('Editor cleared', 'info');
    }
}

// Settings Management
function openSettings() {
    const popup = document.getElementById('settingsPopup');
    popup.classList.remove('hide');
    popup.classList.add('show');
}

function closeSettings() {
    const popup = document.getElementById('settingsPopup');
    popup.classList.remove('show');
    popup.classList.add('hide');
    setTimeout(() => {
        popup.classList.remove('hide');
    }, 300);
}

function toggleDarkMode() {
    const isDarkMode = document.getElementById('darkModeSwitch').checked;
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('darkMode', isDarkMode);
}

function changeThemeColor(color) {
    document.documentElement.style.setProperty('--primary-color', color);
    document.documentElement.style.setProperty('--primary-hover', color);
    document.documentElement.style.setProperty('--gradient-start', color);
    document.documentElement.style.setProperty('--gradient-end', color);
    
    document.querySelectorAll('.theme-option').forEach(option => {
        option.classList.remove('active');
    });
    event.target.classList.add('active');
    localStorage.setItem('themeColor', color);
}

function changeFontSize(size) {
    document.getElementById('editor').style.fontSize = `${size}px`;
    localStorage.setItem('fontSize', size);
}

// Utility Functions
function updateLineCount() {
    const editor = document.getElementById('editor');
    const text = editor.value;
    const lines = text.split('\n');
    const currentLine = lines.length;
    const currentColumn = text.length - text.lastIndexOf('\n');
    document.getElementById('lineCount').textContent = `Line: ${currentLine}, Column: ${currentColumn}`;
}

function updateLanguageInfo() {
    const language = document.getElementById('languageSelect').value;
    document.getElementById('languageInfo').textContent = `Language: ${language.charAt(0).toUpperCase() + language.slice(1)}`;
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    updateLineCount();
    updateLanguageInfo();

    // Add event listeners
    const editor = document.getElementById('editor');
    editor.addEventListener('input', updateLineCount);
    document.getElementById('languageSelect').addEventListener('change', updateLanguageInfo);

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'r':
                    e.preventDefault();
                    runCode();
                    break;
            }
        }
    });
}); 