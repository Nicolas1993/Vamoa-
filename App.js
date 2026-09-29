import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  adicionarViagem,
  buscarViagem,
  carregarViagens,
  excluirViagem,
} from './lib/storage';

export default function App() {
  const [tela, setTela] = useState('lista'); // 'lista' | 'detalhe' | 'adicionar'
  const [viagens, setViagens] = useState([]);
  const [selecionada, setSelecionada] = useState(null);

  // formulário (tela adicionar)
  const [destino, setDestino] = useState('');
  const [local, setLocal] = useState('');
  const [dataIda, setDataIda] = useState('');
  const [dataVolta, setDataVolta] = useState('');
  const [valorEstimado, setValorEstimado] = useState('');

  const recarregar = useCallback(async () => {
    const lista = await carregarViagens();
    setViagens(lista);
  }, []);

  const abrirDetalhe = async (id) => {
    const viagem = await buscarViagem(id);
    setSelecionada(viagem);
    setTela('detalhe');
  };

  const salvar = async () => {
    if (!destino.trim()) {
      Alert.alert('Atenção', 'Preencha ao menos o destino.');
      return;
    }
    await adicionarViagem({
      title: destino.trim(),
      location: local.trim() || 'A definir',
      price: valorEstimado ? `R$ ${valorEstimado.trim()}` : 'A definir',
      rating: 'Novo',
      tag: 'Adicionada',
      days: dataIda && dataVolta ? `${dataIda} → ${dataVolta}` : 'A combinar',
      image: 'https://i.pinimg.com/736x/9d/b1/5b/9db15b67bed3ac1e7306dc9fc47e21af.jpg',
      dataIda: dataIda.trim() || 'A definir',
      dataVolta: dataVolta.trim() || 'A definir',
      qtdPessoas: '1',
      hospedagem: 'A definir',
      transporte: 'A definir',
      valorEstimado: valorEstimado.trim(),
    });
    setDestino('');
    setLocal('');
    setDataIda('');
    setDataVolta('');
    setValorEstimado('');
    await recarregar();
    setTela('lista');
  };

  const confirmarExclusao = (id) => {
    Alert.alert('Excluir viagem', 'Tem certeza que deseja excluir?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await excluirViagem(id);
          await recarregar();
          setTela('lista');
        },
      },
    ]);
  };

  if (tela === 'adicionar') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <ScrollView contentContainerStyle={styles.formContent}>
          <Text style={styles.eyebrow}>Vamoaê</Text>
          <Text style={styles.title}>Adicionar viagem</Text>

          <Text style={styles.label}>Destino *</Text>
          <TextInput
            style={styles.input}
            value={destino}
            onChangeText={setDestino}
            placeholder="Ex.: Praia de Copacabana"
          />

          <Text style={styles.label}>Local</Text>
          <TextInput
            style={styles.input}
            value={local}
            onChangeText={setLocal}
            placeholder="Ex.: Rio de Janeiro"
          />

          <Text style={styles.label}>Data de ida</Text>
          <TextInput
            style={styles.input}
            value={dataIda}
            onChangeText={setDataIda}
            placeholder="Ex.: 10/01/2027"
          />

          <Text style={styles.label}>Data de volta</Text>
          <TextInput
            style={styles.input}
            value={dataVolta}
            onChangeText={setDataVolta}
            placeholder="Ex.: 15/01/2027"
          />

          <Text style={styles.label}>Valor estimado (R$)</Text>
          <TextInput
            style={styles.input}
            value={valorEstimado}
            onChangeText={setValorEstimado}
            placeholder="Ex.: 680"
            keyboardType="numeric"
          />

          {/* TAREFA (Aula 07): adicione aqui os campos qtdPessoas, hospedagem e transporte */}

          <TouchableOpacity style={styles.button} onPress={salvar}>
            <Text style={styles.buttonText}>Salvar viagem</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonSecundario}
            onPress={() => setTela('lista')}
          >
            <Text style={styles.buttonTextSecundario}>Cancelar</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (tela === 'detalhe' && selecionada) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <ScrollView contentContainerStyle={styles.detailContent}>
          <Text style={styles.eyebrow}>Vamoaê</Text>
          <Text style={styles.detailTitle}>{selecionada.title}</Text>
          <Image source={{ uri: selecionada.image }} style={styles.detailImage} />

          <View style={styles.detailCard}>
            {[
              ['Local', selecionada.location],
              ['Período', selecionada.days],
              ['Data de ida', selecionada.dataIda],
              ['Data de volta', selecionada.dataVolta],
              ['Valor estimado', selecionada.price],
            ].map(([rotulo, valor]) => (
              <View key={rotulo} style={styles.detailRow}>
                <Text style={styles.detailLabel}>{rotulo}</Text>
                <Text style={styles.detailValor}>{valor}</Text>
              </View>
            ))}
          </View>

          {/* TAREFA (Aula 18): adicione um botão "Editar" aqui (Atualizar a viagem no AsyncStorage) */}

          <TouchableOpacity
            style={styles.buttonDanger}
            onPress={() => confirmarExclusao(selecionada.id)}
          >
            <Text style={styles.buttonText}>Excluir viagem</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonSecundario}
            onPress={() => setTela('lista')}
          >
            <Text style={styles.buttonTextSecundario}>Voltar</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Vamoaê</Text>
          <Text style={styles.title}>Viagens em alta</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        >
          {viagens.map((trip) => (
            <TouchableOpacity
              key={trip.id}
              activeOpacity={0.9}
              style={styles.card}
              onPress={() => abrirDetalhe(trip.id)}
            >
              <Image source={{ uri: trip.image }} style={styles.image} />

              <View style={styles.cardContent}>
                <View style={styles.rowBetween}>
                  <Text style={styles.location}>{trip.location}</Text>
                  <Text style={styles.badge}>{trip.tag}</Text>
                </View>

                <Text style={styles.tripTitle}>{trip.title}</Text>
                <Text style={styles.meta}>⭐ {trip.rating} · {trip.days}</Text>

                <View style={styles.rowBetween}>
                  <Text style={styles.price}>{trip.price}</Text>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => abrirDetalhe(trip.id)}
                  >
                    <Text style={styles.buttonText}>Ver detalhe</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={styles.floatButton}
          onPress={() => setTela('adicionar')}
        >
          <Text style={styles.floatButtonText}>+ Nova viagem</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f7fb',
  },
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 24,
  },
  header: {
    marginBottom: 16,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: '#4f8ef7',
    marginBottom: 6,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#14213d',
  },
  list: {
    paddingBottom: 90,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    marginBottom: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 180,
  },
  cardContent: {
    padding: 16,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  location: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4f8ef7',
  },
  badge: {
    backgroundColor: '#e8f1ff',
    color: '#2b6fe6',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 999,
    fontSize: 10,
    fontWeight: '700',
  },
  tripTitle: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: '800',
    color: '#14213d',
  },
  meta: {
    marginTop: 6,
    fontSize: 13,
    color: '#596579',
  },
  price: {
    marginTop: 18,
    fontSize: 24,
    fontWeight: '800',
    color: '#14213d',
  },
  button: {
    marginTop: 16,
    backgroundColor: '#4f8ef7',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  buttonSecundario: {
    marginTop: 8,
    backgroundColor: '#e8f1ff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonTextSecundario: {
    color: '#2b6fe6',
    fontWeight: '700',
    fontSize: 14,
  },
  buttonDanger: {
    marginTop: 24,
    backgroundColor: '#e5484d',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  floatButton: {
    position: 'absolute',
    bottom: 24,
    left: 18,
    right: 18,
    backgroundColor: '#4f8ef7',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  floatButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
  formContent: {
    padding: 18,
    paddingBottom: 40,
  },
  detailContent: {
    padding: 18,
    paddingBottom: 40,
  },
  detailTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#14213d',
    marginBottom: 14,
  },
  detailImage: {
    width: '100%',
    height: 200,
    borderRadius: 22,
    marginBottom: 16,
  },
  detailCard: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 18,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e8f1ff',
  },
  detailLabel: {
    fontSize: 13,
    color: '#8a9bb5',
    fontWeight: '600',
  },
  detailValor: {
    fontSize: 14,
    color: '#14213d',
    fontWeight: '700',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#14213d',
    marginTop: 14,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#dfe7f3',
  },
});