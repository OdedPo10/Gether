import React, { useState, useEffect } from "react";
import { View, TextInput, StyleSheet, SafeAreaView, TouchableOpacity, Text, Alert, Animated } from "react-native";
import { COLORS } from "../../constants";
import axios from "axios";
import { ip } from "../../../context/usersContext";
import { useNavigation } from "@react-navigation/native";
import { ROUTES } from "../../constants";
import { UserContext } from "./../../../context/usersContext";
import { useContext } from "react";
const ForgotPass = () => {
  const { checkMail } = useContext(UserContext);
  const [shakeAnim] = useState(new Animated.Value(0));

  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [input3, setInput3] = useState("");
  const [input4, setInput4] = useState("");

  const input1Ref = React.useRef(null);
  const input2Ref = React.useRef(null);
  const input3Ref = React.useRef(null);
  const input4Ref = React.useRef(null);

  const handleInput1Change = (text) => {
    setInput1(text);
    if (text.length === 1) input2Ref.current.focus();
  };

  const handleInput2Change = (text) => {
    setInput2(text);
    if (text.length === 1) input3Ref.current.focus();
    else if (!text.length) input1Ref.current.focus();
  };

  const handleInput3Change = (text) => {
    setInput3(text);
    if (text.length === 1) input4Ref.current.focus();
    else if (!text.length) input2Ref.current.focus();
  };

  const handleInput4Change = (text) => {
    setInput4(text);
    if (!text.length) input3Ref.current.focus();
  };

  const handleKeyPress = (ref, text) => {
    if (text.length === 0) ref.current.focus();
  };

  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const navigation = useNavigation();

  const handleEmailInput = (text) => {
    setEmail(text);
  };
  //SEND MAIL WITH CODE
  const sendCode = async () => {
    //CHECK IF EMAIL IS FILLED BY A PROPER WAY
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (regex.test(email)) {
      const result = await checkMail(email);
      if (result) {
        //GENREATE A RANDOM CODE NUMBER
        const randomNumber = Math.floor(1000 + Math.random() * 9000);
        setCode(randomNumber.toString());
        console.log(randomNumber.toString());
        console.log(email);
        Alert.alert("open your email", `A four-digit code has been sent to your email`, [{ text: "Cancel" }]);
        //SEND TO THE EMAIL THE SPECIFIC CODE
        let answer = await axios.post(`https://getheremailserver.onrender.com`, {
          email: email,
          code: randomNumber.toString(),
        });
        console.log(answer.data);
      } else {
        Alert.alert("Incorrect email", `Make sure to use the email that you signed up with`, [{ text: "Cancel" }]);
      }
    } else {
      Alert.alert("Somthing went wrong", `email must be filled as the example shows`, [{ text: "Cancel" }]);
    }
  };

  //CHECK IF THE CODE TYPED IN QEUAL TO THE CODE THAT SENT
  useEffect(() => {
    const enteredCode = input1 + input2 + input3 + input4;
    if (enteredCode === code && code != "") {
      Alert.alert("Code Matched", "Your code is correct!", [
        {
          text: "OK",
          onPress: () => navigation.navigate(ROUTES.RESET_PASSWORD),
        },
      ]);
    } else {
      setInput1("");
      setInput2("");
      setInput3("");
      setInput4("");
      input1Ref.current.focus();
      Animated.timing(shakeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start(() => shakeAnim.setValue(0));
    }
  }, [input4]);

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.container}>
        <View style={styles.wFull}>
          <Text style={styles.loginContinueTxt}>Please enter your email address</Text>
          <TextInput placeholder="example@example.com" textContentType="emailAddress" style={styles.inputEmail} onChangeText={handleEmailInput}></TextInput>
          <View style={styles.loginBtnWrapper}>
            <TouchableOpacity activeOpacity={0.7} style={styles.loginBtn} onPress={() => sendCode()}>
              <Text style={styles.loginText}>confirm</Text>
            </TouchableOpacity>
          </View>
          <Animated.View
            style={[
              {
                display: "flex",
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-evenly",
              },
              {
                transform: [
                  {
                    translateX: shakeAnim.interpolate({
                      inputRange: [0.08, 0.16, 0.24, 0.32, 0.4, 0.48, 0.56, 0.64, 0.72, 0.8, 0.9, 1],
                      outputRange: [-5, -10, -15, -10, -5, 0, 5, 10, 15, 10, 5, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-evenly",
              }}
            >
              <TextInput placeholder="X" ref={input1Ref} maxLength={1} keyboardType="number-pad" value={input1} onChangeText={handleInput1Change} onKeyPress={({ nativeEvent: { key } }) => handleKeyPress(input1Ref, input1)} style={styles.input} />
              <TextInput placeholder="X" ref={input2Ref} maxLength={1} keyboardType="number-pad" value={input2} onChangeText={handleInput2Change} onKeyPress={({ nativeEvent: { key } }) => handleKeyPress(input2Ref, input2)} style={styles.input} />
              <TextInput placeholder="X" ref={input3Ref} maxLength={1} keyboardType="number-pad" value={input3} onChangeText={handleInput3Change} onKeyPress={({ nativeEvent: { key } }) => handleKeyPress(input3Ref, input3)} style={styles.input} />
              <TextInput placeholder="X" ref={input4Ref} maxLength={1} keyboardType="number-pad" value={input4} onChangeText={handleInput4Change} onKeyPress={({ nativeEvent: { key } }) => handleKeyPress(input4Ref, input4)} style={styles.input} />
            </View>
          </Animated.View>
          <Text style={styles.loginContinueTxt}>Please enter the code above to reset your password</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    padding: 10,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  container: {
    padding: 15,
    width: "100%",
    position: "relative",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  brandName: {
    fontSize: 32,
    textAlign: "center",
    fontWeight: "bold",
    color: COLORS.primary,
    opacity: 0.9,
  },
  loginContinueTxt: {
    fontSize: 21,
    textAlign: "center",
    color: COLORS.gray,
    marginBottom: 16,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.grayLight,
    padding: 15,
    marginVertical: 0,
    borderRadius: 5,
    height: 60,
    paddingVertical: 0,
    fontSize: 60,
    fontWeight: "500",
    marginBottom: 40,
  },
  inputEmail: {
    borderWidth: 1,
    borderColor: COLORS.grayLight,
    padding: 15,
    marginVertical: 0,
    borderRadius: 5,
    height: 60,
    paddingVertical: 0,
    fontSize: 26,
    fontWeight: "400",
    marginBottom: 40,
    textAlign: "center",
  },

  loginBtnWrapper: {
    backgroundColor: COLORS.primary,
    height: 55,
    marginBottom: "10%",
    borderRadius: "50%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
  },
  linearGradient: {
    width: "100%",
    borderRadius: 50,
  },
  loginBtn: {
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 55,
  },
  loginText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "400",
  },
  forgotPassText: {
    color: COLORS.primary,
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 15,
  },

  footer: {
    position: "absolute",
    bottom: 20,
    textAlign: "center",
    flexDirection: "row",
  },
  footerText: {
    color: COLORS.gray,
    fontWeight: "bold",
  },
  signupBtn: {
    color: COLORS.primary,
    fontWeight: "bold",
  },

  wFull: {
    width: "100%",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  mr7: {
    marginRight: 7,
    height: 55,
    width: 55,
  },
  row: {
    flexDirection: "row",
    alignContent: "flex-start",
    alignItems: "center",
  },
});

export default ForgotPass;
