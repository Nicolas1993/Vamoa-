import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';
import { adicionarViagem } from '../lib/storage';

export default function AdicionarScreen() {
  const [destino, setDestino] = useState('');
  const [dataIda, setDataIda] = useState('');
  const [dataVolta, setDataVolta] = useState('');
  const [qtdPessoas, setQtdPessoas] = useState('');
  const [hospedagem, setHospedagem] = useState('');
  const [transporte, setTransporte] = useState('');
  const [valorEstimado, setValorEstimado] = useState('');

  const salvar = async () => {
    // TAREFA (Aula 07): valide os campos antes de salvar.
    // Ex.: destino, dataIda e dataVolta não podem estar vazios.
    if (!destino.trim() || !dataIda.trim() || !dataVolta.trim()) {
      Alert.alert('Atenção', 'Preencha ao menos destino e período da viagem.');
      return;
    }

    await adicionarViagem({
      destino: destino.trim(),
      dataIda: dataIda.trim(),
      dataVolta: dataVolta.trim(),
      qtdPessoas: Number(qtdPessoas) || 1,
      hospedagem: hospedagem.trim() || 'A definir',
      transporte: transporte.trim() || 'A definir',
      valorEstimado: Number(valorEstimado) || 0,
    });

    Alert.alert('Viagem adicionada!', 'Sua viagem foi salva no AsyncStorage.');
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.label}>Destino *</Text>
        <TextInput
          style={styles.input}
          value={destino}
          onChangeText={setDestino}
          placeholder="Ex.: Florianópolis - SC"
          placeholderTextColor="#9CA3AF"
        />

        <Text style={styles.label}>Data de ida *</Text>
        <TextInput
          style={styles.input}
          value={dataIda}
          onChangeText={setDataIda}
          placeholder="Ex.: 10/01/2027"
          placeholderTextColor="#9CA3AF"
        />

        <Text style={styles.label}>Data de volta *</Text>
        <TextInput
          style={styles.input}
          value={dataVolta}
          onChangeText={setDataVolta}
          placeholder="Ex.: 15/01/2027"
          placeholderTextColor="#9CA3AF"
        />

        <Text style={styles.label}>Quantidade de pessoas</Text>
        <TextInput
          style={styles.input}
          value={qtdPessoas}
          onChangeText={setQtdPessoas}
          placeholder="Ex.: 4"
          keyboardType="numeric"
          placeholderTextColor="#9CA3AF"
        />

        <Text style={styles.label}>Hospedagem</Text>
        <TextInput
          style={styles.input}
          value={hospedagem}
          onChangeText={setHospedagem}
          placeholder="Ex.: Hotel Pousada do Mar"
          placeholderTextColor="#9CA3AF"
        />

        <Text style={styles.label}>Transporte</Text>
        <TextInput
          style={styles.input}
          value={transporte}
          onChangeText={setTransporte}
          placeholder="Ex.: Carro / Ônibus / Avião"
          placeholderTextColor="#9CA3AF"
        />

        <Text style={styles.label}>Valor estimado (R$)</Text>
        <TextInput
          style={styles.input}
          value={valorEstimado}
          onChangeText={setValorEstimado}
          placeholder="Ex.: 1200"
          keyboardType="numeric"
          placeholderTextColor="#9CA3AF"
        />

        <Pressable style={styles.button} onPress={salvar}>
          <Text style={styles.buttonText}>Salvar Viagem</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#1D3557',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});