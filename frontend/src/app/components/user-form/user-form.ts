import { Component, inject, input, OnInit, output } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

import { RoleOptions, DepartmentOptions, AreaOptions } from '../../constants/select-options';
import { UserProfileUpdate, UserRegistration } from '../../models/users';

@Component({
  selector: 'app-user-form',
  standalone: false,
  templateUrl: './user-form.html',
  styleUrl: './user-form.css',
})
export class UserForm implements OnInit {
  readonly initialData = input<Partial<UserProfileUpdate>>({});
  readonly submitButtonLabel = input<string>('');
  readonly showPasswordField = input<boolean>(true);
  readonly fullWidthButton = input<boolean>(true);

  readonly formSubmit = output<UserRegistration | UserProfileUpdate>();

  private readonly formBuilder = inject(FormBuilder);
  protected userForm: FormGroup = this.formBuilder.group({});

  protected formConfig: any = {
    name: ['', [Validators.required, Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    role: [null, Validators.required],
    department: [null, Validators.required],
    area: [null, Validators.required],
    companyYears: [0, [Validators.required, Validators.min(0)]],
    acessibilityFormation: [false, Validators.required],
  };

  protected roleOptions = RoleOptions;
  protected departmentOptions = DepartmentOptions;
  protected areaOptions = AreaOptions;

  ngOnInit(): void {
    this.buildForm();
    this.patchForm();
  }

  private buildForm(): void {
    if (this.showPasswordField()) {
      this.formConfig.password = ['', [Validators.required, Validators.minLength(8)]];
      this.formConfig.confirmPassword = ['', [Validators.required, this.validateSamePassword]];
    }

    this.userForm = this.formBuilder.group(this.formConfig);
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

  onSubmit(): void {
    if (this.userForm.valid) {
      this.formSubmit.emit(this.userForm.value as UserProfileUpdate);
    }
  }
}
