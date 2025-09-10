import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SignalementService } from '../../../services/signalement/signalement.service';
import { Signalement } from '../../../models/signalement';
import { TacheService } from '../../../services/tache/tache.service';
import { Tache } from '../../../models/tache';
import { log } from 'ng-zorro-antd/core/logger';




@Component({
  selector: 'app-detaille-signalement',
  standalone: false,
  templateUrl: './detaille-signalement.component.html',
  styleUrl: './detaille-signalement.component.css'
})
export class DetailleSignalementComponent {
  signalement!: Signalement;
  adresse: string = '';
  photoFichiersPaths!:string[]
  videoFichiersPaths!:string[]
  tache?: Tache;

  constructor(private route: ActivatedRoute,
    private signalementService: SignalementService,
    private tacheService: TacheService,
    private router: Router) { }

  ngOnInit(): void {
    //recuperation du signalement en question
    this.route.params.subscribe(params => {
      console.log('📋 Paramètres de route:', params);
      this.signalementService.getSignalementById(params['id']).subscribe((response: any) => {
        this.signalement = response.data;
        console.log('📊 Signalement récupéré:', this.signalement);
        console.log('🆔 trackingId du signalement:', this.signalement.trackingId);
        this.getAndSortFichierPaths();
        // pour recuperer l'adresse par defaut
        this.signalementService.reverseGeocode(parseFloat(this.signalement.latitude), parseFloat(this.signalement.longitude))
        .subscribe((geoData: any) => {
          this.adresse = geoData.display_name;
        });
       // récupération de la tâche liée au signalement
     this.getTacheBySignalement(this.signalement.trackingId);
      });
    });

    //methode pour le tri des chemins
    this.getAndSortFichierPaths();
  }

  getTacheBySignalement(signalementId: string): void {
    this.tacheService.getTacheBysignalement(signalementId).subscribe({
      next: (response:any) => {
        this.tache = response.data;
        console.log('Tâche récupérée :', this.tache);
        
      },
      error: (err) => {
        console.error('Erreur lors de la récupération de la tâche :', err);
      }
    });
  }

  redirigerVersTache(): void {
     // récupération de la tâche liée au signalement
     this.getTacheBySignalement(this.signalement.trackingId);
    this.router.navigate(['/tache', this.tache?.trackingId]);
  }


  getAndSortFichierPaths(): void {
    if (!this.signalement || !this.signalement.fichiersPaths) {
      this.photoFichiersPaths = [];
      this.videoFichiersPaths = [];
      return;
    }
    const photoExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.mkv', '.webm'];
    this.photoFichiersPaths = this.signalement.fichiersPaths.filter(path =>
      photoExtensions.some(ext => path.toLowerCase().endsWith(ext))
    );
    this.videoFichiersPaths = this.signalement.fichiersPaths.filter(path =>
      videoExtensions.some(ext => path.toLowerCase().endsWith(ext))
    );

    console.log(this.photoFichiersPaths);
    console.log(this.videoFichiersPaths);
    
    
  }

  getMapUrl(): string {
    return `https://maps.google.com/maps?q=${this.signalement.latitude},${this.signalement.longitude}&z=15&output=embed`;
  }


  
}
