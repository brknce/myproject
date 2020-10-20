import React, { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

const initialState = {
  latitude: null,
  longitude: null,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
}

const App = () => {
  const [currentPosition, setCurrentPosition] = useState(initialState)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { longitude, latitude } = position.coords;
      setCurrentPosition({
        ...currentPosition,
        latitude,
        longitude,
      })
    },
      error => alert(error.message),
      { timeout: 20000, maximumAge: 1000 }
    )
  }, [])

  return currentPosition.latitude ? (
    <MapView
      provider={PROVIDER_GOOGLE}
      showsUserLocation = {true}
      style = {{flex : 1}}
      initialRegion={currentPosition}
    />
  ) : <ActivityIndicator style={{ flex: 1 }} animating size="large" />
}


export default App;
