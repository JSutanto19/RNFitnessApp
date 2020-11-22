import React,{useState}  from 'react';

import { StyleSheet, ScrollView,Text, Platform, View, TextInput} from 'react-native';
import { Button, Overlay } from 'react-native-elements';
import Goals from './Goals';
import ExCard from './ExCard'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome5';


class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: "",
            activities: [],
            totalDuration: 0,
            time :""
        }

    }

    async componentDidMount() {
      this._navListener = this.props.navigation.addListener('focus', async () => {
        let url = "https://mysqlcs639.cs.wisc.edu/activities/";
        let response = await fetch(url, { 
            method: 'GET', 
            headers: { 
                'x-access-token': this.props.accessToken,
            },
        })    
        response = await response.json();
        this.setState({activities: response.activities});
      });
      
    }

     datesAreOnSameDay(first, second){
      return first.getFullYear() === second.getFullYear() &&
      first.getMonth() === second.getMonth() &&
      first.getDate() === second.getDate();  
     }
    
     

    displayActivities(){
       let today = new Date();
       let acts = [];
       if(this.state.activities != 0 && this.state.activities != undefined){
         for(let i = 0; i < this.state.activities.length; ++i){
           if(this.datesAreOnSameDay(new Date(this.state.activities[i].date), today)){
             acts.push(<ExCard name={this.state.activities[i].name} duration={this.state.activities[i].duration} calories={this.state.activities[i].calories} date={this.state.activities[i].date} id={this.state.activities[i].id} accessToken={this.props.accessToken} todayMode={false}/>);
           }
         }
         return acts;
       }
    }


    render() {
        return <ScrollView style={styles.mainContainer} contentContainerStyle={{ flexGrow: 11, justifyContent: 'center', alignItems: "center" }}>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    <Icon name="sun" size={40} color="#900" style={{ marginRight: 20 }} />
                    <Text style={styles.bigText} accessible={true}  accessibilityLabel="Today">Today</Text>
                  </View>
                   <Text style={styles.text} accessible={true}  accessibilityLabel="Whats on the agenda today">Whats on the agenda for today?</Text>
                   <Text style={styles.text} accessible={true}  accessibilityLabel="These are your exercises">These are your goals and exercises</Text>
                   <Goals activities={this.state.activities} goalActivity={this.props.goalActivity} navigation={this.props.navigation}/>
                   <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop:20}}>
                    <Icon name="running" size={40} color="#900" style={{ marginRight: 20 }} />
                    <Text style={styles.bigText} accessible={true}  accessibilityLabel="Exercises">Exercises</Text>
                  </View>
                   <Text accessible={true}  accessibilityLabel="Here are your scheduled exercises">Here are your Scheduled excercises</Text>
                   {this.displayActivities()}
               </ScrollView>
    }
}


class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        id: 0,
        date: new Date(),
        duration: 0,
        name:"",
        calories:0,
        activities:[],
        visible: false
    }
    this.setVisible = this.setVisible.bind(this);
    this.setDate = this.setDate.bind(this);
    this.setMode = this.setMode.bind(this);
    this.setshow = this.setShow.bind(this);
    this.setInvisible = this.setInvisible.bind(this);
    this.addEx = this.addEx.bind(this);
}

setDate(dat) {
  this.setState({ date: dat });
}

setMode(variable) {
  this.setState({ mode: variable });
}

setShow(bool) {
  this.setState({ show: bool });
}


onChange(event, selectedDate) {
  const currentDate = selectedDate || this.state.date;
  this.setShow(Platform.OS === 'ios');
  this.setDate(currentDate);
}

showMode = (currentMode) => {
  this.setShow(true);
  this.setMode(currentMode);
};

showDatepicker = () => {
  this.showMode('date');
};

showTimepicker = () => {
  this.showMode('time');
};

setVisible() {
  this.setState({ visible: this.state.visible });
}

setInvisible(){
  this.setState({visible: !this.state.visible})
}

setVisible(){
  this.setState({visible: !this.state.visible});
}

async componentDidMount() {
  this._navListener = this.props.navigation.addListener('focus', async () => {
    let url = "https://mysqlcs639.cs.wisc.edu/activities/";

    let response = await fetch(url, { 
        method: 'GET', 
        headers: { 
            'x-access-token': this.props.accessToken,
        },
    })    
    response = await response.json();
    this.setState({activities: response.activities});
	});   
}

addEx(){
       
        fetch('https://mysqlcs639.cs.wisc.edu/activities/', {
            method: 'POST',
            headers: {
              'Accept': 'application/json', 
              'Content-Type': 'application/json',
              'x-access-token': this.props.accessToken
            },
            body: JSON.stringify({
                name: this.state.name,
                calories: this.state.calories,
                duration: this.state.duration,
                date: this.state.date
            })
          })
            .then(res => res.json())
            .then(res => {
              alert("Exercise Added");
            })
            .catch(err => {
              alert("Something went wrong! Verify you have filled out the fields correctly.");
            }); 
}

displayActivities(){
  let today = new Date();
  let acts = [];
  if(this.state.activities != 0 && this.state.activities != undefined){
    for(let i = 0; i < this.state.activities.length; ++i){
      if(this.datesAreOnSameDay(new Date(this.state.activities[i].date), today)){
        acts.push(<ExCard name={this.state.activities[i].name} duration={this.state.activities[i].duration} calories={this.state.activities[i].calories} date={this.state.activities[i].date} id={this.state.activities[i].id} accessToken={this.props.accessToken} todayMode={true} />);
      }
    }
    return acts;
  }
}

datesAreOnSameDay(first, second){
  return first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();  
 }


render() {
    return <ScrollView style={styles.mainContainer} contentContainerStyle={{ flexGrow: 11, justifyContent: 'center', alignItems: "center" }} accessible={true} accessibilityLabel="View Exercises and Goals">
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    <Icon name="running" size={40} color="#900" style={{ marginRight: 20 }} />
                    <Text style={styles.bigText}>Exercises</Text>
              </View>
              <Text style={styles.text} accessible={true} accessibilityLabel="Let's get to Work">Let's get to Work</Text>
              <Text style={styles.text } accessible={true} accessibilityLabel="Record Your Exercises Below">Record Your Exercises Below</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    <Button color="#942a21" style={styles.buttonInline} title="Add Exercise" onPress={this.setVisible} accessible={true} accessibilityLabel="Add exercise"/>
                    <View style={styles.spaceHorizontal} />
             </View>

             {this.displayActivities()}

                <Overlay isVisible={this.state.visible} onBackdropPress={this.setVisible} overlayStyle={{
                    backgroundColor: '#fff',
                    alignItems: 'center',
                    justifyContent: 'center',borderRadius: 15, width: '80%', height: '80%'}}>
                    <Text style={styles.bigText} accessible={true} accessibilityLabel="Enter Exercises">Exercise Details</Text>
                    <Text style={{ textAlignVertical: "center", fontWeight: "700", marginTop:20 }} accessible={true} accessibilityLabel="Enter exercise name">Exercise Name</Text>
                    <TextInput style={styles.input} placeholder="Name" onChange={(event) => this.setState({name: event.nativeEvent.text})}  />
                    <Text style={{ textAlignVertical: "center", fontWeight: "700",marginTop:20 }} accessible={true} accessibilityLabel="Enter Calories burnt" >Calories Burnt</Text>
                    <TextInput style={styles.input} placeholder="Calories" onChange={(event) => this.setState({calories: event.nativeEvent.text})}/>
                    <Text style={{ textAlignVertical: "center", fontWeight: "700", marginTop:20}} accessible={true} accessibilityLabel="Enter Calories burnt">Duration (Minutes)</Text>
                    <TextInput style={styles.input} placeholder="Duration" onChange={(event) => this.setState({duration: event.nativeEvent.text})}/>

                    <View accessible={true} accessibilityLabel="Show time picker" accessibilityHint="Show date picker and select date">
                      <Button style={{marginTop: 20}}onPress={this.showDatepicker} title="Show date picker!" />
                    </View>
                    <View accessible={true}  accessibilityLabel="Show time picker" accessibilityHint="select a time">
                      <Button style={{marginTop: 20}} onPress={this.showTimepicker} title="Show time picker!" />
                    </View>
                    <View accessible={true}  accessibilityLabel="Add Exercise">
                      <Button style={{marginTop: 20}} onPress={this.addEx} title="Add Exercise" color="#ff000"/>
                    </View>
                    <View accessible={true}  accessibilityLabel="hide modal" accessibilityHint="close modal">
                      <Button style={{marginTop: 20}} onPress={this.setInvisible} title="Hide Modal" color="#ff000"/>
                    </View>
                    {this.state.show && (
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={this.state.date}
                        mode={this.state.mode}
                        is24Hour={true}
                        display="default"
                        onChange={this.onChange}
                        style={styles.picker}
                      />)}    
                </Overlay>
           </ScrollView>
    }
}




class Excer extends React.Component {
  /**
   * Specifies the default values that will be shown for a split second
   * while data is loading in from the server.
   */
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      goalDailyCalories: 0.0,
      goalDailyProtein: 0.0,
      goalDailyCarbohydrates: 0.0,
      goalDailyFat: 0.0,
      goalDailyActivity: 0.0
    }
  }

  /**
   * Fetch the data from the API after mounting; this may take a few seconds.
   * Once the data is fetched, it is stored into the state and then displayed
   * onto the fields.
   * 
   * This GET request requires us to specify our username and x-access-token,
   * both of which we inherit through props.
   */
  componentDidMount() {
    fetch('https://mysqlcs639.cs.wisc.edu/users/' + this.props.username, {
      method: 'GET',
      headers: { 'x-access-token': this.props.accessToken }
    })
      .then(res => res.json())
      .then(res => {
        this.setState({
          firstName: res.firstName,
          lastName: res.lastName,
          goalDailyCalories: res.goalDailyCalories,
          goalDailyProtein: res.goalDailyProtein,
          goalDailyCarbohydrates: res.goalDailyCarbohydrates,
          goalDailyFat: res.goalDailyFat,
          goalDailyActivity: res.goalDailyActivity
        });
      });
  }

  /**
   * Make a PUT request to save all the entered information onto the server.
   * Note, we must check if what the user entered is a number. Once the state
   * is guarnteed to be set, we call the fetch function.
   * 
   * This PUT request requires us to specify our username and x-access-token,
   * both of which we inherit through props. Additionally, we are sending a
   * JSON body, so we need to specify Content-Type: application/json
   */
  handleSaveProfile() {
    this.setState({
      goalDailyCalories: parseFloat(this.state.goalDailyCalories),
      goalDailyProtein: parseFloat(this.state.goalDailyProtein),
      goalDailyCarbohydrates: parseFloat(this.state.goalDailyCarbohydrates),
      goalDailyFat: parseFloat(this.state.goalDailyFat),
      goalDailyActivity: parseFloat(this.state.goalDailyActivity)
    }, () => fetch('https://mysqlcs639.cs.wisc.edu/users/' + this.props.username, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': this.props.accessToken
      },
      body: JSON.stringify({
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        goalDailyCalories: this.state.goalDailyCalories,
        goalDailyProtein: this.state.goalDailyProtein,
        goalDailyCarbohydrates: this.state.goalDailyCarbohydrates,
        goalDailyFat: this.state.goalDailyFat,
        goalDailyActivity: this.state.goalDailyActivity
      })
    })
      .then(res => res.json())
      .then(res => {
        alert("Your profile has been updated!");
      })
      .catch(err => {
        alert("Something went wrong! Verify you have filled out the fields correctly.");
      }));
      this.props.getActivity(this.state.goalDailyActivity);
      this.props.navigation.navigate("DayView");
  }

  backToLogin() {
    this.props.revokeAccessToken();
  }

  /**
   * Displays and collects the profile information.
   * 
   * The styling could definitely be cleaned up; should be consistent!
   */
  render() {
    return (
      <ScrollView style={styles.mainContainer} contentContainerStyle={{ flexGrow: 11, justifyContent: 'center', alignItems: "center" }} accessible={true} accessibilityLabel="Today's Exercises" accessibilityHint="add exercises to toda view here">
        <View style={styles.space} />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <Icon name="male" size={40} color="#900" style={{ marginRight: 20 }} />
          <Text style={styles.bigText}>About Me</Text>
        </View>
        <View style={styles.spaceSmall}></View>
        <Text>Let's get to know you!</Text>
        <Text>Specify your information below.</Text>
        <View style={styles.space} />

        <Text style={{ textAlignVertical: "center", fontWeight: "700", fontSize: 20 }}>Personal Information</Text>
        <View style={styles.spaceSmall}></View>
        <View>
          <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>First Name</Text>
        </View>
        <TextInput style={styles.input}
          underlineColorAndroid="transparent"
          placeholder="Bucky"
          placeholderTextColor="#d9bebd"
          onChangeText={(firstName) => this.setState({ firstName: firstName })}
          value={this.state.firstName}
          autoCapitalize="none" />
        <View style={styles.spaceSmall}></View>

        <View>
          <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Last Name</Text>
        </View>
        <TextInput style={styles.input}
          underlineColorAndroid="transparent"
          placeholder="Badger"
          placeholderTextColor="#d9bebd"
          onChangeText={(lastName) => this.setState({ lastName: lastName })}
          value={this.state.lastName}
          autoCapitalize="none" />
        <View style={styles.spaceSmall}></View>

        <Text style={{ textAlignVertical: "center", fontWeight: "700", fontSize: 20 }}>Fitness Goals</Text>
        <View style={styles.spaceSmall}></View>
        <View>
          <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Daily Calories (kcal)</Text>
        </View>
        <TextInput style={styles.input}
          underlineColorAndroid="transparent"
          placeholder="2200"
          placeholderTextColor="#d9bebd"
          onChangeText={(goalDailyCalories) => this.setState({ goalDailyCalories: goalDailyCalories })}
          value={this.state.goalDailyCalories + ""}
          autoCapitalize="none" />
        <View style={styles.spaceSmall}></View>
        <View>
          <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Daily Protein (grams)</Text>
        </View>
        <TextInput style={styles.input}
          underlineColorAndroid="transparent"
          placeholder="52"
          placeholderTextColor="#d9bebd"
          onChangeText={(goalDailyProtein) => this.setState({ goalDailyProtein: goalDailyProtein })}
          value={this.state.goalDailyProtein + ""}
          autoCapitalize="none" />
        <View style={styles.spaceSmall}></View>
        <View>
          <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Daily Carbs (grams)</Text>
        </View>
        <TextInput style={styles.input}
          underlineColorAndroid="transparent"
          placeholder="130"
          placeholderTextColor="#d9bebd"
          onChangeText={(goalDailyCarbohydrates) => this.setState({ goalDailyCarbohydrates: goalDailyCarbohydrates })}
          value={this.state.goalDailyCarbohydrates + ""}
          autoCapitalize="none" />
        <View style={styles.spaceSmall}></View>
        <View>
          <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Daily Fat (grams)</Text>
        </View>
        <TextInput style={styles.input}
          underlineColorAndroid="transparent"
          placeholder="35"
          placeholderTextColor="#d9bebd"
          onChangeText={(goalDailyFat) => this.setState({ goalDailyFat: goalDailyFat })}
          value={this.state.goalDailyFat + ""}
          autoCapitalize="none" />
        <View style={styles.spaceSmall}></View>
        <View>
          <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Daily Activity (mins)</Text>
        </View>
        <TextInput style={styles.input}
          underlineColorAndroid="transparent"
          placeholder="60"
          placeholderTextColor="#d9bebd"
          onChangeText={(goalDailyActivity) => this.setState({ goalDailyActivity: goalDailyActivity })}
          value={this.state.goalDailyActivity + ""}
          autoCapitalize="none" />
        <View style={styles.spaceSmall}></View>

        <View style={styles.space} />

        <Text style={{ fontWeight: "700", fontSize: 20 }}>Looks good! All set?</Text>
        <View style={styles.spaceSmall} />

        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <Button color="#942a21" style={styles.buttonInline} title="Save Profile" onPress={() => this.handleSaveProfile()} />
          <View style={styles.spaceHorizontal} />
          <Button color="#a1635f" style={styles.buttonInline} title="Exit" onPress={() => this.backToLogin()} />
        </View>
        <View style={styles.space} />
      </ScrollView>
    );
  }


}




  const Tab = createBottomTabNavigator();

export default class TodayView extends React.Component {
  render(){
    return (
      <Tab.Navigator>
        <Tab.Screen name="Today" options={{
            tabBarLabel: 'Today',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="white-balance-sunny" color={color} size={size} />
            ),
          }}>
           {(props) => <HomeScreen {...props} goalActivity={this.props.goalActivity} username={this.props.username} accessToken={this.props.accessToken} revokeAccessToken={this.props.revokeAccessToken} />}
          </Tab.Screen>
        <Tab.Screen name="Exercise"  options={{
            tabBarLabel: 'Exercise',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="bike" color={color} size={size} />
            ),
          }}> 
           {(props) => <SettingsScreen {...props} goalActivity={this.props.goalActivity} username={this.props.username} accessToken={this.props.accessToken} revokeAccessToken={this.props.revokeAccessToken} />}
          </Tab.Screen>
         <Tab.Screen name="Profile"  options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account-circle" color={color} size={size} />
            ),
          }}>
             {(props) => <Excer {...props} goalActivity={this.props.goalActivity} username={this.props.username} accessToken={this.props.accessToken} revokeAccessToken={this.props.revokeAccessToken} />}
          </Tab.Screen>
      </Tab.Navigator>
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
  bigText: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 5
  },
  text:{
     marginBottom: 5
  },
  space: {
    width: 20,
    height: 20,
  },
  spaceHorizontal: {
    display: "flex",
    width: 20
  },
  buttonInline: {
    display: "flex",
    marginTop: 20
  },
  input: {
    width: 200,
    padding: 10,
    margin: 5,
    height: 40,
    borderColor: '#c9392c',
    borderWidth: 1
  },
  picker:{
    width: "90%",
  }
});