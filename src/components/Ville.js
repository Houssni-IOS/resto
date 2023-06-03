import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Button, Modal, Form, Table } from 'react-bootstrap';
import Header from './Header';

function Ville() {
  const [villes, setVilles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredVilles, setFilteredVilles] = useState([]);
  const [nom, setNom] = useState('');
  const [selectedVille, setSelectedVille] = useState(null);

  useEffect(() => {
    fetchVilles();
  }, []);

  useEffect(() => {
    filterVilles();
  }, [villes, searchTerm]);

  const fetchVilles = async () => {
    try {
      const response = await axios.get('/api/villes');
      setVilles(response.data);
    } catch (error) {
      console.error('Error fetching villes:', error);
    }
  };

  const filterVilles = () => {
    const filtered = villes.filter((ville) =>
      ville.nom.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVilles(filtered);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddVille = async () => {
    try {
      const response = await axios.post('/api/villes', { nom: nom });
      setVilles([...villes, response.data]);
      setShowModal(false);
      setNom('');
    } catch (error) {
      console.error('Error adding ville:', error);
    }
  };

  const handleDeleteVille = async (id) => {
    try {
      await axios.delete(`/api/villes/${id}`);
      setVilles(villes.filter((ville) => ville.id !== id));
    } catch (error) {
      console.error('Error deleting ville:', error);
    }
  };

  const handleModifyVille = async () => {
    try {
      await axios.put(`/api/villes/${selectedVille.id}`, { nom: nom });
      const modifiedVilles = villes.map((ville) =>
        ville.id === selectedVille.id ? { ...ville, nom: nom } : ville
      );
      setVilles(modifiedVilles);
      setShowModal(false);
      setNom('');
      setSelectedVille(null);
    } catch (error) {
      console.error('Error modifying ville:', error);
    }
  };

  const openModifyModal = (ville) => {
    setSelectedVille(ville);
    setNom(ville.nom);
    setShowModal(true);
  };

  return (
    <div>
      <Header />
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center">
          <h2>Ville List</h2>
          <div className="text-center">
            <input
              type="text"
              className="form-control"
              placeholder="Search by ville name"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div>
            <Button variant="primary" onClick={() => setShowModal(true)}>
              Add
            </Button>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVilles.map((ville) => (
              <tr key={ville.id}>
                <td>{ville.nom}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => openModifyModal(ville)}
                    className="mr-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteVille(ville.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedVille ? 'Edit Ville' : 'Add Ville'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Nom</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter ville name"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={selectedVille ? handleModifyVille : handleAddVille}
          >
            {selectedVille ? 'Save Changes' : 'Add'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Ville;
