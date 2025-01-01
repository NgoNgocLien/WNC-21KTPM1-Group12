import BaseService from './BaseService';

const AdminService = {
  async getAdminInfo() {
    try {
      const jsonObject = await BaseService.get('admins/profile');
      return jsonObject;
    } catch (error) {
      console.error('Error fetching Admin profile:', error);
      throw error;
    }
  },
};

export default AdminService;
