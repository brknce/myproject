import React from 'react';
import MapView from 'react-native-maps';
import { View } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

export default class App extends React.Component {

  state = {
    location: null,
    errorMessage: ""
  }

  componentDidMount() {
    this._getLocation();
  }

  _getLocation = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);

    if (status !== 'granted') {
      console.log("PERMISSION NOT GRANTED!")

      this.setState({
        errorMessage: "PERMISSION NOT GRANTED"
      })
    }

    let location = await Location.getCurrentPositionAsync();

    this.setState({
      location: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.045,
        longitudeDelta: 0.045,
      },
    });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MapView
          initialRegion={this.state.location}
          showsUserLocation={true}
          showsCompass={true}
          rotateEnabled={false}
          style={{ flex: 1, zIndex: 0 }}
        />
      </View>
    );
  }
}