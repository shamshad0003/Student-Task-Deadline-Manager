# Session Security & Future Improvements

This document outlines the current state of authentication in the **Student Task & Deadline Manager** and provides a roadmap for production-level security enhancements.

## Current Implementation: LocalStorage + JWT

At present, our system uses **JWT (JSON Web Tokens)** stored in the browser's `localStorage`. This is a common and practical approach for portfolio projects, but it has some theoretical limitations.

### Current Features:
- **Client-Side Expiry Checking**: Decodes JWT headers to calculate remaining session time.
- **Auto-Logout**: Automatically redirects to login when the token expires (1-hour TTL).
- **Proactive Validation**: Validates session integrity every time the application loads.
- **Global Error Interceptors**: Automatically clears local data and redirects if the backend responds with a 401 Unauthorized status.

---

## Recommended Next Steps (The "Production" Approach)

To further elevate this project to a enterprise-grade standard, we recommend the following enhancements:

### 1. HttpOnly Cookies
Shift the JWT storage from `localStorage` to **Secure HttpOnly Cookies**.
- **Reason**: `localStorage` is accessible via JavaScript, making it theoretically vulnerable to Cross-Site Scripting (XSS). HttpOnly cookies are invisible to JavaScript, providing a much higher layer of protection.

### 2. Refresh Token Strategy
Currently, users are logged out strictly after 1 hour. A Refresh Token flow allows for a better User Experience:
- **How it works**:
    1. The server issues a short-lived **Access Token** (15 mins) and a long-lived **Refresh Token** (7 days).
    2. When the Access Token expires, the frontend calls a `/refresh` endpoint with the Refresh Token to get a new Access Token.
    3. The user stays logged in across sessions without needing a password, as long as they are active.

### 3. Password Complexity Requirements
Enhance the Joi validation schemas in the backend to require:
- At least one uppercase letter.
- At least one number.
- At least one special character.

---

> [!TIP]
> **Implementing cookies?** Remember to set `samesite: 'strict'` and `secure: true` in your Express cookie configuration to prevent CSRF and ensure transmission over HTTPS only.

> [!NOTE]
> For this portfolio phase, we have chosen the **LocalStorage + Auto-Logout** pattern because it provides the best visibility for recruiters to see your frontend logic (JWT parsing, timers, state management).
