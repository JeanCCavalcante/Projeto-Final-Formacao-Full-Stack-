import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';

import { Subject, takeUntil } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';

import { TaskForm } from '../../components/forms/task-form/task-form';
import { MODAL_OPTIONS } from '../../constants/modal';
import { TaskPriorityEnum, TaskStatusEnum } from '../../enums/select-mapping';
import { Task } from '../../models/tasks';
import { AuthStateService } from '../../services/auth-state';
import { TasksService } from '../../services/tasks';
import { TasksStateService } from '../../services/tasks-state';
import { NotificationService } from '../../services/notification';

@Component({
  selector: 'app-tasks-list',
  standalone: false,
  templateUrl: './tasks-list.html',
  styleUrl: './tasks-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksList implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  private readonly pageIndexSignal = signal(0);
  protected readonly pageSizeSignal = signal(6);

  private readonly authState = inject(AuthStateService);
  private readonly notificationService = inject(NotificationService);
  private readonly tasksService = inject(TasksService);
  private readonly tasksStateService = inject(TasksStateService);

  private readonly dialog = inject(MatDialog);

  protected taskListLength = computed(() => this.tasksStateService.tasks().length);
  protected paginatedTasks = computed(() => {
    const tasks = this.tasksStateService.tasks();
    const start = this.pageIndexSignal() * this.pageSizeSignal();
    return tasks.slice(start, start + this.pageSizeSignal());
  });

  ngOnInit(): void {
    if (this.authState.isLoggedIn()) {
      this.loadTasks();
    }
  }

  loadTasks(): void {
    this.tasksService
      .getTasks()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (tasks) => {
          this.tasksStateService.setTasks(tasks);
        },
        error: (error) => {
          const message = this.notificationService.extractErrorMessage(error);
          this.notificationService.showError('Falha ao carregar tarefas: ' + message);
        },
      });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndexSignal.set(event.pageIndex);
    this.pageSizeSignal.set(event.pageSize);
  }

  openTaskForm(task?: Task): void {
    const dialogRef = this.dialog.open(TaskForm, {
      ...MODAL_OPTIONS,
      data: task || null,
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result) {
          const isEdit = !!task;
          const message = isEdit ? 'Tarefa atualizada com sucesso!' : 'Tarefa criada com sucesso!';
          this.notificationService.showSuccess(message);
          this.loadTasks();
        }
      });
  }

  editTask(task: Task): void {
    this.openTaskForm(task);
  }

  deleteTask(id: string): void {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      this.tasksService
        .deleteTask(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.notificationService.showSuccess('Tarefa excluída com sucesso!');
            this.tasksStateService.removeTask(id);
          },
          error: (error) => {
            const message = this.notificationService.extractErrorMessage(error);
            this.notificationService.showError(message);
          },
        });
    }
  }

  getPriorityLabel(priority: TaskPriorityEnum): string {
    switch (priority) {
      case TaskPriorityEnum.BAIXA:
        return 'Baixa';
      case TaskPriorityEnum.MEDIA:
        return 'Média';
      case TaskPriorityEnum.ALTA:
        return 'Alta';
      default:
        return priority;
    }
  }

  getStatusLabel(status: TaskStatusEnum): string {
    switch (status) {
      case TaskStatusEnum.PENDENTE:
        return 'Pendente';
      case TaskStatusEnum.ANDAMENTO:
        return 'Em andamento';
      case TaskStatusEnum.CONCLUIDA:
        return 'Concluída';
      default:
        return status;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
