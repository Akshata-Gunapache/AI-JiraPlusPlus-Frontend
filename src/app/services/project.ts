import { Injectable } from '@angular/core';
import axios from 'axios';
import { API_BASE_URL } from '../config';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  getHeaders() {
    return {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    };
  }

  async getProjects() {
    const res = await axios.get(`${API_BASE_URL}/api/projects`, {
      headers: this.getHeaders()
    });
    return res.data;
  }

  async createProject(project: any) {
    const res = await axios.post(`${API_BASE_URL}/api/projects`, project, {
      headers: this.getHeaders()
    });
    return res.data;
  }
}