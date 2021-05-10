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
import {StyleSheet, ScrollView, View, Animated} from 'react-native';
import CoverImage from './components/CoverImage';
import CoverTitle from './components/CoverTitle';
import DestinationCard from './components/DestinationCard';
import DestinationModal from './components/DestinationModal';
import Header from './components/Header';
import {BACKGROUND_COLOR} from './constants';
import {ActiveDestination} from './model/ActiveDestination';
import {Measurement} from './model/Measurement';
import {TravelDestination} from './model/TravelDestination';
import destinations from './travel-destinations';

const App = () => {
  const y = useRef(new Animated.Value(0)).current;

  const [
    activeDestination,
    setActiveDestination,
  ] = useState<ActiveDestination | null>(null);

  const open = (destination: TravelDestination, measurement: Measurement) => {
    setActiveDestination({destination, measurement});
  };

  return (
    <View style={styles.body}>
      <CoverImage y={y} />
      <Header y={y} />
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{nativeEvent: {contentOffset: {y}}}], {
          useNativeDriver: false,
        })}
        scrollEventThrottle={1}>
        <CoverTitle y={y} />
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
  content: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
});

export default App;
