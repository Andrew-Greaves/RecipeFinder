import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
  FlatList,
  Modal,
  ActivityIndicator,
} from "react-native";
import { React, useState, useEffect, useRef } from "react";
import { Input, Button, Icon, CheckBox } from "@rneui/themed";
import axios from "axios";
import Header from "../Components/Header";

const OPENAI_API_URL =
  "https://api.openai.com/v1/engines/text-davinci-002/completions";
const API_KEY = `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`;

const images = [
  { uri: require("../assets/food1.png") },
  { uri: require("../assets/food2.png") },
  { uri: require("../assets/food3.png") },
  { uri: require("../assets/food4.png") },
];
const { width } = Dimensions.get("window");
const ImageCarousel = () => {
  const scrollViewRef = useRef();
  const scrollX = useRef(0); // To keep track of the scroll position.

  useEffect(() => {
    const interval = setInterval(() => {
      scrollX.current = (scrollX.current + width) % (width * images.length);
      scrollViewRef.current.scrollTo({ x: scrollX.current, animated: true });
    }, 2000); // Scroll every 2000 milliseconds (2 seconds)

    return () => clearInterval(interval); // Clear interval on unmount.
  }, []);

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onScroll={(event) => {
        // Update the scroll position.
        scrollX.current = event.nativeEvent.contentOffset.x;
      }}
      scrollEventThrottle={16}
    >
      {images.map((image, index) => (
        <Image
          key={index}
          source={
            typeof image.uri === "string" ? { uri: image.uri } : image.uri
          }
          style={{ width, height: 200 }}
        />
      ))}
    </ScrollView>
  );
};

const Home = () => {
  const [ingredient, setIngredient] = useState(""); // Current input value
  const [ingredientsList, setIngredientsList] = useState([]); // List of all ingredients
  const [healthy, setHealthy] = useState(false);
  const [unhealthy, setUnhealthy] = useState(false);
  const [recipeResponse, setRecipeResponse] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle the addition of a new ingredient
  const handleAddIngredient = () => {
    if (ingredient.trim().length > 0) {
      setIngredientsList([...ingredientsList, ingredient.trim()]);
      setIngredient(""); // Reset the input field
    }
  };

  const handleRemoveIngredient = (index) => {
    let updatedList = [...ingredientsList];
    updatedList.splice(index, 1);
    setIngredientsList(updatedList);
  };

  async function getRecipePrompt(promptText) {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        prompt: promptText,
        max_tokens: 1024, // Adjust as needed
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].text.trim(); // Extract the response text
  }

  async function handleRecipeRequest() {
    const promptText = `Given the following ingredients: ${ingredientsList.join(
      ", "
    )}, can you suggest 3 ${
      healthy ? "healthy" : ""
    } recipes and give detailed step by step instructions for each recipe?`;
    setIsLoading(true);
    try {
      const result = await getRecipePrompt(promptText);
      setRecipeResponse(result);
      setIsVisible(true);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setRecipeResponse("Failed to fetch recipes. Please try again later.");
    } finally {
      setIsLoading(false); // Set loading to false when request completes or error occurs
    }
  }
  return (
    <View style={styles.container}>
      <StatusBar />
      <View style={styles.header}>
        <Image
          source={require("../assets/RecipeFinder.png")}
          style={{ width: 70, height: 70 }}
        />
        <Header/>
      </View>
      <ScrollView>
        <View style={styles.mainContent}>
          <ImageCarousel />
          <Input
            value={ingredient}
            onChangeText={setIngredient}
            placeholder="Enter ingredient"
            style={styles.input}
          />
          <TouchableOpacity
            onPress={() => handleAddIngredient()}
            style={styles.buttonContainer}
          >
            <Text style={styles.buttonText}>Add Ingredient</Text>
          </TouchableOpacity>
          <FlatList
            data={ingredientsList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.listItem}>
                <Text style={{ flex: 1 }}>{item}</Text>
                <TouchableOpacity
                  onPress={() => handleRemoveIngredient(index)}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeButtonText}>x</Text>
                </TouchableOpacity>
              </View>
            )}
          />
          <Text style={[styles.buttonText, { marginTop: 20 }]}>
            Do you want healthy options?
          </Text>
          <View style={{ flexDirection: "row", marginBottom: 40 }}>
            <CheckBox
              center
              title="Yes"
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checked={healthy}
              onPress={() => {
                setHealthy(!healthy);
                setUnhealthy(false);
              }}
            />

            <CheckBox
              center
              title="No"
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checked={unhealthy}
              onPress={() => {
                setUnhealthy(!unhealthy);
                setHealthy(false);
              }}
            />
          </View>
        </View>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={() => {
          setIsVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <ScrollView>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{recipeResponse}</Text>

              <TouchableOpacity
                style={{ ...styles.buttonContainer, marginTop: 20 }}
                onPress={() => {
                  setIsVisible(false);
                  setIngredientsList([]);
                  setHealthy(false);
                  setUnhealthy(false);
                }}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
      <TouchableOpacity
        onPress={handleRecipeRequest}
        style={styles.buttonContainer}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Find Recipes</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  mainContent: {
    alignContent: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  header: {
    flexDirection: "row",
    alignContent: "flex-start",
    justifyContent: "space-between",
    marginTop: 40,
  },
  input: {
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    marginTop: 30,
    borderRadius: 25, // Makes the input look rounded
    paddingLeft: 10,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5, // or any spacing you prefer
    padding: 10, // or any padding you prefer
    backgroundColor: "#f3f3f3", // or any background color you prefer
  },
  removeButton: {
    padding: 8, // Provide ample touch area
    backgroundColor: "#e74c3c", // A shade of red for deletion
    borderRadius: 4, // Smooth out the corners
  },
  removeButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  buttonContainer: {
    backgroundColor: "orange",
    borderRadius: 10,
    padding: 10,
    width: "90%",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 0,
    height: 50,
    justifyContent: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
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
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
    padding: 10,
    color: "#333",
    backgroundColor: "#f9f9f9", // A light background to distinguish the text area
    borderRadius: 8, // Round the corners a bit
    margin: 10, // Some margin around the text
    elevation: 2, // Adds a shadow on Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default Home;
