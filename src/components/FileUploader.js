import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import './FileUploader.css';

const FileUploader = ({ onDataLoaded }) => {
  const { saveGameData } = useData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setError('');

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);
        
        // Vérifier que le fichier contient les données attendues
        if (!jsonData.items || !jsonData.recipes || !jsonData.jobs) {
          throw new Error('Le fichier ne contient pas toutes les données nécessaires (items, recipes, jobs)');
        }
        
        // Sauvegarder les données
        saveGameData(jsonData);
        
        // Notifier que les données sont chargées
        if (onDataLoaded) onDataLoaded();
        
      } catch (error) {
        console.error('Erreur lors du traitement du fichier JSON:', error);
        setError('Le fichier JSON est invalide. Assurez-vous qu\'il contient les données correctes.');
      } finally {
        setLoading(false);
      }
    };

    reader.onerror = () => {
      setError('Erreur lors de la lecture du fichier.');
      setLoading(false);
    };

    reader.readAsText(file);
  };

  return (
    <div className="file-uploader panel">
      <h2>Importer les données du jeu</h2>
      <p className="description">
        Chargez un fichier JSON contenant les données d'objets, de recettes et de métiers de Dofus Touch.
      </p>
      
      <div className="upload-container">
        <label className="upload-button">
          <input type="file" accept=".json" onChange={handleFileUpload} />
          Sélectionner un fichier
        </label>
        
        {loading && <div className="loading">Chargement des données...</div>}
        {error && <div className="error">{error}</div>}
      </div>
      
      <div className="info-box">
        <h3>Comment obtenir le fichier de données ?</h3>
        <p>
          Utilisez notre script de scraping disponible sur GitHub pour extraire les données du wiki officiel du jeu.
          Suivez les instructions dans le README pour générer le fichier JSON.
        </p>
      </div>
    </div>
  );
};

export default FileUploader;
