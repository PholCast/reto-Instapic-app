import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html'
})
export class HeaderComponent {

  authService = inject(AuthService);

  router = inject(Router);

  isLoggedUser = this.authService.isLogged;


  onLogout(){
    this.authService.logout();
    this.router.navigateByUrl('/');
  }

}
