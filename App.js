import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as SQLite from 'expo-sqlite';
import {
  ActivityIndicator,
  Alert,
  FlatList,
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

const INITIAL_TRAVEL_DATA = [
  {
    title: 'Praia de Copacabana',
    location: 'Rio de Janeiro',
    description: 'Feriado com praia, gastronomia e vista do pôr do sol.',
    status: 'pendente',
    price: 'R$ 680',
    rating: '4.9',
    tag: 'Mais procurada',
    days: '5 dias',
    image: 'https://i.pinimg.com/736x/4f/31/03/4f3103015fb580368b4c8000c03d5a8f.jpg',
    dataIda: '10/01/2027',
    dataVolta: '15/01/2027',
    qtdPessoas: '2',
    hospedagem: 'Hotel Copacabana Palace',
    transporte: 'Avião',
    valorEstimado: '680',
  },
  {
    title: 'Paris',
    location: 'Paris, França',
    description: 'Viagem cultural com museus, cafés e passeios icônicos.',
    status: 'concluida',
    price: 'R$ 820',
    rating: '4.8',
    tag: 'Trending',
    days: '4 dias',
    image: 'https://i.pinimg.com/736x/e9/8f/2c/e98f2c723a8686fc228adad6c905ebc9.jpg',
    dataIda: '20/02/2027',
    dataVolta: '24/02/2027',
    qtdPessoas: '2',
    hospedagem: 'Hotel Eiffel',
    transporte: 'Avião',
    valorEstimado: '820',
  },
  {
    title: 'Gramado e Serra',
    location: 'Rio Grande do Sul',
    description: 'Roteiro de natureza, chocolates e paisagens serranas.',
    status: 'pendente',
    price: 'R$ 760',
    rating: '4.7',
    tag: 'Top 10',
    days: '3 dias',
    image: 'https://i.pinimg.com/1200x/4f/c7/a6/4fc7a6bc690d57666bae3856379787c1.jpg',
    dataIda: '05/03/2027',
    dataVolta: '08/03/2027',
    qtdPessoas: '4',
    hospedagem: 'Pousada da Serra',
    transporte: 'Carro',
    valorEstimado: '760',
  },
];

const formatarViagem = (viagem) => ({
  ...viagem,
  id: Number(viagem.id),
});

async function inicializarBanco() {
  const tabela = await db.getAllAsync('PRAGMA table_info(viagens)');

  if (!tabela || tabela.length === 0) {
    await db.execAsync(`
      PRAGMA foreign_keys = ON;
      CREATE TABLE IF NOT EXISTS viagens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        location TEXT,
        description TEXT,
        status TEXT DEFAULT 'pendente',
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
        valorEstimado TEXT,
        createdAt TEXT DEFAULT (datetime('now'))
      );
    `);
  }

  const colunas = new Set((await db.getAllAsync('PRAGMA table_info(viagens)')).map((coluna) => coluna.name));

  if (!colunas.has('description')) {
    await db.execAsync('ALTER TABLE viagens ADD COLUMN description TEXT');
  }

  if (!colunas.has('status')) {
    await db.execAsync("ALTER TABLE viagens ADD COLUMN status TEXT DEFAULT 'pendente'");
  }

  if (!colunas.has('createdAt')) {
    await db.execAsync("ALTER TABLE viagens ADD COLUMN createdAt TEXT DEFAULT (datetime('now'))");
  }

  const total = await db.getFirstAsync('SELECT COUNT(*) AS total FROM viagens');
  if ((total?.total ?? 0) === 0) {
    for (const item of INITIAL_TRAVEL_DATA) {
      await db.runAsync(
        `INSERT INTO viagens (
          title, location, description, status, price, rating, tag, days, image,
          dataIda, dataVolta, qtdPessoas, hospedagem, transporte, valorEstimado
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          item.title,
          item.location,
          item.description,
          item.status,
          item.price,
          item.rating,
          item.tag,
          item.days,
          item.image,
          item.dataIda,
          item.dataVolta,
          item.qtdPessoas,
          item.hospedagem,
          item.transporte,
          item.valorEstimado,
        ]
      );
    }
  }
}

async function listarViagensDoBanco(filtro = 'todos', busca = '') {
  let query = 'SELECT * FROM viagens';
  const params = [];
  const condicoes = [];

  if (filtro !== 'todos') {
    condicoes.push('status = ?');
    params.push(filtro);
  }

  const termo = busca.trim();
  if (termo) {
    condicoes.push('(title LIKE ? OR location LIKE ? OR description LIKE ?)');
    const valorLike = `%${termo}%`;
    params.push(valorLike, valorLike, valorLike);
  }

  if (condicoes.length > 0) {
    query += ` WHERE ${condicoes.join(' AND ')}`;
  }

  query += ' ORDER BY createdAt DESC, id DESC';

  const viagens = await db.getAllAsync(query, params);
  return viagens.map(formatarViagem);
}

async function buscarViagemNoBanco(id) {
  const viagem = await db.getFirstAsync('SELECT * FROM viagens WHERE id = ?', [id]);
  return viagem ? formatarViagem(viagem) : null;
}

async function adicionarViagemNoBanco(viagem) {
  await db.runAsync(
    `INSERT INTO viagens (
      title, location, description, status, price, rating, tag, days, image,
      dataIda, dataVolta, qtdPessoas, hospedagem, transporte, valorEstimado
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      viagem.title,
      viagem.location,
      viagem.description,
      viagem.status || 'pendente',
      viagem.price,
      viagem.rating || 'Nova',
      viagem.tag || 'Novo',
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
}

async function atualizarViagemNoBanco(id, viagem) {
  await db.runAsync(
    `UPDATE viagens SET
      title = ?,
      location = ?,
      description = ?,
      status = ?,
      price = ?,
      rating = ?,
      tag = ?,
      days = ?,
      image = ?,
      dataIda = ?,
      dataVolta = ?,
      qtdPessoas = ?,
      hospedagem = ?,
      transporte = ?,
      valorEstimado = ?
     WHERE id = ?;`,
    [
      viagem.title,
      viagem.location,
      viagem.description,
      viagem.status || 'pendente',
      viagem.price,
      viagem.rating || 'Nova',
      viagem.tag || 'Novo',
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
}

async function excluirViagemNoBanco(id) {
  await db.runAsync('DELETE FROM viagens WHERE id = ?', [id]);
}

export default function App() {
  const [tela, setTela] = useState('lista');
  const [viagens, setViagens] = useState([]);
  const [selecionada, setSelecionada] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtroAtual, setFiltroAtual] = useState('todos');
  const [termoBusca, setTermoBusca] = useState('');

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pendente');
  const [dataIda, setDataIda] = useState('');
  const [dataVolta, setDataVolta] = useState('');
  const [valorEstimado, setValorEstimado] = useState('');
  const [qtdPessoas, setQtdPessoas] = useState('1');
  const [hospedagem, setHospedagem] = useState('A definir');
  const [transporte, setTransporte] = useState('A definir');
  const [imagem, setImagem] = useState('');

  const limparFormulario = () => {
    setTitle('');
    setLocation('');
    setDescription('');
    setStatus('pendente');
    setDataIda('');
    setDataVolta('');
    setValorEstimado('');
    setQtdPessoas('1');
    setHospedagem('A definir');
    setTransporte('A definir');
    setImagem('');
    setModoEdicao(false);
    setEditandoId(null);
  };

  const recarregarViagens = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      await inicializarBanco();
      const lista = await listarViagensDoBanco(filtroAtual, termoBusca);
      setViagens(lista);
    } catch (erro) {
      console.error('Erro ao carregar viagens:', erro);
      setError('Não foi possível carregar as viagens. Tente novamente.');
      setViagens([]);
    } finally {
      setLoading(false);
    }
  }, [filtroAtual, termoBusca]);

  useEffect(() => {
    recarregarViagens();
  }, [recarregarViagens]);

  const abrirDetalhe = async (id) => {
    const viagem = await buscarViagemNoBanco(Number(id));
    setSelecionada(viagem);
    setTela('detalhe');
  };

  const selecionarImagem = async () => {
    const { status: permissao } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissao !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos acessar a galeria para usar uma imagem da viagem.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      aspect: [4, 3],
    });

    if (!resultado.canceled && resultado.assets?.[0]?.uri) {
      setImagem(resultado.assets[0].uri);
    }
  };

  const salvarViagem = async () => {
    if (!title.trim()) {
      Alert.alert('Atenção', 'Informe o nome da viagem.');
      return;
    }

    try {
      const payload = {
        title: title.trim(),
        location: location.trim() || 'A definir',
        description: description.trim() || 'Sem descrição adicionada.',
        status: status || 'pendente',
        price: valorEstimado ? `R$ ${valorEstimado.trim()}` : 'A definir',
        days: dataIda && dataVolta ? `${dataIda} a ${dataVolta}` : 'A combinar',
        image: imagem || 'https://i.pinimg.com/736x/9d/b1/5b/9db15b67bed3ac1e7306dc9fc47e21af.jpg',
        dataIda: dataIda.trim() || 'A definir',
        dataVolta: dataVolta.trim() || 'A definir',
        qtdPessoas: qtdPessoas.trim() || '1',
        hospedagem: hospedagem.trim() || 'A definir',
        transporte: transporte.trim() || 'A definir',
        valorEstimado: valorEstimado.trim() || '0',
        rating: selecionada?.rating || 'Nova',
        tag: selecionada?.tag || 'Novo',
      };

      if (modoEdicao && editandoId) {
        await atualizarViagemNoBanco(Number(editandoId), payload);
      } else {
        await adicionarViagemNoBanco(payload);
      }

      limparFormulario();
      setTela('lista');
    } catch (erro) {
      console.error('Erro ao salvar viagem:', erro);
      setError('Não foi possível salvar a viagem. Tente novamente.');
      Alert.alert('Erro', 'Não foi possível salvar a viagem.');
    }
  };

  const confirmarExclusao = (id) => {
    Alert.alert('Excluir viagem', 'Deseja remover esta viagem do banco de dados?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await excluirViagemNoBanco(Number(id));
            setTela('lista');
            if (selecionada?.id === id) setSelecionada(null);
          } catch (erro) {
            console.error('Erro ao excluir viagem:', erro);
            setError('Não foi possível excluir a viagem. Tente novamente.');
            Alert.alert('Erro', 'Não foi possível excluir a viagem.');
          }
        },
      },
    ]);
  };

  const iniciarEdicao = () => {
    if (!selecionada) return;
    setModoEdicao(true);
    setEditandoId(selecionada.id);
    setTitle(selecionada.title || '');
    setLocation(selecionada.location || '');
    setDescription(selecionada.description || '');
    setStatus(selecionada.status || 'pendente');
    setDataIda(selecionada.dataIda || '');
    setDataVolta(selecionada.dataVolta || '');
    setValorEstimado(selecionada.valorEstimado || '');
    setQtdPessoas(selecionada.qtdPessoas || '1');
    setHospedagem(selecionada.hospedagem || 'A definir');
    setTransporte(selecionada.transporte || 'A definir');
    setImagem(selecionada.image || '');
    setTela('adicionar');
  };

  if (tela === 'adicionar') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <ScrollView contentContainerStyle={styles.formContent}>
          <Text style={styles.eyebrow}>Vamoa</Text>
          <Text style={styles.title}>{modoEdicao ? 'Editar viagem' : 'Nova viagem'}</Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {imagem ? <Image source={{ uri: imagem }} style={styles.previewImage} /> : null}

          <TouchableOpacity style={styles.buttonSecundario} onPress={selecionarImagem}>
            <Text style={styles.buttonTextSecundario}>
              {imagem ? 'Trocar foto da viagem' : 'Adicionar foto da galeria'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.label}>Título *</Text>
          <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Ex.: Praia de Copacabana" />

          <Text style={styles.label}>Local</Text>
          <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="Ex.: Rio de Janeiro" />

          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Descreva a viagem"
            multiline
          />

          <Text style={styles.label}>Status</Text>
          <View style={styles.statusRow}>
            {['pendente', 'concluida'].map((opcao) => (
              <TouchableOpacity
                key={opcao}
                style={[styles.statusButton, status === opcao && styles.statusButtonActive]}
                onPress={() => setStatus(opcao)}
              >
                <Text style={[styles.statusText, status === opcao && styles.statusTextActive]}>
                  {opcao === 'pendente' ? 'Pendente' : 'Concluída'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Data de ida</Text>
          <TextInput style={styles.input} value={dataIda} onChangeText={setDataIda} placeholder="Ex.: 10/01/2027" />

          <Text style={styles.label}>Data de volta</Text>
          <TextInput style={styles.input} value={dataVolta} onChangeText={setDataVolta} placeholder="Ex.: 15/01/2027" />

          <Text style={styles.label}>Valor estimado</Text>
          <TextInput style={styles.input} value={valorEstimado} onChangeText={setValorEstimado} placeholder="Ex.: 680" keyboardType="numeric" />

          <Text style={styles.label}>Quantidade de pessoas</Text>
          <TextInput style={styles.input} value={qtdPessoas} onChangeText={setQtdPessoas} placeholder="Ex.: 2" keyboardType="numeric" />

          <Text style={styles.label}>Hospedagem</Text>
          <TextInput style={styles.input} value={hospedagem} onChangeText={setHospedagem} placeholder="Ex.: Hotel Copacabana Palace" />

          <Text style={styles.label}>Transporte</Text>
          <TextInput style={styles.input} value={transporte} onChangeText={setTransporte} placeholder="Ex.: Avião" />

          <TouchableOpacity style={styles.button} onPress={salvarViagem}>
            <Text style={styles.buttonText}>{modoEdicao ? 'Salvar alterações' : 'Salvar viagem'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonSecundario}
            onPress={() => {
              limparFormulario();
              setTela('lista');
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
          <Text style={styles.eyebrow}>Vamoa</Text>
          <Text style={styles.detailTitle}>{selecionada.title}</Text>
          <Image source={{ uri: selecionada.image }} style={styles.detailImage} />

          <View style={styles.detailCard}>
            {[
              ['Local', selecionada.location],
              ['Descrição', selecionada.description],
              ['Status', selecionada.status === 'concluida' ? 'Concluída' : 'Pendente'],
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

          <TouchableOpacity style={styles.buttonDanger} onPress={() => confirmarExclusao(selecionada.id)}>
            <Text style={styles.buttonText}>Excluir viagem</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonSecundario} onPress={() => setTela('lista')}>
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
          <Text style={styles.eyebrow}>Vamoa</Text>
          <Text style={styles.title}>Viagens em alta</Text>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            value={termoBusca}
            onChangeText={setTermoBusca}
            placeholder="Buscar destino, cidade ou descrição"
          />
        </View>

        <View style={styles.filterRow}>
          {['todos', 'pendente', 'concluida'].map((opcao) => (
            <TouchableOpacity
              key={opcao}
              style={[styles.filterButton, filtroAtual === opcao && styles.filterButtonActive]}
              onPress={() => setFiltroAtual(opcao)}
            >
              <Text style={[styles.filterButtonText, filtroAtual === opcao && styles.filterButtonTextActive]}>
                {opcao === 'todos' ? 'Todos' : opcao === 'pendente' ? 'Pendentes' : 'Concluídas'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <View style={styles.emptyState}>
            <ActivityIndicator size="large" color="#4f8ef7" />
            <Text style={styles.emptyTitle}>Carregando viagens...</Text>
          </View>
        ) : (
          <FlatList
            data={viagens}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>✈️</Text>
                <Text style={styles.emptyTitle}>Nenhuma viagem encontrada</Text>
                <Text style={styles.emptyText}>Ajuste os filtros ou cadastre uma nova viagem.</Text>
              </View>
            )}
            renderItem={({ item }) => (
              <TouchableOpacity activeOpacity={0.9} style={styles.card} onPress={() => abrirDetalhe(item.id)}>
                <Image source={{ uri: item.image }} style={styles.image} />

                <View style={styles.cardContent}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.location}>{item.location}</Text>
                    <View style={[styles.badge, item.status === 'concluida' && styles.badgeConcluida]}>
                      <Text style={[styles.badgeText, item.status === 'concluida' && styles.badgeTextConcluida]}>
                        {item.status === 'concluida' ? 'Concluída' : 'Pendente'}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.tripTitle}>{item.title}</Text>
                  <Text style={styles.meta}>{item.description || 'Sem descrição'} • {item.days || 'A combinar'}</Text>

                  <View style={styles.rowBetween}>
                    <Text style={styles.price}>{item.price || 'R$ 0'}</Text>
                    <TouchableOpacity style={styles.buttonSmall} onPress={() => abrirDetalhe(item.id)}>
                      <Text style={styles.buttonText}>Ver detalhe</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}

        <TouchableOpacity
          style={styles.floatButton}
          onPress={() => {
            limparFormulario();
            setTela('adicionar');
          }}
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
  searchContainer: {
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dfe7f3',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#14213d',
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#edf3ff',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#4f8ef7',
  },
  filterButtonText: {
    color: '#2b6fe6',
    fontWeight: '700',
    fontSize: 12,
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  list: {
    paddingBottom: 90,
  },
  errorText: {
    backgroundColor: '#fff1f2',
    color: '#c62828',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontWeight: '600',
  },
  previewImage: {
    width: '100%',
    height: 180,
    borderRadius: 18,
    marginBottom: 12,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#14213d',
    marginBottom: 8,
  },
  emptyText: {
    color: '#596579',
    fontSize: 14,
    textAlign: 'center',
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
    backgroundColor: '#fff2cc',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 999,
  },
  badgeConcluida: {
    backgroundColor: '#dff7e8',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#a66a00',
  },
  badgeTextConcluida: {
    color: '#19734f',
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
  buttonSmall: {
    marginTop: 16,
    backgroundColor: '#4f8ef7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
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
    maxWidth: '60%',
    textAlign: 'right',
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
  textArea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  statusRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
    marginBottom: 6,
  },
  statusButton: {
    flex: 1,
    backgroundColor: '#edf3ff',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  statusButtonActive: {
    backgroundColor: '#4f8ef7',
  },
  statusText: {
    fontWeight: '700',
    color: '#2b6fe6',
  },
  statusTextActive: {
    color: '#fff',
  },
});
