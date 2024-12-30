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
    }
};

export default TransactionService;
