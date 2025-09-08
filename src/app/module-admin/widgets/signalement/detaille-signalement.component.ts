  getImageUrl(path: string): string {
    // Si le backend sert les fichiers à partir d'une URL publique, adapter ici
    // Exemple : remplacer le chemin local par l'URL du serveur
    // Supposons que les images sont accessibles via /media/images/...
    const fileName = path.split(/[/\\]/).pop();
    return `/media/images/${fileName}`;
  } 