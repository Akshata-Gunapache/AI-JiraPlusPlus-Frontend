import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  totalTasks = 0;
  todoTasks = 0;
  inProgressTasks = 0;
  completedTasks = 0;

  constructor(
  private router: Router,
  private taskService: TaskService
) {

  this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(() => {
      this.loadStats();
    });
}

  async ngOnInit() {
  await this.loadStats();
}

async ionViewWillEnter() {
  await this.loadStats();
}

  async loadStats() {
    const tasks = await this.taskService.getTasks();

    this.totalTasks = tasks.length;
    this.todoTasks = tasks.filter((t: any) => !t.status || t.status === 'TODO').length;
    this.inProgressTasks = tasks.filter((t: any) => t.status === 'IN_PROGRESS').length;
    this.completedTasks = tasks.filter((t: any) => t.status === 'DONE').length;
  }

  goToKanban() {
    this.router.navigate(['/kanban']);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    this.router.navigate(['/']);
  }
}