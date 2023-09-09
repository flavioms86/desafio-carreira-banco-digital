const express = require('express');
const router = require('./routes/rotas');
const { verificarUsuario } = require('./middlewares/autenticacao');

const app = express();

app.use(express.json());
app.use(verificarUsuario);
app.use(router);


app.listen(3000);