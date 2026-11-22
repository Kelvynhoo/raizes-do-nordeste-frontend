# Raízes do Nordeste — Protótipo Front-End (Opção B)

Protótipo funcional em HTML, CSS e JavaScript puros, com dados mockados,
desenvolvido para o Projeto Multidisciplinar (Trilha Front-End) da UNINTER.

## Arquivos
- `index.html` — estrutura das telas (Cardápio, Carrinho, Pagamento, Status do Pedido, Perfil).
- `styles.css` — identidade visual (mobile-first, responsivo para desktop/totem).
- `data.js` — dados mockados: unidades, cardápio e usuário de teste.
- `app.js` — lógica de navegação, carrinho, LGPD, pagamento simulado e status do pedido.

Não há dependências externas além das fontes do Google Fonts (carregadas via CDN).
Nenhum dado de pagamento real é processado — o "pagamento" é uma simulação local.

## Como testar localmente
Basta abrir o arquivo `index.html` diretamente no navegador (duplo clique),
ou rodar um servidor simples na pasta:

```bash
python3 -m http.server 8000
# depois acesse http://localhost:8000
```

## Links
- Protótipo publicado: https://raizes-nordeste-frontend.web.app
- Repositório: https://github.com/Kelvynhoo/raizes-do-nordeste-frontend

## Publicação
Publicado com Firebase Hosting (plano gratuito), a partir dos arquivos deste repositório.

## Fluxo para testar
Escolher unidade → adicionar itens → carrinho → aceitar os termos → pagamento (simulado) → acompanhar o status do pedido.
Cupons de teste: BEMVINDO10 e PONTOS (este exige login).
