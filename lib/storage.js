import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  filtroPadrao: '@vamoa:filtroPadrao',
  ultimaTela: '@vamoa:ultimaTela',
};

export async function carregarPreferencia(chave, fallback = null) {
  try {
    const valor = await AsyncStorage.getItem(chave);
    if (valor === null) {
      return fallback;
    }

    try {
      return JSON.parse(valor);
    } catch {
      return valor;
    }
  } catch (erro) {
    console.error('Erro ao carregar preferência:', erro);
    return fallback;
  }
}

export async function salvarPreferencia(chave, valor) {
  try {
    const texto = typeof valor === 'string' ? valor : JSON.stringify(valor);
    await AsyncStorage.setItem(chave, texto);
  } catch (erro) {
    console.error('Erro ao salvar preferência:', erro);
  }
}

export async function carregarFiltroPadrao() {
  return carregarPreferencia(STORAGE_KEYS.filtroPadrao, 'todos');
}

export async function salvarFiltroPadrao(filtroPadrao = 'todos') {
  await salvarPreferencia(STORAGE_KEYS.filtroPadrao, filtroPadrao);
}

export async function carregarUltimaTela() {
  return carregarPreferencia(STORAGE_KEYS.ultimaTela, 'lista');
}

export async function salvarUltimaTela(tela) {
  await salvarPreferencia(STORAGE_KEYS.ultimaTela, tela);
}