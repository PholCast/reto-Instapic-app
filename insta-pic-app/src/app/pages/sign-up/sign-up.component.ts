import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { User } from '../../shared/interfaces/user.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sign-up',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {

  router = inject(Router);

  fb = inject(FormBuilder);

  authService = inject(AuthService);

  passwordsMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const rePassword = control.get('rePassword')?.value;
    return password === rePassword ? null : { passwordsMismatch: true };

  };

  signUpForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(6)]],
    username: ['', [Validators.required]],
    email: ['', [Validators.email]],
    password: ['', [Validators.required]],
    rePassword: ['']
  }, { validators: this.passwordsMatchValidator })


  onRegistry() {

    if (this.signUpForm.invalid) {
      Swal.fire({
        text: 'Debe diligenciar todos los campos',
        icon: 'error'
      })
      return;
    }

    const user = this.signUpForm.getRawValue() as Required<User>;

    this.authService.registry(user)
      .subscribe({
        next: (response) => {
          if (!!response) {
            this.router.navigateByUrl('home');
          }
          this.signUpForm.reset();
        },
        error: (error) => {
          Swal.fire({
            text: 'Usuario ya existe',
            icon: 'error'
          })
        }
      });
  }

}
