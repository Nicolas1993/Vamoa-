import AsyncStorage from '@react-native-async-storage/async-storage';
import { viagensIniciais, Viagem } from '../data/viagens';

const STORAGE_KEY = '@vamoa:viagens';

export async function carregarViagens(): Promise<Viagem[]> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (json !== null) {
      return JSON.parse(json);
    }
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(viagensIniciais));
    return viagensIniciais;
  } catch (erro) {
    console.error('Erro ao carregar viagens:', erro);
    return viagensIniciais;
  }
}

export async function salvarViagens(viagens: Viagem[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(viagens));
  } catch (erro) {
    console.error('Erro ao salvar viagens:', erro);
  }
}

export async function adicionarViagem(novaViagem: Omit<Viagem, 'id'>): Promise<Viagem[]> {
  const viagens = await carregarViagens();
  const viagemComId: Viagem = { ...novaViagem, id: String(Date.now()) };
  const atualizadas = [...viagens, viagemComId];
  await salvarViagens(atualizadas);
  return atualizadas;
}

export async function buscarViagem(id: string): Promise<Viagem | undefined> {
  const viagens = await carregarViagens();
  return viagens.find((v) => v.id === id);
}