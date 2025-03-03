import React from 'react';
import { useData } from '../contexts/DataContext';
import './JobTabs.css';

const JobTabs = () => {
  const { 
    activeJobId, 
    setActiveJobId,
    getJobs
  } = useData();

  const jobs = getJobs();

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