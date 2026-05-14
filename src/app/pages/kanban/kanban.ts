import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  transferArrayItem,
  moveItemInArray,
  DragDropModule
} from '@angular/cdk/drag-drop';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
  dueDate = '';

  filterPriority = 'ALL';

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

    this.loading = true;

    try {

      const tasks = await this.taskService.getTasks();

      let filteredTasks = tasks;

      if (this.filterPriority !== 'ALL') {

        filteredTasks = tasks.filter(
          (t: any) => t.priority === this.filterPriority
        );
      }

      this.todo = filteredTasks.filter(
        (t: any) => !t.status || t.status === 'TODO'
      );

      this.inProgress = filteredTasks.filter(
        (t: any) => t.status === 'IN_PROGRESS'
      );

      this.done = filteredTasks.filter(
        (t: any) => t.status === 'DONE'
      );

      this.error = '';

    } catch (err) {

      console.error(err);
      this.error = 'Failed to load tasks';

    } finally {

      this.loading = false;
    }
  }

  async createTask() {

    if (!this.title.trim()) return;

    try {

      await this.taskService.createTask({
        title: this.title,
        description: this.description,
        priority: this.getAiSuggestion(),
        status: 'TODO',
        dueDate: this.dueDate
      });

      this.title = '';
      this.description = '';
      this.dueDate = '';

      await this.loadTasks();

    } catch (error) {

      console.error(error);
      alert('Task creation failed');
    }
  }

  async deleteTask(id: number) {

    await this.taskService.deleteTask(id);

    await this.loadTasks();
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

    await this.taskService.updateTaskStatus(
      task.id,
      newStatus
    );

    task.status = newStatus;

    await this.loadTasks();
  }

  hasTaskInput() {

    return (
      this.title.trim().length > 0 ||
      this.description.trim().length > 0
    );
  }

  getAiSuggestion() {

    const text =
      (this.title + ' ' + this.description).toLowerCase();

    if (
      text.includes('security') ||
      text.includes('jwt') ||
      text.includes('authentication') ||
      text.includes('production') ||
      text.includes('critical') ||
      text.includes('urgent')
    ) {
      return 'HIGH';
    }

    if (
      text.includes('bug') ||
      text.includes('fix') ||
      text.includes('api') ||
      text.includes('integration')
    ) {
      return 'MEDIUM';
    }

    return 'LOW';
  }

  getAiReason() {

    const priority = this.getAiSuggestion();

    if (priority === 'HIGH') {
      return 'Critical security or production workflow detected';
    }

    if (priority === 'MEDIUM') {
      return 'Moderate engineering impact predicted';
    }

    return 'Low urgency task predicted';
  }

  logout() {

    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');

    this.router.navigate(['/']);
  }
}