/** @format */

import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Animated, Platform, Text, View, I18nManager } from "react-native";
import { Menu, Back } from "@navigation/IconNav";
import { Languages, Images, withTheme, GlobalStyle, Constants } from "@common";
import styles from "./styles";

const isAndroid = Platform.OS === "android";

class AnimatedHeader extends PureComponent {
  static propTypes = {
    scrollY: PropTypes.any,
    label: PropTypes.string,
    hideIcon: PropTypes.bool,
  };

  render() {
    const { scrollY, label, hideIcon, navigation } = this.props;
    const title = Languages[label] || label;
    const {
      theme:{
        colors:{
          background, text
        }
      }
    } = this.props

    if (isAndroid || typeof scrollY === "undefined") {
      return (
        <View style={[styles.headerAndroid, {backgroundColor: GlobalStyle.primaryBackgroundColor.color}]}>
          {label && <Text style={[styles.headerLabelStatic, {fontFamily: Constants.fontHeader,color: text}]}>{label}</Text>}
          {!hideIcon && <View style={styles.homeMenu}>{Menu()}</View>}
        </View>
      );
    }

    const titleTransformY = scrollY.interpolate({
      inputRange: [0, 50],
      outputRange: [0, -45],
      extrapolate: "clamp",
    });
    const titleTransformX = scrollY.interpolate({
      inputRange: [0, 50],
      outputRange: [0, I18nManager.isRTL ? -25 : 25],
      extrapolate: "clamp",
    });
    const titleScale = scrollY.interpolate({
      inputRange: [0, 50],
      outputRange: [1, 0.8],
      extrapolate: "clamp",
    });

    return (
      <View>
        <View style={styles.headerView} />

        <Animated.Text
          style={[
            styles.headerLabel,
            {
              transform: [
                { translateY: titleTransformY },
                { translateX: titleTransformX },
                { scale: titleScale },
              ],
            },
            {color: text}
          ]}>
          {title}
        </Animated.Text>
        {!hideIcon && <View style={styles.homeMenu}>{Menu()}</View>}
      </View>
    );
  }
}

export default withTheme(AnimatedHeader)
