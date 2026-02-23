import React from 'react';
import CentralLocationSetup from './components/centralLocationSetup';

function App() {
  const [role, setRole] = React.useState('Admin'); // default to Admin

  return (
    <div>
      <h1>Red, yellow, green</h1>
      <label>Role: </label>
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="Admin">Admin</option>
        <option value="Worker">Worker</option>
      </select>

      <CentralLocationSetup role={role} />
    </div>
  );
}

export default App;
