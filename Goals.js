import React from 'react';

import { StyleSheet, ScrollView,Text} from 'react-native';
import { Card} from 'react-native-elements'


class Goals extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           goalActivity: 0,
           activities: []        
        }

    }


    componentDidMount() {
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

    getTotalDuration(){
        let today = new Date();
        let duration = 0;

        if(this.props.activities !== 0 && this.props.activities !== undefined){

          for(let i = 0; i < this.props.activities.length; ++i){
            if(this.datesAreOnSameDay(new Date(this.props.activities[i].date), today)){
                duration += this.props.activities[i].duration;
            }
          }
        }
        console.log("Goal Activity: ",this.props.goalActivity);
        return <Text> Daily Activity {duration} / {this.props.goalActivity}</Text>
    }

    render() {
        return <Card>
                    <Card.Title>Goal Status</Card.Title>
                    <Card.Divider/>
                    <Text style={{marginBottom: 10}}>
                      {this.getTotalDuration()}
                    </Text>
                </Card>
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

export default Goals;