import React, { useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import './JobTabs.css';

const JobTabs = () => {
  const { 
    activeJobId, 
    setActiveJobId,
    setActiveCategory,
    getJobs
  } = useData();

  // Réinitialiser la catégorie quand le métier change
  useEffect(() => {
    setActiveCategory('all');
  }, [activeJobId, setActiveCategory]);

  const jobs = getJobs();

  // Pas de tabs si pas de métiers
  if (jobs.length <= 1) {
    return null;
  }

  return (
    <div className="job-tabs-main">
      {jobs.map(job => (
        <div 
          key={job.id} 
          className={`job-tab ${activeJobId === job.id ? 'active' : ''}`}
          onClick={() => setActiveJobId(job.id)}
        >
          {job.name}
        </div>
      ))}
    </div>
  );
};

export default JobTabs;