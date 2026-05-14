import { Component } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  DragDropModule
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-kanban',
  imports: [DragDropModule],
  templateUrl: './kanban.html',
  styleUrl: './kanban.css'
})
export class Kanban {

  todo = [
    'JWT Authentication',
    'Spring Security',
    'Angular Login UI'
  ];

  inProgress = [
    'WebSocket Integration',
    'Kanban Sync'
  ];

  done = [
    'GCP Deployment'
  ];

  drop(event: CdkDragDrop<string[]>) {

    if (event.previousContainer === event.container) {

      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

    } else {

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}