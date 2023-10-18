import { StyleSheet, Text, View,Dimensions,ScrollView,StatusBar,Image,ActivityIndicator } from 'react-native'
import React, { useState,useRef,useEffect } from 'react'
import axios from "axios";
import Header from '../Components/Header';

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

const FeaturedRecipes = () => {
    const [recipeResponse, setRecipeResponse] = useState("");
    const [isLoading,setIsLoading]=useState(false);

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

    useEffect(() => {
      handleRecipeRequest();
    }, []);

    async function handleRecipeRequest() {
      const promptText = `Give step by step recipes of 3 different food dishes which only need 4 ingredients to make. All 3 must be different style dishes. Add a line to separate each recipe`;
      setIsLoading(true);
      try {
        const result = await getRecipePrompt(promptText);
        setRecipeResponse(result);
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
        <Header />
      </View>
      {isLoading ? (
        <View style={styles.centeredLoading}>
          <ActivityIndicator size="large" color="grey" />
          <Text>Loading...</Text>
        </View>
      ) : (
        <ScrollView>
          <View style={styles.mainContent}>
            <ImageCarousel />
            <Text style={styles.featuredText}>
              Featured 4 Ingredient Recipes
            </Text>
            <Text style={styles.recipeText}>{recipeResponse}</Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

export default FeaturedRecipes

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
  featuredText: {
    alignSelf: "center",
    fontSize: 25,
    marginTop: 30,
    fontWeight: 600,
  },
  centeredLoading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  recipeText: {
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