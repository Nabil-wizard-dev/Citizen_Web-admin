import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthentificationService } from '../../../module-auth/services/authentification/authentification.service';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  // Ajout d'un objet pour suivre l'état ouvert/fermé de chaque sous-menu
  submenus: { [key: string]: boolean } = {};

  constructor(private authService: AuthentificationService, private router: Router) { }

  toggleSubmenu(menu: string) {
    this.submenus[menu] = !this.submenus[menu];
  }

  isSubmenuOpen(menu: string): boolean {
    return !!this.submenus[menu];
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['auth/login']);
  }
}
