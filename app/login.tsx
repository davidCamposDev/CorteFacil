import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth } from "../services/firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !senha) {
      return Alert.alert("Erro", "Preencha todos os campos!");
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        senha
      );
      const user = userCredential.user;

      Alert.alert("Sucesso", "Login realizado!");

      // 👇 Verifica se é o barbeiro
      if (user.email === "davi.alencar144@gmail.com") {
        router.replace("/painelBarbeiro");
      } else {
        router.replace("/servicos");
      }
    } catch (error: any) {
      console.log(error);
      Alert.alert("Erro ao logar", error.message);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <Text className="text-3xl font-bold mb-6">Corte Fácil 💈</Text>

      <TextInput
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        className="border border-gray-300 rounded-lg w-full p-3 mb-4"
      />

      <TextInput
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        className="border border-gray-300 rounded-lg w-full p-3 mb-6"
      />

      <TouchableOpacity
        onPress={handleLogin}
        className="bg-black px-12 py-4 rounded-xl"
      >
        <Text className="text-white text-lg font-semibold">Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("./register")}
        className="mt-4"
      >
        <Text className="text-gray-700">Criar uma conta</Text>
      </TouchableOpacity>
    </View>
  );
}
