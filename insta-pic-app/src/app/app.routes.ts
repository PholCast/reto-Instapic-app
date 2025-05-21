import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { HomeComponent } from './pages/home/home.component';
import { FindComponent } from './pages/find/find.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { UploadComponent } from './pages/upload/upload.component';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  {
    path:'',
    component:LoginComponent
  },
  {
    path:'sign-up',
    component:SignUpComponent
  },
  {
    path:'home',
    component:HomeComponent,
    canActivate:[authGuard]
  },
  {
    path:'find',
    component:FindComponent,
    canActivate:[authGuard]
  },
  {
    path:'profile',
    component:ProfileComponent,
    canActivate:[authGuard]
  },
  {
    path:'upload',
    component:UploadComponent,
    canActivate:[authGuard]
  },
  {
    path:'**', redirectTo: '', pathMatch:'full'
  }
];
