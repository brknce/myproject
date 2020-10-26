import React, { useState, useEffect} from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import firebase from "../database/firabaseDB";


const initialState = {
  latitude: null,
  longitude: null,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
}


const Map = () => {
  const [currentPosition, setCurrentPosition] = useState(initialState)
  const [showMarkers, setshowMarkers] = useState(true)
  const [markers, setMarkers] = useState([]);

  //get current position
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

  //get markers
  useEffect(() => {
    firebase.database().ref("markers").once("value").then(function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        var childData = childSnapshot.val();
        setMarkers(markers => [...markers, childData]);
      })
    });
  }, [])


  return currentPosition.latitude ? (
    <View style={{ flex: 1 }}>
      <MapView
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        style={{ flex: 1, zIndex: 0 }}
        initialRegion={currentPosition}
      >
        {showMarkers ? markers.map((marker,index) => (
          <Marker key={index} coordinate={marker.coordinate}>
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
