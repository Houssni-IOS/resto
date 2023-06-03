import React, { useEffect, useState } from 'react';

const Map = () => {
  const [map, setMap] = useState(null);
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    // Check if the Google Maps API script is already loaded
    if (!window.google) {
      // Load the Google Maps API script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBC7TrnSJ6ZvaNUaspY6zbmOAbrz5PFF04&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      script.addEventListener('load', initializeMap);

      return () => {
        script.removeEventListener('load', initializeMap);
      };
    } else {
      // Google Maps API already loaded, initialize the map
      initializeMap();
    }
  }, []);

  useEffect(() => {
    // Fetch restaurants data from the API
    fetch('http://localhost:8080/api/restaurants')
      .then((response) => response.json())
      .then((data) => {
        setRestaurants(data);
      })
      .catch((error) => {
        console.error('Error fetching restaurants:', error);
      });
  }, []);

  const initializeMap = () => {
    if (navigator.geolocation) {
      // Fetch the user's current location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const mapOptions = {
            center: { lat: latitude, lng: longitude },
            zoom: 15,
            // Add your custom map styles here
            // Example:
            // styles: [
            //   {
            //     elementType: 'geometry',
            //     stylers: [
            //       {
            //         color: '#f8f9fa',
            //       },
            //     ],
            //   },
            //   {
            //     elementType: 'labels.text.fill',
            //     stylers: [
            //       {
            //         color: '#000000',
            //       },
            //     ],
            //   },
            // ],
          };
          const newMap = new window.google.maps.Map(
            document.getElementById('map'),
            mapOptions
          );
          setMap(newMap);
        },
        (error) => {
          console.error('Error getting current location:', error);
          // Default coordinates if user location not available
          const mapOptions = {
            center: { lat: 31.7945, lng: -7.0849 },
            zoom: 15,
            // Add your custom map styles here
            // Example:
            // styles: [
            //   {
            //     elementType: 'geometry',
            //     stylers: [
            //       {
            //         color: '#f8f9fa',
            //       },
            //     ],
            //   },
            //   {
            //     elementType: 'labels.text.fill',
            //     stylers: [
            //       {
            //         color: '#000000',
            //       },
            //     ],
            //   },
            // ],
          };
          const newMap = new window.google.maps.Map(
            document.getElementById('map'),
            mapOptions
          );
          setMap(newMap);
        }
      );
    } else {
      // Default coordinates if geolocation not supported
      const mapOptions = {
        center: { lat: 31.7945, lng: -7.0849 },
        zoom: 15,
        // Add your custom map styles here
        // Example:
        // styles: [
        //   {
        //     elementType: 'geometry',
        //     stylers: [
        //       {
        //         color: '#f8f9fa',
        //       },
        //     ],
        //   },
        //   {
        //     elementType: 'labels.text.fill',
        //     stylers: [
        //       {
        //         color: '#000000',
        //       },
        //     ],
        //   },
        // ],
      };
      const newMap = new window.google.maps.Map(
        document.getElementById('map'),
        mapOptions
      );
      setMap(newMap);
    }
  };

  const renderMarkers = () => {
    if (map) {
      restaurants.forEach((restaurant) => {
        const marker = new window.google.maps.Marker({
          position: { lat: restaurant.latitude, lng: restaurant.longitude },
          map: map,
          title: restaurant.name,
        });

        const infowindow = new window.google.maps.InfoWindow({
          content: `<div><h3>${restaurant.name}</h3><p>${restaurant.address}</p></div>`,
        });

        marker.addListener('click', () => {
          infowindow.open(map, marker);
        });
      });
    }
  };

  useEffect(() => {
    renderMarkers();
  }, [map, restaurants]);

  return <div id="map" style={{ height: '500px' }} />;
};

export default Map;
