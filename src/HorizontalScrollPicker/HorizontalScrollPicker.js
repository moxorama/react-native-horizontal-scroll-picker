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

        const size = width / props.rowItems;

        this.state = {
            size,
            selected: props.initialIdx,
        };

        this.scrollView = null;
        this.scrollOffset = 0;
        this.isParking = false;
    }


    _calculateLayout = (event) => {
        this.scrollView.scrollTo({ x: initialIdx * size, y: 0, animated: false });
    };

    _renderItem = (item, idx) => {
        const { size, selected } = this.state;
        const { itemStyle, textStyle, selectedTextStyle } = this.props;

        const { label, value } = item;


        return (
            <View
                key={`item-${idx}-${value}`}
                style={[
                    styles.itemContainer,
                    {
                        width: size,
                    },
                    itemStyle
                ]}
            >
                <Text style={[styles.item, textStyle,
                    (selected == idx) && selectedTextStyle
                ]}>
                    {label}
                </Text>
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
        }, 150);
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
        const { items, rowItems, containerStyle, selectorStyle } = this.props;
        const { size } = this.state;

        const sideItems = (rowItems - 1) / 2;

        return (
            <View style={[styles.timelineContainer, { width: rowItems * size }, containerStyle]}>
                <View
                    style={[
                        styles.selectedItem,
                        {
                            left: sideItems * size,
                            width: size,
                        },
                        selectorStyle
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
    itemStyle: ViewPropTypes.style,
    selectorStyle: ViewPropTypes.style,
    textStyle: Text.propTypes.style,
    selectedTextStyle: Text.propTypes.style,
    items: PropTypes.array,
    onSelect: PropTypes.func.isRequired,
    initialIdx: PropTypes.number.isRequired
};

HorizontalScrollPicker.defaultProps = {
    rowItems: rowItems,
    items: [],
    initialIdx: 0,
};

export default HorizontalScrollPicker;
