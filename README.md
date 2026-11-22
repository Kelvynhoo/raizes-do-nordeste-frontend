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

## Como publicar (para gerar o link público exigido no roteiro)

### Opção 1 — GitHub Pages (mais simples)
1. Crie um repositório novo no GitHub (ex.: `raizes-do-nordeste-frontend`).
2. Envie os 4 arquivos (`index.html`, `styles.css`, `data.js`, `app.js`) para a raiz do repositório.
3. No repositório, vá em **Settings → Pages**.
4. Em "Source", selecione a branch `main` e a pasta `/root`, depois clique em **Save**.
5. Aguarde 1–2 minutos. O link público aparecerá na própria página de Settings → Pages,
   no formato `https://SEU-USUARIO.github.io/raizes-do-nordeste-frontend/`.
6. Cole esse link e o link do repositório na seção "6. Entrega Técnica" do documento principal.

### Opção 2 — Vercel ou Netlify (arrastar e soltar)
1. Crie uma conta gratuita em vercel.com ou netlify.com (pode entrar com sua conta do GitHub).
2. Escolha "novo projeto" / "Add new site" → "Deploy manually" (Netlify) ou importe a pasta (Vercel).
3. Arraste a pasta com os 4 arquivos para a área indicada.
4. Em poucos segundos a plataforma gera uma URL pública (ex.: `https://raizes-nordeste.netlify.app`).
5. Cole essa URL na seção "6. Entrega Técnica" do documento principal.

## Checklist antes de entregar
- [ ] Testei o link publicado em uma aba anônima (sem estar logado em nada) para confirmar que está público.
- [ ] Testei o fluxo completo no link publicado: escolher unidade → adicionar itens → carrinho →
      aceitar termos → pagamento → status do pedido.
- [ ] Colei o link do repositório e o link publicado na seção 6 do `Projeto_FrontEnd_Raizes_do_Nordeste.docx`.
- [ ] Preenchi a capa do documento (nome, RU, polo, semestre).
- [ ] Reconverti o `.docx` para PDF único antes de enviar no AVA-Univirtus.
