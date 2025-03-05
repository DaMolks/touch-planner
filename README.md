<div align="center">

<img src="https://raw.githubusercontent.com/DaMolks/touch-planner/main/assets/icon.png" alt="Touch Planner Logo" width="250"/>

*Une calculatrice de craft avancée pour Dofus Touch avec suivi des prix du marché et organisation par métiers*

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/DaMolks/touch-planner/releases/tag/v1.0.0)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/DaMolks/touch-planner/blob/main/LICENSE)

</div>

## 📋 Présentation

Touch Planner est un outil de gestion économique pour Dofus Touch qui vous permet de calculer la rentabilité de vos crafts, suivre l'évolution des prix du marché et organiser vos productions par métiers. Disponible en version web et desktop, l'application fonctionne entièrement en local pour une performance optimale.

## ✨ Fonctionnalités

- **🔍 Organisation intuitive** : Classement par métiers et catégories
- **💰 Calcul de rentabilité précis** : Prise en compte de la taxe de vente de 3%
- **📈 Historique des prix** : Visualisation graphique de l'évolution des prix
- **🚦 Indicateurs économiques** : Système visuel pour identifier les prix bas, moyens ou élevés
- **🔄 Calcul par lots** : Simulation de crafts en séries (1, 10, 100 ou 1000 items)
- **💾 Sauvegarde locale** : Stockage des données dans votre navigateur
- **🖥️ Version desktop** : Interface native pour Windows

## 🛠️ Technologies utilisées

- **Frontend**
  - React.js avec hooks pour une interface utilisateur réactive
  - Context API pour la gestion d'état globale
  - Styled Components pour le styling modulaire
  - Chart.js pour les visualisations graphiques
  
- **Stockage**
  - LocalStorage pour la persistance des données
  - IndexedDB pour le stockage des historiques de prix volumineux
  
- **Desktop**
  - Electron pour l'encapsulation multiplateforme
  - Electron-builder pour la génération des installateurs

- **Outils de développement**
  - Webpack pour le bundling
  - ESLint et Prettier pour le formatage du code
  - Jest pour les tests unitaires

## 🚀 Installation

### Version Web

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

### Version Desktop

1. Téléchargez le dernier installateur depuis la section [Releases](https://github.com/DaMolks/touch-planner/releases)

2. Exécutez l'installateur et suivez les instructions

3. Ou compilez vous-même l'exécutable :
```bash
npm run electron-pack
```

## 📊 Utilisation

1. **Chargement des données** : Au premier démarrage, chargez un fichier JSON contenant les données du jeu
2. **Navigation** : Utilisez les onglets et filtres pour trouver rapidement les objets
3. **Calcul** : Sélectionnez un objet, entrez les prix et visualisez la rentabilité
4. **Suivi** : Consultez l'historique des prix pour optimiser vos achats et ventes

## 🔮 Perspectives futures

### Plateforme communautaire de prix

Pour la version 2.0, nous prévoyons d'implémenter un système de partage communautaire des prix :

- **📡 Synchronisation cloud** : Envoi et réception des prix moyens du marché
- **🌐 Base de données centralisée** : Stockage sécurisé des données de prix
- **📊 Statistiques avancées** : Analyse des tendances par serveur
- **🔐 Système de contribution** : Validation communautaire pour assurer la fiabilité des prix
- **📱 Application mobile** : Extension de l'écosystème avec une version mobile

### Autres fonctionnalités prévues

- **🧮 Système de calcul d'optimisation** : Suggestions automatiques pour maximiser les profits
- **📑 Profils d'utilisateurs** : Sauvegarde de multiples configurations par serveur
- **🔔 Alertes de prix** : Notifications pour les variations importantes
- **🧩 API publique** : Intégration possible avec d'autres outils

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit vos changements (`git commit -m 'feat: add amazing feature'`)
4. Push sur la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📜 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

<div align="center">
  <sub>Made with ❤️ by DaMolks</sub>
</div>
