export const API_BASE = import.meta.env.VITE_API_BASE_URL || '';


class API {
    constructor() {
        // Remove trailing slashes and ensure it starts with / only if it's a relative path
        let base = (API_BASE || '').replace(/\/$/, '');
        this.baseURL = base.endsWith('/api') ? base : `${base}/api`;

        console.log('[DEBUG] API Base URL:', this.baseURL);
        this.token = localStorage.getItem('token');
    }



    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }

    getHeaders(includeAuth = true) {
        const headers = {
            'Content-Type': 'application/json',
        };
        if (includeAuth && this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            ...options,
            headers: {
                ...this.getHeaders(options.auth !== false),
                ...options.headers,
            },
        };

        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Request failed');
        }

        return data;
    }

    auth = {
        register: (email, password, username) =>
            this.request('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ email, password, username }),
                auth: false,
            }),

        verifyOTP: (userId, otp) =>
            this.request('/auth/verify-otp', {
                method: 'POST',
                body: JSON.stringify({ userId, otp }),
                auth: false,
            }),

        resendOTP: (userId) =>
            this.request('/auth/resend-otp', {
                method: 'POST',
                body: JSON.stringify({ userId }),
                auth: false,
            }),

        login: (email, password) =>
            this.request('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
                auth: false,
            }),

        me: () => this.request('/auth/me'),
    };

    posts = {
        create: (formData) => {
            const url = `${this.baseURL}/posts`;
            return fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                },
                body: formData,
            }).then(res => res.json());
        },

        getFeed: (page = 1, limit = 20) =>
            this.request(`/posts/feed?page=${page}&limit=${limit}`),

        getUserPosts: (username, page = 1, limit = 12) =>
            this.request(`/posts/user/${username}?page=${page}&limit=${limit}`, { auth: false }),

        like: (postId) =>
            this.request(`/posts/${postId}/like`, { method: 'POST' }),

        comment: (postId, content) =>
            this.request(`/posts/${postId}/comment`, {
                method: 'POST',
                body: JSON.stringify({ content }),
            }),

        getComments: (postId, page = 1, limit = 20) =>
            this.request(`/posts/${postId}/comments?page=${page}&limit=${limit}`, { auth: false }),

        delete: (postId) =>
            this.request(`/posts/${postId}`, { method: 'DELETE' }),
    };

    users = {
        getProfile: (username) =>
            this.request(`/users/${username}`, { auth: false }),

        updateProfile: (data) =>
            this.request('/users/profile', {
                method: 'PUT',
                body: JSON.stringify(data),
            }),

        updateAvatar: (formData) => {
            const url = `${this.baseURL}/users/avatar`;
            return fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                },
                body: formData,
            }).then(res => res.json());
        },

        follow: (userId) =>
            this.request(`/users/${userId}/follow`, { method: 'POST' }),

        unfollow: (userId) =>
            this.request(`/users/${userId}/unfollow`, { method: 'POST' }),

        getFollowers: (userId, page = 1, limit = 20) =>
            this.request(`/users/${userId}/followers?page=${page}&limit=${limit}`, { auth: false }),

        getFollowing: (userId, page = 1, limit = 20) =>
            this.request(`/users/${userId}/following?page=${page}&limit=${limit}`, { auth: false }),

        search: (query, limit = 10) =>
            this.request(`/users/search?q=${encodeURIComponent(query)}&limit=${limit}`, { auth: false }),

    };
}

export const getMediaUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const base = API_BASE.replace(/\/$/, '');
    return `${base}${path}`;
};

export default new API();

