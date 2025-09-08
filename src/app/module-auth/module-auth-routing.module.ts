import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './widgets/login/login.component';
import { RegisterComponent } from './widgets/register/register.component';
import { ResetPasswordComponent } from './widgets/reset-password/reset-password.component';

const routes: Routes = [
   { path: 'login', component: LoginComponent  },
   { path: 'register', component: RegisterComponent },
   { path: 'resetPassword', component: ResetPasswordComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModuleAuthRoutingModule { }
