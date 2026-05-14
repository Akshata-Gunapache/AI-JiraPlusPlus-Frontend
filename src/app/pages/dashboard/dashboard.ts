import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '../../services/task';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  totalTasks = 0;
  inProgressTasks = 0;
  completedTasks = 0;

  constructor(
    private router: Router,
    private taskService: TaskService
  ) {}

  async ngOnInit() {

    const tasks = await this.taskService.getTasks();

    this.totalTasks = tasks.length;

    this.inProgressTasks = tasks.filter(
      (t: any) => t.status === 'IN_PROGRESS'
    ).length;

    this.completedTasks = tasks.filter(
      (t: any) => t.status === 'DONE'
    ).length;
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}