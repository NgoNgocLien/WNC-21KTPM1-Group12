export class DebtService extends BaseService {
  async getIncomingDebts() {
    return await this.get('debts/incoming');
  }

  async getOutgoingDebts() {
    return await this.get('debts/outgoing');
  }

  async createDebt(data) {
    return await this.post('debts', data);
  }

  async payDebt(id, data) {
    return await this.post(`debts/pay/${id}`, data);
  }

  async cancelDebt(id) {
    return await this.post(`debts/cancel/${id}`);
  }

  async declineDebt(id) {
    return await this.post(`debts/decline/${id}`);
  }
}