// API Client
const api = {
    async request(endpoint, method = 'GET', data = null) {
        const options = {
            method,
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        };
        if (data) options.body = JSON.stringify(data);
        
        const response = await fetch(`/api${endpoint}`, options);
        return response.json();
    },
    
    async getCurrentUser() {
        return this.request('/auth/me');
    },
    
    async login(email, password) {
        return this.request('/auth/login', 'POST', { email, password });
    },
    
    async signup(name, email, password) {
        return this.request('/auth/signup', 'POST', { name, email, password });
    },
    
    async logout() {
        return this.request('/auth/logout', 'POST');
    }
};

// Session Management
let currentUser = null;

async function checkAuth() {
    try {
        currentUser = await api.getCurrentUser();
        updateAuthUI();
    } catch (error) {
        console.log('Not authenticated');
    }
}

function updateAuthUI() {
    if (currentUser) {
        document.querySelectorAll('.auth-only').forEach(el => el.style.display = '');
        document.querySelectorAll('.guest-only').forEach(el => el.style.display = 'none');
        if (document.getElementById('userName')) {
            document.getElementById('userName').textContent = currentUser.name;
        }
    } else {
        document.querySelectorAll('.auth-only').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.guest-only').forEach(el => el.style.display = '');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', checkAuth);