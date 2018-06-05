import React from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { SocialIcon, Icon } from 'react-native-elements'
import { setUserScreenName, setUserImageURL, setAccessToken } from '../redux/actions';
import Expo from 'expo'
import { connect } from 'react-redux';

const ANDROID_CLIENT_ID = '603386649315-9rbv8vmv2vvftetfbvlrbufcps1fajqf.apps.googleusercontent.com'
const ANDROID_STANDALONE_CLIENT_ID = '482729792146-pobcqffea175ophs0h9qa25t2f4ppn48.apps.googleusercontent.com'

const MAIN_COLOR = '#0B4F6C'

class Login extends React.Component {

  constructor() {
    super();
  }

  //
  _handleGoogleLoginTest = async () => {
    const { navigate } = this.props.navigation;
    try {
      const result = await Expo.Google.logInAsync({
        androidStandaloneAppClientId: ANDROID_STANDALONE_CLIENT_ID, 
        iosStandaloneAppClientId: '<IOS_CLIENT_ID>',
        androidClientId: ANDROID_CLIENT_ID,
        iosClientId: '<IOS_CLIENT_ID>',
        scopes: ['profile', 'email'],
      });

      switch (result.type) {
        case 'success': {
          this.props.setUserScreenName(result.user.name)
          this.props.setUserImageURL(result.user.photoUrl)
          this.props.setAccessToken(result.accessToken)

          Alert.alert(
            'Logged in!',
            `Hi ${result.user.name}!`,
            [
              {text: 'OK', onPress: () => navigate('Main')},
            ],
            { cancelable: true}
          );
          break;
        }
        case 'cancel': {
          Alert.alert(
            'Cancelled!',
            'Login was cancelled!',
          );
          break;
        }
        default: {
          Alert.alert(
            'Oops!',
            'Login failed!',
          );
        }
      }
    } catch(e) {
      console.log('Error: ' + e)
      return {error: true};
    }
  }


  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.topText}>Welcome to my</Text>
          <View style={styles.iconContainer}>
            <Icon
              name='tv'
              type='feather'
              color='#fff'
              size={100}
            />
          </View>
          <Text style={styles.bottomText}>Streamlabs Coding Project</Text>
        </View>

        <View style={styles.buttonContainer}>
          <SocialIcon
            title='Sign In With Google'
            button
            type='google-plus-official'
            style={styles.buttonStyle}
            onPress={this._handleGoogleLoginTest}
          />
          <SocialIcon
            title='Sign In With Youtube'
            button
            type='youtube'
            style={styles.buttonStyle}
            onPress={() => navigate('Main')}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MAIN_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "white"
  },
  iconContainer: {
    padding: 10
  },
  bottomText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: "white"
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

const mapStateToProps = (state) => ({
  screenName: state.main.screenName,
});

export default connect(mapStateToProps, {setUserScreenName, setUserImageURL, setAccessToken})(Login);
