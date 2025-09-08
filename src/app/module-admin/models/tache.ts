export interface Tache {
   trackingId?:string ;
   dateDebut: string | null;
   dateFin: string | null;
   fichierDevis?:string;
   activer: boolean;
   resolu: boolean ;
   signalementId: string;
   etatDeTacheIds: string[];
   statutRapport?: string;
   ouvrierNom?: string;
}