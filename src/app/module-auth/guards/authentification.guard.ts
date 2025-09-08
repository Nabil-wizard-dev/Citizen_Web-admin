import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { AuthentificationService } from '../services/authentification/authentification.service';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class AuthentificationGuard implements CanActivate {

  constructor(private authService: AuthentificationService, private router: Router) { }

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/auth/login']); // Redirige vers la page de connexion
      return false;
    }
  }
};


