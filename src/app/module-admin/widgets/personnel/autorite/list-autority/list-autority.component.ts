import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from '../../../../../module-auth/services/authentification/authentification.service';
import { Utilisateur } from '../../../../../module-auth/models/utilisateur';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment.development';

@Component({
  selector: 'app-list-autority',
  standalone: false,
  templateUrl: './list-autority.component.html',
  styleUrl: './list-autority.component.css'
})
export class ListAutorityComponent implements OnInit {
  
  // Variables
  autorites: Utilisateur[] = [];
  filteredAutorites: Utilisateur[] = [];
  selectedAutorite: Utilisateur | null = null;
  searchTerm: string = '';
  loading: boolean = false;
  error: string = '';

  constructor(
    private authService: AuthentificationService,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadAutorites();
  }

  loadAutorites(): void {
    this.loading = true;
    this.error = '';
    
    // Récupérer tous les utilisateurs et filtrer ceux qui ont le rôle d'autorité
    this.http.get<any>(`${environment.apiUrl}/api/utilisateurs`).subscribe({
      next: (response: any) => {
        console.log('=== RÉPONSE API UTILISATEURS ===');
        console.log('Réponse complète:', response);
        console.log('Type de réponse:', typeof response);
        console.log('Est un array:', Array.isArray(response));
        
        let allUsers: Utilisateur[] = [];
        
        // Gérer différents formats de réponse
        if (response._embedded && response._embedded.utilisateurs) {
          allUsers = response._embedded.utilisateurs;
          console.log('Données extraites de _embedded.utilisateurs:', allUsers);
        } else if (Array.isArray(response.data)) {
          allUsers = response.data;
          console.log('Données extraites de data:', allUsers);
        } else if (Array.isArray(response)) {
          allUsers = response;
          console.log('Réponse directe (array):', allUsers);
        } else {
          console.log('Format de réponse non reconnu');
        }
        
        console.log('Total utilisateurs récupérés:', allUsers.length);
        console.log('Utilisateurs avec rôles:', allUsers.map(u => ({ nom: u.nom, role: u.role })));
        
        // Filtrer les utilisateurs avec le rôle d'autorité
        this.autorites = allUsers.filter(user => 
          user.role === 'AUTORITE_LOCALE' || user.role === 'ADMIN'
        );
        
        console.log('=== AUTORITÉS FILTRÉES ===');
        console.log('Autorités chargées:', this.autorites);
        console.log('Nombre d\'autorités:', this.autorites.length);
        
        this.filteredAutorites = [...this.autorites];
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Erreur lors du chargement des autorités';
        this.loading = false;
        console.error('Erreur lors du chargement des autorités:', err);
      }
    });
  }

  filterAutorites(): Utilisateur[] {
    if (!this.searchTerm.trim()) {
      return this.filteredAutorites;
    }
    
    const term = this.searchTerm.toLowerCase();
    return this.filteredAutorites.filter(autorite => 
      autorite.nom.toLowerCase().includes(term) ||
      autorite.prenom.toLowerCase().includes(term) ||
      autorite.email.toLowerCase().includes(term) ||
      autorite.role?.toLowerCase().includes(term)
    );
  }

  selectAutorite(autorite: Utilisateur): void {
    this.selectedAutorite = autorite;
  }

  voirProfil(autorite: Utilisateur): void {
    // Navigation vers la page de profil de l'autorité
    this.router.navigate(['/admin/personnel/autorites/profil', autorite.trackingId]);
  }

  modifierAutorite(autorite: Utilisateur): void {
    // Navigation vers la page de modification
    this.router.navigate(['/admin/personnel/autorites/modifier', autorite.trackingId]);
  }

  supprimerAutorite(autorite: Utilisateur): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'autorité ${autorite.nom} ${autorite.prenom} ?`)) {
      this.http.delete(`${environment.apiUrl}/api/utilisateurs/${autorite.trackingId}`).subscribe({
        next: () => {
          this.loadAutorites(); // Recharger la liste
          this.selectedAutorite = null;
        },
        error: (err: any) => {
          console.error('Erreur lors de la suppression:', err);
          alert('Erreur lors de la suppression de l\'autorité');
        }
      });
    }
  }

  onSelectionConfirmed(): void {
    if (this.selectedAutorite) {
      // Logique pour confirmer la sélection (si utilisé dans un contexte d'assignation)
      console.log('Autorité sélectionnée:', this.selectedAutorite);
      // Ici vous pouvez émettre un événement ou naviguer selon le contexte
    }
  }

  getRoleClass(autorite: Utilisateur): string {
    switch(autorite.role) {
      case 'AUTORITE_LOCALE': return 'bg-primary';
      case 'ADMIN': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  getRoleText(autorite: Utilisateur): string {
    switch(autorite.role) {
      case 'AUTORITE_LOCALE': return 'Autorité Locale';
      case 'ADMIN': return 'Administrateur';
      default: return autorite.role;
    }
  }

  onSearchChange(): void {
    // Cette méthode est appelée automatiquement par le binding [(ngModel)]
    // Le filtrage se fait dans filterAutorites()
  }

  // Propriétés calculées pour les statistiques
  get totalAutorites(): number {
    return this.autorites.length;
  }

  get autoritesLocales(): number {
    return this.autorites.filter(a => a.role === 'AUTORITE_LOCALE').length;
  }

  get administrateurs(): number {
    return this.autorites.filter(a => a.role === 'ADMIN').length;
  }

  get resultatsFiltres(): number {
    return this.filterAutorites().length;
  }

  // Getter pour accéder aux contrôles du formulaire
  get form() {
    return this.filteredAutorites;
  }
}