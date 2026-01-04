import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth } from "../services/firebase";

export default function Register() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !senha) {
      return Alert.alert("Erro", "Preencha todos os campos!");
    }

    try {
      await createUserWithEmailAndPassword(auth, email, senha);
      Alert.alert("Sucesso", "Conta criada!");
      router.replace("/login");
    } catch (error: any) {
      console.log(error);
      Alert.alert("Erro ao cadastrar", error.message);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <Text className="text-3xl font-bold mb-6">Criar Conta 💈</Text>

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
        onPress={handleRegister}
        className="bg-black px-12 py-4 rounded-xl"
      >
        <Text className="text-white text-lg font-semibold">Cadastrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/login")} className="mt-4">
        <Text className="text-gray-700">Voltar ao login</Text>
      </TouchableOpacity>
    </View>
  );
}
