import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthentificationService } from '../../../../module-auth/services/authentification/authentification.service';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  
  pageTitle = 'Dashboard';
  userFullName = 'Utilisateur';
  userPhotoUrl: string | null = null;
  showUserMenu = false;
  notificationCount = 0;
  environment = environment;
  isLoggedIn = false;

  constructor(
    private router: Router,
    private authService: AuthentificationService
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
    this.setupPageTitle();
    
    // Écouter les mises à jour de profil
    this.authService.profileUpdated$.subscribe(() => {
      console.log('🔄 Mise à jour de profil détectée, rechargement des infos...');
      this.loadUserInfo();
    });
  }

  // Méthode pour forcer le rechargement des informations
  refreshUserInfo(): void {
    console.log('🔄 Rechargement forcé des informations utilisateur...');
    this.loadUserInfo();
  }

  loadUserInfo(): void {
    console.log('🔍 Chargement des informations utilisateur...');
    
    // Forcer la récupération depuis le token
    const user = this.authService.getCurrentUser();
    console.log('👤 Utilisateur récupéré depuis localStorage:', user);
    
    this.isLoggedIn = this.authService.isLoggedIn();
    console.log('🔐 Connecté:', this.isLoggedIn);
    
    if (user && user.nom && user.prenom) {
      this.userFullName = `${user.prenom} ${user.nom}`.trim();
      console.log('📝 Nom complet depuis localStorage:', this.userFullName);
      
      // Charger la photo de profil si disponible
      if (user.photoProfil) {
        this.userPhotoUrl = `${environment.apiUrl}/${user.photoProfil}`;
        console.log('📸 URL photo depuis localStorage:', this.userPhotoUrl);
      } else {
        console.log('📸 Aucune photo de profil dans localStorage');
      }
    } else {
      console.log('❌ Informations utilisateur incomplètes dans localStorage, tentative depuis le token...');
      
      // Essayer de récupérer depuis le token directement
      const token = this.authService.getToken();
      if (token) {
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          const decodedToken = JSON.parse(jsonPayload);
          
          console.log('🔍 Token décodé directement:', decodedToken);
          
          if (decodedToken.nom && decodedToken.prenom) {
            this.userFullName = `${decodedToken.prenom} ${decodedToken.nom}`.trim();
            console.log('📝 Nom complet depuis token:', this.userFullName);
            
            if (decodedToken.photoProfil) {
              this.userPhotoUrl = `${environment.apiUrl}/${decodedToken.photoProfil}`;
              console.log('📸 URL photo depuis token:', this.userPhotoUrl);
            }
          } else {
            console.log('❌ Informations nom/prénom manquantes dans le token');
            this.userFullName = 'Utilisateur';
          }
        } catch (error) {
          console.error('❌ Erreur lors du décodage du token:', error);
          this.userFullName = 'Utilisateur';
        }
      } else {
        console.log('❌ Aucun token trouvé');
        this.userFullName = 'Utilisateur';
      }
    }
  }

  setupPageTitle(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updatePageTitle(event.url);
      }
    });
  }

  updatePageTitle(url: string): void {
    if (url.includes('/dashboard')) {
      this.pageTitle = 'Dashboard';
    } else if (url.includes('/signalement')) {
      this.pageTitle = 'Signalements';
    } else if (url.includes('/devis')) {
      this.pageTitle = 'Devis';
    } else if (url.includes('/profile')) {
      this.pageTitle = 'Mon Profil';
    } else if (url.includes('/addAutority')) {
      this.pageTitle = 'Ajouter Autorité';
    } else if (url.includes('/addOuvrier')) {
      this.pageTitle = 'Ajouter Ouvrier';
    } else if (url.includes('/addSignalement')) {
      this.pageTitle = 'Ajouter Signalement';
    } else {
      this.pageTitle = 'Dashboard';
    }
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  navigateToProfile(): void {
    this.router.navigate(['/admin/profile']);
    this.showUserMenu = false;
  }

  navigateToSettings(): void {
    // Navigation vers les paramètres (à implémenter)
    this.showUserMenu = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  onImageError(event: any): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'assets/images/faces/default-avatar.png';
    }
  }

  // Fermer le menu si on clique ailleurs
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-profile')) {
      this.showUserMenu = false;
    }
  }
}
