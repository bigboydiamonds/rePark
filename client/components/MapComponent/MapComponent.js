import React, { useState, useEffect, useContext, useRef } from 'react'; // using React hooks
import ReactMapGL, { Marker, Popup, GeolocateControl } from 'react-map-gl'; // using mapbox api
import Geocoder from 'react-map-gl-geocoder'; // coverts user inputted address into coordinates
import marker from './marker.png'; // image of map pin. Will need to find one with transparent background
import { UserContext } from '../../../client/contexts/UserContext.js';
import './map.css';

const reservedSpace = [];

const MapComponent = () => {
  function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }
  // use React hooks to declare a state variable called viewport. This will be the entire map where the center is at [33.987909, -118.470693] in Los Angeles.
  const [viewport, setViewport] = useState({
    latitude: 33.987909,
    longitude: -118.470693,
    width: '100vw',
    height: '100vh',
    zoom: 10
  });



  //navigation google maps redirecting button handler 
  function mapsSelector(lat, long) {
    console.log("in map selector")
    if /* if we're on iOS, open in Apple Maps */
      ((navigator.platform.indexOf("iPhone") != -1) ||
      (navigator.platform.indexOf("iPad") != -1) ||
      (navigator.platform.indexOf("iPod") != -1))
      window.open(`maps://maps.google.com/maps?daddr=${lat},${long}&amp;ll=`);
    else /* else use Google */
      window.open(`https://maps.google.com/maps?daddr=${lat},${long}&amp;ll=`);
  }

  // selectedPark is a state variable that contains which map pin the user has clicked
  const [selectedPark, setSelectedPark] = useState(null);

  const [markers, setMarkers] = React.useState([]);

  const [userMarker, setUserMarker] = React.useState([]); //this is the space that the user icon will be held until it is 'ready' to be added to datbase
  // this method will make the map pin popup go away when escape key is pressed


  useEffect(() => {
    const listener = e => {
      if (e.key === 'Escape') {
        setSelectedPark(null);
      }
    };
    window.addEventListener('keydown', listener);
    return () => {
      window.removeEventListener('keydown', listener);
    }
  }, []);

  //to retrieve other pins
  useInterval(() => {
    fetch('/api/parking', {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((pinLocations) => {
        setMarkers(markers => [])
        pinLocations.forEach((location) => {
          const latitudeVar = location.latitude;
          const latitude = Number(latitudeVar);
          const longitudeVar = location.longitude;
          const longitude = Number(longitudeVar);
          setMarkers(markers => [...markers, { latitude,
                                               longitude,
                                                parking_spot: location.parking_spot, 
                                                id: location.id, 
                                                name: location.name,
                                                car_make: location.car_make,
                                                car_model: location.car_model
                                               }]);
        })
      })
  }, 5000)

  // setInterval(() => {

  // }, 2000)

  // mapRef is needed for geocoder
  const mapRef = React.useRef();

  // this would zoom in to the location of the address the user inputted in the geocoder search box
  const handleGeocoderViewportChange = (viewport) => {
    const geocoderDefaultOverrides = { transitionDuration: 1000 };
    return setViewport({
      ...viewport,
      ...geocoderDefaultOverrides
    });
  }

  // markers array is the state variable that will be populated with each individual marker object

  const [shouldAddPin, setShouldAddPin] = React.useState(false);

  const { user } = useContext(UserContext);

  const [time, setTime] = React.useState(new Date(Date.now()).toUTCString());

  const [available, setAvailable] = React.useState(true);
  
  const [reserved, setReserved] = React.useState(false);
  const [reservedDB, setReservedDB] = React.useState(false); //react hook for when DB changes reserved to true
  const [reservedBy, setReservedBy] = React.useState(''); //reservedBy hook for the 'get' request from DB

  const [taken, setTaken] = React.useState(false);



  // when the user clicks on the map, add the coordinates into the markers array
  const handleClick = ({ lngLat: [longitude, latitude], target }) => { // the parameter is the PointerEvent in react-map-gl
    console.log('user state', user)
    console.log('target.className', target.className);
    console.log('Markers in MapComponent: ', markers);
    console.log(markers);
    if (target.className !== 'mapboxgl-ctrl-geocoder--input' && shouldAddPin) { // as long as the user is not clicking in the search box
      // console.log(`clicked, longitude: ${longitude}, latitude: ${latitude}`);
      setUserMarker(userMarker => [{ latitude, longitude, user_ID: user.id, user_name: user.name, car_make: user.car.car_make, car_model: user.car.car_model, userMark: true }]); // add a marker at the location
      // console.log('markers: ', markers);
      setShouldAddPin(shouldAddPin => !shouldAddPin);

      let utcDate = new Date(new Date().toUTCString());
      let utcDateAdd10Min = new Date(utcDate.getTime() + 10 * 60000);
      setTime(time => {
        return utcDateAdd10Min.toLocaleTimeString('en-US'); // this will set time to be the current time + 10 minutes, format example: 5:20:08 PM
      });
    }


    // if the user clicks on the add pin button, toggle the state for shouldAddPin
    if (target.id === 'add_pin') {
      setShouldAddPin(shouldAddPin => !shouldAddPin);
    }
  };

  //available button functionality
  const availableClick = (lat, long) => {
    setAvailable(false);
          fetch('/api/parking', {
        method: 'POST',
        body: JSON.stringify({
          longitude:long,
          latitude:lat,
          user_id: user.id
        }),
        headers: { 'content-type': 'application/json', 'Accept': 'application/json' } //need to hash this out for adding the user's button to the database
      });
  }


  //reserve button functionality
  const reserveClick = (lat, long, parking_spot) => {
    setReserved(true);
    setAvailable(false);
    console.log('I am clicking in reserveclick good sir');
    fetch("/api/parking", {
      method: "PATCH",
      body: JSON.stringify({
        id: user.id,
        latitude: lat,
        longitude: long,
        available: false,
        reserved: true,
        taken: false,
        parking_spot: parking_spot,
        reserved_by: user.name
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => {
      console.log('this is reservedDB', reservedDB);
      setReservedDB(true);
    })
  }

  //taken button - conditionally render
  const takenClick = (lat, long) => {
    setTaken(true);
    setAvailable(false);
    setReserved(false);
    fetch("/api/parking", {
      method: "PATCH",
      body: JSON.stringify({
        id: user.id,
        latitude: lat,
        longitude: long,
        available: false,
        reserved: false,
        taken: true
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => {
      console.log('parking spot is taken');
    })
  }

  const onMarkerDragStart = ({ lngLat: [longitude, latitude] }) => {
  };

  const onMarkerDrag = ({ lngLat: [longitude, latitude] }) => {
  };

  const onMarkerDragEnd = ({ lngLat: [longitude, latitude] }) => {
    setUserMarker(userMarker => [])
    setUserMarker(userMarker => [{ latitude, longitude, name: user.name, userMark: true }]);
  };

  //this is a helper function that gets the reserved_by name to fill in the pop up //parkingid should 
  const reservedByQuery = (parking_spot) => {
    fetch("/api/reservedBy", {
      method: 'PATCH',
      body: JSON.stringify({
        parking_spot: parking_spot
      }),
      headers: {
        'content-type': 'application/json', 'Accept': 'application/json' 
      }
    }).then(res => res.json())
    .then(res => {
      console.log('this is res.reservedBy', res)
      setReservedBy(`${res.reserved_by}`);
    })
    .catch(err=> {
      console.log(err);
    })
  }

  return (
    <div style={{ margin: '-2vw', textAlign: 'left' }}>
      <link href='map.css' type="text/css" rel='stylesheet' />
      <div id="mapbox">
        <ReactMapGL // ReactMapGL is the entire map element
          onClick={handleClick} // add markers upon clicks
          ref={mapRef}
          {...viewport}
          mapboxApiAccessToken="pk.eyJ1IjoieWE4NTA1MDkiLCJhIjoiY2s1MGFwd2h5MGszMzNqbmVhZWZqMmI4MyJ9.1X0GGZVNGDyxCfacWadlgw" // my mapbox account token that allows us to use mapbox api
          mapStyle="mapbox://styles/ya850509/ck51pt5z70dot1cqj6aix253v" // this style is made from my mapbox account
          onViewportChange={viewport => {
            setViewport(viewport);
          }} // this enables users to drag and move the map by setting viewport again whenever there's a change
        >

          <Geocoder // this is the address search box at the bottom left of the map
            mapRef={mapRef}
            onViewportChange={handleGeocoderViewportChange}
            mapboxApiAccessToken="pk.eyJ1IjoieWE4NTA1MDkiLCJhIjoiY2s1MGFwd2h5MGszMzNqbmVhZWZqMmI4MyJ9.1X0GGZVNGDyxCfacWadlgw"
            reverseGeocode={true}
            position={"bottom-left"}
          />

          <GeolocateControl // this asks the user if they allow sharing their location, if they do, the map automatically drops a blue dot at their current location
            positionOptions={{ enableHighAccuracy: true }}
            trackUserLocation={true}
            showUserLocation={true}
          />
          {userMarker.map((park, i) => ( // map the array of the user parking spots
            <Marker // this JSX element is imported from MapBox that will mark different locations on the map
              key={i}
              latitude={park.latitude}
              longitude={park.longitude}
              user={park.name}
              car_make={park.car_make}
              car_model={park.car_model}
              userMark={true}
              draggable={true}
              onDragStart={onMarkerDragStart}
              onDrag={onMarkerDrag}
              onDragEnd={onMarkerDragEnd}
            >
              <button className="marker-btn" onClick={(e) => {
                e.preventDefault();
                setSelectedPark(park); // when the map pin button is clicked, we will set the state of selectedPark to be the current park the user clicked
              }}>
                <img src={marker} style={{ backgroundColor: 'red' }} width="15" height="20" />
              </button>
            </Marker>
          ))}
          {markers.map((park, i) => ( // map the array of databased parking spots
            <Marker // this JSX element is imported from MapBox that will mark different locations on the map
              key={i}
              latitude={park.latitude}
              longitude={park.longitude}
              user={park.name}
              car_make={park.car_make}
              car_model={park.car_model}
              parking_spot={park.parking_spot}

            >
              <button className="marker-btn" onClick={(e) => {
                e.preventDefault();
                console.log('clicked: ', park);
                setSelectedPark(park); // when the map pin button is clicked, we will set the state of selectedPark to be the current park the user clicked
              }}>
                <img src={marker} style={{ backgroundColor: 'transparent' }} width="15" height="20" />
              </button>
            </Marker>
          ))}

          {selectedPark ? ( // ternary operator: if there is a selectedPark, show a popup window
            <Popup

              latitude={selectedPark.latitude}
              longitude={selectedPark.longitude}
              onClose={() => { // when the x on the top right of the pop up is clicked

                setSelectedPark(null); // set the state of selectedPark back to null
              }}
            > {console.log('selected park',selectedPark)}
              <div style={{ textAlign: 'left', width: '350px', height: '150px' }}>
                Who parked here: {selectedPark.name }<br />
                Parking coordinates: {selectedPark.latitude}, {selectedPark.longitude}<br />
                Car: {selectedPark.car_make} {selectedPark.car_model}<br />
                <br></br>
                Available today at: {time}<br />
                {reservedDB ? (`Reserved by: ${reservedBy}`): null}
              </div>

              <br></br>
              <br></br>

              {selectedPark.userMark ? //usermark is used as a means to render the SUBMIT SPOT BUTTON 
              (<button onClick={() => availableClick(selectedPark.latitude, selectedPark.longitude, user)}>Submit Spot</button>)
                : (reserved ? //otherwise, we are dealing with other users buttons, render the other options!
                  (<div>
                    <button onClick={() => mapsSelector(selectedPark.latitude, selectedPark.longitude)}>Go to Maps</button>
                    <button onClick={() => takenClick(selectedPark.latitude, selectedPark.longitude)}>Taken</button>
                    </div>
                  ) : (!(selectedPark.name== user.name) ? (<button onClick={() => {reserveClick(selectedPark.latitude, selectedPark.longitude, selectedPark.parking_spot), reservedByQuery(selectedPark.parking_spot)}}>Reserve</button>): null))
              }    


            </Popup>
          ) : null}
          <button id="add_pin" style={{ position: 'absolute', bottom: '15vh', left: '4vw', height: '45px', width: '85px', borderRadius: '2vw', fontSize: '15px', background: '#2B7BF0', color: 'white' }}>
            + Add pin
          </button>
        </ReactMapGL>
      </div>
    </div>
  );
};

export default MapComponent;

