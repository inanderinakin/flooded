import React, { useEffect, useState } from "react";
import {StyleSheet, View, TouchableOpacity, Text, Dimensions, Image, ActivityIndicator} from "react-native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { StatusBar } from 'expo-status-bar';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

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
      <StatusBar style="light" />
      <View style={styles.topNavbar}>
      </View>
      <View style={styles.header}>
        <Text style={styles.headerText}>Flooded</Text>
        <Text style={styles.headerDescription}>You are <Text style={{color: 'green'}}>SAFE</Text></Text>
        <Text style={styles.headerDescription}>Nearest flood is happening in: <Text style={{color: 'red'}}>200km</Text></Text>
      </View>
      {initialRegion ? (
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
      )}
      <View style={styles.bottomNavbar}>
        <TouchableOpacity style={[styles.bottomNavbarTab, activeTab === 0 && styles.bottomNavbarTabActive]} onPress={() => setActiveTab(0)}>
          <Text style={styles.bottomNavbarTabText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.bottomNavbarTab, activeTab === 1 && styles.bottomNavbarTabActive]} onPress={() => setActiveTab(1)}>
          <Text style={styles.bottomNavbarTabText}>Map</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.bottomNavbarTab, activeTab === 2 && styles.bottomNavbarTabActive]} onPress={() => setActiveTab(2)}>
          <Text style={styles.bottomNavbarTabText}>More</Text>
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
  },
  topNavbar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 150,
    backgroundColor: "#071952",
    justifyContent: "center",
    alignItems: "center",
  },
  topNavbarText: {
    fontSize: 18,
    color: "#fff",
  },
  header: {
    position: "absolute",
    top: 95,
    left: 32,
    zIndex: 1,
    zIndex: 1000,
  },
  headerText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 30,
  },
  headerDescription: {
    fontSize: 18,
    marginBottom: 5,
  },

  map: {
    width: "90%",
    height: "50%",
    borderRadius: 10,
    overflow: "hidden",
  },

  bottomNavbar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: "#071952",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  bottomNavbarTab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomNavbarTabActive: {
    borderBottomWidth: 0,
    borderBottomColor: "#fff",
    marginBottom: 20,
  },
  bottomNavbarTabText: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 20,
  },
});

export default WaitingDriverScreen;