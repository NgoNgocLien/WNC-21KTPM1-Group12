import BaseService from './BaseService';

const EmployeeService = {
  async getEmployeeInfo() {
    try {
      const jsonObject = await BaseService.get('employees/profile');
      return jsonObject;
    } catch (error) {
      console.error('Error fetching employee profile:', error);
      throw error; // Re-throw error để xử lý tại nơi gọi
    }
  },
};

export default EmployeeService;
