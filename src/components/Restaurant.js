import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';

const Restaurant = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [villes, setVilles] = useState([]);
  const [zones, setZones] = useState([]);
  const [filteredZones, setFilteredZones] = useState([]);
  const [searchVille, setSearchVille] = useState('');
  const [searchZone, setSearchZone] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [nom, setNom] = useState('');
  const [adresse, setAdresse] = useState('');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [numTel, setNumTel] = useState('');
  const [openAt, setOpenAt] = useState('');
  const [closeAt, setCloseAt] = useState('');
  const [specialities, setSpecialities] = useState([]);
  const [selectedVille, setSelectedVille] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get('/api/restaurants');
        setRestaurants(response.data);
        setFilteredRestaurants(response.data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
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

    const fetchZones = async () => {
      try {
        const response = await axios.get('/api/zones');
        setZones(response.data);
      } catch (error) {
        console.error('Error fetching zones:', error);
      }
    };

    fetchRestaurants();
    fetchVilles();
    fetchZones();
  }, []);

  useEffect(() => {
    const filtered = restaurants.filter((restaurant) =>
      restaurant.nom.toLowerCase().includes(searchVille.toLowerCase())
    );
    setFilteredRestaurants(filtered);
  }, [searchVille, restaurants]);

  useEffect(() => {
    const filtered = zones.filter((zone) => zone.nom.toLowerCase().includes(searchZone.toLowerCase()));
    setFilteredZones(filtered);
  }, [searchZone, zones]);

  const handleSearchVille = (e) => {
    setSearchVille(e.target.value);
  };

  const handleSearchZone = (e) => {
    setSearchZone(e.target.value);
  };

  const handleAddRestaurant = async () => {
    try {
      const response = await axios.post('/api/restaurants', {
        nom: nom,
        adresse: adresse,
        longitude: longitude,
        lattitude: latitude,
        num_tel: numTel,
        openAt: openAt,
        closeAt: closeAt,
        specialities: specialities,
        zone: { id: selectedZone, ville: { id: selectedVille } },
      });

      setRestaurants([...restaurants, response.data]);
      setShowModal(false);
      setNom('');
      setAdresse('');
      setLongitude('');
      setLatitude('');
      setNumTel('');
      setOpenAt('');
      setCloseAt('');


      setSpecialities([]);
      setSelectedVille('');
      setSelectedZone('');
    } catch (error) {
      console.error('Error adding restaurant:', error);
    }
  };

  const handleDeleteRestaurant = async (id) => {
    try {
      await axios.delete(`/api/restaurants/${id}`);
      const updatedRestaurants = restaurants.filter((restaurant) => restaurant.id !== id);
      setRestaurants(updatedRestaurants);
    } catch (error) {
      console.error('Error deleting restaurant:', error);
    }
  };

  const handleEditRestaurant = async () => {
    try {
      await axios.put(`/api/restaurants/${selectedRestaurant.id}`, {
        nom: nom,
        adresse: adresse,
        longitude: longitude,
        lattitude: latitude,
        num_tel: numTel,
        openAt: openAt,
        closeAt: closeAt,
        specialities: specialities,
        zone: { id: selectedZone, ville: { id: selectedVille } },
      });

      const updatedRestaurants = restaurants.map((restaurant) => {
        if (restaurant.id === selectedRestaurant.id) {
          return {
            ...restaurant,
            nom: nom,
            adresse: adresse,
            longitude: longitude,
            lattitude: latitude,
            num_tel: numTel,
            openAt: openAt,
            closeAt: closeAt,
            specialities: specialities,
            zone: { id: selectedZone, ville: { id: selectedVille } },
          };
        }
        return restaurant;
      });

      setRestaurants(updatedRestaurants);
      setShowModal(false);
      setNom('');
      setAdresse('');
      setLongitude('');
      setLatitude('');
      setNumTel('');
      setOpenAt('');
      setCloseAt('');
      setSpecialities([]);
      setSelectedVille('');
      setSelectedZone('');
      setSelectedRestaurant(null);
    } catch (error) {
      console.error('Error editing restaurant:', error);
    }
  };

  const handleEditModalOpen = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowModal(true);
    setNom(restaurant.nom);
    setAdresse(restaurant.adresse);
    setLongitude(restaurant.longitude);
    setLatitude(restaurant.lattitude);
    setNumTel(restaurant.num_tel);
    setOpenAt(restaurant.openAt);
    setCloseAt(restaurant.closeAt);
    setSpecialities(restaurant.specialities);
    setSelectedVille(restaurant.zone.ville.id);
    setSelectedZone(restaurant.zone.id);
  };

  return (
    <div>
      <h1>Restaurant Management</h1>

      <div>
        <h2>Filter by Ville:</h2>
        <input type="text" value={searchVille} onChange={handleSearchVille} />
      </div>

      <div>
        <h2>Filter by Zone:</h2>
        <input type="text" value={searchZone} onChange={handleSearchZone} />
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Adresse</th>
            <th>Longitude</th>
            <th>Lattitude</th>
            <th>Numéro de téléphone</th>
            <th>Ouvert à</th>
            <th>Fermé à</th>
            <th>Spécialités</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredRestaurants.map((restaurant) => (
            <tr key={restaurant.id}>
              <td>{restaurant.nom}</td>
              <td>{restaurant.adresse}</td>
              <td>{restaurant.longitude}</td>
              <td>{restaurant.lattitude}</td>
              <td>{restaurant.num_tel}</td>
              <td>{restaurant.openAt}</td>
              <td>{restaurant.closeAt}</td>
              <td>{restaurant.specialities.join(', ')}</td>
              <td>
                <Button variant="info" onClick={() => handleEditModalOpen(restaurant)}>Edit</Button>{' '}
                <Button variant="danger" onClick={() => handleDeleteRestaurant(restaurant.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Button variant="primary" onClick={() => setShowModal(true)}>Add Restaurant</Button>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedRestaurant ? 'Edit Restaurant' : 'Add Restaurant'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={selectedRestaurant ? handleEditRestaurant : handleAddRestaurant}>
            <Form.Group controlId="nom">
              <Form.Label>Nom</Form.Label>
              <Form.Control type="text" value={nom} onChange={(e) => setNom(e.target.value)} required />
            </Form.Group>

            <Form.Group controlId="adresse">
              <Form.Label>Adresse</Form.Label>
              <Form.Control type="text" value={adresse} onChange={(e) => setAdresse(e.target.value)} required />
            </Form.Group>

            <Form.Group controlId="longitude">
              <Form.Label>Longitude</Form.Label>
              <Form.Control type="text" value={longitude} onChange={(e) => setLongitude(e.target.value)} required />
            </Form.Group>

            <Form.Group controlId="latitude">
              <Form.Label>Lattitude</Form.Label>
              <Form.Control type="text" value={latitude} onChange={(e) => setLatitude(e.target.value)} required />
            </Form.Group>

            <Form.Group controlId="numTel">
              <Form.Label>Numéro de téléphone</Form.Label>
              <Form.Control type="text" value={numTel} onChange={(e) => setNumTel(e.target.value)} required />
            </Form.Group>

            <Form.Group controlId="openAt">
              <Form.Label>Ouvert à</Form.Label>
              <Form.Control type="time" value={openAt} onChange={(e) => setOpenAt(e.target.value)} required />
            </Form.Group>

            <Form.Group controlId="closeAt">
              <Form.Label>Fermé à</Form.Label>
              <Form.Control type="time" value={closeAt} onChange={(e) => setCloseAt(e.target.value)} required />
            </Form.Group>

            <Form.Group controlId="specialities">
              <Form.Label>Spécialités</Form.Label>
              <Form.Control as="select" multiple value={specialities} onChange={(e) => setSpecialities(Array.from(e.target.selectedOptions, (option) => option.value))} required>
                <option value="Italian">Italian</option>
                <option value="Mexican">Mexican</option>
                <option value="Chinese">Chinese</option>
                <option value="Indian">Indian</option>
                <option value="Japanese">Japanese</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="ville">
              <Form.Label>Ville</Form.Label>
              <Form.Control as="select" value={selectedVille} onChange={(e) => setSelectedVille(e.target.value)} required>
                {villes.map((ville) => (
                  <option key={ville.id} value={ville.id}>{ville.nom}</option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="zone">
              <Form.Label>Zone</Form.Label>
              <Form.Control as="select" value={selectedZone} onChange={(e) => setSelectedZone(e.target.value)} required>
                {zones.map((zone) => (
                  <option key={zone.id} value={zone.id}>{zone.nom}</option>
                ))}
              </Form.Control>
            </Form.Group>

            <Button variant="primary" type="submit">{selectedRestaurant ? 'Save Changes' : 'Add Restaurant'}</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Restaurant;