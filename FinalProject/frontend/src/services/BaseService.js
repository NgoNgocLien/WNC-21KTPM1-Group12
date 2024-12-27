import { BASE_URL } from "../util/config";
import { getAccessToken } from "../util/cookie";

export default class BaseService {

  static async get(url) {
    const accessToken = getAccessToken();
    const response = await fetch(`${BASE_URL}/${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    } else {
      return await response.json();
    }
  }

  static async post(url, data) {
    const accessToken = getAccessToken();
    const response = await fetch(`${BASE_URL}/${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error('Failed to post data');
    } else {
      return await response.json();
    }
  }

  static async put(url, data) {
    const accessToken = getAccessToken();
    const response = await fetch(`${BASE_URL}/${url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAccessToken()}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error('Failed to put data');
    } else {
      return await response.json();
    }
  }

  static async patch(url, data) {
    const accessToken = getAccessToken();
    const response = await fetch(`${BASE_URL}/${url}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error('Failed to patch data');
    } else {
      return await response.json();
    }
  }

  static async delete(url) {
    const accessToken = getAccessToken();
    const response = await fetch(`${BASE_URL}/${url}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to delete data');
    } else {
      return await response.json();
    }
  }
}