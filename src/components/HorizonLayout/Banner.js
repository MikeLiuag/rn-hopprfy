/** @format */

import React, { PureComponent } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { Images, Styles } from "@common";
import { ImageCache, TouchableScale } from "@components";
import { getProductImage, currencyFormatter } from "@app/Omni";
import { LinearGradient } from "@expo";
import css from "./style";
import ProductURLHelper from "../../services/ProductURLHelper";

export default class BannerLarge extends PureComponent {
  render() {
    console.debug("rendering banner in bannerLarge:" + product.name);
    const { viewPost, title, product } = this.props;
    const imageURI =
      typeof product.images[0] !== "undefined"
        ? getProductImage(
            ProductURLHelper.generateProductURL(product.images[0]),
            Styles.width - 42
          )
        : Images.PlaceHolderURL;
    const productPrice = `${currencyFormatter(product.price)} `;
    const productPriceSale = product.on_sale
      ? `${currencyFormatter(product.regular_price)} `
      : null;

    return (
      <TouchableScale onPress={viewPost} style={css.bannerViewShadow}>
        <View activeOpacity={1} style={css.bannerView}>
          <ImageCache uri={imageURI} style={css.bannerImage} />

          <LinearGradient
            colors={["rgba(0,0,0,0)", "rgba(0,0,0, 0.7)"]}
            style={css.bannerOverlay}
          >
            <Text style={css.bannerTitle}>{title}</Text>
            <View style={css.priceView}>
              <Text style={[css.price]}>{productPrice}</Text>
              <Text style={[css.price, product.on_sale && css.sale_price]}>
                {productPriceSale}
              </Text>
            </View>
          </LinearGradient>
        </View>
      </TouchableScale>
    );
  }
}
