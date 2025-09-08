import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./module-auth/module-auth.module').then(m => m.ModuleAuthModule) },
  { path: 'admin', loadChildren: () => import('./module-admin/module-admin.module').then(m => m.ModuleAdminModule) },
  { path: '**', redirectTo: '/auth/login', pathMatch: 'full' },
  // { path: '', redirectTo: '/auth/login', },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
