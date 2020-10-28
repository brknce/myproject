import React, { useState, useEffect, useRef } from 'react';
import { ActivityIndicator, View, Text, Alert, Modal, TouchableHighlight, StyleSheet, Platform } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import firebase from "../database/firabaseDB";
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';


const initialState = {
  latitude: null,
  longitude: null,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
}


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Map = () => {
  const [currentPosition, setCurrentPosition] = useState(initialState)
  const [showMarkers, setshowMarkers] = useState(true)
  const [markers, setMarkers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [value, onChangeText] = React.useState('');

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

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
        {showMarkers ? markers.map((marker, index) => (
          <Marker key={index} coordinate={marker.coordinate} onPress={() => { setModalVisible(true); }}>
            <View style={{ backgroundColor: "red", padding: 10 }}>
              <Text>SF</Text>
            </View>
          </Marker>
        )) : null}
      </MapView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              value={value}
              onChangeText={text => onChangeText(text)}
              placeholder="Enter your message"
              style={{ paddingVertical: 10, borderWidth: 1 }}>
            </TextInput>

            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={async () => { await sendPushNotification(expoPushToken, value); }}
            >
              <Text style={styles.textStyle}>Send Message</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    </View>
  ) : <ActivityIndicator style={{ flex: 1 }} animating size="large" />


}

// Can use this function below, OR use Expo's Push Notification Tool-> https://expo.io/notifications
async function sendPushNotification(expoPushToken, value) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: value,
    data: { data: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    textAlign: "left",
    marginBottom: 15,
    borderWidth: 1,
    paddingHorizontal: 115,
    paddingVertical: 10
  }
});


export default Map;
