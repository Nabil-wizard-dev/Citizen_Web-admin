export interface Ouvrier {
   trackingId?: string;
   nom: string;
   prenom: string;
   imagePath?: string;
   cni: string;
   adresse?: string;
   numero: string;
   dateNaissance?: string;
   email: string;
   motDePasse: string;
   role: string;
   
   serviceId?: number;
   signalementActuelId?: string;
   specialite: string;
}