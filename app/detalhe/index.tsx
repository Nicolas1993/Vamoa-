import { useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { buscarViagem, Viagem } from '../../lib/storage';

export default function DetalheScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [viagem, setViagem] = useState<Viagem | undefined>(undefined);

  useFocusEffect(
    useCallback(() => {
      if (id) {
        buscarViagem(id).then(setViagem);
      }
    }, [id])
  );

  if (!viagem) {
    return (
      <View style={styles.container}>
        <Text style={styles.naoEncontrada}>Viagem não encontrada.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.destino}>{viagem.destino}</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Período</Text>
        <Text style={styles.valor}>
          {viagem.dataIda} → {viagem.dataVolta}
        </Text>

        <Text style={styles.label}>Pessoas</Text>
        <Text style={styles.valor}>{viagem.qtdPessoas}</Text>

        <Text style={styles.label}>Hospedagem</Text>
        <Text style={styles.valor}>{viagem.hospedagem}</Text>

        <Text style={styles.label}>Transporte</Text>
        <Text style={styles.valor}>{viagem.transporte}</Text>

        <Text style={styles.label}>Valor estimado</Text>
        <Text style={[styles.valor, styles.vlDestaque]}>
          R$ {viagem.valorEstimado.toLocaleString('pt-BR')}
        </Text>
      </View>

      {/* TAREFA (Aula 18): adicione um botão "Editar" ou "Excluir" aqui.
          Lembre-se de pedir confirmação antes de excluir (Alert.alert). */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  naoEncontrada: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: 16,
    color: '#666',
  },
  destino: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
  },
  label: {
    fontSize: 13,
    color: '#8A8A8E',
    marginTop: 8,
  },
  valor: {
    fontSize: 16,
    color: '#1C1C1E',
  },
  vlDestaque: {
    fontWeight: '700',
    color: '#1D3557',
    fontSize: 18,
  },
});