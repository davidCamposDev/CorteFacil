import { router, useLocalSearchParams } from "expo-router";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

const horarios = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
];

export default function Horarios() {
  const { servico, barbeiro } = useLocalSearchParams();

  return (
    <View className="flex-1 bg-white p-6">
      <Text className="text-3xl font-bold mb-6">Escolha o horário</Text>

      <FlatList
        data={horarios}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="bg-black p-5 rounded-2xl mb-3"
            onPress={() =>
              router.push({
                pathname: "../confirmacao",
                params: { servico, barbeiro, hora: item },
              })
            }
          >
            <Text className="text-white text-xl font-semibold">{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
