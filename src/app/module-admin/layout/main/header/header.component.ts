import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthentificationService } from '../../../../module-auth/services/authentification/authentification.service';
import { ProfileService } from '../../../../module-auth/services/profile/profile.service';
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
    private authService: AuthentificationService,
    private profileService: ProfileService
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
    
    const user = this.authService.getCurrentUser();
    console.log('👤 Utilisateur récupéré depuis localStorage:', user);
    
    this.isLoggedIn = this.authService.isLoggedIn();
    console.log('🔐 Connecté:', this.isLoggedIn);
    
    if (!user || !user.trackingId) {
      console.log('❌ Aucun utilisateur ou trackingId trouvé');
      this.userFullName = 'Utilisateur';
      return;
    }

    // Essayer d'abord avec les données locales si disponibles
    if (user.nom && user.prenom) {
      this.userFullName = `${user.prenom} ${user.nom}`.trim();
      console.log('📝 Nom complet depuis localStorage:', this.userFullName);
      
      if (user.photoProfil) {
        this.userPhotoUrl = `${environment.apiUrl}/${user.photoProfil}`;
        console.log('📸 URL photo depuis localStorage:', this.userPhotoUrl);
      }
    } else {
      // Sinon, récupérer depuis l'API
      console.log('🔄 Récupération du profil depuis l\'API...');
      this.profileService.getProfile(user.trackingId).subscribe({
        next: (profile) => {
          this.userFullName = `${profile.prenom} ${profile.nom}`.trim();
          console.log('📝 Nom complet depuis API:', this.userFullName);
          
          if (profile.photoProfil) {
            this.userPhotoUrl = `${environment.apiUrl}/${profile.photoProfil}`;
            console.log('📸 URL photo depuis API:', this.userPhotoUrl);
          }
          
          // Mettre à jour le localStorage avec les vraies données
          const updatedUser = {
            ...user,
            nom: profile.nom,
            prenom: profile.prenom,
            adresse: profile.adresse,
            cni: profile.cni,
            photoProfil: profile.photoProfil
          };
          this.authService.saveUser(updatedUser);
        },
        error: (error) => {
          console.error('❌ Erreur lors de la récupération du profil:', error);
          this.userFullName = 'Utilisateur';
        }
      });
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
