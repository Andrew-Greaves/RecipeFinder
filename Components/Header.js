import { View, Text,StyleSheet,TouchableOpacity } from 'react-native'
import {React,useState} from 'react'
import { useNavigation } from '@react-navigation/native';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import { Icon } from '@rneui/themed';

const Header = () => {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);

  const hideMenu = () => setVisible(false);

  const showMenu = () => setVisible(true);
  return(
    <Menu
        visible={visible}
        anchor={
        <View style={styles.menuIconContainer}>
          <TouchableOpacity onPress={showMenu}>
            <Icon type='material-community' name='menu' size={32}/>
          </TouchableOpacity>
        </View>}
            onRequestClose={hideMenu}
        >
        <MenuItem onPress={() => {hideMenu(); navigation.navigate("Home")}}>Home</MenuItem>
        <MenuDivider />
        <MenuItem onPress={() => { hideMenu(); navigation.navigate("Profile")}}>Profile</MenuItem>
        <MenuDivider />
        <MenuItem onPress={() => { hideMenu(); navigation.navigate("FeaturedRecipes")}}>Featured Recipes</MenuItem>
        <MenuDivider />
        <MenuItem onPress={() => { hideMenu(); navigation.navigate("Login")}}>Log Out</MenuItem>
    </Menu>
    
  )};

  const styles = StyleSheet.create({
    menuIconContainer: {
      alignItems: 'center',
      marginTop:20
    },
    menuText: {
      marginLeft: 5,
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
  
  export default Header;