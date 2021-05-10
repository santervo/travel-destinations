import React, {Fragment} from 'react';
import {Animated, StyleSheet, Text} from 'react-native';
import {
  COVER_MAX_HEIGHT,
  COVER_MIN_HEIGHT,
  HEADER_BAR_HEIGHT,
  HEADER_COLOR,
} from '../constants';

interface Props {
  y: Animated.Value;
}
const CoverTitle = ({y}: Props) => {
  const opacity = y.interpolate({
    inputRange: [0, COVER_MAX_HEIGHT - COVER_MIN_HEIGHT],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <Fragment>
      <Animated.View style={styles.container}>
        <Text style={styles.title}>Travel Destinations</Text>
      </Animated.View>
      <Animated.View style={[styles.overlay, {opacity}]} />
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    height: COVER_MAX_HEIGHT,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: HEADER_BAR_HEIGHT,
    marginBottom: 10,
  },
  title: {
    color: 'white',
    fontSize: 32,
    fontWeight: '900',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    height: COVER_MAX_HEIGHT,
    backgroundColor: HEADER_COLOR,
  },
});

export default CoverTitle;
