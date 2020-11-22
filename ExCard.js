import React from 'react';

import {StyleSheet,TextInput,Button,Text,View } from 'react-native';
import {Card, Overlay} from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';


class ExCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            calories:0,
            date:"",
            // time:"",
            name:"",
            duration:"",
            modalVisible: false,
            visible: false
        }
        this.setVisible = this.setVisible.bind(this);
        this.setDate = this.setDate.bind(this);
        this.setMode = this.setMode.bind(this);
        this.setshow = this.setShow.bind(this);
        this.setInvisible = this.setInvisible.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
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
      let url = "https://mysqlcs639.cs.wisc.edu/activities/";
      url = url + this.props.id;

      let response = await fetch(url, { 
          method: 'GET', 
          headers: { 
              'x-access-token': this.props.accessToken,
          },
      })    
      response = await response.json();
      this.setState({
        name: response.name, date: response.date, 
        calories:response.calories, duration:response.duration
      });
    }
    

    convertDate(){
        let d = new Date(this.props.date);
        let year = d.getFullYear();
        let month = d.getMonth() + 1;
        let dt = d.getDate();

        if (dt < 10) {
            dt = '0' + dt;
        }
        
        if (month < 10) {
           month = '0' + month;
        }

        return year+'-' + month + '-'+dt;
    }

    async delEx(){
        let url = 'https://mysqlcs639.cs.wisc.edu/activities/'
        url = url + this.props.id;
        let response = await fetch(url, { 
           method: 'DELETE', 
        headers: { 'x-access-token': this.props.accessToken
            },
        })
        // .then(res => res.json())
        // .then(this.props.updateOccured(res.activities))
        response = await response.json();
        // this.props.updateOccured(response.activities);
    }

    async handleUpdate(){
      // this.setState({
      //   name: this.state.name,
      //   calories: parseFloat(this.state.calories),
      //   duration: parseFloat(this.state.duration),
      //   date: this.state.date
      // });

      await fetch('https://mysqlcs639.cs.wisc.edu/activities/' + this.props.id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': this.props.accessToken
        },
        body: JSON.stringify({
          name: this.state.name,
          calories: this.state.calories,
          duration: this.state.duration,
          date: this.state.date,
        })
      })
        .then(res => res.json())
        .then(res => {
          alert("Exercise Deleted");
        })
        .catch(err => {
          alert("Something went wrong! Verify the acitivity you want to delete still exists or was deleted");
        });
    }

  

    //for edit button create modal window with many input boxes which can edit date, cals, and 
    render() {
      if(this.props.todayMode === true){

        return <Card>
                 <Card.Title>{this.props.name}</Card.Title>
                 <Card.Divider/>
                    <Text style={{marginBottom: 10}}>Date: {this.convertDate()}</Text>
                    <Text style={{marginBottom: 10}}>Time: {new Date(this.props.date).toLocaleTimeString()}</Text>
                    <Text style={{marginBottom: 10}}>Duration: {this.props.duration} Minutes</Text>
                    <Text style={{marginBottom: 10}}>Calories: {this.props.calories}</Text>
                    
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        <Button color="#942a21" style={styles.buttonInline} title="Edit" onPress={() => this.setVisible()} />
                        <View style={styles.spaceHorizontal} />
                        <Button color="#a1635f" style={styles.buttonInline} title="Remove" onPress={() => this.delEx()} />
                        </View>
                    <View style={styles.space} />

                    <Overlay isVisible={this.state.visible} onBackdropPress={this.setVisible} overlayStyle={{
                    backgroundColor: '#fff',
                    alignItems: 'center',
                    justifyContent: 'center',borderRadius: 15, width: '80%', height: '80%'}}>
                    <Text style={styles.bigText}>Exercise Details</Text>
                    <Text style={{ textAlignVertical: "center", fontWeight: "700", marginTop:20 }}>Exercise Name</Text>
                    <TextInput style={styles.input} placeholder="Name" onChangeText={(event) => this.setState({name: event.nativeEvent.text})} value={this.state.name}/>
                    <Text style={{ textAlignVertical: "center", fontWeight: "700",marginTop:20 }}>Calories Burnt</Text>
                    <TextInput style={styles.input} placeholder="Calories" onChangeText={(event) => this.setState({calories: event.nativeEvent.text})} value={this.state.calories.toString()}/>
                    <Text style={{ textAlignVertical: "center", fontWeight: "700", marginTop:20}}>Duration (Minutes)</Text>
                    <TextInput style={styles.input} placeholder="Duration" onChangeText={(event) => this.setState({duration: event.nativeEvent.text})} value={this.state.duration.toString()}/>

                    <View>
                      <Button style={{marginTop: 20}} onPress={this.showDatepicker} title="Show date picker!" />
                    </View>
                    <View>
                      <Button style={{marginTop: 20}} onPress={this.showTimepicker} title="Show time picker!" />
                    </View>
                    <View>
                      <Button style={{marginTop: 20}} onPress={this.handleUpdate} title="Save" color="green"/>
                    </View>
                    <View>
                      <Button style={{marginTop: 20}} onPress={this.setInvisible} title="Hide Modal" color="red"/>
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
                </Card>

      } else {
         
        return <Card>
                 <Card.Title>{this.props.name}</Card.Title>
                 <Card.Divider/>
                  <Text style={{marginBottom: 10}}>Date: {this.convertDate()}</Text>
                  <Text style={{marginBottom: 10}}>Time: {new Date(this.props.date).toLocaleTimeString()}</Text>
                  <Text style={{marginBottom: 10}}>Calories Burnt: {this.props.calories}</Text>
                  <Text style={{marginBottom: 10}}>{this.props.duration} Minutes</Text>
               </Card>
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
      display: "flex"
    },
    input: {
      width: 200,
      padding: 10,
      margin: 5,
      height: 40,
      borderColor: '#c9392c',
      borderWidth: 1
    }
  });

  const styles2 = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5
    },
    openButton: {
      backgroundColor: "#F194FF",
      borderRadius: 20,
      padding: 10,
      elevation: 2
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center"
    }
  });

export default ExCard;