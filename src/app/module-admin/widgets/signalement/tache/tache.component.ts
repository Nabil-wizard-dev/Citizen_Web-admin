import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EtatDeEtatDeEtatDeTacheService } from '../../../services/etatDeTache/etat-de-tache.service';
import { EtatDeTache } from '../../../models/etatDeTache';
import { Tache } from '../../../models/tache';
import { TacheService } from '../../../services/tache/tache.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-tache',
  standalone: false,
  templateUrl: './tache.component.html',
  styleUrl: './tache.component.css'
})
export class TacheComponent implements OnInit {
  etatsDeTache: EtatDeTache[] = [];
  tacheId?: string;
  tache?: Tache;
  tachesAValider: Tache[] = [];
  

  constructor(
    private route: ActivatedRoute,
    private etatDeTacheService: EtatDeEtatDeEtatDeTacheService,
    private tacheService: TacheService,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    // Récupération de l'id de la tâche depuis l'URL
    this.tacheId = this.route.snapshot.paramMap.get('id')!;
    console.log(this.tacheId);
    
    this.getTacheById(this.tacheId)
    this.getEtatsByTache(this.tacheId);
    this.chargerTachesAValider();
    
  }

  getTacheById(id: string): void {
    this.tacheService.getTacheById(id).subscribe({
      next: (response:any) => {
        this.tache = response.data;
        console.log('Tâche récupérée :', this.tache);
        
      },
      error: (err) => {
        console.error('Erreur lors de la récupération de la tâche :', err);
      }
    });
  }

  getEtatsByTache(tacheId: string): void {
    this.etatDeTacheService.getEtatsByTache(tacheId).subscribe({
      next: (response: any) => {
        this.etatsDeTache = response.data;
        console.log('États de tâche récupérés :',this.etatsDeTache );
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des états de tâche :', err);
      }
    });
  }

  activerTache() {
    if (!this.tache || !this.tacheId) return;
    const tacheMaj = { ...this.tache, activer: true };
    this.tacheService.setTacheActiver(this.tacheId).subscribe({
      next: (response: any) => {
        this.tache = response;
        this.getTacheById(this.tacheId!)
      },
      error: (err) => {
        console.error('Erreur lors de l\'activation de la tâche :', err);
      }
    });
  }

  marquerTacheResolu() {
    if (!this.tache || !this.tacheId) return;
    const tacheMaj = { ...this.tache, resolu: true };
    this.tacheService.setTacheResolu(this.tacheId).subscribe({
      next: (response: any) => {
        this.tache = response;
      },
      error: (err) => {
        console.error('Erreur lors du passage de la tâche à résolue :', err);
      }
    });
  }

  chargerTachesAValider(): void {
    this.tacheService.getTachesAValider().subscribe({
      next: (response: any) => {
        this.tachesAValider = response.data || response;
      },
      error: (err) => {
        this.message.error('Erreur lors du chargement des rapports à valider');
      }
    });
  }

  validerRapport(tache: Tache): void {
    this.tacheService.validerRapport(tache.trackingId!).subscribe({
      next: () => {
        this.message.success('Rapport validé');
        this.chargerTachesAValider();
      },
      error: () => {
        this.message.error('Erreur lors de la validation');
      }
    });
  }

  rejeterRapport(tache: Tache): void {
    this.tacheService.rejeterRapport(tache.trackingId!).subscribe({
      next: () => {
        this.message.success('Rapport rejeté');
        this.chargerTachesAValider();
      },
      error: () => {
        this.message.error('Erreur lors du rejet');
      }
    });
  }
}
