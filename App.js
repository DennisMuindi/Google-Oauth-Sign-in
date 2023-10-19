import * as React from "react";
import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [userInfo, setUserInfo] = React.useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "546479378168-071lcqudj0qom6pkuu22h9naffo96k62.apps.googleusercontent.com",
    webClientId:
      "546479378168-44i522vrjf2i8qr3o8u134sj54nb6dhb.apps.googleusercontent.com",
    iosClientId:
      "546479378168-g1fu0f8ms73kp4hl2835hsk3mgcc4ncf.apps.googleusercontent.com",
  });

  React.useEffect(() => {
    handleSignIn();
  }, [response]);

  async function handleSignIn() {
    await AsyncStorage.removeItem("@user");
    const user = await AsyncStorage.getItem("@user");
    if (!user) {
      if (response?.type === "success") {
        await getUserInfo(response.authentication.accessToken);
      }
    }
  }

  const getUserInfo = async (token) => {
    if (!token) return;
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const user = await response.json();
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      setUserInfo(user);
    } catch (error) {}
  };

  return (
    <View style={styles.container}>
      <Text>{JSON.stringify(userInfo, null, 2)}</Text>
      <Text>Papa Dennis</Text>
      <Button onPress={() => promptAsync()} title="Sign in with Google" />
      <Button
        onPress={() => AsyncStorage.removeItem("@user")}
        title="Delete user"
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
