import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './widgets/dashboard/dashboard.component';
import { LayoutComponent } from './layout/layout.component';

import { AuthentificationGuard } from '../module-auth/guards/authentification.guard';
import { LesSignalementComponent } from './widgets/signalement/les-signalement/les-signalement.component';
import { AddAutorityComponent } from './widgets/personnel/autorite/add-autority/add-autority.component';
import { AddOuvrierComponent } from './widgets/personnel/ouvrier/add-ouvrier/add-ouvrier.component';
import { AddSignalementComponent } from './widgets/signalement/add-signalement/add-signalement.component';
import { DetailleSignalementComponent } from './widgets/signalement/detaille-signalement/detaille-signalement.component';
import { UploadTesterComponent } from './widgets/test/upload-tester/upload-tester.component';
import { AssignerOuvrierComponent } from './widgets/signalement/assigner-ouvrier/assigner-ouvrier.component';
import { TacheComponent } from './widgets/signalement/tache/tache.component';
import { ListeDevisComponent } from './widgets/signalement/liste-devis/liste-devis.component';
import { ProfileComponent } from './widgets/profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthentificationGuard] },
      { path: 'upload', component: UploadTesterComponent, canActivate: [AuthentificationGuard] },
      //personnel
      { path: 'addAutority', component: AddAutorityComponent, canActivate: [AuthentificationGuard] },
      { path: 'addOuvrier', component: AddOuvrierComponent, canActivate: [AuthentificationGuard] },
      { path: 's-addOuvrier/:trackingId', component: AssignerOuvrierComponent, canActivate: [AuthentificationGuard] },
      // signalement
      { path: 'signalement', component: LesSignalementComponent, canActivate: [AuthentificationGuard] },
      { path: 'addSignalement', component: AddSignalementComponent, canActivate: [AuthentificationGuard] },
      { path: 's-details/:id', component: DetailleSignalementComponent, canActivate: [AuthentificationGuard] },
      { path: 'tache/:id', component: TacheComponent, canActivate: [AuthentificationGuard] },
      { path: 'devis', component: ListeDevisComponent, canActivate: [AuthentificationGuard] },
      // profil
      { path: 'profile', component: ProfileComponent, canActivate: [AuthentificationGuard] },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModuleAdminRoutingModule { }
