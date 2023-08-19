import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

function MapScreen({ route }) {
  const [map, setMap] = useState({});

  useEffect(() => {
    setMap(route.params);
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          ...map,
          latitudeDelta: 0.001,
          longitudeDelta: 0.006,
        }}
      >
        <Marker title="I am here" coordinate={{ ...map }} description="Hello" />
      </MapView>
    </View>
  );
}
export default MapScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
