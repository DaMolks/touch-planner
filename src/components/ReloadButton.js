import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import './ReloadButton.css';

const ReloadButton = () => {
  const { saveGameData, gameData } = useData();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  // Effacer le message après 5 secondes
  const clearStatus = () => {
    setTimeout(() => {
      setStatus({ type: '', message: '' });
    }, 5000);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setStatus({ type: '', message: '' });

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);
        
        // Vérifier que le fichier contient les données attendues
        if (!jsonData.items || !jsonData.recipes || !jsonData.jobs) {
          throw new Error('Le fichier ne contient pas toutes les données nécessaires');
        }
        
        // Si les données ont l'air correctes, on peut les sauvegarder
        const itemCount = Object.keys(jsonData.items).length;
        const recipeCount = Object.keys(jsonData.recipes).length;
        
        saveGameData(jsonData);
        
        setStatus({ 
          type: 'success', 
          message: `Données rechargées avec succès: ${itemCount} objets, ${recipeCount} recettes.` 
        });
        clearStatus();
        
      } catch (error) {
        console.error('Erreur lors du traitement du fichier JSON:', error);
        setStatus({ 
          type: 'error', 
          message: 'Le fichier JSON est invalide. Vérifiez son format.' 
        });
        clearStatus();
      } finally {
        setLoading(false);
        // Réinitialiser l'input file pour permettre de sélectionner le même fichier à nouveau
        event.target.value = '';
      }
    };

    reader.onerror = () => {
      setStatus({ type: 'error', message: 'Erreur lors de la lecture du fichier.' });
      setLoading(false);
      clearStatus();
    };

    reader.readAsText(file);
  };

  return (
    <div className="reload-button-container">
      <label className="reload-button">
        <input 
          type="file" 
          accept=".json" 
          onChange={handleFileUpload} 
          disabled={loading}
        />
        {loading ? 'Chargement...' : 'Recharger les données'}
      </label>
      
      {status.message && (
        <div className={`status-message ${status.type}`}>
          {status.message}
        </div>
      )}
      
      {gameData && Object.keys(gameData.items).length > 0 && (
        <div className="data-info">
          <span>{Object.keys(gameData.items).length} objets</span>
          <span>{Object.keys(gameData.recipes).length} recettes</span>
        </div>
      )}
    </div>
  );
};

export default ReloadButton;
