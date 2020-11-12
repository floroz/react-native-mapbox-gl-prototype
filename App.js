import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {MAPBOX_API} from '@env';

MapboxGL.setAccessToken(MAPBOX_API);

const OKLAHOMA_CITY_COORDINATES = [-97.508469, 35.481918];

const layerStyles = {
  singlePoint: {
    circleColor: 'green',
    circleOpacity: 0.84,
    circleStrokeWidth: 2,
    circleStrokeColor: 'white',
    circleRadius: 5,
    circlePitchAlignment: 'map',
  },

  clusteredPoints: {
    circlePitchAlignment: 'map',

    circleColor: [
      'step',
      ['get', 'point_count'],
      '#51bbd6',
      100,
      '#f1f075',
      750,
      '#f28cb1',
    ],

    circleRadius: ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],

    circleOpacity: 0.84,
    circleStrokeWidth: 2,
    circleStrokeColor: 'white',
  },

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

  const onMarkerSelected = (event) => {};

  const renderClusters = () => {
    return (
      <MapboxGL.ShapeSource
        url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
        id="symbolLocationSource"
        hitbox={{width: 18, height: 18}}
        onPress={onMarkerSelected}
        clusterRadius={50}
        clusterMaxZoom={14}
        cluster>
        <MapboxGL.SymbolLayer
          id="pointCount"
          style={layerStyles.clusterCount}
        />
        <MapboxGL.CircleLayer
          id="clusteredPoints"
          minZoomLevel={6}
          belowLayerID="pointCount"
          filter={['has', 'point_count']}
          style={layerStyles.clusteredPoints}
        />
        <MapboxGL.CircleLayer
          id="singlePoint"
          minZoomLevel={6}
          filter={['!', ['has', 'point_count']]}
          style={layerStyles.singlePoint}
        />
      </MapboxGL.ShapeSource>
    );
  };

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
              centerCoordinate={OKLAHOMA_CITY_COORDINATES}
              zoomLevel={8}
            />
            {renderClusters()}
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
