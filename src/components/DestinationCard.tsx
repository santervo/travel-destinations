import React, {useRef} from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import {Measurement} from '../model/Measurement';
import {TravelDestination} from '../model/TravelDestination';

interface Props {
  destination: TravelDestination;
  open: (destination: TravelDestination, measurement: Measurement) => void;
}

const DestinationCard = ({destination, open}: Props) => {
  const ref: React.MutableRefObject<View | null> = useRef(null);

  const onPress = () => {
    ref.current?.measureInWindow((x, y, width, height) =>
      open(destination, {x, y, width, height}),
    );
  };

  return (
    <View style={styles.container}>
      <View ref={ref}>
        <TouchableHighlight activeOpacity={0.8} onPress={onPress}>
          <ImageBackground
            source={destination.image}
            style={styles.imageBackground}>
            <Text style={styles.title}>{destination.name}</Text>
          </ImageBackground>
        </TouchableHighlight>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  imageBackground: {
    height: 300,
    padding: 20,
    justifyContent: 'flex-end',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: '900',
  },
});

export default DestinationCard;
