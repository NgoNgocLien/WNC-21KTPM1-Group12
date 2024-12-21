import { BASE_URL } from "./config";

const getFullname = async (access_token, account_number, bank_id) => {
    try {
      let response = null;
      if (bank_id === 1) {
        response = await fetch(`${BASE_URL}/transactions/recipient_profile/${account_number}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
          },
        });
      }

      if (!response.ok) {
        throw new Error('Failed to fetch fullname');
      }
      const result = await response.json();
      return result.data.customers.fullname;
    } catch (error) {
      console.error('Error fetching fullname:', error);
      return '';
    }
  };

export default getFullname;