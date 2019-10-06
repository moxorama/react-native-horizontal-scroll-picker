import React, { Component } from 'react';
import { View, Text, Dimensions, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

import { ScrollView }  from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');
const rowItems = 5;

import styles from './HorizontalScrollPickerStyle';

class HorizontalScrollPicker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            size: width / props.rowItems,
            selected: 1,
        };

        this.scrollView = null;
        this.scrollOffset = 0;
        this.isParking = false;
    }

    _calculateLayout = (event) => {
        const { rowItems } = this.props;

        const { width } = event.nativeEvent.layout;
        this.setState({ size: width / rowItems });
    };

    _renderItem = (item, idx) => {
        const { size } = this.state;
        const { textStyle } = this.props;

        const { label, value } = item;

        return (
            <View
                key={`item-${idx}-${value}`}
                style={[
                    styles.itemContainer,
                    {
                        width: size,
                        height: size,
                    },
                ]}
            >
                <Text style={[styles.item, textStyle]}>{label}</Text>
            </View>
        );
    };

    _handleScroll = (event) => {
        this.scrollOffset = event.nativeEvent.contentOffset.x;
    };

    _handleParking = () => {
        const { size } = this.state;
        const { onSelect, items } = this.props;

        this.isParking = true;

        setTimeout(() => {
            if (this.isParking) {
                const selected = this._selectItem();
                this.setState({
                    selected,
                });
                this.isParking = false;
                this.scrollView.scrollTo({ y: 0, x: size * selected, animated: true });
                onSelect(items[selected].value);
            }
        }, 250);
    };

    _cancelParking = () => {
        this.isParking = false;
    }

    _selectItem = () => {
        const { items, onSelect } = this.props;
        const { size } = this.state;

        const idx = Math.abs(Math.round(this.scrollOffset / size));
        const selected = idx === items.length ? idx - 1 : idx;
        this.setState({
            selected,
        });

        onSelect(items[selected].value);
        return selected;
    }


    render() {
        const { items, rowItems, containerStyle, selectedStyle } = this.props;
        const { size } = this.state;

        const sideItems = (rowItems - 1) / 2;

        return (
            <View style={[styles.timelineContainer, { height: size, width: rowItems * size }, containerStyle]}>
                <View
                    style={[
                        styles.selectedItem,
                        {
                            left: sideItems * size,
                            width: size,
                            height: size,
                        },
                        selectedStyle
                    ]}
                />
                <ScrollView
                    horizontal
                    ref={(ref) => (this.scrollView = ref)}
                    showsHorizontalScrollIndicator={false}
                    onLayout={this._calculateLayout}
                    snapToInterval={size}
                    onTouchEnd={this._scrollParking}
                    onScroll={this._handleScroll}
                    onTouchEnd={this._handleParking}
                    onScrollEndDrag={this._handleParking}
                    scrollEventThrottle={16}
                    onMomentumScrollBegin={this._cancelParking}
                    onMomentumScrollEnd={this._selectItem}
                    shouldCancelWhenOutside={false}
                    contentContainerStyle={{
                        paddingLeft: size * sideItems,
                        paddingRight: size * sideItems,
                        height: size,
                    }}
                >
                    {items.map((item, idx) => this._renderItem(item, idx))}
                </ScrollView>
            </View>
        );
    }
}

HorizontalScrollPicker.propTypes = {
    rowItems: PropTypes.number,
    containerStyle: ViewPropTypes.style,
    selectedStyle: ViewPropTypes.style,
    textStyle: ViewPropTypes.style,
    items: PropTypes.array,
    onSelect: PropTypes.func.isRequired
};

HorizontalScrollPicker.defaultProps = {
    rowItems: rowItems,
    items: [],
};

export default HorizontalScrollPicker;