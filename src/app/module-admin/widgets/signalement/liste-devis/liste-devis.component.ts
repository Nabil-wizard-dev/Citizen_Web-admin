import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevisService, Devis } from '../../../services/devis/devis.service';
import { SignalementService } from '../../../services/signalement/signalement.service';
import { Signalement } from '../../../models/signalement';
import { AuthentificationService } from '../../../../module-auth/services/authentification/authentification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-liste-devis',
  standalone: false,
  templateUrl: './liste-devis.component.html',
  styleUrl: './liste-devis.component.css'
})
export class ListeDevisComponent implements OnInit {
  devis: Devis[] = [];
  rapports: Devis[] = [];
  signalements: Signalement[] = [];
  selectedSignalement: Signalement | null = null;
  isLoading = false;
  isLoadingRapports = false;
  errorMessage = '';
  errorMessageRapports = '';
  selectedSignalementId: string | null = null;

  constructor(
    private devisService: DevisService,
    private signalementService: SignalementService,
    private authService: AuthentificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Vérifier si l'utilisateur est connecté et si le token est valide
    this.authService.isAuthenticated().subscribe({
      next: (isValid: boolean) => {
        if (!isValid) {
          console.error(' Utilisateur non connecté ou token invalide');
          alert('Session expirée. Veuillez vous reconnecter.');
          this.router.navigate(['/auth/login']);
          return;
        }
        
        console.log(' Utilisateur authentifié, token valide');
        this.loadSignalements();
      },
      error: (error: any) => {
        console.error(' Erreur lors de la vérification d\'authentification:', error);
        alert('Erreur de vérification d\'authentification. Veuillez vous reconnecter.');
        this.router.navigate(['/auth/login']);
      }
    });
  }

  loadSignalements(): void {
    this.signalementService.getSignalements2().subscribe({
      next: (response: any) => {
        if (response.data) {
          this.signalements = response.data;
          console.log(' Signalements récupérés:', this.signalements);
        }
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des signalements:', error);
      }
    });
  }

  loadDevisForSignalement(signalementId: string): void {
    console.log('🔍 Chargement des devis pour signalementId:', signalementId);
    if (!signalementId) return;
    
    this.isLoading = true;
    this.errorMessage = '';

    this.devisService.getDevisBySignalement(signalementId).subscribe({
      next: (response: any) => {
        console.log(' Devis récupérés:', response);
        console.log(' Type de response:', typeof response);
        console.log(' Response complète:', JSON.stringify(response, null, 2));
        if (response.data && Array.isArray(response.data)) {
          this.devis = response.data;
          console.log(' Nombre de devis:', this.devis.length);
        } else {
          this.devis = [];
          this.errorMessage = response.message || 'Aucun devis trouvé';
          console.log(' Pas de données valides dans la réponse');
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error(' Erreur lors du chargement des devis:', error);
        console.log(' Erreur complète:', JSON.stringify(error, null, 2));
        this.errorMessage = 'Erreur lors du chargement des devis';
        this.isLoading = false;
      }
    });
  }

  loadRapportsForSignalement(signalementId: string): void {
    console.log('🔍 Chargement des rapports pour signalementId:', signalementId);
    if (!signalementId) return;
    
    this.isLoadingRapports = true;
    this.errorMessageRapports = '';

    this.devisService.getRapportsBySignalement(signalementId).subscribe({
      next: (response: any) => {
        console.log(' Rapports récupérés:', response);
        if (response.data && Array.isArray(response.data)) {
          this.rapports = response.data;
          console.log(' Nombre de rapports:', this.rapports.length);
        } else {
          this.rapports = [];
          this.errorMessageRapports = response.message || 'Aucun rapport trouvé';
        }
        this.isLoadingRapports = false;
      },
      error: (error: any) => {
        console.error(' Erreur lors du chargement des rapports:', error);
        this.errorMessageRapports = 'Erreur lors du chargement des rapports';
        this.isLoadingRapports = false;
      }
    });
  }

  onSignalementChange(): void {
    if (this.selectedSignalementId !== null) {
      // Trouver le signalement sélectionné
      this.selectedSignalement = this.signalements.find(s => s.trackingId === this.selectedSignalementId) || null;
      
      // Charger les devis et rapports
      this.loadDevisForSignalement(this.selectedSignalementId);
      this.loadRapportsForSignalement(this.selectedSignalementId);
    } else {
      this.selectedSignalement = null;
      this.devis = [];
      this.rapports = [];
    }
  }

  getStatusBadgeClass(statut: string): string {
    switch (statut) {
      case 'EN_ATTENTE':
        return 'bg-warning';
      case 'EN_COURS':
        return 'bg-primary';
      case 'TRAITE':
        return 'bg-success';
      case 'REJETE':
        return 'bg-danger';
      case 'ARCHIVE':
        return 'bg-secondary';
      default:
        return 'bg-secondary';
    }
  }

  viewRapportDetails(rapport: Devis): void {
    // Ouvrir une modal ou naviguer vers une page de détails
    console.log('Voir détails du rapport:', rapport);
    alert(`Détails du rapport: ${rapport.titre}\nCréé le: ${this.formatDate(rapport.dateCreation)}`);
  }

  commenterRapport(rapport: Devis): void {
    // Ouvrir une modal pour ajouter un commentaire
    const commentaire = prompt('Ajouter un commentaire au rapport:');
    if (commentaire) {
      console.log('Commentaire ajouté:', commentaire);
      alert('Commentaire ajouté avec succès!');
    }
  }

  exportSignalementData(): void {
    if (!this.selectedSignalement) return;
    
    // Créer un objet avec toutes les données du signalement
    const dataToExport = {
      signalement: this.selectedSignalement,
      devis: this.devis,
      rapports: this.rapports,
      dateExport: new Date().toISOString()
    };
    
    // Créer et télécharger le fichier JSON
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `signalement_${this.selectedSignalement.code}_${new Date().getTime()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    alert('Données exportées avec succès!');
  }

  downloadDevis(devisId: string, titre: string): void {
    this.devisService.downloadDevisPdf(devisId).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `devis_${titre}_${new Date().getTime()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
      error: (error: any) => {
        console.error('Erreur lors du téléchargement:', error);
        alert('Erreur lors du téléchargement du devis');
      }
    });
  }

  downloadRapport(rapportId: string, titre: string): void {
    this.devisService.downloadRapportPdf(rapportId).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `rapport_${titre}_${new Date().getTime()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
      error: (error: any) => {
        console.error('Erreur lors du téléchargement:', error);
        alert('Erreur lors du téléchargement du rapport');
      }
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getSignalementTitle(signalementId: string): string {
    const signalement = this.signalements.find(s => s.trackingId === signalementId);
    return signalement ? signalement.titre : 'Signalement inconnu';
  }

  trackByDevisId(index: number, devis: Devis): string {
    return devis.trackingId;
  }

  trackByRapportId(index: number, rapport: Devis): string {
    return rapport.trackingId;
  }

  activerSignalement(signalementId: string) {
    this.authService.isAuthenticated().subscribe({
      next: (isValid: boolean) => {
        if (!isValid) {
          alert('Session expirée. Veuillez vous reconnecter.');
          this.router.navigate(['/auth/login']);
          return;
        }

        this.signalementService.activerSignalement(signalementId).subscribe({
          next: () => {
            alert('Signalement activé !');
            this.loadDevisForSignalement(signalementId);
          },
          error: (error: any) => {
            console.error(' Erreur lors de l\'activation:', error);
            if (error.status === 403) {
              alert('Erreur d\'autorisation. Veuillez vous reconnecter.');
              this.router.navigate(['/auth/login']);
            } else {
              alert('Erreur lors de l\'activation: ' + (error.error?.message || error.message || 'Erreur inconnue'));
            }
          }
        });
      },
      error: () => {
        alert('Erreur de vérification d\'authentification. Veuillez vous reconnecter.');
        this.router.navigate(['/auth/login']);
      }
    });
  }

  rejeterSignalement(signalementId: string) {
    this.authService.isAuthenticated().subscribe({
      next: (isValid: boolean) => {
        if (!isValid) {
          alert('Session expirée. Veuillez vous reconnecter.');
          this.router.navigate(['/auth/login']);
          return;
        }

        this.signalementService.rejeterSignalement(signalementId).subscribe({
          next: () => {
            alert('Signalement rejeté !');
            this.loadDevisForSignalement(signalementId);
          },
          error: (error: any) => {
            console.error(' Erreur lors du rejet:', error);
            if (error.status === 403) {
              alert('Erreur d\'autorisation. Veuillez vous reconnecter.');
              this.router.navigate(['/auth/login']);
            } else {
              alert('Erreur lors du rejet: ' + (error.error?.message || error.message || 'Erreur inconnue'));
            }
          }
        });
      },
      error: () => {
        alert('Erreur de vérification d\'authentification. Veuillez vous reconnecter.');
        this.router.navigate(['/auth/login']);
      }
    });
  }

  finaliserSignalement(signalementId: string) {
    this.authService.isAuthenticated().subscribe({
      next: (isValid: boolean) => {
        if (!isValid) {
          alert('Session expirée. Veuillez vous reconnecter.');
          this.router.navigate(['/auth/login']);
          return;
        }

        if (confirm('Êtes-vous sûr de vouloir finaliser cette affaire ? Cette action ne peut pas être annulée.')) {
          this.signalementService.finaliserSignalement(signalementId).subscribe({
            next: (response: any) => {
              alert('Affaire finalisée avec succès !');
              // Recharger les données du signalement
              this.onSignalementChange();
            },
            error: (error: any) => {
              console.error(' Erreur lors de la finalisation:', error);
              if (error.status === 403) {
                alert('Erreur d\'autorisation. Veuillez vous reconnecter.');
                this.router.navigate(['/auth/login']);
              } else {
                alert('Erreur lors de la finalisation de l\'affaire: ' + (error.error?.message || error.message || 'Erreur inconnue'));
              }
            }
          });
        }
      },
      error: () => {
        alert('Erreur de vérification d\'authentification. Veuillez vous reconnecter.');
        this.router.navigate(['/auth/login']);
      }
    });
  }

  archiverSignalement(signalementId: string) {
    if (confirm('Êtes-vous sûr de vouloir archiver cette affaire ?')) {
      // : Implémenter l'archivage
      alert('Fonctionnalité d\'archivage à implémenter');
    }
  }
} 