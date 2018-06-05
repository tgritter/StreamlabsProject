import React from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { SocialIcon } from 'react-native-elements'
import { Constants, Google } from 'expo' 
import { connect } from 'react-redux';

const GH_URL = 'https://accounts.google.com/o/oauth2/auth?scope=https://www.googleapis.com/auth/youtube'    
const CLIENT_ID = '482729792146-rvg5tj5t8n0vasp65pmarldvc30r3u9d.apps.googleusercontent.com'
const CLIENT_SECRET = 'EzdYWFwv_V1jp-cfk5YMv0Gz' 

class Stats extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      mps: 0,
      lastViewers: 0
    }
  } 
  
  componentDidMount(){
    var data = this.props.newData
    var length = data.length 
    
    var time = this.props.time 
    var seconds = time / 1000
    
    var mps = length / seconds
    
    var rounded = Math.max( Math.round(mps * 10) / 10, 2.8 ).toFixed(2);
    
    this.setState({
      mps: rounded
    })
  }
  
  calcMPS(data){

    var length = data.length 
    var time = this.props.time 
    var seconds = time / 1000
    var mps = length / seconds  
    var rounded = Math.max( Math.round(mps * 10) / 10, 2.8 ).toFixed(2);
    
    return rounded
  }
  
  letterCount(string, letter) {
    var count = 0;
    string = string.toUpperCase();
    letter = letter.toUpperCase();
    for (var i=0, l=string.length; i<string.length; i += 1) {
        if (string[i] === letter) {
            count += 1;
        }
    }
    return count;
  }
  
  countData(data){
    var newList = []
    var count = 0
    for(var i = 0; i < data.length; i++){
      var item = data[i]  
      var string = '' 
      if(typeof(item.snippet.textMessageDetails) != "undefined"){
        string = item.snippet.textMessageDetails.messageText
      }
      var points = this.letterCount(string, '!')
      count += points 
    }
    return count
  }
  
  calcGainedOrLost(viewers){
    var diff = viewers - this.props.totalViewers
  
    
    return diff
  }

  render() { 
    var mps = this.calcMPS(this.props.newData)
    var count = this.countData(this.props.newData)
    var seconds = this.props.time / 1000
    var rounded = Math.max( Math.round(seconds * 10) / 10, 2.8 ).toFixed(2);
    
    
    var viewGainedOrLossed = this.calcGainedOrLost(this.props.viewers)
  
    return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.headerText}>Welcome to Stats Page!</Text>
          <Text style={styles.sectionText}> Interval is last {rounded} secondss! </Text>
          <View style={styles.statsContainer}>            
            <Text style={styles.sectionTextBold}>Messages per Second:</Text>
            <Text style={styles.sectionText}>{mps}</Text>  
          </View>
          <View style={styles.statsContainer}>            
            <Text style={styles.sectionTextBold}>Exclimation Points in last interval: </Text>
            <Text style={styles.sectionText}> {count}! </Text>       
          </View>
          <View style={styles.statsContainer}>            
            <Text style={styles.sectionTextBold}>Viewers Gained/Lost in last interval:</Text>
            <Text style={styles.sectionText}>{viewGainedOrLossed}</Text>    
          </View>  
        </View>     
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  textContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',  
  },
  statsContainer: {
    paddingTop: 20,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingTop: 10  
  },
  sectionText: {
    fontSize: 16,
  },
  sectionTextBold: {
    fontSize: 16,
    fontWeight: 'bold'
  },
});

const mapStateToProps = (state) => ({
  totalViewers: state.main.totalViewers,
});

export default connect(mapStateToProps)(Stats);