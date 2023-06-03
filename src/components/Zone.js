import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Button, Modal, Form, Table } from 'react-bootstrap';
import Header from './Header';

function Zone() {
  const [zones, setZones] = useState([]);
  const [villes, setVilles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredZones, setFilteredZones] = useState([]);
  const [nom, setNom] = useState('');
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedVille, setSelectedVille] = useState('');
  const [filteredVille, setFilteredVille] = useState('');

  useEffect(() => {
    fetchZones();
    fetchVilles();
  }, []);

  useEffect(() => {
    filterZones();
  }, [zones, searchTerm, filteredVille]);

  const fetchZones = async () => {
    try {
      const response = await axios.get('/api/zones');
      setZones(response.data);
    } catch (error) {
      console.error('Error fetching zones:', error);
    }
  };

  const fetchVilles = async () => {
    try {
      const response = await axios.get('/api/villes');
      setVilles(response.data);
    } catch (error) {
      console.error('Error fetching villes:', error);
    }
  };

  const filterZones = () => {
    const filtered = zones.filter(
      (zone) =>
        zone.nom.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filteredVille
          ? zone.ville && zone.ville.nom.toLowerCase().includes(filteredVille.toLowerCase())
          : true)
    );
    setFilteredZones(filtered);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleVilleFilter = (e) => {
    setFilteredVille(e.target.value);
  };

  const handleAddZone = async () => {
    try {
      const response = await axios.post('/api/zones', {
        nom: nom,
        ville: { id: selectedVille },
      });
      setZones([...zones, response.data]);
      setShowModal(false);
      setNom('');
      setSelectedVille('');
    } catch (error) {
      console.error('Error adding zone:', error);
    }
  };

  const handleDeleteZone = async (id) => {
    try {
      await axios.delete(`/api/zones/${id}`);
      setZones(zones.filter((zone) => zone.id !== id));
    } catch (error) {
      console.error('Error deleting zone:', error);
    }
  };

  const handleModifyZone = async () => {
    try {
      await axios.put(`/api/zones/${selectedZone.id}`, {
        nom: nom,
        ville: { id: selectedVille },
      });
      const modifiedZones = zones.map((zone) =>
        zone.id === selectedZone.id ? { ...zone, nom: nom, ville: { id: selectedVille } } : zone
      );
      setZones(modifiedZones);
      setShowModal(false);
      setNom('');
      setSelectedVille('');
      setSelectedZone(null);
    } catch (error) {
      console.error('Error modifying zone:', error);
    }
  };

  const openModifyModal = (zone) => {
    setSelectedZone(zone);
    setNom(zone.nom);
    setSelectedVille(zone.ville ? zone.ville.id : '');
    setShowModal(true);
  };

  return (
    <div>
      <Header />
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Zone List</h2>
          <div className="d-flex">
            <div className="mr-2">
              <input
                type="text"
                className="form-control"
                placeholder="Search by zone name"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <div>
              <Form.Select
                value={filteredVille}
                onChange={handleVilleFilter}
                className="form-select"
              >
                <option value="">All Villes</option>
                {villes.map((ville) => (
                  <option key={ville.id} value={ville.nom}>
                    {ville.nom}
                  </option>
                ))}
              </Form.Select>
            </div>
          </div>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Add
          </Button>
        </div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Zone Name</th>
              <th>Ville</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredZones.map((zone) => (
              <tr key={zone.id}>
                <td>{zone.nom}</td>
                <td>{zone.ville ? zone.ville.nom : ''}</td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteZone(zone.id)}
                    className="mr-2"
                  >
                    Delete
                  </Button>
                  <Button variant="primary" onClick={() => openModifyModal(zone)}>
                    Modify
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedZone ? 'Modify Zone' : 'Add Zone'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Zone Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter zone name"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              name="nom"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Ville</Form.Label>
            <Form.Select
              value={selectedVille}
              onChange={(e) => setSelectedVille(e.target.value)}
              className="form-select"
            >
              <option value="">Select Ville</option>
              {villes.map((ville) => (
                <option key={ville.id} value={ville.id}>
                  {ville.nom}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          {selectedZone ? (
            <Button variant="primary" onClick={handleModifyZone}>
              Modify
            </Button>
          ) : (
            <Button variant="primary" onClick={handleAddZone}>
              Add
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Zone;
