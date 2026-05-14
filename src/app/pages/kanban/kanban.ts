import { Component, OnInit } from '@angular/core';
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
  projectId = 1;

  constructor(private taskService: TaskService) {}

  async ngOnInit() {
    await this.loadTasks();
  }

  async loadTasks() {
    const tasks = await this.taskService.getTasks();

    this.todo = tasks.filter((t: any) => t.status === 'TODO');
    this.inProgress = tasks.filter((t: any) => t.status === 'IN_PROGRESS');
    this.done = tasks.filter((t: any) => t.status === 'DONE');
  }

  async createTask() {
    await this.taskService.createTask({
      title: this.title,
      description: this.description,
      priority: this.priority,
      status: 'TODO',
      project: { id: this.projectId }
    });

    this.title = '';
    this.description = '';

    await this.loadTasks();
  }

  async drop(event: CdkDragDrop<any[]>, newStatus: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      return;
    }

    const task = event.previousContainer.data[event.previousIndex];

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );

    await this.taskService.updateTaskStatus(task.id, newStatus);
    await this.loadTasks();
  }
}