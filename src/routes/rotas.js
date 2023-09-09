const bancoDigital = require('../controllers/bancoDigital');

const router = require('express').Router();

router.get('/contas', bancoDigital.listarContas);
router.post('/contas', bancoDigital.cadastrarConta);
router.put('/contas/:numeroConta/usuario', bancoDigital.atualizarUsuarioConta);
router.delete('/contas/:numeroConta', bancoDigital.removerConta);
router.post('/transacoes/depositar', bancoDigital.depositarSaldo);
router.post('/transacoes/sacar', bancoDigital.sacarSaldo);
router.post('/transacoes/transferir/', bancoDigital.transferirSaldo);
router.get('/contas/saldo', bancoDigital.exibirSaldo);
router.get('/contas/extrato', bancoDigital.exibirExtrato);

module.exports = router;