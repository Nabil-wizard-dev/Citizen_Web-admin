import { Component, Input, OnInit } from '@angular/core';
import { DevisService, Devis } from '../../../services/devis/devis.service';

@Component({
  selector: 'app-devis',
  standalone: false,
  templateUrl: './devis.component.html',
  styleUrl: './devis.component.css'
})
export class DevisComponent implements OnInit {
  @Input() signalementId!: string;
  
  devis: Devis[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private devisService: DevisService) { 
    console.log('🔧 DevisComponent constructor()');
  }

  ngOnInit(): void {
    console.log('🎯 DevisComponent ngOnInit() - signalementId:', this.signalementId);
    this.loadDevis();
  }

  loadDevis(): void {
    console.log('🔍 loadDevis() appelé avec signalementId:', this.signalementId);
    if (!this.signalementId) {
      console.log('❌ signalementId est null ou undefined');
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    console.log('📡 Appel API pour signalementId:', this.signalementId);

    this.devisService.getDevisBySignalement(this.signalementId).subscribe({
      next: (response: any) => {
        console.log('✅ Réponse API reçue:', response);
        console.log('📊 Type de response.error:', typeof response.error);
        console.log('📊 Valeur de response.error:', response.error);
        console.log('📊 Type de response.data:', typeof response.data);
        console.log('📊 Valeur de response.data:', response.data);
        
        if (response.error === false && response.data) {
          console.log('✅ Données valides, mise à jour du tableau devis');
          this.devis = response.data;
          console.log('📋 Nombre de devis dans le tableau:', this.devis.length);
        } else {
          console.log('❌ Pas de données valides');
          this.errorMessage = response.message || 'Aucun devis trouvé';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Erreur lors du chargement des devis:', error);
        this.errorMessage = 'Erreur lors du chargement des devis';
        this.isLoading = false;
      }
    });
  }

  downloadDevis(devisId: string, titre: string): void {
    this.devisService.downloadDevisPdf(devisId).subscribe({
      next: (blob: Blob) => {
        // Créer un lien de téléchargement
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `devis_${titre}_${new Date().getTime()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Erreur lors du téléchargement:', error);
        alert('Erreur lors du téléchargement du devis');
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

  trackByDevisId(index: number, devis: Devis): string {
    return devis.trackingId;
  }

  testApi(): void {
    console.log('🧪 Test API appelé');
    console.log('🔍 signalementId actuel:', this.signalementId);
    
    // Test simple avec fetch
    fetch(`http://localhost:8080/api/signalements/devis/${this.signalementId}`)
      .then(response => {
        console.log('📡 Réponse fetch:', response);
        return response.json();
      })
      .then(data => {
        console.log('📊 Données fetch:', data);
      })
      .catch(error => {
        console.error('❌ Erreur fetch:', error);
      });
  }
} 