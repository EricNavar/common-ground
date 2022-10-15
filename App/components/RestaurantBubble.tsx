import React from 'react';
import { TouchableOpacity, Image, StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
  restaurantMain: {
    justifyContent: 'center',
    textAlign: 'center',
  },
  image: {
    width: 85,
    height: 85,
    borderRadius: 8,
    marginRight: 16,
  },
  text: {
    marginRight: 'auto',
    marginLeft: 'auto',
    marginTop: 8,
    width: 100,
    overflow: 'hidden',
  },
});

type RestaurantBubbleProps = {
  thumbnail: string,
  name: string,
  onPress: () => void,
}

function RestaurantBubble(props: RestaurantBubbleProps) {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <Image style={styles.image} source={{ uri: props.thumbnail}}/>
      <Text style={styles.text}>
        {props.name}
      </Text>
    </TouchableOpacity>
  );
}

export { RestaurantBubble };
