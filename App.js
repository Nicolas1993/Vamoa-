import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';
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

const db = SQLite.openDatabaseSync('vamoa.db');

const SQL_SEED = `
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS viagens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    location TEXT,
    price TEXT,
    rating TEXT,
    tag TEXT,
    days TEXT,
    image TEXT,
    dataIda TEXT,
    dataVolta TEXT,
    qtdPessoas TEXT,
    hospedagem TEXT,
    transporte TEXT,
    valorEstimado TEXT
  );

  INSERT OR IGNORE INTO viagens (
    id, title, location, price, rating, tag, days, image, dataIda, dataVolta, qtdPessoas, hospedagem, transporte, valorEstimado
  ) VALUES
    (1, 'Praia de Copacabana', 'Rio de Janeiro', 'R$ 680', '4.9', 'Mais procurada', '5 dias', 'https://i.pinimg.com/736x/4f/31/03/4f3103015fb580368b4c8000c03d5a8f.jpg', '10/01/2027', '15/01/2027', '2', 'Hotel Copacabana Palace', 'Avião', '680'),
    (2, 'Paris', 'Paris, França', 'R$ 820', '4.8', 'Trending', '4 dias', 'https://i.pinimg.com/736x/e9/8f/2c/e98f2c723a8686fc228adad6c905ebc9.jpg', '20/02/2027', '24/02/2027', '2', 'Hotel Eiffel', 'Avião', '820'),
    (3, 'Gramado e Serra', 'Rio Grande do Sul', 'R$ 760', '4.7', 'Top 10', '3 dias', 'https://i.pinimg.com/1200x/4f/c7/a6/4fc7a6bc690d57666bae3856379787c1.jpg', '05/03/2027', '08/03/2027', '4', 'Pousada da Serra', 'Carro', '760');
`;

const formatarViagem = (viagem) => ({
  ...viagem,
  id: String(viagem.id),
});

const inicializarBanco = async () => {
  await db.execAsync(SQL_SEED);
};

const listarViagensDoBanco = async () => {
  const viagens = await db.getAllAsync('SELECT * FROM viagens ORDER BY id DESC');
  return viagens.map(formatarViagem);
};

const buscarViagemNoBanco = async (id) => {
  const viagem = await db.getFirstAsync('SELECT * FROM viagens WHERE id = ?', [id]);
  return viagem ? formatarViagem(viagem) : null;
};

const adicionarViagemNoBanco = async (viagem) => {
  await db.runAsync(
    `INSERT INTO viagens (title, location, price, rating, tag, days, image, dataIda, dataVolta, qtdPessoas, hospedagem, transporte, valorEstimado)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      viagem.title,
      viagem.location,
      viagem.price,
      viagem.rating,
      viagem.tag,
      viagem.days,
      viagem.image,
      viagem.dataIda,
      viagem.dataVolta,
      viagem.qtdPessoas,
      viagem.hospedagem,
      viagem.transporte,
      viagem.valorEstimado,
    ]
  );
};

const atualizarViagemNoBanco = async (id, viagem) => {
  await db.runAsync(
    `UPDATE viagens
     SET title = ?, location = ?, price = ?, rating = ?, tag = ?, days = ?, image = ?, dataIda = ?, dataVolta = ?, qtdPessoas = ?, hospedagem = ?, transporte = ?, valorEstimado = ?
     WHERE id = ?;`,
    [
      viagem.title,
      viagem.location,
      viagem.price,
      viagem.rating,
      viagem.tag,
      viagem.days,
      viagem.image,
      viagem.dataIda,
      viagem.dataVolta,
      viagem.qtdPessoas,
      viagem.hospedagem,
      viagem.transporte,
      viagem.valorEstimado,
      id,
    ]
  );
};

const excluirViagemNoBanco = async (id) => {
  await db.runAsync('DELETE FROM viagens WHERE id = ?', [id]);
};

export default function App() {
  const [tela, setTela] = useState('lista'); // 'lista' | 'detalhe' | 'adicionar'
  const [viagens, setViagens] = useState([]);
  const [selecionada, setSelecionada] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  // formulário (tela adicionar)
  const [destino, setDestino] = useState('');
  const [local, setLocal] = useState('');
  const [dataIda, setDataIda] = useState('');
  const [dataVolta, setDataVolta] = useState('');
  const [valorEstimado, setValorEstimado] = useState('');
  const [qtdPessoas, setQtdPessoas] = useState('1');
  const [hospedagem, setHospedagem] = useState('A definir');
  const [transporte, setTransporte] = useState('A definir');

  const limparFormulario = () => {
    setDestino('');
    setLocal('');
    setDataIda('');
    setDataVolta('');
    setValorEstimado('');
    setQtdPessoas('1');
    setHospedagem('A definir');
    setTransporte('A definir');
    setModoEdicao(false);
    setEditandoId(null);
  };

  const recarregar = useCallback(async () => {
    await inicializarBanco();
    const lista = await listarViagensDoBanco();
    setViagens(lista);
  }, []);

  useEffect(() => {
    const carregar = async () => {
      await recarregar();
    };

    carregar();
  }, [recarregar]);

  const abrirDetalhe = async (id) => {
    const viagem = await buscarViagemNoBanco(Number(id));
    setSelecionada(viagem);
    setTela('detalhe');
  };

  const salvar = async () => {
    if (!destino.trim()) {
      Alert.alert('Atenção', 'Preencha ao menos o destino.');
      return;
    }

    const viagemBase = {
      title: destino.trim(),
      location: local.trim() || 'A definir',
      price: valorEstimado ? `R$ ${valorEstimado.trim()}` : 'A definir',
      days: dataIda && dataVolta ? `${dataIda} → ${dataVolta}` : 'A combinar',
      dataIda: dataIda.trim() || 'A definir',
      dataVolta: dataVolta.trim() || 'A definir',
      qtdPessoas: qtdPessoas.trim() || '1',
      hospedagem: hospedagem.trim() || 'A definir',
      transporte: transporte.trim() || 'A definir',
      valorEstimado: valorEstimado.trim(),
    };

    if (modoEdicao && editandoId) {
      const viagemAtualizada = {
        ...selecionada,
        ...viagemBase,
        rating: selecionada?.rating || 'Novo',
        tag: selecionada?.tag || 'Editada',
        image: selecionada?.image || 'https://i.pinimg.com/736x/9d/b1/5b/9db15b67bed3ac1e7306dc9fc47e21af.jpg',
      };

      await atualizarViagemNoBanco(Number(editandoId), viagemAtualizada);
      const atualizada = await buscarViagemNoBanco(Number(editandoId));
      setSelecionada(atualizada);
      limparFormulario();
      await recarregar();
      setTela('detalhe');
      return;
    }

    await adicionarViagemNoBanco({
      ...viagemBase,
      rating: 'Novo',
      tag: 'Adicionada',
      image: 'https://i.pinimg.com/736x/9d/b1/5b/9db15b67bed3ac1e7306dc9fc47e21af.jpg',
    });

    limparFormulario();
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
          await excluirViagemNoBanco(Number(id));
          await recarregar();
          setTela('lista');
        },
      },
    ]);
  };

  const iniciarEdicao = () => {
    if (!selecionada) return;
    setModoEdicao(true);
    setEditandoId(selecionada.id);
    setDestino(selecionada.title || '');
    setLocal(selecionada.location || '');
    setDataIda(selecionada.dataIda || '');
    setDataVolta(selecionada.dataVolta || '');
    setValorEstimado(selecionada.valorEstimado || '');
    setQtdPessoas(selecionada.qtdPessoas || '1');
    setHospedagem(selecionada.hospedagem || 'A definir');
    setTransporte(selecionada.transporte || 'A definir');
    setTela('adicionar');
  };

  if (tela === 'adicionar') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <ScrollView contentContainerStyle={styles.formContent}>
          <Text style={styles.eyebrow}>Vamoaê</Text>
          <Text style={styles.title}>
            {modoEdicao ? 'Editar viagem' : 'Adicionar viagem'}
          </Text>

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

          <Text style={styles.label}>Quantidade de pessoas</Text>
          <TextInput
            style={styles.input}
            value={qtdPessoas}
            onChangeText={setQtdPessoas}
            placeholder="Ex.: 2"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Hospedagem</Text>
          <TextInput
            style={styles.input}
            value={hospedagem}
            onChangeText={setHospedagem}
            placeholder="Ex.: Hotel Copacabana Palace"
          />

          <Text style={styles.label}>Transporte</Text>
          <TextInput
            style={styles.input}
            value={transporte}
            onChangeText={setTransporte}
            placeholder="Ex.: Avião"
          />

          <TouchableOpacity style={styles.button} onPress={salvar}>
            <Text style={styles.buttonText}>
              {modoEdicao ? 'Salvar alterações' : 'Salvar viagem'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonSecundario}
            onPress={() => {
              limparFormulario();
              setTela(modoEdicao ? 'detalhe' : 'lista');
            }}
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
              ['Quantidade de pessoas', selecionada.qtdPessoas],
              ['Hospedagem', selecionada.hospedagem],
              ['Transporte', selecionada.transporte],
            ].map(([rotulo, valor]) => (
              <View key={rotulo} style={styles.detailRow}>
                <Text style={styles.detailLabel}>{rotulo}</Text>
                <Text style={styles.detailValor}>{valor}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.button} onPress={iniciarEdicao}>
            <Text style={styles.buttonText}>Editar viagem</Text>
          </TouchableOpacity>

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