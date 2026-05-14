import { Injectable } from '@angular/core';
import axios from 'axios';
import { API_BASE_URL } from '../config';

@Injectable({ providedIn: 'root' })
export class TaskService {
  getHeaders() {
    return {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    };
  }

  async getTasks() {
    const res = await axios.get(`${API_BASE_URL}/api/tasks`, {
      headers: this.getHeaders()
    });
    return res.data;
  }

  async createTask(task: any) {
    const res = await axios.post(`${API_BASE_URL}/api/tasks`, task, {
      headers: this.getHeaders()
    });
    return res.data;
  }

  async updateTaskStatus(id: number, status: string) {
    const res = await axios.put(
      `${API_BASE_URL}/api/tasks/${id}/status?status=${status}`,
      {},
      { headers: this.getHeaders() }
    );
    return res.data;
  }
}