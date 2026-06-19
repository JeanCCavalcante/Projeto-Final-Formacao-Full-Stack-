// services/tasks-state.ts (updated)
import { Injectable, signal, WritableSignal } from '@angular/core';
import { Task } from '../models/tasks';

@Injectable({
  providedIn: 'root',
})
export class TasksStateService {
  private readonly tasksSignal: WritableSignal<Task[]> = signal([]);
  public readonly tasks = this.tasksSignal.asReadonly();

  setTasks(tasks: Task[]): void {
    this.tasksSignal.set(tasks);
  }

  addTask(task: Task): void {
    this.tasksSignal.update((current) => [task, ...current]);
  }

  updateTask(updatedTask: Task): void {
    this.tasksSignal.update((current) =>
      current.map((task) => (task._id === updatedTask._id ? updatedTask : task))
    );
  }

  removeTask(taskId: string): void {
    this.tasksSignal.update((current) => current.filter((task) => task._id !== taskId));
  }

  clearTasks(): void {
    this.tasksSignal.set([]);
  }
}
