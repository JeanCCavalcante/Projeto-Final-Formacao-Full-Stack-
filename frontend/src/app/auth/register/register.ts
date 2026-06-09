import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  protected registerSelectOptions = {
    role: ['Mentorado', 'Mentor'],
    department: ['Tecnologia', 'Produto', 'Marketing', 'Pessoas e Cultura'],
    area: [
      'Dev Back-end',
      'QA',
      'Produto',
      'UX/UI Designer',
      'Data Engineer',
      'Dev Front-end',
      'Dev Mobile',
    ],
  };

  protected registerForm: FormGroup;

  constructor(private readonly formBuilder: FormBuilder) {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirmation: ['', [Validators.required, Validators.minLength(8)]],
      role: [null, [Validators.required]],
      department: [null, [Validators.required]],
      area: [null, [Validators.required]],
      companyYears: [0, [Validators.required, Validators.min(0)]],
      acessibilityFormation: [false, [Validators.required]],
    });
  }

  onRegister(form: FormGroup) {
    console.log(form.value);
  }
}
