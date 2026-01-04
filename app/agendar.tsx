import { router, useLocalSearchParams } from "expo-router";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../services/firebase";

export default function Agendar() {
  const user = auth.currentUser;
  const { servico } = useLocalSearchParams();
  const [slots, setSlots] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Buscar horários disponíveis do barbeiro
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const q = query(
          collection(db, "availability"),
          where("barbeiroId", "==", "mrjhonn")
        );
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          // usa o documento mais recente (último criado)
          const docData = snapshot.docs[snapshot.docs.length - 1];
          const data = docData.data();

          if (Array.isArray(data.slots)) {
            setSlots(data.slots);
          } else {
            setSlots([]);
          }
        } else {
          setSlots([]);
        }
      } catch (error) {
        console.log(error);
        Alert.alert("Erro", "Falha ao carregar horários.");
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, []);

  // 📅 Confirmar agendamento
  const handleAgendar = async () => {
    if (!selected) return Alert.alert("Selecione um horário");

    try {
      // cria o agendamento
      await addDoc(collection(db, "bookings"), {
        clienteId: user?.email || "anônimo",
        barbeiroId: "mrjhonn",
        servico,
        data: new Date().toISOString().split("T")[0],
        hora: selected,
        status: "pendente",
      });

      // remove o horário do availability
      const q = query(
        collection(db, "availability"),
        where("barbeiroId", "==", "mrjhonn")
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const docRef = snapshot.docs[snapshot.docs.length - 1];
        const currentSlots = docRef.data().slots || [];
        const newSlots = currentSlots.filter((h: string) => h !== selected);

        await updateDoc(doc(db, "availability", docRef.id), {
          slots: newSlots,
        });
      }

      Alert.alert("Sucesso", "Agendamento enviado! Aguarde confirmação.");
      router.replace("/servicos");
    } catch (error: any) {
      console.error(error);
      Alert.alert("Erro", error.message || "Falha ao enviar agendamento.");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#000" />
        <Text className="mt-3 text-gray-500">Carregando horários...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white p-6">
      <Text className="text-2xl font-bold mb-4">Escolha o horário</Text>

      {slots.length === 0 ? (
        <Text className="text-gray-500 text-center mt-10">
          Nenhum horário disponível no momento.
        </Text>
      ) : (
        <FlatList
          data={slots}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelected(item)}
              className={`p-4 rounded-xl mb-2 border ${
                selected === item ? "bg-black" : "bg-zinc-200"
              }`}
            >
              <Text
                className={`text-center ${
                  selected === item ? "text-white" : "text-black"
                }`}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      {slots.length > 0 && (
        <TouchableOpacity
          onPress={handleAgendar}
          className="bg-orange-600 mt-6 py-4 rounded-xl"
        >
          <Text className="text-white text-center text-lg font-semibold">
            Confirmar Agendamento
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
