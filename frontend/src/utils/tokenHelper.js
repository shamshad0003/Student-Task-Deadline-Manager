/**
 * Decodes a JWT and returns the payload object.
 * @param {string} token 
 * @returns {object|null}
 */
export const parseJwt = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            window.atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
};

/**
 * Checks if a token is expired.
 * @param {string} token 
 * @returns {boolean}
 */
export const isTokenExpired = (token) => {
    const payload = parseJwt(token);
    if (!payload || !payload.exp) return true;
    
    // JWT exp is in seconds, Date.now() is in milliseconds
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
};

/**
 * Gets the remaining time in milliseconds until the token expires.
 * @param {string} token 
 * @returns {number}
 */
export const getTokenRemainingTime = (token) => {
    const payload = parseJwt(token);
    if (!payload || !payload.exp) return 0;

    const currentTime = Date.now();
    const expiryTime = payload.exp * 1000;
    return Math.max(0, expiryTime - currentTime);
};
