import React from 'react';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { SocialIcon, Icon } from 'react-native-elements'
import Expo from 'expo'
const SCREEN_WIDTH = Dimensions.get('window').width

export default class App extends React.Component {
  
  constructor() {
    super();
    this.state = {
      name: '',
      type: 'Users',
      messages: []
    }
  } 
   
  
  componentDidMount(){
    this.setState({
      messages: this.props.data
    })
  }
  
  renderMessage(item){
    if(typeof(item.snippet.textMessageDetails) != "undefined"){
      return item.snippet.textMessageDetails.messageText
    }
  }
  
  renderComponent(item){ 
    return(
      <TouchableOpacity onPress={() => this.setState({type: 'Messages', name: item.name})}>
      <View style={styles.textContainer}>
        <Image 
          style={styles.thumbnail}
          source={{uri: item.url}}
        />
          <Text style={styles.userNameText}>{item.name}  </Text> 
      </View> 
      </TouchableOpacity>
    )
  }
  
  renderMessageComponent(item){
    return(
      <View style={styles.textContainer}>
      <Image 
        style={styles.thumbnail}
        source={{uri: item.url}}
      />
      <View style={styles.flex}>
      <Text>
        <Text style={styles.userNameText}>{item.name}  </Text> 
        <Text style={styles.messageText}>{item.message}</Text>  
      </Text>
      </View>
    </View> 
  )
  }
  
  filterData(data){
    var newList = []
    for(var i = 0; i < data.length; i++){
      var item = data[i]
        var found = false;
        for(var j = 0; j < newList.length; j++) {
          if (newList[j].name == item.authorDetails.displayName) {
            found = true;
            break;
          }
        }
        if(!found){
          var newItem = {name: item.authorDetails.displayName, url: item.authorDetails.profileImageUrl}
          newList.push(newItem)
        }
      }
      
      return newList
  }
  
  filterMessageData(data){
    var newList = []
    
    for(var i = 0; i < data.length; i++){
      var item = data[i]
      if(item.authorDetails.displayName == this.state.name){
          var newItem = {name: item.authorDetails.displayName, url: item.authorDetails.profileImageUrl, message: this.renderMessage(item)}
          newList.push(newItem)
        }
      }
      
      return newList
  }
  
  renderMessages(){
    var newList = this.filterMessageData(this.state.messages)
    console.log('NewListTest: ' + JSON.stringify(newList))
    return(
      <FlatList
        data={newList}
        renderItem={({item}) => (
          this.renderMessageComponent(item)
        )} 
      />
    )
  }
  
  renderUsers(){
    var newList = this.filterData(this.state.messages) 
    return(
      <FlatList
        data={newList}
        renderItem={({item}) => (
          this.renderComponent(item)
        )} 
      />
    )
  }
  
  render() {
    
    if(this.state.type == 'Users'){
      return(
        <View style={styles.container}>
          <View style={styles.topBar}>
            <Text style={styles.headerText}>Click on User to See Messages</Text>
          </View>
          {this.renderUsers()}
        </View>
      )
    }else{
      return(
        <View style={styles.container}>
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.backButtonContainer} onPress={() => this.setState({type: 'Users', name: ''})}>
              <View style={styles.backButtonContainer}>
                <Icon
                  name='arrow-back'
                  color='#000'
                  size={25}
                />
              </View>
            </TouchableOpacity>
            <View style={styles.headerTextFlex}>
              <Text style={styles.headerTextSmall}>Messages of {this.state.name}</Text>
            </View>
            <View style={styles.backButtonContainer}/>
          </View>
          {this.renderMessages()}
        </View>
      )
    }
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
  backButtonContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    justifyContent: 'center',
  },
  headerTextFlex: {
    flex: 7,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    alignItems: 'center',  
    justifyContent: 'flex-start',
    padding: 5
  },
  topBar: {
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    height: 30,
    borderBottomWidth: 1,
    borderColor: 'black',
    alignItems: 'center',  
    justifyContent: 'center',
  }, 
  headerText: {
    fontSize: 16,
    fontWeight: 'bold'  
  },
  headerTextSmall: {
    fontSize: 14,
    fontWeight: 'bold'  
  },
  userNameText: {
    fontSize: 14,
    fontWeight: 'bold'  
  },
  messageText: {
    fontSize: 14,
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