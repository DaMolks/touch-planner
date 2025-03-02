# Touch Planner

Une calculatrice de craft avancée pour Dofus Touch avec suivi des prix du marché et organisation par métiers.

## Fonctionnalités

- **Organisation des objets** : Par métiers et catégories
- **Calcul de rentabilité** : Prend en compte la taxe de vente de 3%
- **Suivi de l'historique des prix** : Avec graphiques d'évolution
- **Indicateurs visuels** : Prix bas, moyen ou élevé par rapport à l'historique
- **Calcul par lots** : Simulez des crafts de 1, 10, 100 ou 1000 items
- **Stockage local** : Les prix sont sauvegardés dans votre navigateur

## Installation

1. Clonez le dépôt :
```bash
git clone https://github.com/DaMolks/touch-planner.git
cd touch-planner
```

2. Installez les dépendances :
```bash
npm install
```

3. Lancez l'application en développement :
```bash
npm start
```

4. Pour construire la version de production :
```bash
npm run build
```

## Utilisation

### Chargement des données

1. Au premier démarrage, vous devez charger un fichier JSON contenant les données du jeu
2. Utilisez le [script de scraping](https://github.com/DaMolks/dofus-touch-scraper) pour générer ce fichier JSON
3. Une fois chargé, les données sont stockées dans le navigateur

### Navigation et filtrage

1. Utilisez les onglets de métiers pour filtrer les objets par métier
2. Utilisez les filtres de catégories pour filtrer par type d'objet
3. Utilisez la barre de recherche pour trouver rapidement un objet spécifique

### Calcul de rentabilité

1. Sélectionnez un objet dans la liste pour voir sa recette
2. Entrez les prix des ingrédients et le prix de vente
3. Choisissez la taille du lot (1, 10, 100 ou 1000 items)
4. Consultez les résultats de rentabilité avec taxe incluse

### Suivi des prix

1. Les cercles colorés à côté des prix indiquent si le prix est :
   - 🟢 Bas (inférieur à 90% de la moyenne)
   - 🟠 Moyen (entre 90% et 110% de la moyenne)
   - 🔴 Élevé (supérieur à 110% de la moyenne)
2. Cliquez sur ces indicateurs pour voir l'historique des prix
3. Les prix sont automatiquement ajoutés à l'historique à chaque modification

## Structure des données

Le fichier JSON doit contenir trois sections principales :

```json
{
  "items": {
    "12345": {
      "id": 12345,
      "name": "Nom de l'objet",
      "imgUrl": "https://...",
      "type": "equipement",
      "level": 50
    }
  },
  "recipes": {
    "12345": {
      "resultId": 12345,
      "ingredients": [
        {"itemId": 6789, "quantity": 3},
        {"itemId": 9876, "quantity": 1}
      ],
      "jobId": 5,
      "jobLevel": 45
    }
  },
  "jobs": {
    "5": {
      "id": 5,
      "name": "Forgeur de Marteaux"
    }
  }
}
```

## Génération des données

Pour générer le fichier JSON des données, utilisez notre [script de scraping Python](https://github.com/DaMolks/dofus-touch-scraper) qui extrait les informations depuis le wiki officiel de Dofus Touch.

## Technologies utilisées

- React.js pour l'interface utilisateur
- Chart.js pour les graphiques d'historique des prix
- LocalStorage pour la persistance des données

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request pour suggérer des améliorations.

## Licence

MIT
