import { Component, OnInit } from '@angular/core';
import { SignalementService } from '../../../services/signalement/signalement.service';
import { Signalement } from '../../../models/signalement';

@Component({
  selector: 'app-les-signalement',
  standalone: false,
  templateUrl: './les-signalement.component.html',
  styleUrl: './les-signalement.component.css'
})
export class LesSignalementComponent implements OnInit {
  
  signalements: Signalement[] = [];
  loading: boolean = false;
  error: string = '';

  constructor(private signalementService: SignalementService) { }

  ngOnInit(): void {
    this.loadSignalements();
  }

  loadSignalements(): void {
    this.loading = true;
    this.error = '';
    
    this.signalementService.getSignalements().subscribe({
      next: (response: any) => {
        this.signalements = response.data;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Erreur lors du chargement des signalements';
        this.loading = false;
        console.error('Erreur lors du chargement des signalements:', err);
      }
    });
  }

  getSignalementsByStatus(status: string): Signalement[] {
    return this.signalements.filter(signalement => {
      const signalementStatus = signalement.statut?.toLowerCase() || '';
      const searchStatus = status.toLowerCase();
      
      switch (searchStatus) {
        case 'traité':
        case 'terminé':
          return signalementStatus.includes('traité') || signalementStatus.includes('terminé');
        case 'en cours':
          return signalementStatus.includes('cours') || signalementStatus.includes('en_cours');
        case 'en attente':
          return signalementStatus.includes('attente') || signalementStatus.includes('en_attente');
        default:
          return true; // Pour l'onglet "Tous"
      }
    });
  }

  deleteSignalement(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce signalement ?')) {
      this.signalementService.deleteSignalement(id).subscribe({
        next: () => {
          this.loadSignalements(); // Recharger la liste après suppression
        },
        error: (err: any) => {
          console.error('Erreur lors de la suppression:', err);
          alert('Erreur lors de la suppression du signalement');
        }
      });
    }
  }

  getStatusClass(status: string): string {
    const statusLower = status?.toLowerCase() || '';
    
    if (statusLower.includes('traité') || statusLower.includes('terminé')) {
      return 'badge bg-light-success';
    } else if (statusLower.includes('cours')) {
      return 'badge bg-light-warning';
    } else if (statusLower.includes('attente')) {
      return 'badge bg-light-info';
    } else {
      return 'badge bg-light-secondary';
    }
  }

  getStatusText(status: string): string {
    const statusLower = status?.toLowerCase() || '';
    
    if (statusLower.includes('traité') || statusLower.includes('terminé')) {
      return 'Traité';
    } else if (statusLower.includes('cours')) {
      return 'En cours';
    } else if (statusLower.includes('attente')) {
      return 'En attente';
    } else {
      return status || 'Non défini';
    }
  }
}
