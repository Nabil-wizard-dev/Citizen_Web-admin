import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModuleAuthRoutingModule } from './module-auth-routing.module';
import { PageComponent } from './page/page.component';
import { LoginComponent } from './widgets/login/login.component';
import { RegisterComponent } from './widgets/register/register.component';
import { ResetPasswordComponent } from './widgets/reset-password/reset-password.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PageComponent,
    LoginComponent,
    RegisterComponent,
    ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    ModuleAuthRoutingModule,
    ReactiveFormsModule
  ]
})
export class ModuleAuthModule { }
