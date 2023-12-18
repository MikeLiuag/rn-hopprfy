/** @format */

import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, Text } from "react-native";
import { Color, withTheme } from "@common";
import { currencyFormatter } from "@app/Omni";
import styles from "./styles";

class ProductPrice extends PureComponent {
  static propTypes = {
    product: PropTypes.object,
    hideDisCount: PropTypes.bool,
    style: PropTypes.any,
  };

  render() {
    const {
      product,
      hideDisCount,
      style,
      theme: {
        colors: { text },
      },
    } = this.props;
    return (
      <View style={[styles.price_wrapper, style && style]}>
        <Text
          style={[
            styles.text_list,
            styles.price,
            {
              color: Color.blackTextSecondary,
            },
            { color: text },
          ]}>
          {`${currencyFormatter(product.price)} `}
        </Text>
        <Text style={[styles.text_list, styles.sale_price, { color: text }]}>
          {product.on_sale ? currencyFormatter(product.regular_price) : ""}
        </Text>
        {hideDisCount ? (
          <View />
        ) : !product.on_sale ? (
          <View />
        ) : (
          <View style={styles.saleWrap}>
            <Text style={[styles.text_list, styles.sale_off, { color: text }]}>
              {`-${(
                (1 - Number(product.price) / Number(product.regular_price)) *
                100
              ).toFixed(0)}%`}
            </Text>
          </View>
        )}
      </View>
    );
  }
}

export default withTheme(ProductPrice);
