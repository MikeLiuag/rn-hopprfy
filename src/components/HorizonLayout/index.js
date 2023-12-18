/** @format */

import React, {PureComponent} from 'react';
import {View} from 'react-native';
import {Images, Constants, Styles, Tools} from '@common';
import {getProductImage} from '@app/Omni';

import ColumnHigh from './OneColumn';
import TwoColumn from './TwoColumn';
import ThreeColumn from './ThreeColumn';
import Card from './Card';
import BannerLarge from './BannerLarge';
import Banner from './Banner';
import BannerHigh from './BannerHigh';
import ProductURLHelper from '../../services/ProductURLHelper';

export default class HorizonLayout extends PureComponent {
  render() {
    const {onViewPost, product} = this.props;
    const title = Tools.getDescription(product.name);

    console.debug('Rendering HorizonLayout for product:' + product.name);

    const imageURL =
      product.images.length > 0
        ? getProductImage(
            ProductURLHelper.generateProductURL(product.images[0]),
            Styles.width,
          )
        : Images.PlaceHolderURL;

    const props = {
      imageURL,
      title,
      viewPost: onViewPost,
      product,
    };

    switch (this.props.layout) {
      case Constants.Layout.twoColumn:
        return <TwoColumn {...props} />;
      case Constants.Layout.threeColumn:
        return <ThreeColumn {...props} />;
      case Constants.Layout.BannerLarge:
        return <BannerLarge {...props} />;
      case Constants.Layout.card:
        return <Card {...props} />;
      case Constants.Layout.Banner:
        return <Banner {...props} />;
      case Constants.Layout.BannerHigh:
        return <BannerHigh {...props} />;
      default:
        return <ColumnHigh {...props} />;
    }
  }
}
