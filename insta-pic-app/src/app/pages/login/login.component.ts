import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../shared/services/auth.service';
import { URL_REDIRECT } from '../../shared/utils/constants';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  router = inject(Router);

  authService = inject(AuthService);

  fb = inject(FormBuilder);

  loginForm = this.fb.group({
    username:['', [Validators.required, Validators.minLength(6)]],
    password:['', [Validators.required]]
  })


  onLogin(){
    if(this.loginForm.invalid){
      Swal.fire({
        text:'Diligencie todos los campos',
        icon:'error'
      })
      return;
    }

    const {username, password } = this.loginForm.value as {username:string, password:string };

    this.authService.login(username, password).subscribe({
      next:(response)=>{
        if (!!response){
          let url = localStorage.getItem(URL_REDIRECT)||'home';
          this.router.navigateByUrl(url);
        }
      },
      error:(error)=>{
        Swal.fire({
          text:'Credenciales incorrectas',
          icon:'error'
        })
      }
    });

  }

}
