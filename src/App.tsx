/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Animated,
  ImageBackground,
} from 'react-native';
import DestinationCard from './components/DestinationCard';
import DestinationModal from './components/DestinationModal';
import {Measurement} from './model/Measurement';
import {TravelDestination} from './model/TravelDestination';

const HEADER_COLOR = '#00BCD4';
const BACKGROUND_COLOR = 'white';
const STATUS_BAR_HEIGHT = 40;
const HEADER_BAR_HEIGHT = 50;
const COVER_MIN_HEIGHT = STATUS_BAR_HEIGHT + HEADER_BAR_HEIGHT;
const COVER_MAX_HEIGHT = 300;

const destinations: TravelDestination[] = [
  {name: 'India', image: require('../assets/images/india.jpg')},
  {name: 'Venice', image: require('../assets/images/venice.jpg')},
  {name: 'Prague', image: require('../assets/images/prague.jpg')},
  {name: 'Vernazza', image: require('../assets/images/vernazza.jpg')},
];

interface ActiveDestination {
  destination: TravelDestination;
  measurement: Measurement;
}

const App = () => {
  const y = useRef(new Animated.Value(0)).current;
  const [
    activeDestination,
    setActiveDestination,
  ] = useState<ActiveDestination | null>(null);

  const scale = y.interpolate({
    inputRange: [-COVER_MAX_HEIGHT, 0],
    outputRange: [3, 1],
    extrapolateRight: 'clamp',
  });

  const top = y.interpolate({
    inputRange: [0, COVER_MAX_HEIGHT],
    outputRange: [0, -COVER_MAX_HEIGHT],
    extrapolate: 'clamp',
  });

  const opacity = y.interpolate({
    inputRange: [0, COVER_MAX_HEIGHT - COVER_MIN_HEIGHT],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const headerOpacity = y.interpolate({
    inputRange: [
      0,
      COVER_MAX_HEIGHT - COVER_MIN_HEIGHT,
      COVER_MAX_HEIGHT - COVER_MIN_HEIGHT + 1,
    ],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });

  const headerTitleOpacity = y.interpolate({
    inputRange: [
      0,
      COVER_MAX_HEIGHT - COVER_MIN_HEIGHT,
      COVER_MAX_HEIGHT - STATUS_BAR_HEIGHT,
    ],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });

  const open = (destination: TravelDestination, measurement: Measurement) => {
    setActiveDestination({destination, measurement});
  };

  return (
    <View style={styles.body}>
      <Animated.View
        style={[styles.coverImageContainer, {top, transform: [{scale}]}]}>
        <ImageBackground
          source={require('../assets/images/cover.jpg')}
          style={styles.coverImage}
        />
      </Animated.View>
      <Animated.View style={[styles.header, {opacity: headerOpacity}]}>
        <Animated.Text
          style={[styles.headerTitle, {opacity: headerTitleOpacity}]}>
          Travel Destinations
        </Animated.Text>
      </Animated.View>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{nativeEvent: {contentOffset: {y}}}], {
          useNativeDriver: false,
        })}
        scrollEventThrottle={1}>
        <Animated.View style={styles.coverTitleContainer}>
          <Text style={styles.coverTitle}>Travel Destinations</Text>
        </Animated.View>
        <Animated.View style={[styles.coverImageOverlay, {opacity}]} />
        {destinations.map((destination) => (
          <DestinationCard
            key={destination.name}
            destination={destination}
            open={open}
          />
        ))}
      </ScrollView>
      {activeDestination && (
        <DestinationModal
          destination={activeDestination.destination}
          measurement={activeDestination.measurement}
          close={() => setActiveDestination(null)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: BACKGROUND_COLOR,
  },
  coverImageContainer: {
    ...StyleSheet.absoluteFillObject,
    height: COVER_MAX_HEIGHT,
  },
  coverImage: {
    ...StyleSheet.absoluteFillObject,
  },
  coverImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    height: COVER_MAX_HEIGHT,
    backgroundColor: HEADER_COLOR,
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  coverTitleContainer: {
    height: COVER_MAX_HEIGHT,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: HEADER_BAR_HEIGHT,
    marginBottom: 10,
  },
  coverTitle: {
    color: 'white',
    fontSize: 32,
    fontWeight: '900',
  },
  header: {
    ...StyleSheet.absoluteFillObject,
    height: COVER_MIN_HEIGHT,
    backgroundColor: HEADER_COLOR,
    paddingTop: STATUS_BAR_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default App;
