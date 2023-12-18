/**
 * Created by InspireUI on 27/02/2017.
 *
 * @format
 */

import React, {Component} from 'react';
import {
  View,
  RefreshControl,
  StyleSheet,
  ScrollView,
  Animated,
  Text,
  TouchableOpacity,
} from 'react-native';
import ListView from 'deprecated-react-native-listview';
import {connect} from 'react-redux';
import {Color, Languages, Styles, withTheme, Images} from '@common';
import {Timer, toast, BlockTimer} from '@app/Omni';
import LogoSpinner from '@components/LogoSpinner';
import Empty from '@components/Empty';
import {DisplayMode} from '@redux/CategoryRedux';
import SubCategoryPicker from '@containers/SubCategoryPicker';
import ProductRow from './ProductRow';
import ControlBar from './ControlBar';
import FastImage from 'react-native-fast-image';
import RNRestart from 'react-native-restart'; // Import package from node modules

const styles = StyleSheet.create({
  listView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    paddingBottom: Styles.navBarHeight + 10,
  },
  container: {
    flexGrow: 1,
    backgroundColor: Color.background,
  },
});

class CategoryScreen extends Component {
  constructor(props) {
    console.debug('In category drill down');
    super(props);
    this.state = {
      scrollY: new Animated.Value(0),
      loadingBuffer: true,
      modalVisible: false,
      displayControlBar: true,
    };
    this.hasLoaded = false;
    this.pageNumber = 1;

    this.renderList = this.renderList.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.renderScrollComponent = this.renderScrollComponent.bind(this);
    this.onRowClickHandle = this.onRowClickHandle.bind(this);
    this.onEndReached = this.onEndReached.bind(this);
    this.onRefreshHandle = this.onRefreshHandle.bind(this);
    this.onListViewScroll = this.onListViewScroll.bind(this);

    this.openCategoryPicker = () => this.setState({modalVisible: true});
    this.closeCategoryPicker = () => this.setState({modalVisible: false});
  }

  load = async () => {
    const {fetchProductsByCategoryId, clearProducts, selectedCategory} =
      this.props;
    clearProducts();
    try {
      if (!this.hasLoaded) {
        this.hasLoaded = true;
        //get passed navigation category
        // let paramsCat;
        // try {
        //   paramsCat= this.props.navigation.getParam("selectedCategory", undefined);
        // } catch (error) {

        // }

        //start process
        // if(typeof paramsCat !== "undefined" && paramsCat)
        // {
        //   await this.props.fetchProductsByCategoryId(paramsCat._id);
        // }
        // else

        if (typeof selectedCategory !== 'undefined') {
          //this was passed via navigation
          console.debug('stop');
          await fetchProductsByCategoryId(
            selectedCategory._id,
            this.pageNumber++,
          );
        } else {
          //this may happen if passed via params!!
          alert('No category was passed');
        }
      }
    } catch (error) {
      alert(error);
    }
  };

  unload = async () => {
    this.hasLoaded = false;
  };

  shouldComponentUpdate(nextProps) {
    const props = this.props;
    const changeProduct =
      nextProps.products.list.length != props.products.list.length;

    // const changeCategory =
    // props.selectedCategory._id !== nextProps.selectedCategory._id;

    return true;
  }

  componentWillUnmount = () => {
    try {
      this.unload();
      this.unsubscribeWillFocus();
      this.unsubscribeLoseFocus();
    } catch (error) {}
  };

  componentDidMount = async () => {
    Timer.setTimeout(() => this.setState({loadingBuffer: false}), 1000);
    this.unsubscribeWillFocus = this.props.navigation.addListener(
      'willFocus',
      this.load,
    );
    this.unsubscribeLoseFocus = this.props.navigation.addListener(
      'willBlur',
      this.unload,
    );
    await this.load();
  };

  componentWillReceiveProps(nextProps) {
    const props = this.props;
    const {error} = nextProps.products;
    if (error) toast(error);

    // if (props.selectedCategory !== nextProps.selectedCategory) {
    //   this.pageNumber = 1;
    //   props.clearProducts();

    //   if (typeof selectedCategory !== "undefined" && selectedCategory) {
    //   props.fetchProductsByCategoryId(
    //     nextProps.selectedCategory._id,
    //     this.pageNumber++
    //   );
    //   }
    //   else{
    //     //alert("selected category wasn't available");
    //   }
    // }
  }

  _renderPageErrorButton = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          RNRestart.Restart();
          // EventRegister.emit("resetStacksAndGo")
          // this.props.navigation.navigate("Home")
        }}
        style={{
          flex: 1,
          alignContent: 'center',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            flex: 1,
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <FastImage
            style={{
              maxHeight: 200,
              height: 200,
              width: 200,
              maxWidth: 200,
            }}
            source={Images.CloudSync2}
            resizeMode="contain"
          />
          <Text style={{textAlign: 'center', paddingTop: 6}}>
            {'Whoops, something went wrong.\nTry again please.'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const {modalVisible, loadingBuffer, displayControlBar} = this.state;
    const {products, selectedCategory} = this.props;
    const {
      theme: {
        colors: {background},
      },
    } = this.props;

    let categoryToUse = selectedCategory;
    // let paramsCat = this.props.navigation.getParam("selectedCategory", undefined);
    // if(typeof paramsCat !== "undefined")
    // {
    //   categoryToUse = paramsCat;
    // }
    if (!categoryToUse) return this._renderPageErrorButton();

    if (products.error) {
      return <Empty text={products.error} />;
    }

    if (loadingBuffer) {
      return <LogoSpinner fullStretch />;
    }

    const marginControlBar = this.state.scrollY.interpolate({
      inputRange: [-100, 0, 40, 50],
      outputRange: [0, 0, -50, -50],
    });
    return (
      <View style={[styles.container, {backgroundColor: background}]}>
        <Animated.View style={{marginTop: marginControlBar}}>
          <ControlBar
            openCategoryPicker={this.openCategoryPicker}
            isVisible={displayControlBar}
            name={categoryToUse.name}
          />
        </Animated.View>
        {this.renderList(products.list)}
        {/* <SubCategoryPicker
          closeModal={this.closeCategoryPicker}
          visible={modalVisible}
        /> */}
      </View>
    );
  }

  renderList(data) {
    const {products, displayMode} = this.props;
    const isCardMode = displayMode == DisplayMode.CardMode;
    const dataSource = new ListView.DataSource({
      rowHasChanged: (product1, product2) => product1._id !== product2._id,
    });

    return (
      <ListView
        dataSource={dataSource.cloneWithRows(data)}
        renderRow={this.renderRow}
        enableEmptySections
        onEndReached={this.onEndReached}
        refreshControl={
          <RefreshControl
            refreshing={isCardMode ? false : products.isFetching}
            onRefresh={this.onRefreshHandle}
          />
        }
        contentContainerStyle={styles.listView}
        initialListSize={6}
        pageSize={2}
        renderScrollComponent={this.renderScrollComponent}
      />
    );
  }

  renderRow(product) {
    const {displayMode} = this.props;
    const onPress = () => this.onRowClickHandle(product);
    const isInWishList =
      this.props.wishListItems.find(item => item.product._id == product._id) !=
      undefined;

    return (
      <ProductRow
        product={product}
        onPress={onPress}
        displayMode={displayMode}
        isInWishList={isInWishList}
        addToWishList={this.addToWishList.bind(this)}
        removeWishListItem={this.removeWishListItem.bind(this)}
      />
    );
  }

  renderScrollComponent(props) {
    const {displayMode} = this.props;
    const mergeOnScroll = event => {
      props.onScroll(event);
      this.onListViewScroll(event);
    };

    if (displayMode == DisplayMode.CardMode) {
      return (
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          props
          {...props}
          onScroll={mergeOnScroll}
        />
      );
    }

    return <ScrollView props {...props} onScroll={mergeOnScroll} />;
  }

  addToWishList(product) {
    this.props.addWishListItem(product);
  }

  removeWishListItem(product) {
    this.props.removeWishListItem(product);
  }

  onRowClickHandle(product) {
    BlockTimer.execute(() => {
      this.props.onViewProductScreen({product});
    }, 500);
  }

  onEndReached() {
    const {products, fetchProductsByCategoryId, selectedCategory} = this.props;
    //if (!products.isFetching && products.stillFetch)

    // if (typeof selectedCategory !== "undefined") {
    //   fetchProductsByCategoryId(selectedCategory._id, this.pageNumber++);
    // }
    // else{

    // }
  }

  onRefreshHandle() {
    const {fetchProductsByCategoryId, clearProducts, selectedCategory} =
      this.props;
    this.pageNumber = 1;

    // clearProducts();
    // fetchProductsByCategoryId(selectedCategory._id, this.pageNumber++);
  }

  onListViewScroll(event: Object) {
    this.state.scrollY.setValue(event.nativeEvent.contentOffset.y);
  }
}

const mapStateToProps = state => {
  return {
    selectedCategory: state.categories.selectedCategory,
    netInfo: state.netInfo,
    displayMode: state.categories.displayMode,
    products: state.products,
    wishListItems: state.wishList.wishListItems,
  };
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  const {netInfo} = stateProps;
  const {dispatch} = dispatchProps;
  const {actions} = require('@redux/ProductRedux');
  const WishListRedux = require('@redux/WishListRedux');
  return {
    ...ownProps,
    ...stateProps,

    fetchProductsByCategoryId: async (categoryId, page, per_page = 100) => {
      //if (!netInfo.isConnected) return toast(Languages.noConnection);
      return actions.fetchProductsByCategoryId(
        dispatch,
        categoryId,
        per_page,
        page,
      );
    },
    clearProducts: () => dispatch(actions.clearProducts()),
    addWishListItem: product => {
      WishListRedux.actions.addWishListItem(dispatch, product, null);
    },
    removeWishListItem: (product, variation) => {
      WishListRedux.actions.removeWishListItem(dispatch, product, null);
    },
  };
}

export default connect(
  mapStateToProps,
  undefined,
  mergeProps,
)(withTheme(CategoryScreen));
