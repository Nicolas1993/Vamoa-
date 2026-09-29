import AsyncStorage from '@react-native-async-storage/async-storage';
import { VIAGENS_INICIAIS } from './viagens';

const STORAGE_KEY = '@vamoa:viagens';

export async function carregarViagens() {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (json !== null) {
      return JSON.parse(json);
    }
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(VIAGENS_INICIAIS));
    return VIAGENS_INICIAIS;
  } catch (erro) {
    console.error('Erro ao carregar viagens:', erro);
    return VIAGENS_INICIAIS;
  }
}

export async function salvarViagens(viagens) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(viagens));
  } catch (erro) {
    console.error('Erro ao salvar viagens:', erro);
  }
}

export async function adicionarViagem(novaViagem) {
  const viagens = await carregarViagens();
  const viagemComId = { ...novaViagem, id: String(Date.now()) };
  const atualizadas = [...viagens, viagemComId];
  await salvarViagens(atualizadas);
  return atualizadas;
}

export async function buscarViagem(id) {
  const viagens = await carregarViagens();
  return viagens.find((v) => v.id === id);
}

export async function excluirViagem(id) {
  const viagens = await carregarViagens();
  const atualizadas = viagens.filter((v) => v.id !== id);
  await salvarViagens(atualizadas);
  return atualizadas;
}