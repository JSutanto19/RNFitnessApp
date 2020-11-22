import React from 'react';

import LoginView from './LoginView';
import SignupView from './SignupView';

import TodayView from './TodayView'
import ExercisesView from './ExercisesView'
import ProfileView from './ProfileView'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { TouchableOpacity, Image, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      accessToken: undefined,
      username: undefined,
      goalActivity:0
    }

    this.login = this.login.bind(this);
    this.revokeAccessToken = this.revokeAccessToken.bind(this);
    this.SignoutButton = this.SignoutButton.bind(this);
    this.getUsername = this.getUsername.bind(this);
  }

  /**
   * Store the username and accessToken here so that it can be
   * passed down to each corresponding child view.
   */
  async login(username, accessToken) {
    let url = "https://mysqlcs639.cs.wisc.edu/users/";
        url = url + username;
        
        let response = await fetch(url, { 
            method: 'GET', 
            headers: { 
                'x-access-token': accessToken,
            },
        })    
        
        response = await response.json();
        this.setState({goalActivity: response.goalDailyActivity});

    this.setState({
      username: username,
      accessToken: accessToken
    });
  }

  /**
   * Revokes the access token, effectively signing a user out of their session.
   */
  revokeAccessToken() {
    this.setState({
      accessToken: undefined
    });
  }


  /**
   * Defines a signout button... Your first TODO!
   */
  SignoutButton = () => {
    return <>
      <View style={{ flexDirection: 'row', marginRight: 25 }}>
        <Icon name="sign-out-alt" size={25} color="#900" style={{ marginRight: 20, paddingLeft:10 }} />
      </View>
    </>
  }
  
  exit(){
    this.setState({accessToken: undefined});    
  }

  async getUsername(uname){
    let url = "https://mysqlcs639.cs.wisc.edu/users/";
        url = url + this.state.username;
        
        let response = await fetch(url, { 
            method: 'GET', 
            headers: { 
                'x-access-token': this.state.accessToken,
            },
        })    
        
        response = await response.json();
        await this.setState({goalActivity: response.goalDailyActivity});
        await this.setState({username: uname});
  }


  /**
   * Note that there are many ways to do navigation and this is just one!
   * I chose this way as it is likely most familiar to us, passing props
   * to child components from the parent.
   * 
   * Other options may have included contexts, which store values above
   * (similar to this implementation), or route parameters which pass
   * values from view to view along the navigation route.
   * 
   * You are by no means bound to this implementation; choose what
   * works best for your design!
   */
  render() {

    // Our primary navigator between the pre and post auth views
    // This navigator switches which screens it navigates based on
    // the existent of an access token. In the authorized view,
    // which right now only consists of the profile, you will likely
    // need to specify another set of screens or navigator; e.g. a
    // list of tabs for the Today, Exercises, and Profile views.
    let AuthStack = createStackNavigator();

    return (
      <NavigationContainer>
        <AuthStack.Navigator>
          {!this.state.accessToken ? (
            <>
              <AuthStack.Screen
                name="SignIn"
                options={{
                  title: 'Fitness Tracker Welcome',
                }}
              >
                {(props) => <LoginView {...props} login={this.login} getUsername={this.getUsername} />}
              </AuthStack.Screen>

              <AuthStack.Screen
                name="SignUp"
                options={{
                  title: 'Fitness Tracker Signup',
                }}
              >
                {(props) => <SignupView {...props} />}
              </AuthStack.Screen>
            </>
          ) : (
              <>
                

                <AuthStack.Screen name="DayView" options={{
                  headerLeft: this.SignoutButton
                }}>
                  {(props) => <TodayView {...props}  goalActivity={this.state.goalActivity} username={this.state.username} accessToken={this.state.accessToken} revokeAccessToken={this.revokeAccessToken} />}
                </AuthStack.Screen>

                <AuthStack.Screen name="FitnessTracker" options={{
                  headerLeft: this.SignoutButton
                }}>
                  {(props) => <ProfileView {...props}  username={this.state.username} accessToken={this.state.accessToken} revokeAccessToken={this.revokeAccessToken} />}
                </AuthStack.Screen>
                
              </>

            )}
        </AuthStack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;

