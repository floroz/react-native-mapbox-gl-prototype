/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {MAPBOX_API} from '@env';
import data from './data';

MapboxGL.setAccessToken(MAPBOX_API);

const LONDON_COORDINATES = [-0.118092, 51.509865];

const points = data.map((tree) => ({
  type: 'Feature',
  properties: {
    id: tree.id,
    name: tree.name,
  },
  geometry: {
    type: 'Point',
    coordinates: [parseFloat(tree.lng), parseFloat(tree.lat)],
  },
}));

const layerStyles = {
  singlePoint: {
    circleColor: 'green',
    circleOpacity: 0.84,
    circleStrokeWidth: 2,
    circleStrokeColor: 'white',
    circleRadius: 5,
    circlePitchAlignment: 'map',
  },

  clusteredPoints: {},

  clusterCount: {
    textField: '{point_count}',
    textSize: 12,
    textPitchAlignment: 'map',
  },
};

const App = () => {
  React.useEffect(() => {
    MapboxGL.setTelemetryEnabled(false);
  }, []);
  const mapRef = React.useRef();

  return (
    <>
      <View style={styles.header}>
        <Text>Hello World</Text>
      </View>
      <View style={styles.page}>
        <View style={styles.container}>
          <MapboxGL.MapView
            style={styles.map}
            ref={mapRef}
            styleURL="mapbox://styles/floroz/ckhbtjzf50u4718lle7journb"
            zoomEnabled
            rotateEnabled={false}
            compassEnabled={false}>
            <MapboxGL.Camera
              animationDuration={250}
              animationMode="flyTo"
              centerCoordinate={LONDON_COORDINATES}
              zoomLevel={8}
            />
            <MapboxGL.ShapeSource
              // url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
              shape={{
                type: 'FeatureCollection',
                features: [...points],
              }}
              id="symbolLocationSource"
              hitbox={{width: 18, height: 18}}
              onPress={() => {}}
              clusterRadius={50}
              clusterMaxZoom={14}
              cluster>
              <MapboxGL.SymbolLayer
                id="pointCount"
                style={layerStyles.clusterCount}
              />
              <MapboxGL.CircleLayer
                id="clusteredPoints"
                belowLayerID="pointCount"
                filter={['has', 'point_count']}
                style={{
                  circlePitchAlignment: 'map',
                  circleColor: 'green',
                  circleRadius: [
                    'step',
                    ['get', 'point_count'],
                    20,
                    100,
                    25,
                    250,
                    30,
                    750,
                    40,
                  ],
                  circleOpacity: 0.84,
                  circleStrokeWidth: 0,
                  circleStrokeColor: 'blue',
                }}
              />
              <MapboxGL.CircleLayer
                id="singlePoint"
                minZoomLevel={6}
                filter={['!', ['has', 'point_count']]}
                style={layerStyles.singlePoint}
              />
            </MapboxGL.ShapeSource>
          </MapboxGL.MapView>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  container: {
    height: 450,
    width: '100%',
  },
  header: {
    marginBottom: 20,
  },
});

export default App;
