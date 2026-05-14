import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  CdkDragDrop,
  transferArrayItem,
  moveItemInArray,
  DragDropModule
} from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task';

@Component({
  selector: 'app-kanban',
  imports: [DragDropModule, FormsModule],
  templateUrl: './kanban.html',
  styleUrl: './kanban.css'
})
export class Kanban implements OnInit {
  todo: any[] = [];
  inProgress: any[] = [];
  done: any[] = [];

  title = '';
  description = '';
  priority = 'HIGH';

  loading = false;
  error = '';

  constructor(
    private taskService: TaskService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.loadTasks();
  }

  async loadTasks() {
    try {
      this.loading = true;
      this.error = '';

      const tasks = await this.taskService.getTasks();

      console.log('TASKS FROM BACKEND:', tasks);

      this.todo = tasks.filter((t: any) => !t.status || t.status === 'TODO');
      this.inProgress = tasks.filter((t: any) => t.status === 'IN_PROGRESS');
      this.done = tasks.filter((t: any) => t.status === 'DONE');

    } catch (error) {
      console.error('Failed to load tasks:', error);
      this.error = 'Failed to load tasks. Please login again.';
    } finally {
      this.loading = false;
    }
  }

  async createTask() {
    if (!this.title.trim()) return;

    try {
      this.error = '';

      await this.taskService.createTask({
        title: this.title,
        description: this.description,
        priority: this.priority,
        status: 'TODO'
      });

      this.title = '';
      this.description = '';
      this.priority = 'HIGH';

      await this.loadTasks();

    } catch (error) {
      console.error('Task creation failed:', error);
      this.error = 'Task creation failed. Please check backend/token.';
    }
  }

  async drop(event: CdkDragDrop<any[]>, newStatus: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      return;
    }

    const task = event.previousContainer.data[event.previousIndex];

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );

    task.status = newStatus;

    try {
      await this.taskService.updateTaskStatus(task.id, newStatus);
    } catch (error) {
      console.error('Status update failed:', error);
      this.error = 'Status update failed. Reverting board.';
      await this.loadTasks();
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}