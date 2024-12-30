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

  async makeDeposit(data) {
    try {
      const jsonObject = await BaseService.post('employees/deposit', data);
      return jsonObject;
    } catch (error) {
      console.error('Error creating employee deposit:', error);
      throw error; // Re-throw error để xử lý tại nơi gọi
    }
  },
};

export default EmployeeService;
