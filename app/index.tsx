import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { carregarViagens, Viagem } from '../lib/storage';

export default function ListaScreen() {
  const [viagens, setViagens] = useState<Viagem[]>([]);

  // Recarrega a lista sempre que a tela ganha foco (depois de adicionar uma viagem)
  useFocusEffect(
    useCallback(() => {
      carregarViagens().then(setViagens);
    }, [])
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={viagens}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma viagem cadastrada ainda.</Text>
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.item}
            onPress={() =>
              router.push({ pathname: '/detalhe', params: { id: item.id } })
            }
          >
            <Text style={styles.itemDestino}>{item.destino}</Text>
            <Text style={styles.itemInfo}>
              {item.dataIda} → {item.dataVolta} · {item.qtdPessoas} pessoas
            </Text>
            <Text style={styles.itemValor}>
              R$ {item.valorEstimado.toLocaleString('pt-BR')}
            </Text>
          </Pressable>
        )}
      />

      <Pressable style={styles.addButton} onPress={() => router.push('/adicionar')}>
        <Text style={styles.addButtonText}>+ Adicionar Viagem</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 40,
    fontSize: 16,
  },
  item: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  itemDestino: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  itemInfo: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  itemValor: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1D3557',
    marginTop: 8,
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: '#1D3557',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});