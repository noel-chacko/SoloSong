import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Button, Alert, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    // This function handles the incoming URL and extracts the token
    const handleOpenURL = (event) => {
      // Extract the URL from the event
      const url = event.url;

      // Parse the URL and get the access token
      let queryParams = new URLSearchParams(url.split('#')[1]); // Assuming the access token is sent back as a fragment
      const accessToken = queryParams.get('access_token');
      const refreshToken = queryParams.get('refresh_token');
      
      if (accessToken) {
        setAuthToken(accessToken);
        Alert.alert("Authenticated", "You are authenticated successfully!");
      }
    };

    // Add event listener to handle incoming URLs
    Linking.addEventListener('url', handleOpenURL);

    return () => {
      // Clean up the event listener
      Linking.removeEventListener('url', handleOpenURL);
    };
  }, []);

  const handleLogin = async () => {
    // Direct the user to the login route on your server
    const loginUrl = 'http://localhost:8888/login'; // Make sure to use the correct IP address or hostname when testing on a device
    try {
      // Opening the URL to initiate the OAuth flow
      const canOpen = await Linking.canOpenURL(loginUrl);
      if (canOpen) {
        Linking.openURL(loginUrl);
      } else {
        Alert.alert("Failed", "Cannot handle login URL");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Login error occurred!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>Solo Song 🎵</Text>
      <View style={{ padding: 20 }}>
        <TouchableOpacity>
          <Image
            source={require("./assets/logo.png")}
            style={{ width: 200, height: 200 }}
          />
        </TouchableOpacity>
        <Button
          title="Get Song"
          onPress={handleLogin}
        />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4fff2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    color: '#2a2a2a',
    fontSize: 24,
    fontWeight: 'bold',
  }
});
