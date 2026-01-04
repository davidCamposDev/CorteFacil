import { router, useLocalSearchParams } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import { Text, TouchableOpacity, View } from "react-native";
import { db } from "../services/firebase";

export default function Confirmacao() {
  const { servico, barbeiro, hora } = useLocalSearchParams();

  async function confirmar() {
    await addDoc(collection(db, "agendamentos"), {
      servico,
      barbeiro,
      hora,
      criadoEm: new Date().toISOString(),
    });

    alert("Agendado com sucesso!");
    router.push("/servicos");
  }

  return (
    <View className="flex-1 bg-white p-6 justify-center">
      <Text className="text-3xl font-bold mb-6">Confirmar Agendamento</Text>

      <Text className="text-xl mb-3">Serviço: {servico}</Text>
      <Text className="text-xl mb-3">Barbeiro: {barbeiro}</Text>
      <Text className="text-xl mb-10">Horário: {hora}</Text>

      <TouchableOpacity className="bg-black p-5 rounded-xl" onPress={confirmar}>
        <Text className="text-white text-xl text-center font-semibold">
          Confirmar
        </Text>
      </TouchableOpacity>
    </View>
  );
}
