import React from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';

class SignupView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    }

    this.handleCreateAccount = this.handleCreateAccount.bind(this);
    this.backToLogin = this.backToLogin.bind(this);
  }

  /**
   * Make a POST request to create a new user with the entered information.
   * 
   * This POST request requires us to specify a requested username and password,
   * Additionally, we are sending a JSON body, so we need to specify
   * Content-Type: application/json
   * 
   * Note that we very cheaply check if the responded message is what we expect,
   * otherwise we display what we get back from the server. A more sophisticated
   * implementation would check the status code and give custom error messages
   * based on the response.
   */
  handleCreateAccount() {
    fetch('https://mysqlcs639.cs.wisc.edu/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      })
    })
      .then(res => res.json())
      .then(res => {
        if (res.message === "User created!") {
          alert(JSON.stringify(res.message));
          this.props.navigation.navigate("SignIn");
        } else {
          alert(JSON.stringify(res.message));
        }
      });
  }

  /**
   * Use React Navigation to switch to the Log In page.
   */
  backToLogin() {
    this.props.navigation.navigate("SignIn");
  }

  /**
   * Displays and collects the sign up information.
   * 
   * The styling could definitely be cleaned up; should be consistent!
   */
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.bigText} accessible={true}  accessibilityLabel="Welcome to the Sign Up page">FitnessTracker</Text>
        <Text accessible={true}  accessibilityLabel="Let's Get Started">New here? Let's get started!</Text>
        <Text accessible={true}  accessibilityLabel="Please create an account below">Please create an account below.</Text>
        <View style={styles.space}/>
        <View accessible={true}>
          <TextInput style={styles.input}
              underlineColorAndroid="transparent"
              placeholderTextColor="#992a20"
              onChangeText={(username) => this.setState({ username: username })}
              value={this.state.username}
              autoCapitalize="none" accessibilityHint="Enter your username" />
        </View>

        <View accessible={true}>
          <TextInput style={styles.input}
              secureTextEntry={true}
              underlineColorAndroid="transparent"
              onChangeText={(password) => this.setState({ password: password })}
              value={this.state.password}
              placeholderTextColor="#992a20"
              autoCapitalize="none" accessibilityHint="Enter your password"/>
        </View>
          
        <View style={styles.space} />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }} accessible={true}  >
          <Button color="#942a21" style={styles.buttonInline} title="Create Account" onPress={this.handleCreateAccount} accessibilityLabel="Create Account" />
          <View style={styles.spaceHorizontal} />
          <Button color="#a1635f" style={styles.buttonInline} title="Nevermind!" onPress={this.backToLogin}  accessibilityLabel="Nevermind" accessibilityHint="return to log in" />
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

export default SignupView;
