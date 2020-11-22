import React from 'react';

import { StyleSheet } from 'react-native';
import {Dimensions} from 'react-native';


class ExercisesView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }

    }

    componentDidMount() {

    }

    render() {
        return <ScrollView style={styles.mainContainer} contentContainerStyle={{ flexGrow: 11, justifyContent: 'center', alignItems: "center" }}>
                  
               </ScrollView>
    }
}

const styles = StyleSheet.create({
    scrollView: {
      height: Dimensions.get('window').height
    },
    mainContainer: {
      flex: 1
    },
    scrollViewContainer: {},
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    bigText: {
      fontSize: 32,
      fontWeight: "700",
      marginBottom: 5
    },
    spaceSmall: {
      width: 20,
      height: 10,
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
    },
    inputInline: {
      flexDirection: "row",
      display: "flex",
      width: 200,
      padding: 10,
      margin: 5,
      height: 40,
      borderColor: '#c9392c',
      borderWidth: 1
    }
  });

export default ExercisesView;