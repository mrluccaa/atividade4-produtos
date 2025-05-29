const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: 'segredo123',
  resave: false,
  saveUninitialized: true
}));

let produtos = [];

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.post('/login', (req, res) => {
  const { username } = req.body;
  req.session.user = username;
  res.cookie('ultimoAcesso', new Date().toLocaleString());
  res.redirect('/cadastro');
});

app.get('/cadastro', (req, res) => {
  if (!req.session.user) {
    return res.send('<h2>Você precisa fazer login. <a href="/">Voltar</a></h2>');
  }
  res.sendFile(path.join(__dirname, 'views', 'cadastro.html'));
});

app.post('/cadastrar', (req, res) => {
  if (!req.session.user) return res.send('Acesso negado.');
  produtos.push(req.body);
  res.redirect('/cadastro');
});

app.get('/produtos', (req, res) => {
  if (!req.session.user) return res.send('Acesso negado.');

  let html = `<h2>Bem-vindo, ${req.session.user}</h2>`;
  html += `<p>Último acesso: ${req.cookies.ultimoAcesso || 'Primeira vez!'}</p>`;
  html += `<h3>Produtos Cadastrados:</h3><table border="1"><tr>
    <th>Código</th><th>Descrição</th><th>Preço Custo</th>
    <th>Preço Venda</th><th>Validade</th><th>Qtd</th><th>Fabricante</th></tr>`;
  produtos.forEach(p => {
    html += `<tr><td>${p.codigo}</td><td>${p.descricao}</td><td>${p.precoCusto}</td>
             <td>${p.precoVenda}</td><td>${p.validade}</td><td>${p.qtd}</td><td>${p.fabricante}</td></tr>`;
  });
  html += `</table><br><a href="/cadastro">Voltar</a>`;
  res.send(html);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
