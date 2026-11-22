// ============================================================
// Raízes do Nordeste — Dados mockados (Opção B: dados fictícios,
// sem processamento real de pagamento, conforme Roteiro Front-End)
// ============================================================

const UNITS = [
  { id: "recife-boa-viagem", name: "Recife — Boa Viagem", kitchen: "completa" },
  { id: "recife-centro",     name: "Recife — Centro",     kitchen: "completa" },
  { id: "sp-paulista",       name: "São Paulo — Av. Paulista", kitchen: "reduzida" },
  { id: "salvador-barra",    name: "Salvador — Barra",    kitchen: "completa" },
];

// isSeasonal: só aparece no período junino (simulado via flag, não data real)
// availableIn: lista de unidades onde o item existe (regras de negócio do estudo de caso)
const MENU = [
  {
    id: "tapioca-queijo", category: "Tapiocas", name: "Tapioca de queijo coalho",
    desc: "Tapioca crocante recheada com queijo coalho derretido.",
    price: 12.9, availableIn: ["recife-boa-viagem", "recife-centro", "sp-paulista", "salvador-barra"],
  },
  {
    id: "tapioca-carne-sol", category: "Tapiocas", name: "Tapioca de carne de sol",
    desc: "Carne de sol desfiada com manteiga de garrafa.",
    price: 16.5, availableIn: ["recife-boa-viagem", "recife-centro", "salvador-barra"],
  },
  {
    id: "cuscuz-recheado", category: "Cuscuz", name: "Cuscuz recheado",
    desc: "Cuscuz nordestino com frango desfiado e legumes.",
    price: 15.9, availableIn: ["recife-boa-viagem", "recife-centro", "sp-paulista", "salvador-barra"],
  },
  {
    id: "cuscuz-simples", category: "Cuscuz", name: "Cuscuz com manteiga",
    desc: "Receita tradicional da casa, no ponto de Dona Francisca.",
    price: 9.9, availableIn: ["recife-boa-viagem", "recife-centro"],
  },
  {
    id: "bolo-macaxeira", category: "Bolos", name: "Bolo de macaxeira",
    desc: "Fatia generosa, feita com coco fresco.",
    price: 9.5, availableIn: ["recife-boa-viagem", "recife-centro", "sp-paulista", "salvador-barra"],
  },
  {
    id: "tapioca-doce-junina", category: "Sazonais", name: "Tapioca doce de milho verde",
    desc: "Receita especial do período junino — disponível por tempo limitado.",
    price: 13.9, availableIn: ["recife-boa-viagem", "recife-centro", "salvador-barra"],
    seasonal: true,
  },
  {
    id: "suco-caju", category: "Sucos", name: "Suco de caju",
    desc: "Polpa 100% natural, sem adição de açúcar.",
    price: 8.0, availableIn: ["recife-boa-viagem", "recife-centro", "sp-paulista", "salvador-barra"],
  },
  {
    id: "cafe-completo", category: "Café da manhã", name: "Café da manhã completo",
    desc: "Tapioca, cuscuz, bolo, suco e café passado na hora.",
    price: 22.9, availableIn: ["recife-boa-viagem", "salvador-barra"],
  },
];

// Usuário mockado para simular login
const MOCK_USER = {
  name: "Maria Eduarda",
  email: "maria.eduarda@email.com",
  points: 140,
};


