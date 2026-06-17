// services/tasks.ts (updated)
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AUTH_API } from '../constants/auth';
import { Task, TaskCreate, TaskUpdate } from '../models/tasks';
import { MappingService } from './mapping';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private readonly http = inject(HttpClient);
  private readonly mappingService = inject(MappingService);

  getTasks(): Observable<Task[]> {
    return this.http
      .get<any[]>(`${AUTH_API}/tasks`)
      .pipe(map((backendTasks) => backendTasks.map((task) => this.mappingService.toTask(task))));
  }

  getTaskById(id: string): Observable<Task> {
    return this.http
      .get<any>(`${AUTH_API}/tasks/${id}`)
      .pipe(map((backendTask) => this.mappingService.toTask(backendTask)));
  }

  createTask(task: TaskCreate): Observable<Task> {
    const backendPayload = this.mappingService.toBackendTask(task);
    return this.http
      .post<any>(`${AUTH_API}/tasks`, backendPayload)
      .pipe(map((createdTask) => this.mappingService.toTask(createdTask)));
  }

  updateTask(id: string, updates: TaskUpdate): Observable<Task> {
    const backendPayload = this.mappingService.toBackendTask(updates);
    return this.http
      .put<any>(`${AUTH_API}/tasks/${id}`, backendPayload)
      .pipe(map((updatedTask) => this.mappingService.toTask(updatedTask)));
  }

  deleteTask(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${AUTH_API}/tasks/${id}`);
  }
}
