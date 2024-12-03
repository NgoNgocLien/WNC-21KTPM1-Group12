export const apiClient = async (url, options = {}) => {
    const token = localStorage.getItem("token");
  
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  
    const response = await fetch(url, { ...options, headers });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "API Error");
    }
  
    return response.json();
};