const setAccessToken = (token) => {
  document.cookie = `access_token=${token}; path=/`;
};

const setRefreshToken = (token) => {
  document.cookie = `refresh_token=${token}; path=/`;
};

const getAccessToken = () => {
  return document.cookie.split('; ').find(row => row.startsWith('access_token'))?.split('=')[1];
};

const getRefreshToken = () => {
  return document.cookie.split('; ').find(row => row.startsWith('refresh_token'))?.split('=')[1];
};

export { setAccessToken, setRefreshToken, getAccessToken, getRefreshToken };