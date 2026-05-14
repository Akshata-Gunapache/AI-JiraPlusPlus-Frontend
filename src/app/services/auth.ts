import { Injectable } from '@angular/core';
import axios from 'axios';
import { API_BASE_URL } from '../config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  async login(email: string, password: string) {
  const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
    email,
    password
  });

  localStorage.setItem('token', response.data.token);
  localStorage.setItem('userEmail', email);

  return response.data;
}

  async register(name: string, email: string, password: string) {
    const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
      name,
      email,
      password,
      role: 'MEMBER'
    });

    return response.data;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }
}