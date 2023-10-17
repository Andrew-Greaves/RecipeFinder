import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,Image,TouchableOpacity,TouchableWithoutFeedback,Keyboard,KeyboardAvoidingView,ScrollView } from 'react-native';
import {React,useState} from 'react';
import { Input,Button,Icon } from '@rneui/themed';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from "react-redux";
import {
  setUsername,
  setPassword,
  selectUsername,
  selectPassword,
} from "../Redux/authSlice"

const Login = () => {
    const [isPasswordSecure, setIsPasswordSecure] = useState(true);
    const [localUsername, setLocalUsername] = useState("");
    const [localPassword, setLocalPassword] = useState("");
    const navigation=useNavigation();
    const dispatch = useDispatch();

    

    const handleProceed = () => {
    if (!localUsername.trim() || !localPassword.trim()) {
        alert("Missing Username or Password");
    } else {
        // Store credentials in Redux
        dispatch(setUsername(localUsername));
        dispatch(setPassword(localPassword));

        navigation.navigate("Home");
    }
    };
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView>
                    <View style={styles.container}>
                        <Image source={require('../assets/RecipeFinder.png')} style={{ marginTop: 70,width: 170, height: 170  }}  />
                        <Text style={{fontSize:35,fontWeight:500,marginTop:10}}>Recipe Finder</Text>
                        <View>
                            <Text style={styles.LoginText}>Login</Text>
                            <TouchableOpacity>
                            <Text style={{ color: 'orange', fontSize: 20, margin:10 }}>By signing in you are agreeing to our terms and privacy policy.</Text>
                            </TouchableOpacity>
                        </View>
                        <Input  
                        leftIcon={<Icon type="material-community" name="account" style={{marginTop:20,marginRight:10}}/>} 
                        placeholder='Username' 
                        style={{marginTop:25}} 
                        onChangeText={(text) => setLocalUsername(text)}>

                        </Input>
                        <Input 
                        leftIcon={<Icon type="material-community" name="lock" style={{marginRight:10}}/>} 
                        rightIcon={<Icon type="material-community" name="eye" onPress={() => setIsPasswordSecure(!isPasswordSecure)} />}
                        placeholder='Password' 
                        maxLength={5} 
                        keyboardType='number-pad' 
                        secureTextEntry={isPasswordSecure} 
                        onChangeText={(text)=>setLocalPassword(text)}>

                        </Input>
                        <TouchableOpacity style={styles.buttonContainer} onPress={() => handleProceed()}>
                            <Text style={styles.buttonText}>Log In</Text>
                        </TouchableOpacity>
                    </View>
            </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
        
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      padding:20
    },
    LoginText: {
        textAlign: "center",
        fontFamily:'Arial',
        fontSize:34,
        fontWeight:'600',
        marginTop: 20,
        letterSpacing:1
      },
      buttonContainer: {
        backgroundColor: 'orange',
        borderRadius: 10,
        padding: 10,
        width: '90%',
        alignItems: 'center',
        alignSelf:"center",
        marginTop: 40,
        height:50,
        justifyContent:"center",
        marginBottom:150
      },
      buttonText: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
      },
  });

export default Login;