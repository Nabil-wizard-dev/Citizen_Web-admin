import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UploadServiceService } from '../../../services/uploads/upload-service.service';
import { OuvrierService } from '../../../services/ouvrier/ouvrier.service';
import { Ouvrier } from '../../../models/ouvrier';
import { SignalementService } from '../../../services/signalement/signalement.service';
import { Signalement } from '../../../models/signalement';
import { TacheService } from '../../../services/tache/tache.service';
import { Tache } from '../../../models/tache';

@Component({
  selector: 'app-assigner-ouvrier',
  standalone: false,
  templateUrl: './assigner-ouvrier.component.html',
  styleUrl: './assigner-ouvrier.component.css'
})
export class AssignerOuvrierComponent implements OnInit {
  ouvriers: Ouvrier[] = [];

  selectedOuvrier: Ouvrier | null = null;
  searchTerm: string = '';
  signalementTrackingId!: string | null;
  signalement!: Signalement;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private uploadService: UploadServiceService,
    private ouvrierService: OuvrierService,
    private signalementService: SignalementService,
    private tacheService: TacheService
  ) { }

  ngOnInit(): void {
    //recuperer le tracking ds l'url
    this.signalementTrackingId = this.route.snapshot.paramMap.get('trackingId');

    // recuperer tous les ouvriers
    this.ouvrierService.getOuvriers().subscribe({
      next: (response: any) => {
        this.ouvriers = response.data;
        console.log(response);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des ouvriers :', err);
      }
    });

    this.getSignalement();
  }



  // recuperer signalement
  getSignalement(): void {
    if (!this.signalementTrackingId) {
      console.error('signalementTrackingId est null ou undefined');
      return;
    }

    console.log('Récupération du signalement avec ID:', this.signalementTrackingId);

    this.signalementService.getSignalementById(this.signalementTrackingId).subscribe({
      next: (response: any) => {
        this.signalement = response.data;
        console.log('Signalement chargé:', this.signalement);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du signalement:', err);
      }
    });
  }

  onSelectionConfirmed(): void {
    if (this.selectedOuvrier && this.signalement) {
      const ouvrierId = this.selectedOuvrier.trackingId;
      const signalementId = this.signalement.trackingId;
      console.log('Ouvrier ID:', ouvrierId);
      console.log('Signalement ID:', signalementId);

      // Vérifier que les données sont valides
      if (!ouvrierId || !signalementId) {
        console.error('Données manquantes: ouvrierId ou signalementId');
        return;
      }

      // Mettre à jour le signalement avec l'ouvrier assigné
      this.signalement.ouvrierUuid = ouvrierId.toString();

      this.signalementService.updateSignalement(this.signalement.trackingId, this.signalement).subscribe({
        next: (updatedSignalement) => {
          console.log('Signalement mis à jour avec ouvrier:', updatedSignalement);

          // Mettre à jour l'ouvrier
          this.ouvrierService.updateOuvrierSignalementActuId(ouvrierId, signalementId).subscribe({
            next: (data) => {
              console.log('Ouvrier mis à jour :', data);

              // Créer la tâche
              const tache: Tache = {
                signalementId: this.signalementTrackingId!,
                activer: true,
                resolu: false,
                dateDebut:null,
                dateFin: null,
                etatDeTacheIds: [], // ou null
                fichierDevis: null!,
              };

              this.tacheService.createTache(tache).subscribe({
                next: (tache) => {
                  console.log('Tâche créée : ', tache);
                  // Navigation seulement après que toutes les opérations soient terminées
                  this.router.navigate(['admin/s-details/' + this.signalementTrackingId]);
                },
                error: (err) => {
                  console.error('Erreur lors de la création de la tâche: ', err);
                  // Navigation même en cas d'erreur de création de tâche
                  this.router.navigate(['admin/s-details/' + this.signalementTrackingId]);
                }
              });
            },
            error: (err) => {
              console.error('Erreur lors de la mise à jour de l\'ouvrier :', err);
              // Navigation même en cas d'erreur de mise à jour de l'ouvrier
              this.router.navigate(['admin/s-details/' + this.signalementTrackingId]);
            }
          });
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour du signalement:', err);
        }
      });
    } else {
      console.error('Ouvrier ou signalement non sélectionné/chargé');
      if (!this.selectedOuvrier) {
        console.error('Aucun ouvrier sélectionné');
      }
      if (!this.signalement) {
        console.error('Signalement non chargé');
      }
    }
  }

  selectOuvrier(ouvrier: Ouvrier): void {
    this.selectedOuvrier = ouvrier;
  }


  voirProfil(ouvrier: Ouvrier): void {
    console.log('Voir le profil de:', ouvrier);
    // Ici vous pourrez ajouter la navigation vers la page de profil
    // this.router.navigate(['/ouvrier-profil', ouvrier.id]);
  }

  filterOuvriers(): Ouvrier[] {
    if (!this.searchTerm) return this.ouvriers;

    return this.ouvriers.filter(ouvrier =>
      ouvrier.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      ouvrier.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      ouvrier.specialite.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}

