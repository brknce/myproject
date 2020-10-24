import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';


const initialState = {
  latitude: null,
  longitude: null,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
}

const parkings = [
  {
    id: 1,
    title: "Parking 1",
    price: 5,
    rating: 4.2,
    spots: 20,
    free: 10,
    coordinate: {
      latitude: 40.89895,
      longitude: 29.2611,
    }
  },
  {
    id: 2,
    title: "Parking 2",
    price: 7,
    rating: 3.8,
    spots: 25,
    free: 20,
    coordinate: {
      latitude: 40.91295,
      longitude: 29.2334,
    }
  },
  {
    id: 3,
    title: "Parking 3",
    price: 10,
    rating: 4.9,
    spots: 58,
    free: 2,
    coordinate: {
      latitude: 40.89000,
      longitude: 29.2054,
    }
  },
]

const Map = () => {
  const [currentPosition, setCurrentPosition] = useState(initialState)
  const [showMarkers, setshowMarkers] = useState(true)

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
    <View style={{ flex: 1 }}>
      <MapView
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        style={{ flex: 1, zIndex: 0 }}
        initialRegion={currentPosition}
      >
        {showMarkers ? parkings.map(parking => (
          <Marker key={`marker-${parking.id}`} coordinate={parking.coordinate}>
            <View style={{ backgroundColor: "red", padding: 10 }}>
              <Text>SF</Text>
            </View>
          </Marker>
        )) : null}
      </MapView>
    </View>
  ) : <ActivityIndicator style={{ flex: 1 }} animating size="large" />
}



export default Map;
