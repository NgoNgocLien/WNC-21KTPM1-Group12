import BaseService from './BaseService';


const getIncomingDebts = async () => {
  return BaseService.get('debts/incoming');
}

const getOutgoingDebts = async () => {
  return BaseService.get('debts/outgoing');
}

const createDebt = async (data) => {
  return BaseService.post('debts', data);
}

const payDebt = async (id, data) => {
  return BaseService.post(`debts/pay/${id}`, data);
}

const cancelDebt = async (id, data) => {
  return BaseService.post(`debts/cancel/${id}`, data);
}

const declineDebt = async (id, data) => {
  return BaseService.post(`debts/decline/${id}`, data);
}

export {
  getIncomingDebts,
  getOutgoingDebts,
  createDebt,
  payDebt,
  cancelDebt,
  declineDebt
}