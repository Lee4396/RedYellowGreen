import React, { useState } from 'react';
import CentralLocationSetup from './components/centralLocationSetup';

function App() {
  const [role, setRole] = useState('Admin');

  return (
    <div>
      <h1>Red, Yellow, Green Production</h1>
      <label>Role: </label>
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="Admin">Admin</option>
        <option value="Supervisor">Supervisor</option>
        <option value="Worker">Worker</option>
      </select>

      <CentralLocationSetup role={role} />
    </div>
  );
}

export default App;