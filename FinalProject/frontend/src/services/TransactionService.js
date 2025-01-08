import BaseService from './BaseService';

const TransactionService = {
    async getAccountTransactions() {
        try {
        const jsonObject = await BaseService.get(`transactions/account`);
        return jsonObject;
        } catch (error) {
        console.error(error);
        throw error;
        }
    },

    async getBankName(id_bank) {
        try {
        const jsonObject = await BaseService.get( `transactions/bank/${id_bank}`);
        return jsonObject;
        } catch (error) {
        console.error(error);
        throw error; 
        }
    },

    async getCustomerTransactions(account_number) {
        try {
        const jsonObject = await BaseService.get(`transactions/account/${account_number}`);
        return jsonObject;
        } catch (error) {
        console.error(error);
        throw error;
        }
    },

    async getExternalTransactions() {
        try {
        const jsonObject = await BaseService.get(`transactions/external`);
        return jsonObject;
        } catch (error) {
        console.error(error);
        throw error;
        }
    },

    async createInternalTransactions(data){
        try {
            const jsonObject = await BaseService.post(`transactions/internal`, data);
            return jsonObject;
        } catch (error) {
            console.error(error);
        throw error;
        }
    },

    async createExternalTransactions(data){
        try {
            const jsonObject = await BaseService.post(`transactions/external/send`, data);
            return jsonObject;
        } catch (error) {
            console.error(error);
        throw error;
        }
    }
};

export default TransactionService;
