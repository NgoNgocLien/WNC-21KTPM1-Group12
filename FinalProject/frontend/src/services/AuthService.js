import BaseService from './BaseService';

const AuthService = {
  async logout() {
    try {
      const jsonObject = await BaseService.post(`auth/logout`);
      return jsonObject;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
};

export default AuthService;