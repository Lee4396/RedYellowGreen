import React, { useState, useEffect } from 'react';

function CentralLocationSetup({ role }) {
    const [newEquipments, setNewEquipments] = useState([{ id: 1 }]);
    const [allEquipments, setAllEquipments] = useState([]);
    const [editedStates, setEditedStates] = useState({});
    const [message, setMessage] = useState('');

    // Colors for ProductionState
    const stateColors = {
        Red: '#ff4d4f',
        Yellow: '#faad14',
        Green: '#52c41a'
    };

    // --------------------------
    // Fetch all equipments
    // --------------------------
    useEffect(() => {
        fetch('http://localhost:5000/api/centrallocation', {
            method: 'GET',
            headers: { 'Role': role },
        })
            .then(res => res.json())
            .then(data => setAllEquipments(data))
            .catch(err => setMessage(`Error: ${err.message}`));
    }, [role]);

    // --------------------------
    // Admin functions
    // --------------------------
    const handleNewEquipmentChange = (index, value) => {
        const isDuplicate = newEquipments.some(
            (eq, idx) => Number(eq.id) === Number(value) && idx !== index
        );
        if (isDuplicate) {
            alert('Equipment ID must be unique.');
            return;
        }
        const updated = [...newEquipments];
        updated[index].id = value;
        setNewEquipments(updated);
    };

    const addNewEquipment = () => {
        const lastId = newEquipments.length > 0 ? newEquipments[newEquipments.length - 1].id : 0;
        setNewEquipments([...newEquipments, { id: lastId + 1 }]);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/centrallocation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Role': role },
                body: JSON.stringify({ equipments: newEquipments }),
            });

            if (!res.ok) throw new Error('Failed to create Central Location');

            const data = await res.json();

            setAllEquipments(data.equipments);
            setMessage(`Created ${data.equipments.length} equipments`);

            const lastId = newEquipments.length > 0 ? newEquipments[newEquipments.length - 1].id : 0;
            setNewEquipments([{ id: lastId + 1 }]);
        } catch (err) {
            setMessage(err.message);
        }
    };

    // --------------------------
    // Worker functions
    // --------------------------
    const handleStateChange = (equipmentId, newState) => {
        setEditedStates(prev => ({
            ...prev,
            [equipmentId]: newState
        }));
    };

    const handleSaveStates = async () => {
        try {
            const updates = Object.entries(editedStates).map(([id, state]) => ({
                id: Number(id),
                productionState: state
            }));

            const res = await fetch('http://localhost:5000/api/centrallocation/batch', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Role': role },
                body: JSON.stringify(updates),
            });

            if (!res.ok) throw new Error('Failed to update states');

            const updatedEquipments = await res.json();

            setAllEquipments(updatedEquipments);
            setEditedStates({});
            setMessage('States updated successfully');
        } catch (err) {
            setMessage(err.message);
        }
    };

    // --------------------------
    // Render
    // --------------------------
    return (
        <div>
            {/* Admin view */}
            {role === 'Admin' && (
                <div>
                    <form onSubmit={handleCreate}>
                        <h2>Setup Equipments</h2>
                        {newEquipments.map((eq, idx) => (
                            <div key={idx}>
                                Equipment ID:
                                <input
                                    type="number"
                                    value={eq.id}
                                    min="1"
                                    onChange={e => handleNewEquipmentChange(idx, Number(e.target.value))}
                                    required
                                />
                            </div>
                        ))}
                        <button type="button" onClick={addNewEquipment}>Add Equipment</button>
                        <button type="submit">Submit</button>
                    </form>
                    {allEquipments.length > 0 && (
                        <div style={{ marginTop: '20px' }}>
                            <h3>Created Equipments</h3>
                            <div>
                                {allEquipments.map((eq, idx) => (
                                    <span key={eq.id}>
                                        {eq.id}{idx < allEquipments.length - 1 ? ', ' : ''}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Worker view */}
            {role === 'Worker' && (
                <div>
                    <h2>All Equipments</h2>
                    {allEquipments.length === 0 && <p>No equipments found.</p>}

                    {allEquipments.map(eq => (
                        <div
                            key={eq.id}
                            style={{
                                marginBottom: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}
                        >
                            <span>ID: {eq.id}</span>
                            <select
                                value={editedStates[eq.id] ?? eq.productionState}
                                onChange={e => handleStateChange(eq.id, e.target.value)}
                                style={{
                                    padding: '5px 10px',
                                    borderRadius: '4px',
                                    backgroundColor: stateColors[editedStates[eq.id] ?? eq.productionState],
                                    color: 'white'
                                }}
                            >
                                <option value="Red">standing still</option>
                                <option value="Yellow">starting up/winding down</option>
                                <option value="Green">producing normally</option>
                            </select>
                        </div>
                    ))}

                    <button
                        onClick={handleSaveStates}
                        disabled={Object.keys(editedStates).length === 0}
                    >
                        Save Changes
                    </button>
                </div>
            )}

            {message && <p>{message}</p>}
        </div>
    );
}

export default CentralLocationSetup;