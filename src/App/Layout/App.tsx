import * as React from 'react';
import styles from './App.module.css';
import EventDashboard from '../../Features/Events/EventDashboard/EventDashboard';

const App: React.FC = () => {
  return (
    <div className={styles.App}>
      <h1>Re-vents</h1>
      <EventDashboard />
    </div>
  );
};

export default App;
