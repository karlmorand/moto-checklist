import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView
} from 'react-native';

export default class AddItem extends Component {
  state = {
    newItem: ''
  };
  componentDidMount() {
    this.textInput.focus();
  }
  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Text style={styles.title}>Add Item</Text>
        <TextInput
          style={styles.input}
          ref={input => {
            this.textInput = input;
          }}
          onChangeText={newItem => this.setState({ newItem })}
        />
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={this.props.cancel}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={() => this.props.addItem(this.state.newItem)}
          >
            <Text style={styles.buttonText}>Add Item</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 40,
    margin: 10,
    fontWeight: 'bold'
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginVertical: 10
  },
  buttonStyle: {
    padding: 20,
    backgroundColor: 'orange',
    borderRadius: 10
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold'
  },
  input: {
    padding: 20,
    backgroundColor: 'white',
    width: '80%',
    borderRadius: 10,
    marginVertical: 20,
    fontSize: 25,
    borderColor: 'orange',
    borderWidth: 2
  }
});
