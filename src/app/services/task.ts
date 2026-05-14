import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TaskService {

  private getStorageKey() {
    const email = localStorage.getItem('userEmail') || 'guest';
    return `tasks_${email}`;
  }

  async getTasks() {
    const tasks = localStorage.getItem(this.getStorageKey());
    return tasks ? JSON.parse(tasks) : [];
  }

  async createTask(task: any) {
  const tasks = await this.getTasks();

  const newTask = {
    id: Date.now(),
    title: task.title,
    description: task.description,
    priority: task.priority,
    status: task.status || 'TODO',
    createdAt: new Date().toLocaleString()
  };

  tasks.push(newTask);
  localStorage.setItem(this.getStorageKey(), JSON.stringify(tasks));

  return newTask;
}

  async updateTaskStatus(id: number, status: string) {
    const tasks = await this.getTasks();

    const updatedTasks = tasks.map((task: any) =>
      task.id === id ? { ...task, status } : task
    );

    localStorage.setItem(this.getStorageKey(), JSON.stringify(updatedTasks));

    return updatedTasks.find((task: any) => task.id === id);
  }

  async deleteTask(id: number) {

  const tasks = await this.getTasks();

  const updatedTasks = tasks.filter(
    (task: any) => task.id !== id
  );

  localStorage.setItem(
    this.getStorageKey(),
    JSON.stringify(updatedTasks)
  );
}
}