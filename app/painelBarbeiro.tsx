import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
 LogBox } from "react-native"
import { auth, db } from "../services/firebase";


// Ocultar avisos desnecessários
LogBox.ignoreLogs([
  "Property 'updateDoc' doesn't exist",
  "VirtualizedLists should never be nested",
]);

export default function PainelBarbeiro() {
  const [abaAtiva, setAbaAtiva] = useState<"agendamentos" | "horarios">(
    "agendamentos"
  );
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [slots, setSlots] = useState<string[]>([]);
  const [novoHorario, setNovoHorario] = useState("");
  const [docId, setDocId] = useState<string | null>(null);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [novosPendentes, setNovosPendentes] = useState(0); // 🟢 contador de notificações

  useEffect(() => {
    // Atualização em tempo real
    const q = query(
      collection(db, "bookings"),
      where("barbeiroId", "==", "mrjhonn")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAgendamentos(data);

      // Contar agendamentos pendentes
    const pendentes = data.filter((a: any) => a.status === "pendente").length;
      setNovosPendentes(pendentes);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const buscarHorarios = async () => {
      const q = query(
        collection(db, "availability"),
        where("barbeiroId", "==", "mrjhonn")
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const docData = snapshot.docs[0];
        setDocId(docData.id);
        setSlots(docData.data().slots || []);
      } else {
        setDocId(null);
        setSlots([]);
      }
    };
    buscarHorarios();
  }, []);

  const onChangeDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === "ios");
    setDate(currentDate);
  };

  const adicionarHorario = async () => {
    if (!novoHorario.trim())
      return Alert.alert("Aviso", "Digite um horário válido.");

    const novoArray = [...slots, novoHorario.trim()];
    if (docId) {
      const ref = doc(db, "availability", docId);
      await updateDoc(ref, { slots: novoArray });
    } else {
      await addDoc(collection(db, "availability"), {
        barbeiroId: "mrjhonn",
        date: date.toISOString().split("T")[0],
        slots: novoArray,
      });
    }
    setSlots(novoArray);
    setNovoHorario("");
    Alert.alert("Sucesso", "Horário adicionado com sucesso!");
  };

  const removerHorario = async (horario: string) => {
    const novoArray = slots.filter((h) => h !== horario);
    if (!docId) return;

    const ref = doc(db, "availability", docId);
    await updateDoc(ref, { slots: novoArray });
    setSlots(novoArray);
  };

  const handleAtualizarStatus = async (id: string, status: string) => {
    try {
      const agendamentoRef = doc(db, "bookings", id);
      await updateDoc(agendamentoRef, { status });
      Alert.alert("Sucesso", `Agendamento ${status}`);
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (error: any) {
      Alert.alert("Erro ao sair", error.message);
    }
  };

  return (
    <View className="flex-1 bg-white p-6">
      {/* Cabeçalho */}
      <View className="flex-row justify-between items-center mb-4">
        <View>
          <Text className="text-3xl font-bold">Painel do Barbeiro 💈</Text>
          {novosPendentes > 0 && (
            <Text className="text-red-600 mt-1 font-semibold">
              🔔 {novosPendentes} novo(s) agendamento(s)
            </Text>
          )}
        </View>
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-600 px-4 py-2 rounded-lg"
        >
          <Text className="text-white font-semibold">Sair</Text>
        </TouchableOpacity>
      </View>

      {/* Abas */}
      <View className="flex-row mb-6">
        <TouchableOpacity
          onPress={() => setAbaAtiva("agendamentos")}
          className={`flex-1 py-3 rounded-lg ${
            abaAtiva === "agendamentos" ? "bg-black" : "bg-gray-300"
          }`}
        >
          <Text
            className={`text-center font-semibold ${
              abaAtiva === "agendamentos" ? "text-white" : "text-black"
            }`}
          >
            Agendamentos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setAbaAtiva("horarios")}
          className={`flex-1 py-3 rounded-lg ml-2 ${
            abaAtiva === "horarios" ? "bg-black" : "bg-gray-300"
          }`}
        >
          <Text
            className={`text-center font-semibold ${
              abaAtiva === "horarios" ? "text-white" : "text-black"
            }`}
          >
            Horários
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {abaAtiva === "agendamentos" ? (
          <>
            <Text className="text-2xl font-bold mb-4">
              Agendamentos Recebidos
            </Text>
            <FlatList
              data={agendamentos}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View className="p-4 border border-gray-300 rounded-xl mb-4">
                  <Text className="text-lg font-semibold">{item.servico}</Text>
                  <Text className="text-gray-600">
                    Cliente: {item.clienteId}
                  </Text>
                  <Text className="text-gray-600">
                    Horário: {item.data} - {item.hora}
                  </Text>
                  <Text className="text-gray-600 mb-2">
                    Status:{" "}
                    <Text
                      className={`${
                        item.status === "aceito"
                          ? "text-green-600"
                          : item.status === "pendente"
                          ? "text-orange-600"
                          : "text-red-600"
                      }`}
                    >
                      {item.status}
                    </Text>
                  </Text>

                  {item.status === "pendente" && (
                    <View className="flex-row justify-between">
                      <TouchableOpacity
                        onPress={() => handleAtualizarStatus(item.id, "aceito")}
                        className="bg-green-600 px-6 py-2 rounded-lg"
                      >
                        <Text className="text-white font-semibold">
                          Aceitar
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() =>
                          handleAtualizarStatus(item.id, "cancelado")
                        }
                        className="bg-red-600 px-6 py-2 rounded-lg"
                      >
                        <Text className="text-white font-semibold">
                          Recusar
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
            />
          </>
        ) : (
          <>
            <Text className="text-2xl font-bold mb-4">Gerenciar Horários</Text>

            <TouchableOpacity
              onPress={() => setShowPicker(true)}
              className="border border-gray-300 rounded-lg p-3 mb-3 bg-gray-100"
            >
              <Text className="text-gray-700 text-lg">
                Data selecionada: {date.toISOString().split("T")[0]}
              </Text>
            </TouchableOpacity>

            {showPicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onChangeDate}
              />
            )}

            <View className="flex-row mb-4 items-center">
              <TextInput
                value={novoHorario}
                onChangeText={setNovoHorario}
                placeholder="Ex: 16:30"
                className="border border-zinc-300 rounded-xl p-3 flex-1 mr-2"
              />
              <TouchableOpacity
                onPress={adicionarHorario}
                className="bg-black p-3 rounded-xl"
              >
                <Text className="text-white font-semibold">Adicionar</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={slots}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <View className="flex-row justify-between items-center bg-zinc-100 p-4 mb-2 rounded-xl">
                  <Text className="text-lg">{item}</Text>
                  <TouchableOpacity
                    onPress={() => removerHorario(item)}
                    className="bg-red-500 px-3 py-1 rounded-xl"
                  >
                    <Text className="text-white font-semibold">Remover</Text>
                  </TouchableOpacity>
                </View>
              )}
            />

            {slots.length === 0 && (
              <Text className="text-zinc-500 text-center mt-10">
                Nenhum horário disponível
              </Text>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
