# HorizontalScrollPicker

This is a small react-native library for picking item from horizontall scroll

- Contains some fixes for Android
- Based on ScrollView from `react-native-gesture-handlers` for better ineroperability with `reanimated-bottom-sheet` or `react-native-modalize`

![](doc/timeline.gif)

---

## Usage

1) Install react-native-gesture handler. If you are using Expo - it sould work out of box.

```

import { HorizontalScrollPicker } from 'react-native-horizontal-scroll-picker';

const timeItems = ['11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00']
...

<HorizontalScrollPicker
    items={_.map(timeItems, (item) => {
        return { label: item, value: item}
    })}
    onSelect={this._selectTime}
/>
```


Special thanks to Alexei https://github.com/gvoz
