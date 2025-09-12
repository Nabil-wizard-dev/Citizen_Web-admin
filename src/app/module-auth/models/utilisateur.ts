export interface Utilisateur {
    nom: string
    prenom: string;
    imagePath?: string;
    cni: string;
    adresse: string;
    numero: number;
    dateNaissance: Date;
    email: string;
    motDePasse: string;
    role: string;
    photoProfil?: string;
    trackingId?: string;
}