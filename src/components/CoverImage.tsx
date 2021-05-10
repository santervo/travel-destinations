import React from 'react';
import {Animated, ImageBackground, StyleSheet} from 'react-native';
import {COVER_MAX_HEIGHT} from '../constants';

interface Props {
  y: Animated.Value;
}

const CoverImage = ({y}: Props) => {
  const top = y.interpolate({
    inputRange: [0, COVER_MAX_HEIGHT],
    outputRange: [0, -COVER_MAX_HEIGHT],
    extrapolate: 'clamp',
  });

  const scale = y.interpolate({
    inputRange: [-COVER_MAX_HEIGHT, 0],
    outputRange: [3, 1],
    extrapolateRight: 'clamp',
  });

  return (
    <Animated.View style={[styles.container, {top, transform: [{scale}]}]}>
      <ImageBackground
        source={require('../../assets/images/cover.jpg')}
        style={styles.coverImage}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: COVER_MAX_HEIGHT,
  },
  coverImage: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default CoverImage;
