/**
 * DestinationModal
 *
 * Modal showing destination details. Does "hero"-animation for cover image.
 */
import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  ImageBackground,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {COVER_MAX_HEIGHT} from '../constants';
import {Measurement} from '../model/Measurement';
import {TravelDestination} from '../model/TravelDestination';

interface Props {
  destination: TravelDestination;
  measurement: Measurement;
  close: () => void;
}

const dimensions = Dimensions.get('window');

const springConfig = {
  useNativeDriver: false,
  restDisplacementThreshold: 1,
  restSpeedThreshold: 1,
  bounciness: 0,
};

const MAX_DY = 100;

const DestinationModal = ({destination, measurement, close}: Props) => {
  // modal position and dimensions
  const left = useRef(new Animated.Value(measurement.x)).current;
  const top = useRef(new Animated.Value(measurement.y)).current;
  const width = useRef(new Animated.Value(measurement.width)).current;
  const height = useRef(new Animated.Value(measurement.height)).current;

  // scroll delta from top
  const dy = useRef(new Animated.Value(0)).current;

  // current dy value
  const currentDY = useRef(0);

  // scrollview position
  const scrollY = useRef(new Animated.Value(0)).current;

  // current scroll view position
  const currentScrollY = useRef(0);

  // content opacity
  const contentOpacity = useRef(new Animated.Value(0)).current;

  // should close modal
  const [shouldClose, setShouldClose] = useState(false);

  // show below titlebar when closing
  const zIndex = shouldClose ? 1 : 100;

  // container background
  const backgroundColor = shouldClose ? 'rgba(0,0,0,0)' : '#f0f0ff';

  // scale view when scrolling down
  const scale = dy.interpolate({
    inputRange: [0, MAX_DY],
    outputRange: [1, 0.8],
    extrapolate: 'clamp',
  });

  // cover translation when scrolling up
  const coverTranslateY = scrollY.interpolate({
    inputRange: [0, COVER_MAX_HEIGHT],
    outputRange: [0, -COVER_MAX_HEIGHT],
    extrapolate: 'clamp',
  });

  // pan responder for scroll down to close effect
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (e, gestureState) =>
        // let this handle if we are at top and scrolling down, otherwise pass to scrollview
        currentScrollY.current <= 0 && gestureState.dy > 0,
      onPanResponderMove: Animated.event([null, {dy}], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        if (currentDY.current < MAX_DY) {
          // spring back
          Animated.spring(dy, {toValue: 0, ...springConfig}).start();
        }
      },
    }),
  ).current;

  // listen for scrollview position
  useEffect(() => {
    const id = scrollY.addListener((v) => (currentScrollY.current = v.value));
    return () => {
      scrollY.removeListener(id);
    };
  }, [scrollY]);

  // listen for dy position
  useEffect(() => {
    const id = dy.addListener((v) => {
      currentDY.current = v.value;
      if (currentDY.current >= MAX_DY) {
        // over threshold, close modal
        setShouldClose(true);
      }
    });
    return () => {
      dy.removeListener(id);
    };
  }, [dy]);

  useEffect(() => {
    if (!shouldClose) {
      // animate to full screen
      Animated.sequence([
        Animated.parallel([
          Animated.spring(left, {toValue: 0, ...springConfig}),
          Animated.spring(top, {toValue: 0, ...springConfig}),
          Animated.spring(width, {toValue: dimensions.width, ...springConfig}),
          Animated.spring(height, {
            toValue: dimensions.height,
            ...springConfig,
          }),
          Animated.spring(contentOpacity, {toValue: 1, ...springConfig}),
        ]),
      ]).start();
    } else {
      // spring back and call close handler
      Animated.sequence([
        Animated.spring(contentOpacity, {toValue: 0, ...springConfig}),
        Animated.parallel([
          Animated.spring(left, {toValue: measurement.x, ...springConfig}),
          Animated.spring(top, {toValue: measurement.y, ...springConfig}),
          Animated.spring(width, {toValue: measurement.width, ...springConfig}),
          Animated.spring(height, {
            toValue: measurement.height,
            ...springConfig,
          }),
          Animated.spring(dy, {toValue: 0, ...springConfig}),
        ]),
      ]).start(() => close());
    }
  }, [
    close,
    contentOpacity,
    dy,
    height,
    left,
    measurement.height,
    measurement.width,
    measurement.x,
    measurement.y,
    shouldClose,
    top,
    width,
  ]);

  return (
    <Animated.View
      style={[
        styles.container,
        {left, top, width, height, zIndex, backgroundColor},
      ]}
      {...(!shouldClose ? panResponder.panHandlers : {})}>
      <Animated.View style={[styles.innerContainer, {transform: [{scale}]}]}>
        {!shouldClose && (
          <View style={styles.closeButtonContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShouldClose(true)}>
              <View style={styles.closeButton}>
                <Text style={styles.closeButtonText}>&times;</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
        <Animated.View
          style={[styles.cover, {transform: [{translateY: coverTranslateY}]}]}>
          <ImageBackground
            source={destination.image}
            style={styles.imageBackground}>
            <Text style={styles.title}>{destination.name}</Text>
          </ImageBackground>
        </Animated.View>
        <Animated.ScrollView
          style={[styles.content, {opacity: contentOpacity}]}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollY}}}],
            {
              useNativeDriver: false,
            },
          )}
          scrollEventThrottle={1}>
          <View style={styles.coverPlaceHolder} />
          <Text style={styles.p}>
            Eu. Sagittis ac scelerisque ridiculus. Aptent massa. Varius conubia
            sit gravida pharetra hac lacinia dignissim nunc ullamcorper
            venenatis leo habitasse phasellus augue imperdiet per consequat
            aliquam neque eros sed cum accumsan varius consequat hymenaeos vel
            penatibus fames auctor libero maecenas nec dolor libero id cras
            auctor proin risus pretium Porttitor eleifend est sem.
          </Text>
          <Text style={styles.p}>
            Magna quis torquent ut magna lorem imperdiet feugiat. Laoreet hac
            lacus. Mus rutrum maecenas felis neque ridiculus rhoncus neque
            tempus dui turpis. Tortor aliquet a hac penatibus lacinia mauris
            elementum quam primis montes platea sed netus egestas semper.
            Fringilla parturient ac et cum cursus dis taciti rutrum.
          </Text>
          <Text style={styles.p}>
            Eu. Sagittis ac scelerisque ridiculus. Aptent massa. Varius conubia
            sit gravida pharetra hac lacinia dignissim nunc ullamcorper
            venenatis leo habitasse phasellus augue imperdiet per consequat
            aliquam neque eros sed cum accumsan varius consequat hymenaeos vel
            penatibus fames auctor libero maecenas nec dolor libero id cras
            auctor proin risus pretium Porttitor eleifend est sem.
          </Text>
          <Text style={styles.p}>
            Magna quis torquent ut magna lorem imperdiet feugiat. Laoreet hac
            lacus. Mus rutrum maecenas felis neque ridiculus rhoncus neque
            tempus dui turpis. Tortor aliquet a hac penatibus lacinia mauris
            elementum quam primis montes platea sed netus egestas semper.
            Fringilla parturient ac et cum cursus dis taciti rutrum.
          </Text>
          <Text style={styles.p}>
            Eu. Sagittis ac scelerisque ridiculus. Aptent massa. Varius conubia
            sit gravida pharetra hac lacinia dignissim nunc ullamcorper
            venenatis leo habitasse phasellus augue imperdiet per consequat
            aliquam neque eros sed cum accumsan varius consequat hymenaeos vel
            penatibus fames auctor libero maecenas nec dolor libero id cras
            auctor proin risus pretium Porttitor eleifend est sem.
          </Text>
          <Text style={styles.p}>
            Magna quis torquent ut magna lorem imperdiet feugiat. Laoreet hac
            lacus. Mus rutrum maecenas felis neque ridiculus rhoncus neque
            tempus dui turpis. Tortor aliquet a hac penatibus lacinia mauris
            elementum quam primis montes platea sed netus egestas semper.
            Fringilla parturient ac et cum cursus dis taciti rutrum.
          </Text>
        </Animated.ScrollView>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  innerContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 40,
    right: 16,
    zIndex: 101,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: '#eee',
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: '500',
  },
  cover: {
    ...StyleSheet.absoluteFillObject,
    height: COVER_MAX_HEIGHT,
    zIndex: 1,
  },
  imageBackground: {
    height: COVER_MAX_HEIGHT,
    padding: 20,
    justifyContent: 'flex-end',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: '900',
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    padding: 20,
  },
  coverPlaceHolder: {
    height: COVER_MAX_HEIGHT,
  },
  p: {
    fontSize: 18,
    paddingBottom: 20,
  },
});
export default DestinationModal;
