import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  FlatList,
  View,
  TouchableOpacity,
  AsyncStorage,
  Alert,
  StatusBar
} from 'react-native';
import { ListItem } from 'react-native-elements';

import AddItem from './AddItem';

import data from '../data';

export default class App extends Component {
  state = {
    items: [],
    showAddItem: false,
    nightMode: false
  };

  componentDidMount() {
    const itemsWithStatus = data.map(item =>
      Object.assign({ name: item, done: false })
    );
    const now = new Date();
    const hours = now.getHours();
    const nightMode = hours > 18 || hours < 7;
    this.setState({ items: itemsWithStatus, nightMode }, () =>
      this.loadItems()
    );
  }

  loadItems = async () => {
    try {
      const items = await AsyncStorage.getItem('ITEMS');
      // We have data!!
      if (!items) {
        this.setDefaultItems();
      } else {
        const itemArray = items
          .split(',')
          .map(item => ({ name: item, done: false }));
        this.setState({ items: itemArray });
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  setDefaultItems = () => {
    const defaultString = data.toString();
    try {
      AsyncStorage.setItem('ITEMS', defaultString);
    } catch (error) {
      console.log('Error setting default items', error);
    }
  };

  toggleItem = toggledItem => {
    const newList = this.state.items.map(item => {
      if (item.name === toggledItem.name) {
        return { ...toggledItem, done: !toggledItem.done };
      }
      return item;
    });
    this.setState({ items: newList });
  };

  resetList = () => {
    const list = this.state.items.map(item => ({ ...item, done: false }));
    this.setState({ items: list });
  };

  renderItem = ({ item }) => {
    return (
      <ListItem
        hideChevron={true}
        onPress={() =>
          item.done ? this.confirmDeleteItem(item) : this.toggleItem(item)
        }
        title={item.name}
        subtitle={item.done ? 'Tap to delete from checklist' : null}
        containerStyle={
          item.done
            ? [
                this.state.nightMode
                  ? styles.itemContDoneNight
                  : styles.itemContDone
              ]
            : [this.state.nightMode ? styles.itemContNight : styles.itemCont]
        }
        titleStyle={[
          styles.titleStyle,
          this.state.nightMode ? styles.titleStyleNight : null
        ]}
        subtitleStyle={styles.subtitleStyle}
        underlayColor={
          item.done
            ? [this.state.nightMode ? '#314700' : 'green']
            : [this.state.nightMode ? '#3B454F' : 'white']
        }
      />
    );
  };
  addItem = async item => {
    const items = [...this.state.items, { name: item, done: false }];
    const itemString = items.map(item => item.name).toString();
    try {
      AsyncStorage.setItem('ITEMS', itemString);
    } catch (error) {
      console.log('Error adding new item', error);
    }
    this.setState({ items, showAddItem: false });
  };

  cancelAddItem = () => {
    this.setState({ showAddItem: false });
  };

  confirmDeleteItem = itemToDelete => {
    Alert.alert(
      `Delete item?`,
      `Confirm you want to delete ${itemToDelete.name}`,
      [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel'
        },
        {
          text: 'Delete',
          onPress: () => this.deleteItem(itemToDelete)
        }
      ]
    );
  };

  deleteItem = async itemToDelete => {
    const itemList = this.state.items.filter(
      item => itemToDelete.name !== item.name
    );
    const itemString = itemList.map(item => item.name).toString();
    try {
      AsyncStorage.setItem('ITEMS', itemString);
    } catch (error) {
      console.log('Error deleting item', error);
    }
    this.setState({ items: itemList });
  };

  render() {
    const notDoneList = this.state.items.filter(item => !item.done);
    const doneList = this.state.items.filter(item => item.done);
    const itemList = [...notDoneList, ...doneList];
    if (this.state.showAddItem) {
      return <AddItem addItem={this.addItem} cancel={this.cancelAddItem} />;
    }
    return (
      <View style={{ flex: 1 }}>
        <StatusBar hidden="true" />
        <SafeAreaView style={{ flex: 1 }}>
          <FlatList
            data={itemList}
            keyExtractor={(item, index) => `${index}`}
            renderItem={this.renderItem}
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={this.resetList}
            >
              <Text style={styles.buttonText}>Reset List</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => this.setState({ showAddItem: true })}
            >
              <Text style={styles.buttonText}>Add Item</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  itemCont: {
    backgroundColor: 'white'
  },
  itemContNight: {
    backgroundColor: '#3B454F'
  },
  itemContDoneNight: {
    backgroundColor: '#314700'
  },
  itemContDone: {
    backgroundColor: 'green'
  },
  titleStyle: {
    // backgroundColor: 'green',
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    paddingVertical: 40
  },
  titleStyleNight: {
    color: 'grey'
  },
  subtitleStyle: {
    textAlign: 'center',
    fontSize: 20,
    marginTop: -10
  },
  buttonStyle: {
    marginVertical: 20,
    paddingVertical: 30,
    backgroundColor: '#8CACFF',
    textAlign: 'center',
    width: '40%',
    borderRadius: 10
  },
  buttonRow: {
    flexDirection: 'row',
    backgroundColor: '#3B454F',
    justifyContent: 'space-around'
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20
  }
});
