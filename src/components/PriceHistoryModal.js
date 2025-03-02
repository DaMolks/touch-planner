import React, { useEffect, useRef } from 'react';
import { usePrices } from '../contexts/PriceContext';
import { useData } from '../contexts/DataContext';
import { Chart, registerables } from 'chart.js';
import ImageWithFallback from './ImageWithFallback';
import './PriceHistoryModal.css';

// Enregistrer tous les elements necessaires pour Chart.js
Chart.register(...registerables);

const PriceHistoryModal = ({ item, onClose }) => {
  const { getItemPriceHistory, getAveragePrice } = usePrices();
  const { gameData } = useData();
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  
  // Recuperer l'historique des prix pour cet item
  const priceHistory = getItemPriceHistory(item.id);
  const averagePrice = getAveragePrice(item.id);
  const itemData = gameData.items[item.id] || {};
  
  useEffect(() => {
    // Si pas d'historique, ne rien faire
    if (!priceHistory || priceHistory.length === 0) return;
    
    // Detruire le graphique precedent s'il existe
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    // Preparer les donnees pour le graphique
    const dates = [];
    const prices = [];
    
    // Trier l'historique par date (du plus ancien au plus recent)
    const sortedHistory = [...priceHistory].sort((a, b) => 
      new Date(a.timestamp) - new Date(b.timestamp)
    );
    
    sortedHistory.forEach(entry => {
      const date = new Date(entry.timestamp);
      dates.push(date.toLocaleDateString());
      prices.push(entry.price);
    });
    
    // Creer le nouveau graphique
    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: 'Prix (kamas)',
          data: prices,
          borderColor: 'rgb(52, 152, 219)',
          backgroundColor: 'rgba(52, 152, 219, 0.1)',
          tension: 0.1,
          fill: true
        }, {
          label: 'Prix moyen',
          data: Array(dates.length).fill(averagePrice),
          borderColor: 'rgb(231, 76, 60)',
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `Historique des prix: ${item.name}`,
            font: {
              size: 16
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ${context.raw.toLocaleString()} kamas`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return value.toLocaleString() + ' K';
              }
            }
          }
        }
      }
    });
    
    // Nettoyage a la fermeture du modal
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [priceHistory, item.name, averagePrice]);
  
  // Formater la date pour l'affichage
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  return (
    <div className="price-history-modal">
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-title">
            <ImageWithFallback 
              src={itemData.imgUrl} 
              alt={item.name} 
              className="modal-item-image"
            />
            <h2>Historique des prix - {item.name}</h2>
          </div>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        {priceHistory.length === 0 ? (
          <div className="no-history">
            <p>Aucun historique de prix disponible pour cet objet.</p>
          </div>
        ) : (
          <>
            <div className="price-chart-container">
              <canvas ref={chartRef}></canvas>
            </div>
            
            <div className="price-summary">
              <div className="summary-item">
                <span>Prix moyen:</span>
                <span className="value">{averagePrice.toLocaleString()} kamas</span>
              </div>
              <div className="summary-item">
                <span>Prix le plus recent:</span>
                <span className="value">
                  {priceHistory[priceHistory.length - 1].price.toLocaleString()} kamas
                </span>
              </div>
              <div className="summary-item">
                <span>Nombre d'entrees:</span>
                <span className="value">{priceHistory.length}</span>
              </div>
            </div>
            
            <div className="price-history-table-container">
              <h3>Detail des prix</h3>
              <table className="price-history-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Prix (kamas)</th>
                  </tr>
                </thead>
                <tbody>
                  {[...priceHistory].reverse().map((entry, index) => (
                    <tr key={index}>
                      <td>{formatDate(entry.timestamp)}</td>
                      <td>{entry.price.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PriceHistoryModal;