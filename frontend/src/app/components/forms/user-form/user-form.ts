import { Component, inject, input, OnInit, output } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

import { RoleOptions, DepartmentOptions, AreaOptions } from '../../../constants/select-options';
import { UserFormType, UserProfileUpdate } from '../../../models/users';

@Component({
  selector: 'app-user-form',
  standalone: false,
  templateUrl: './user-form.html',
  styleUrl: './user-form.css',
})
export class UserForm implements OnInit {
  readonly initialData = input<Partial<UserProfileUpdate>>({});
  readonly isLoginForm = input<boolean>(false);
  readonly submitButtonLabel = input<string>('');
  readonly showPasswordField = input<boolean>(true);
  readonly showConfirmPasswordField = input<boolean>(false);
  readonly fullWidthButton = input<boolean>(true);

  readonly formMode = input<'login' | 'register' | 'profile'>('login');
  readonly formSubmit = output<UserFormType>();

  private readonly formBuilder = inject(FormBuilder);
  protected userForm: FormGroup = this.formBuilder.group({});

  protected roleOptions = RoleOptions;
  protected departmentOptions = DepartmentOptions;
  protected areaOptions = AreaOptions;

  ngOnInit(): void {
    this.buildForm();
    this.patchForm();
  }

  private buildForm(): void {
    const formConfig: any = {
      email: ['', [Validators.required, Validators.email]],
    };

    if (!this.isLoginForm()) {
      formConfig.name = ['', [Validators.required, Validators.maxLength(50)]];
      formConfig.role = [null, Validators.required];
      formConfig.department = [null, Validators.required];
      formConfig.area = [null, Validators.required];
      formConfig.companyYears = [0, [Validators.required, Validators.min(0), Validators.max(50)]];
      formConfig.acessibilityFormation = [false, Validators.required];
    }

    if (this.showPasswordField()) {
      formConfig.password = ['', [Validators.required, Validators.minLength(8)]];

      if (this.showConfirmPasswordField()) {
        formConfig.confirmPassword = ['', [Validators.required, this.validateSamePassword]];
      }
    }

    this.userForm = this.formBuilder.group(formConfig);
  }

  private patchForm(): void {
    const data = this.initialData();
    if (!data) return;

    const patchData: Partial<UserProfileUpdate> = {};
    if (data.name !== undefined) patchData.name = data.name;
    if (data.email !== undefined) patchData.email = data.email;
    if (data.role !== undefined) patchData.role = data.role;
    if (data.department !== undefined) patchData.department = data.department;
    if (data.area !== undefined) patchData.area = data.area;
    if (data.companyYears !== undefined) patchData.companyYears = data.companyYears;
    if (data.acessibilityFormation !== undefined)
      patchData.acessibilityFormation = data.acessibilityFormation;

    this.userForm.patchValue(patchData);
  }

  private validateSamePassword(control: AbstractControl): ValidationErrors | null {
    const password = control.parent?.get('password');
    const confirmPassword = control.parent?.get('confirmPassword');
    return password?.value == confirmPassword?.value ? null : { notSame: true };
  }

  getNameErrorMessage(): string {
    const control = this.userForm.get('name');
    if (control?.hasError('required')) return 'Nome completo é obrigatório';
    if (control?.hasError('maxlength')) return 'Máximo de 50 caracteres';
    return '';
  }

  getEmailErrorMessage(): string {
    const control = this.userForm.get('email');
    if (control?.hasError('required')) return 'E-mail é obrigatório';
    if (control?.hasError('email')) return 'Digite um e-mail válido';
    return '';
  }

  getPasswordErrorMessage(): string {
    if (!this.showPasswordField()) return '';
    const control = this.userForm.get('password');
    if (control?.hasError('required')) return 'Senha é obrigatória';
    if (control?.hasError('minlength')) return 'Mínimo de 8 caracteres';
    return '';
  }

  getConfirmPasswordErrorMessage(): string {
    if (!this.showPasswordField()) return '';
    const control = this.userForm.get('confirmPassword');
    if (control?.hasError('required')) return 'Confirmação de senha é obrigatória';
    if (control?.hasError('notSame')) return 'As senhas não coincidem';
    return '';
  }

  getCompanyYearsErrorMessage(): string {
    const control = this.userForm.get('companyYears');
    if (control?.hasError('required')) return 'Anos de empresa é obrigatório';
    if (control?.hasError('min')) return 'Valor não pode ser negativo';
    if (control?.hasError('max')) return 'Valor máximo de 50 anos';
    return '';
  }

  getRoleErrorMessage(): string {
    const control = this.userForm.get('role');
    return control?.hasError('required') ? 'Papel é obrigatório' : '';
  }

  getDepartmentErrorMessage(): string {
    const control = this.userForm.get('department');
    return control?.hasError('required') ? 'Departamento é obrigatório' : '';
  }

  getAreaErrorMessage(): string {
    const control = this.userForm.get('area');
    return control?.hasError('required') ? 'Área de atuação é obrigatória' : '';
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.formSubmit.emit({ type: this.formMode(), formValue: this.userForm.value });
    }
  }
}
