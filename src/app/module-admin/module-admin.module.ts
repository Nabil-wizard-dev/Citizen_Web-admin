import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModuleAdminRoutingModule } from './module-admin-routing.module';

import { LayoutComponent } from './layout/layout.component';
import { MainComponent } from './layout/main/main.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { BodyComponent } from './layout/main/body/body.component';
import { FooterComponent } from './layout/main/footer/footer.component';
import { HeaderComponent } from './layout/main/header/header.component';
import { DashboardComponent } from './widgets/dashboard/dashboard.component';
import { LesSignalementComponent } from './widgets/signalement/les-signalement/les-signalement.component';
import { DetailleSignalementComponent } from './widgets/signalement/detaille-signalement/detaille-signalement.component';
import { AddAutorityComponent } from './widgets/personnel/autorite/add-autority/add-autority.component';
import { AddOuvrierComponent } from './widgets/personnel/ouvrier/add-ouvrier/add-ouvrier.component';
import { AddSignalementComponent } from './widgets/signalement/add-signalement/add-signalement.component';
import { UploadTesterComponent } from './widgets/test/upload-tester/upload-tester.component';
import { HttpClientModule } from '@angular/common/http';
import { AssignerOuvrierComponent } from './widgets/signalement/assigner-ouvrier/assigner-ouvrier.component';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { ProfileOuvrierComponent } from './widgets/personnel/ouvrier/profile-ouvrier/profile-ouvrier.component';
import { ProfileAutoriteComponent } from './widgets/personnel/autorite/profile-autorite/profile-autorite.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { TacheComponent } from './widgets/signalement/tache/tache.component';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { ListeDevisComponent } from './widgets/signalement/liste-devis/liste-devis.component';
import { ProfileComponent } from './widgets/profile/profile.component';
import { DevisComponent } from './widgets/signalement/devis/devis.component';
import { ListAutorityComponent } from './widgets/personnel/autorite/list-autority/list-autority.component';
import { ListOuvrierComponent } from './widgets/personnel/ouvrier/list-ouvrier/list-ouvrier.component';


@NgModule({
  declarations: [
    LayoutComponent,
    MainComponent,
    SidebarComponent,
    HeaderComponent,
    BodyComponent,
    FooterComponent,
    DashboardComponent,
    LesSignalementComponent,
    DetailleSignalementComponent,
    AddAutorityComponent,
    AddOuvrierComponent,
    AddSignalementComponent,
    UploadTesterComponent,
    AssignerOuvrierComponent,
    ProfileOuvrierComponent,
    ProfileAutoriteComponent,
    TacheComponent,
    ListeDevisComponent,
    ProfileComponent,
    DevisComponent,
    ListAutorityComponent,
    ListOuvrierComponent,
     
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModuleAdminRoutingModule,
    HttpClientModule,
    SafeUrlPipe,
    NzButtonModule,
    NzCollapseModule,
    NzTimelineModule
  ],
  exports: [
    AssignerOuvrierComponent
  ]
})
export class ModuleAdminModule { }
