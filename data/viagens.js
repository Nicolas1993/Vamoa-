export type Viagem = {
  id: string;
  destino: string;
  dataIda: string;
  dataVolta: string;
  qtdPessoas: number;
  hospedagem: string;
  transporte: string;
  valorEstimado: number;
};

export const viagensIniciais: Viagem[] = [
  {
    id: '1',
    destino: 'Ubatuba - SP',
    dataIda: '12/12/2026',
    dataVolta: '15/12/2026',
    qtdPessoas: 4,
    hospedagem: 'Pousada do Sol',
    transporte: 'Carro',
    valorEstimado: 850,
  },
  {
    id: '2',
    destino: 'Campos do Jordão - SP',
    dataIda: '20/01/2027',
    dataVolta: '23/01/2027',
    qtdPessoas: 2,
    hospedagem: 'Hotel Alpino',
    transporte: 'Ônibus',
    valorEstimado: 1200,
  },
  {
    id: '3',
    destino: 'Belo Horizonte - MG',
    dataIda: '02/02/2027',
    dataVolta: '06/02/2027',
    qtdPessoas: 3,
    hospedagem: 'Airbnb Centro',
    transporte: 'Avião',
    valorEstimado: 1900,
  },
];