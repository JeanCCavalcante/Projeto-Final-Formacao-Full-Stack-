import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Subject, takeUntil } from 'rxjs';

import { TaskPriorityOptions, TaskStatusOptions } from '../../../constants/select-options';
import { Task, TaskCreate, TaskUpdate } from '../../../models/tasks';
import { AuthStateService } from '../../../services/auth-state';
import { TasksService } from '../../../services/tasks';
import { NotificationService } from '../../../services/notification';

@Component({
  selector: 'app-task-form',
  standalone: false,
  templateUrl: './task-form.html',
  styleUrl: './task-form.css',
})
export class TaskForm implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  private readonly authStateService = inject(AuthStateService);
  private readonly notificationService = inject(NotificationService);
  private readonly tasksService = inject(TasksService);

  public dialogRef = inject(MatDialogRef<TaskForm>);
  public taskData: Task | null = inject(MAT_DIALOG_DATA);

  private readonly formBuilder = inject(FormBuilder);
  protected taskForm: FormGroup = this.formBuilder.group({});

  protected priorityOptions = TaskPriorityOptions;
  protected statusOptions = TaskStatusOptions;

  protected isEdit = false;

  ngOnInit(): void {
    this.isEdit = !!this.taskData;
    this.buildForm();
    if (this.isEdit && this.taskData) {
      this.patchForm();
    }
  }

  private buildForm(): void {
    this.taskForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      priority: [null, Validators.required],
      status: [null],
      mentorResponsible: ['', [Validators.required, Validators.maxLength(100)]],
      startDate: [''],
      completionDate: [''],
      feedback: ['', Validators.maxLength(500)],
    });
  }

  private patchForm(): void {
    if (!this.taskData) return;

    const startDate = this.taskData.startDate
      ? new Date(this.taskData.startDate).toISOString().split('T')[0]
      : '';
    const completionDate = this.taskData.completionDate
      ? new Date(this.taskData.completionDate).toISOString().split('T')[0]
      : '';

    this.taskForm.patchValue({
      title: this.taskData.title,
      description: this.taskData.description,
      priority: this.taskData.priority,
      status: this.taskData.status,
      mentorResponsible: this.taskData.mentorResponsible,
      startDate: startDate,
      completionDate: completionDate,
      feedback: this.taskData.feedback,
    });
  }

  getTitleErrorMessage(): string {
    const control = this.taskForm.get('title');
    if (control?.hasError('required')) return 'Título é obrigatório';
    if (control?.hasError('maxlength')) return 'Máximo de 100 caracteres';
    return '';
  }

  getDescriptionErrorMessage(): string {
    const control = this.taskForm.get('description');
    if (control?.hasError('required')) return 'Descrição é obrigatória';
    if (control?.hasError('maxlength')) return 'Máximo de 500 caracteres';
    return '';
  }

  getPriorityErrorMessage(): string {
    const control = this.taskForm.get('priority');
    return control?.hasError('required') ? 'Prioridade é obrigatória' : '';
  }

  getMentorResponsibleErrorMessage(): string {
    const control = this.taskForm.get('mentorResponsible');
    if (control?.hasError('required')) return 'Mentor responsável é obrigatório';
    if (control?.hasError('maxlength')) return 'Máximo de 100 caracteres';
    return '';
  }

  getFeedbackErrorMessage(): string {
    const control = this.taskForm.get('feedback');
    return control?.hasError('maxlength') ? 'Máximo de 500 caracteres' : '';
  }

  getDateErrorMessage(): string {
    const startControl = this.taskForm.get('startDate');
    const start = startControl?.value;
    const end = this.taskForm.get('completionDate')?.value;
    if (startControl?.hasError('required')) return 'Data de início é obrigatório';
    if (start && end && new Date(end) < new Date(start)) {
      return 'Data de conclusão não pode ser anterior à data de início';
    }
    return '';
  }

  onSubmit(): void {
    if (this.taskForm.invalid) return;

    if (this.getDateErrorMessage()) {
      console.error('Data inválida');
      return;
    }

    const formValue = this.taskForm.value;

    if (this.isEdit && this.taskData) {
      const updatePayload: TaskUpdate = {};
      const original = this.taskData;

      (Object.keys(formValue) as Array<keyof TaskUpdate>).forEach((key) => {
        const newValue = formValue[key];
        const oldValue = original[key as keyof Task];
        if (newValue !== oldValue && newValue !== undefined && newValue !== '') {
          (updatePayload as any)[key] = newValue;
        }
      });

      if (Object.keys(updatePayload).length === 0) {
        this.dialogRef.close();
        return;
      }

      this.tasksService
        .updateTask(this.taskData._id, updatePayload)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updated) => this.dialogRef.close(updated),
          error: (error) => {
            const message = this.notificationService.extractErrorMessage(error);
            this.notificationService.showError('Erro ao atualizar tarefa: ' + message);
          },
        });
    } else {
      const currentUser = this.authStateService.loggedUser();
      if (!currentUser?._id) {
        this.notificationService.showError('Usuário não autenticado.');
        return;
      }

      const newTask: TaskCreate = {
        title: formValue.title,
        description: formValue.description,
        priority: formValue.priority,
        status: formValue.status,
        mentorResponsible: formValue.mentorResponsible,
        startDate: formValue.startDate || undefined,
        completionDate: formValue.completionDate || undefined,
        feedback: formValue.feedback || undefined,
        userId: currentUser._id,
      };

      this.tasksService
        .createTask(newTask)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (created) => this.dialogRef.close(created),
          error: (error) => {
            const message = this.notificationService.extractErrorMessage(error);
            this.notificationService.showError('Erro ao criar tarefa: ' + message);
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
