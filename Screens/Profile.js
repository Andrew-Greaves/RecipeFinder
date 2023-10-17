import { StyleSheet, Text, View,StatusBar,Image } from 'react-native'
import React,{useState} from 'react'
import Header from '../Components/Header';
import { useSelector } from "react-redux";

const Profile = () => {

    const username = useSelector((state) => state.auth.username);
    const password = useSelector((state) => state.auth.password);
    const [showUsername,setShowUsername]= useState(false);
    const [showPassword,setShowPassword]= useState(false);
    return (
      <View style={styles.container}>
        <StatusBar />
        <View style={styles.header}>
          <Image
            source={require("../assets/RecipeFinder.png")}
            style={{ width: 70, height: 70 }}
          />
          <Header />
        </View>
        <View style={styles.mainContent}>
          <Text
            style={[styles.userInfoText,{marginBottom:50}]}
            onPress={() => setShowUsername(!showUsername)}
          >
            {showUsername ? username : "Username"}
          </Text>
          <Text
            style={styles.userInfoText}
            onPress={() => setShowPassword(!showPassword)}
          >
            {showPassword ? password : "Password"}
          </Text>
        </View>
      </View>
    );
}

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  mainContent: {
    alignContent: "center",
    justifyContent: "center",
    flex:.75
  },
  header: {
    flexDirection: "row",
    alignContent: "flex-start",
    justifyContent: "space-between",
    marginTop: 40,
  },
  userInfoText: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10, // Adds space above and below the text
    padding: 10, // Increases tappable area and provides padding
    backgroundColor: "#f2f2f2", // A light background color
    borderRadius: 8, // Rounded corners
    textAlign: "center",
    width: 200, // Fixed width for the boxes
    overflow: "hidden", // To respect the border radius
    alignSelf:"center",
  },
});