import {jwtDecode} from 'jwt-decode';

const setAccessToken = (token) => {
  document.cookie = `access_token=${token}; path=/`;
};

const setRefreshToken = (token) => {
  document.cookie = `refresh_token=${token}; path=/`;
};

const getAccessToken = () => {
  return document.cookie.split('; ').find(row => row.startsWith('access_token'))?.split('=')[1];
};

const getRoleFromToken = () => {
  const token = getAccessToken();
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.role; // Assuming the role is stored in the "role" claim
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  }
  return null;
};

const getRefreshToken = () => {
  return document.cookie.split('; ').find(row => row.startsWith('refresh_token'))?.split('=')[1];
};

const clearToken = () => {
  document.cookie = 'access_token=; Max-Age=0; path=/';
  document.cookie = 'refresh_token=; Max-Age=0; path=/';
};

export { setAccessToken, setRefreshToken, getAccessToken, getRoleFromToken, getRefreshToken, clearToken };