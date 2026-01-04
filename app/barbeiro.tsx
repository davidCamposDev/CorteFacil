import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { db } from "../services/firebase";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  doc,
  where,
} from "firebase/firestore";

export default function PainelBarbeiro() {
  const [agendamentos, setAgendamentos] = useState<any[]>([]);

  const fetchAgendamentos = async () => {
    const q = query(
      collection(db, "bookings"),
      where("barbeiroId", "==", "mrjhonn")
    );
    const snapshot = await getDocs(q);
    setAgendamentos(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchAgendamentos();
  }, []);

  const atualizarStatus = async (id: string, status: string) => {
    const ref = doc(db, "bookings", id);
    await updateDoc(ref, { status });
    fetchAgendamentos();
  };

  return (
    <View className="flex-1 bg-white p-6">
      <Text className="text-2xl font-bold mb-4">Agendamentos Pendentes</Text>

      <FlatList
        data={agendamentos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="bg-zinc-100 p-4 rounded-xl mb-3">
            <Text className="text-lg font-semibold">{item.servico}</Text>
            <Text className="text-zinc-600">{item.clienteId}</Text>
            <Text className="text-zinc-600">
              {item.data} às {item.hora}
            </Text>
            <Text className="mt-1 font-bold text-orange-600">{item.status}</Text>

            <View className="flex-row justify-between mt-2">
              <TouchableOpacity
                onPress={() => atualizarStatus(item.id, "aceito")}
                className="bg-green-500 px-4 py-2 rounded-lg"
              >
                <Text className="text-white font-semibold">Aceitar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => atualizarStatus(item.id, "cancelado")}
                className="bg-red-500 px-4 py-2 rounded-lg"
              >
                <Text className="text-white font-semibold">Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}
