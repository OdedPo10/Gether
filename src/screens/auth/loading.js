import React from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

const Loading = () => {
  return (
    <View style={[StyleSheet.absoluteFillObject, styles.loadContainer]}>
      <LottieView source={require("../../assets/97203-loader.json")} autoPlay loop />
    </View>
  );
};

const styles = StyleSheet.create({
  loadContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Loading;
