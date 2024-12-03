import { jwtDecode } from 'jwt-decode';


const isTokenValid = (token) => {
    if (!token) return false;
  
    try {
      // Try decoding the JWT token
      const decoded = jwtDecode(token);
      // console.log(decoded)
  
      // Check if the token has expired
      const isExpired = decoded.exp < Date.now() / 1000; // Expiry time in seconds
  
      if (isExpired) {
        localStorage.removeItem('token'); // Remove expired token
        return false;  // Token is expired
      }
  
      // If the token is tampered or invalid, jwt_decode will throw an error
      return true; // Token is valid
    } catch (error) {
      console.error("Token validation failed:", error);
      localStorage.removeItem('token'); // Remove any invalid or edited token
      return false;  // Token is invalid (e.g., edited or tampered with)
    }
  };

export default isTokenValid;