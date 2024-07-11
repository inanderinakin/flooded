import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  Image,
  ActivityIndicator,
  Linking,
  Platform,
} from "react-native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import MarkerIcon from "../flooded/assets/iconMarker.png";

const WaitingDriverScreen = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [initialRegion, setInitialRegion] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  // State to check if it is in danger
  const [isInDanger, setIsInDanger] = useState(false);

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);

      // I created a danger condition based on latitude, just for example, it can be changed and reused according to what we will do in the future.
      if (location.coords.latitude < -20) {
        setIsInDanger(true);
      } else {
        //If you want to check how it works, just change setIsInDanger to "true" or "false ⬇️".
        setIsInDanger(true);
      }

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
      <StatusBar style="auto" />

      {activeTab === 0 &&
        (initialRegion ? (
          <MapView style={styles.map} initialRegion={initialRegion}>
            {/* Cabeçalho */}
            <View style={styles.securityWarning}>
              <Text
                style={[
                  styles.securityText,
                  { color: isInDanger ? "orange" : "white" },
                ]}
              >
                {isInDanger ? "Careful Danger!!" : "You're safe!"}
              </Text>
            </View>
            {currentLocation && (
              <Marker
                coordinate={{
                  latitude: currentLocation.latitude,
                  longitude: currentLocation.longitude,
                }}
                title="Your Location"
                image={MarkerIcon}
              />
            )}
          </MapView>
        ) : (
          <ActivityIndicator size="large" color="#242424" />
        ))}
      {activeTab === 1 && (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Navigation Tab</Text>
        </View>
      )}

      {activeTab === 2 && (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>More Tab</Text>
        </View>
      )}
      <View style={styles.bottomNavbar}>
        <TouchableOpacity
          style={styles.bottomNavbarTab}
          onPress={() => setActiveTab(0)}
        >
          <Ionicons
            name="map"
            size={30}
            color={activeTab === 0 ? "#F1F6F8" : "#b0b0b0"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomNavbarTab}
          onPress={() => setActiveTab(1)}
        >
          <Ionicons
            name="location"
            size={30}
            color={activeTab === 1 ? "#F1F6F8" : "#b0b0b0"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomNavbarTab}
          onPress={() => setActiveTab(2)}
        >
          <Ionicons
            name="ellipsis-horizontal"
            size={30}
            color={activeTab === 2 ? "#F1F6F8" : "#b0b0b0"}
          />
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

  map: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    zIndex: 0,
  },

  bottomNavbar: {
    position: "absolute",
    bottom: 0,
    margin: 10,
    left: 0,
    right: 0,
    height: 100,
    alignItems: "center",
    backgroundColor: "#21273D",
    flexDirection: "row",
    paddingHorizontal: 10,
    borderRadius: 34,
    height: 76,
    paddingTop: 20,
  },
  bottomNavbarTab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },

  securityText: {
    fontSize: 22,
    fontWeight: "bold",
    zIndex: 2,
  },

  securityWarning: {
    backgroundColor: "#21273D",
    padding: 15,
    marginLeft: 10,
    marginRight: 10,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    borderBottomLeftRadius: 23,
    borderBottomRightRadius: 23,
    zIndex: 1,
  },
});

export default WaitingDriverScreen;
