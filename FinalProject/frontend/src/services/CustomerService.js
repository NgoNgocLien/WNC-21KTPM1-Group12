import BaseService from './BaseService';

const CustomerService = {
  async getCustomerInfo() {
    try {
      const jsonObject = await BaseService.get(`customers/profile`);
      return jsonObject;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getInternalRecipientInfo(account_number) {
    try {
      const jsonObject = await BaseService.get( `customers/profile/internal/${account_number}`);
      return jsonObject.data.customers.fullname;
    } catch (error) {
      console.error(error);
      throw error; // Re-throw error để xử lý tại nơi gọi
    }
  },

  async getExternalRecipientInfo(bank_id, account_number) {
    try {
      const jsonObject = await BaseService.get( `customers/profile/external/${bank_id}/${account_number}`);
      return jsonObject.data.customers.fullname;
    } catch (error) {
      console.error(error);
      throw error; // Re-throw error để xử lý tại nơi gọi
    }
  },

  async getCustomerContacts() {
    try {
      const jsonObject = await BaseService.get(`customers/contacts`);
      return jsonObject;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  
  async createOneContact(data) {
    try {
      const jsonObject = await BaseService.post(`customers/contacts`, data);
      return jsonObject;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async updateOneContact(data) {
    try {
      const jsonObject = await BaseService.patch(`customers/contacts`, data);
      return jsonObject;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async deleteOneContact(data) {
    try {
      const jsonObject = await BaseService.delete(`customers/contacts`, data);
      return jsonObject;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getCustomers() {
    try {
      const jsonObject = await BaseService.get(`customers`);
      return jsonObject;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
};

export default CustomerService;
