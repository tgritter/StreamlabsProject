import React from 'react';
import { StyleSheet, Text, View, Image, FlatList, Dimensions } from 'react-native';
import { SocialIcon } from 'react-native-elements'
import Expo from 'expo'
const SCREEN_WIDTH = Dimensions.get('window').width
export default class App extends React.Component {

  constructor() {
    super();
  }

  renderMessage(item){
    if(typeof(item.snippet.textMessageDetails) != "undefined"){
      return item.snippet.textMessageDetails.messageText
    }
  }

  renderComponent(item){
    return(
      <View style={styles.textContainer}>
        <Image
          style={styles.thumbnail}
          source={{uri: item.authorDetails.profileImageUrl}}
        />
        <View style={styles.flex}>
        <Text>
          <Text style={styles.userNameText}>{item.authorDetails.displayName}  </Text>
          <Text style={styles.messageText}>{this.renderMessage(item)}</Text>
        </Text>

        </View>
      </View>
    )
  }

  render() {
    return (
      <FlatList
        inverted
        data={this.props.data}
        renderItem={({item}) => (
          this.renderComponent(item)
        )}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: {
    width: SCREEN_WIDTH - 50,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: 5
  },
  userNameText: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  messageText: {
    fontSize: 14,
    maxWidth: SCREEN_WIDTH -50
  },
  thumbnail: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 5
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonStyle: {
    width: 300,
  }
});
