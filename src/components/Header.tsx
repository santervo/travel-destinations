import React from 'react';
import {Animated, StyleSheet} from 'react-native';
import {
  COVER_MAX_HEIGHT,
  COVER_MIN_HEIGHT,
  HEADER_COLOR,
  STATUS_BAR_HEIGHT,
} from '../constants';

interface Props {
  y: Animated.Value;
}

const Header = ({y}: Props) => {
  const opacity = y.interpolate({
    inputRange: [
      0,
      COVER_MAX_HEIGHT - COVER_MIN_HEIGHT,
      COVER_MAX_HEIGHT - COVER_MIN_HEIGHT + 1,
    ],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });

  const titleOpacity = y.interpolate({
    inputRange: [
      0,
      COVER_MAX_HEIGHT - COVER_MIN_HEIGHT,
      COVER_MAX_HEIGHT - STATUS_BAR_HEIGHT,
    ],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={[styles.container, {opacity}]}>
      <Animated.Text style={[styles.title, {opacity: titleOpacity}]}>
        Travel Destinations
      </Animated.Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: COVER_MIN_HEIGHT,
    backgroundColor: HEADER_COLOR,
    paddingTop: STATUS_BAR_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default Header;
