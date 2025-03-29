const setTokens = (accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
};

const getAccessToken = () => {
    const token = localStorage.getItem("accessToken");
    return token ? `Bearer ${token}` : ""; // Add Bearer prefix
};

const getRefreshToken = () => localStorage.getItem("refreshToken");

const clearTokens = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
};

const isAuthenticated = () => !!localStorage.getItem("accessToken"); // Simplified

export { setTokens, getAccessToken, getRefreshToken, clearTokens, isAuthenticated };