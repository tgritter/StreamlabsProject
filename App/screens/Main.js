import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
  View,
  WebView,
  Text,
  Dimensions,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Chat from '../component/Chat'
import Users from '../component/Users'
import Stats from '../component/Stats'
import { Icon } from 'react-native-elements'
import { connect } from 'react-redux';
import { setStreamNumber, setCurrentViewerNumber } from '../redux/actions';

const SCREEN_WIDTH = Dimensions.get('window').width
const MAIN_COLOR = '#0B4F6C'
const UNSELECTED_TAB_COLOR = 	'#696969'
const API_KEY = 'AIzaSyD1_ZilM4gBhIX60UL4wen-8YKh8hgDwJA'

class Main extends React.Component {

  constructor() {
    super();
    this.state = {
      isLoading: true,
      videoID: '',
      activeChatID: '',
      keyboardShowing: false,
      viewerCount: 0,
      text: '',
      tabType: 'Chat',
      pageToken: '',
      messages: [],
      newMessages: []
    }
  }

  componentDidMount(){  
    //Get VideoID of stream with most current viewers
    fetch('https://www.googleapis.com/youtube/v3/search?part=snippet&eventType=live&type=video&regionCode=US&order=viewCount&maxResults=5&key=' + API_KEY)
      .then((response) => response.json())
      .then((responseJson) => {
        var items = responseJson.items
        var streamNumber = this.props.streamNumber
        if(items[streamNumber]['id']['videoId'] == 'nvzfO4GG5ug'){
          streamNumber = streamNumber + 1
        }
        var videoID = items[streamNumber]['id']['videoId']
        this.setState({
          videoID: videoID,
        }, function(){
          this.getChatID(videoID)
        });
      })
      .catch((error) =>{
        console.error(error);
      });
      
    //Open Listeners for seeing whether keyboard is open
    //Use to hide video while user types message
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
  }

  //Remove Keyboard Listener
  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }


  _keyboardDidShow () {
    this.setState({
      keyboardShowing: true
    })
  }

  _keyboardDidHide () {
    this.setState({
      keyboardShowing: false
    })
  }
    
  //Get LiveStream Chat ID based upon Video ID
  getChatID(videoID){
    const { navigate } = this.props.navigation;
    return fetch('https://www.googleapis.com/youtube/v3/videos?id=' + videoID + '&part=snippet,contentDetails,statistics,liveStreamingDetails&key=' + API_KEY)
      .then((response) => response.json())
      .then((responseJson) => {
        var items = responseJson.items

        //Check to see if Video has a valid live stream
        //If not return to login screen and change to second most popular video to prevent error
        if(items.length == 0){
          this.props.setStreamNumber(this.props.streamNumber + 1)
          navigate('Login')
        }else if(typeof items[0]['liveStreamingDetails'] === "undefined"){
          this.props.setStreamNumber(this.props.streamNumber + 1)
          navigate('Login')
        }else{
          this.setState({
            activeChatID: items[0]['liveStreamingDetails']['activeLiveChatId'],
            isLoading: false,
          }, function(){
            this.getViewerCount()
            this.getMessages()
          })};
        })
        .catch((error) =>{
          console.error(error);
        });
    }

    //Get numbers of current viewers 
    getViewerCount(){
      this.props.setCurrentViewerNumber(this.state.viewerCount)
      return fetch('https://www.youtube.com/live_stats?v=' + this.state.videoID)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          viewerCount: responseJson,
        });
      })
    }

    //Get List of Current Messages
    getMessages(){
      return fetch('https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=' + this.state.activeChatID +'&part=snippet,authorDetails&pageToken=' + this.state.pageToken + '&key=' + API_KEY)
      .then((response) => response.json())
      .then((responseJson) => {
        //Add News Messages to Local Message List
        var currentItems = this.state.messages
        var items = responseJson.items
        var newItems = items.concat(currentItems)
        
        //Slice list to reduce data size
        var length = newItems.length - 1
        var lengthMinus = length - 100
        var newList = newItems.slice(0, 100) 

        this.setState({
          messages: newList,
          newMessages: responseJson.items,
          pageToken: responseJson.nextPageToken,
          intervalMilli: responseJson.pollingIntervalMillis,
          isLoading: false,
        }, function(){
          this.setTimeOut()
        });
      })
      .catch((error) =>{
        console.error(error);
      });
    }

  setTimeOut(){
    setTimeout(() => {
      this.getMessages()
      this.getViewerCount()
    }, this.state.intervalMilli);
  }

  //Render WebVideo Player
  renderVideo(uriString){
    if(!this.state.keyboardShowing){
      return(
        <View style={{width: Dimensions.get('window').width, height: 250}}>
          <WebView
            javaScriptEnabled={true}
            source={{uri: uriString}}
          />
        </View>
      )
    }
  }

  //Render Icons with with white color is selected, grey if otherwise
  renderChatIcon(color){
    return(
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => this.setState({tabType: 'Chat'})}>
          <Icon
            name='message'
            type='entypo'
            color={color}
          />
        </TouchableOpacity>
      </View>
    )
  }

  renderUsersIcon(color){
    return(
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => this.setState({tabType: 'Users'})}>
          <Icon
            name='users'
            type='entypo'
            color={color}
          />
        </TouchableOpacity>
      </View>
    )
  }

  renderStatsIcon(color){
    return(
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => this.setState({tabType: 'Stats'})}>
          <Icon
            name='line-graph'
            type='entypo'
            color={color}
          />
        </TouchableOpacity>
      </View>
    )
  }

  //Render Tab Icon
  //Color changes from White to Grey depending on which tab is selected
  renderTab(){
    if(!this.state.keyboardShowing){
      return(
        <View style={styles.tab}>
          <View style={styles.icons}>
            {this.state.tabType == 'Chat' ? this.renderChatIcon('#fff') : this.renderChatIcon(UNSELECTED_TAB_COLOR)}
            {this.state.tabType == 'Users' ? this.renderUsersIcon('#fff') : this.renderUsersIcon(UNSELECTED_TAB_COLOR)}
            {this.state.tabType == 'Stats' ? this.renderStatsIcon('#fff') : this.renderStatsIcon(UNSELECTED_TAB_COLOR)}

          </View>
          <View style={styles.viewerCount}>
            <Text style={styles.viewersText}>{this.state.viewerCount} Viewers   </Text>
          </View>
        </View>
      )
    }
  }

  //Change Databox Depending on Tab Selected
  renderDataBox(){
    if(this.state.tabType == 'Chat'){
      return(
        <View style={styles.chatContainer}>
          <Chat data={this.state.messages}/>
        </View>
      )
    }else if(this.state.tabType == 'Users'){
      return(
        <View style={styles.chatContainer}>
          <Users data={this.state.messages}/>
        </View>
      )
    }else{
      return(
        <View style={styles.chatContainer}>
          <Stats data={this.state.messages} newData={this.state.newMessages} time={this.state.intervalMilli} viewers={this.state.viewerCount}/>
        </View>
      )
    }
  }

  //Render TextBox for User to Upload Message
  renderTextBox(){
    if(this.state.tabType == 'Chat'){
      return(
        <View style={styles.textInputContainer}>
          <TextInput
            style={{height: 40, width: Dimensions.get('window').width - 50}}
            onChangeText={(text) => this.setState({text})}
            value={this.state.text}
            onSubmitEditing={() => this.sendMessage()}
            onEndEditing={() => this.setState({keyboardShowing: false})}
            onFocus={() => this.setState({keyboardShowing: true})}
          />
          <Icon
            name ='pencil'
            type ='foundation' />
        </View>
      )
    }
  }
  
  

  //Lets users interact with chat
  sendMessage(){
    var items = this.state.messages

    //Put Request to Insert Message to LiveStreamChat
    //Having some trouble with 'Invalid Credibles Error' so also insert message locally
    fetch('https://www.googleapis.com/youtube/v3/liveChat/messages?part=snippet&scope=https://www.googleapis.com/auth/youtube&key=' + API_KEY + '&access_token=' + this.props.accessToken, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        snippet: {
          "liveChatId": this.state.activeChatID,
          "type": "textMessageEvent",
          "textMessageDetails": {
            "messageText": this.state.text
          }
        },
        authorDetails: {
          profileImageUrl: this.props.imageURL,
          displayName: this.props.screenName
        }
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson)
      return responseJson;
    })
    .catch((error) => {
      console.error(error);
    });

    //Insert new message locally
    var newItem = {
      snippet: {
        textMessageDetails: {
          messageText: this.state.text
        }
      },
      authorDetails: {
        profileImageUrl: this.props.imageURL,
        displayName: this.props.screenName
      }
    }
    var newTextList = [newItem]
    var newList = newTextList.concat(items)
    items.push(newItem)
    this.setState({
      messages:newList,
      text: '',
    })
  }
  
  

  render() {
    if(this.state.isLoading){
      return(
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      )
    }else{
      var uriString = 'https://www.youtube.com/embed/' + this.state.videoID + '?rel=0&autoplay=0&showinfo=0&controls=0'
      return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
          {this.renderVideo(uriString)}
          {this.renderTab()}
          {this.renderDataBox()}
          {this.renderTextBox()}
        </KeyboardAvoidingView>
      );
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
  tab: {
    width: SCREEN_WIDTH,
    height: 40,
    flexDirection: 'row',
    backgroundColor: MAIN_COLOR,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  icons: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  viewerCount: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  viewersText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "white"
  },
  topText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "white"
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 10,
    justifyContent: 'center', 
  },
  textInputContainer: {
    width: SCREEN_WIDTH,
    height: 40,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
});

const mapStateToProps = (state) => ({
  screenName: state.main.screenName,
  imageURL: state.main.imageURL,
  accessToken: state.main.accessToken,
  streamNumber: state.main.streamNumber
});

export default connect(mapStateToProps, {setStreamNumber, setCurrentViewerNumber})(Main);
