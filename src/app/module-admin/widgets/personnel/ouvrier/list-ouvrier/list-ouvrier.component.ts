import { Component, OnInit } from '@angular/core';
import { OuvrierService } from '../../../../services/ouvrier/ouvrier.service';
import { Ouvrier } from '../../../../models/ouvrier';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-ouvrier',
  standalone: false,
  templateUrl: './list-ouvrier.component.html',
  styleUrl: './list-ouvrier.component.css'
})
export class ListOuvrierComponent implements OnInit {
  
  // Variables
  ouvriers: Ouvrier[] = [];
  filteredOuvriers: Ouvrier[] = [];
  selectedOuvrier: Ouvrier | null = null;
  searchTerm: string = '';
  loading: boolean = false;
  error: string = '';

  constructor(
    private ouvrierService: OuvrierService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadOuvriers();
  }

  loadOuvriers(): void {
    this.loading = true;
    this.error = '';
    
    this.ouvrierService.getOuvriers().subscribe({
      next: (response: any) => {
        console.log('Réponse API ouvriers:', response.data);
        // Gérer la réponse selon le format de l'API
        if (response._embedded && response._embedded.ouvriers) {
          this.ouvriers = response._embedded.ouvriers;
        } else if (Array.isArray(response.data)) {
          this.ouvriers = response.data;
        } else {
          this.ouvriers = [];
        }
        console.log('Ouvriers chargés:', this.ouvriers);
        this.filteredOuvriers = [...this.ouvriers];
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Erreur lors du chargement des ouvriers';
        this.loading = false;
        console.error('Erreur lors du chargement des ouvriers:', err);
      }
    });
  }

  filterOuvriers(): Ouvrier[] {
    if (!this.searchTerm.trim()) {
      console.log('Pas de terme de recherche, retour de filteredOuvriers:', this.filteredOuvriers);
      return this.filteredOuvriers;
    }
    
    const term = this.searchTerm.toLowerCase();
    const filtered = this.filteredOuvriers.filter(ouvrier => 
      ouvrier.nom.toLowerCase().includes(term) ||
      ouvrier.prenom.toLowerCase().includes(term) ||
      ouvrier.specialite?.toLowerCase().includes(term) ||
      ouvrier.email.toLowerCase().includes(term)
    );
    console.log('Filtrage avec terme:', term, 'résultat:', filtered);
    return filtered;
  }

  selectOuvrier(ouvrier: Ouvrier): void {
    this.selectedOuvrier = ouvrier;
  }

  voirProfil(ouvrier: Ouvrier): void {
    // Navigation vers la page de profil de l'ouvrier
    this.router.navigate(['/admin/personnel/ouvriers/profil', ouvrier.trackingId]);
  }

  modifierOuvrier(ouvrier: Ouvrier): void {
    // Navigation vers la page de modification
    this.router.navigate(['/admin/personnel/ouvriers/modifier', ouvrier.trackingId]);
  }

  supprimerOuvrier(ouvrier: Ouvrier): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'ouvrier ${ouvrier.nom} ${ouvrier.prenom} ?`)) {
      this.ouvrierService.deleteOuvrier(parseInt(ouvrier.trackingId || '0')).subscribe({
        next: () => {
          this.loadOuvriers(); // Recharger la liste
          this.selectedOuvrier = null;
        },
        error: (err: any) => {
          console.error('Erreur lors de la suppression:', err);
          alert('Erreur lors de la suppression de l\'ouvrier');
        }
      });
    }
  }

  onSelectionConfirmed(): void {
    if (this.selectedOuvrier) {
      // Logique pour confirmer la sélection (si utilisé dans un contexte d'assignation)
      console.log('Ouvrier sélectionné:', this.selectedOuvrier);
      // Ici vous pouvez émettre un événement ou naviguer selon le contexte
    }
  }

  getDisponibiliteClass(ouvrier: Ouvrier): string {
    return ouvrier.signalementActuelId == null ? 'bg-success' : 'bg-danger';
  }

  getDisponibiliteText(ouvrier: Ouvrier): string {
    return ouvrier.signalementActuelId == null ? 'Libre' : 'Occupé';
  }

  onSearchChange(): void {
    // Cette méthode est appelée automatiquement par le binding [(ngModel)]
    // Le filtrage se fait dans filterOuvriers()
  }

  // Propriétés calculées pour les statistiques
  get totalOuvriers(): number {
    return this.ouvriers.length;
  }

  get ouvriersLibres(): number {
    return this.ouvriers.filter(o => o.signalementActuelId == null).length;
  }

  get ouvriersOccupes(): number {
    return this.ouvriers.filter(o => o.signalementActuelId != null).length;
  }

  get resultatsFiltres(): number {
    return this.filterOuvriers().length;
  }

}
