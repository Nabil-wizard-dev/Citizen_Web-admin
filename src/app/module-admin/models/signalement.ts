export interface Signalement {
  trackingId: string,
  titre: string,
  code: string,
  description: string,
  typeService: string,
  typeSignalement: string,
  serviceId: number,
  fichiers: string[],
  fichiersPaths: string[],
  commentaireService: string,
  priorite: number,
  latitude: string,
  longitude: string,
  ouvrierUuid: string,
  traiteurUuid: string,
  statut: string
}