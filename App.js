import React, { useEffect, useState } from "react";
import {StyleSheet, View, TouchableOpacity, Text, Dimensions, Image, ActivityIndicator, Linking, Platform} from "react-native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

const WaitingDriverScreen = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [initialRegion, setInitialRegion] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);

      setInitialRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    };

    getLocation();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto"/>

      {activeTab === 0 && (
        
        initialRegion ? (
          <MapView style={styles.map} initialRegion={initialRegion}>
            {currentLocation && (
              <Marker
                coordinate={{
                  latitude: currentLocation.latitude,
                  longitude: currentLocation.longitude,
                }}
                title="Your Location"
              />
            )}
          </MapView>
        ) : (
          <ActivityIndicator size="large" color="#242424" />
        )
      )}
      {activeTab === 1 && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Navigation Tab</Text>
        </View>
      )}

      {activeTab === 2 && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>More Tab</Text>
        </View>
      )}
      <View style={styles.bottomNavbar}>
        <TouchableOpacity style={styles.bottomNavbarTab} onPress={() => setActiveTab(0)}>
          <Ionicons name="map" size={30} color={activeTab === 0 ? "#F1F6F8" : "#b0b0b0"} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomNavbarTab} onPress={() => setActiveTab(1)}>
          <Ionicons name="location" size={30} color={activeTab === 1 ? "#F1F6F8" : "#b0b0b0"} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomNavbarTab} onPress={() => setActiveTab(2)}>
          <Ionicons name="ellipsis-horizontal" size={30} color={activeTab === 2 ? "#F1F6F8" : "#b0b0b0"} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F6F8",
  },
  header: {
    position: "absolute",
    top: 95,
    left: 32,
    zIndex: 1,
  },
  headerText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 10,
  },
  headerDescription: {
    fontSize: 20,
    marginBottom: 3,
  },
  map: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    zIndex: 0,
  },

  bottomNavbar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: "#21273D",
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  bottomNavbarTab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
});

export default WaitingDriverScreen;