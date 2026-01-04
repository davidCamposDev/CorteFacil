import { router } from "expo-router";
import { signOut } from "firebase/auth";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { auth } from "../services/firebase";
import { useAuth } from "../src/context/authContext";

const servicos = [
  {
    id: "1",
    nome: "Corte Masculino",
    preco: "R$ 30",
    img: "https://bluebarbearia.shop/img/corte.jpg",
  },
  {
    id: "2",
    nome: "Barba",
    preco: "R$ 20",
    img: "https://bluebarbearia.shop/img/barba.jpg",
  },
  {
    id: "3",
    nome: "Sobrancelha",
    preco: "R$ 15",
    img: "https://bluebarbearia.shop/img/sobrancelha.png",
  },
];

export default function Servicos() {
  const { user } = useAuth();
  const username = user?.email?.split("@")[0] ?? "Usuário";

  const logout = async () => {
    await signOut(auth);
    router.replace("/login");
  };

  return (
    <View className="flex-1 bg-white p-6">
      {/* Cabeçalho com nome e sair */}
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-bold text-black">Escolha o serviço</Text>

        <View className="flex-row items-center space-x-2">
          <Text className="text-base font-semibold text-gray-700">
            {username}
          </Text>
          <TouchableOpacity
            onPress={logout}
            className="bg-red-500 px-2 py-1 mx-1 rounded-lg"
          >
            <Text className="text-white text-sm">Sair</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Lista de serviços */}
      <FlatList
        data={servicos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/agendar",
                params: { servico: item.id },
              })
            }
            className="flex-row bg-black p-4 rounded-2xl mb-4 items-center active:bg-zinc-900"
          >
            <Image
              source={{ uri: item.img }}
              className="w-20 h-20 rounded-xl mr-4"
            />
            <View>
              <Text className="text-white text-xl font-semibold">
                {item.nome}
              </Text>
              <Text className="text-zinc-400 text-base">{item.preco}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
