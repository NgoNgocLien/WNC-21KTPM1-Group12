import BaseService from './BaseService';

const DebtService = {
  async getIncomingDebts() {
    try {
      const jsonObject = await BaseService.get('debts/incoming');
      return jsonObject;
    } catch (error) {
      console.error('Error fetching incoming debts:', error);
      throw error; // Re-throw error để xử lý tại nơi gọi
    }
  },

  async getOutgoingDebts() {
    try {
      const jsonObject = await BaseService.get('debts/outgoing');
      return jsonObject;
    } catch (error) {
      console.error('Error fetching outgoing debts:', error);
      throw error;
    }
  },

  async createDebt(data) {
    try {
      const jsonObject = await BaseService.post('debts', data);
      return jsonObject;
    } catch (error) {
      console.error('Error creating debt:', error);
      throw error;
    }
  },

  async payDebt(id, data) {
    try {
      const jsonObject = await BaseService.post(`debts/pay/${id}`, data);
      return jsonObject;
    } catch (error) {
      console.error(`Error paying debt with ID ${id}:`, error);
      throw error;
    }
  },

  async cancelDebt(id, data) {
    try {
      const jsonObject = await BaseService.post(`debts/cancel/${id}`, data);
      return jsonObject;
    } catch (error) {
      console.error(`Error canceling debt with ID ${id}:`, error);
      throw error;
    }
  },

  async declineDebt(id, data) {
    try {
      const jsonObject = await BaseService.post(`debts/decline/${id}`, data);
      return jsonObject;
    } catch (error) {
      console.error(`Error declining debt with ID ${id}:`, error);
      throw error;
    }
  },
};

export default DebtService;
