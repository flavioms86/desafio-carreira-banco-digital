const gerarNumeroConta = require("../shared/gerarNumeroConta");
const validarDados = require("../shared/validarDados");
const formatarData = require("../shared/registroData");
const fs = require('fs/promises');
let { contas, depositos, saques, transferencias } = require("../data/bancodedados");


const listarContas = async (req, res) => {

    try {

        const contasCadastradas = await fs.readFile('./src/data/bancodigital.json');

        const contasCadastradasObj = JSON.parse(contasCadastradas);

        return res.status(200).json(contasCadastradasObj.contas);

    } catch (error) {

        return res.status(500).json({ 'mensagem': 'Erro interno.' });
    }

};

const cadastrarConta = async (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!validarDados.validarDadosCliente(nome, cpf, data_nascimento, telefone, email, senha)) {

        return res.status(400).json({ 'mensagem': 'O nome, cpf, data de nascimento, telefone, email e senha devem ser informados.' });

    };

    try {

        const contasCadastradas = await fs.readFile('./src/data/bancodigital.json');

        const contasCadastradasObj = JSON.parse(contasCadastradas);

        if (validarDados.verificarCpfEmail(cpf, email, contasCadastradasObj.contas)) {

            return res.status(400).json({ 'mensagem': 'Já existe uma conta com o cpf ou e-mail informado!' });
        };

        const novaConta = {

            "numero": gerarNumeroConta(contasCadastradasObj.contas).toString(),
            "saldo": 0,
            "usuario": {
                nome,
                cpf,
                data_nascimento,
                telefone,
                email,
                senha
            }
        };

        contasCadastradasObj.contas.push(novaConta);

        await fs.writeFile('./src/data/bancodigital.json', JSON.stringify(contasCadastradasObj))

        return res.status(204).json();

    } catch (error) {

        return res.status(500).json({ 'mensagem': 'Erro interno.' });

    }

};

const atualizarUsuarioConta = async (req, res) => {
    const { numeroConta } = req.params;
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!validarDados.validarDadosCliente(nome, cpf, data_nascimento, telefone, email, senha)) {

        return res.status(400).json({ 'mensagem': 'O nome, cpf, data de nascimento, telefone, email e senha devem ser informados.' });

    };

    const contasCadastradas = await fs.readFile('./src/data/bancodigital.json');

    const contasCadastradasObj = JSON.parse(contasCadastradas);

    const conta = validarDados.retornarConta(numeroConta, contasCadastradasObj.contas);

    if (!conta) {

        return res.status(404).json({ 'mensagem': 'Conta inexistente!' });

    };

    const outrosClientes = contasCadastradasObj.contas.filter((contas) => {
        return contas.numero !== numeroConta
    });

    if (validarDados.verificarCpfEmail(cpf, email, outrosClientes)) {

        return res.status(400).json({ 'mensagem': 'Já existe uma conta com o cpf ou e-mail informado!' });

    };

    conta.usuario.nome = nome;
    conta.usuario.cpf = cpf;
    conta.usuario.data_nascimento = data_nascimento;
    conta.usuario.telefone = telefone;
    conta.usuario.email = email;
    conta.usuario.senha = senha;

    await fs.writeFile('./src/data/bancodigital.json', JSON.stringify(contasCadastradasObj));

    return res.status(204).json();
};

const removerConta = (req, res) => {
    const { numeroConta } = req.params;

    if (validarDados.localizarConta(numeroConta, contas) === -1) {

        return res.status(404).json({ 'mensagem': 'Conta inexistente!' });

    };

    if (validarDados.verificarSaldo(numeroConta, contas) !== 0) {

        return res.status(400).json({ 'mensagem': 'A conta só pode ser removida se o saldo for zero!' });
    };

    contas = contas.filter((contas) => {
        return contas.numero !== numeroConta;
    });

    return res.status(204).json();

};

const depositarSaldo = (req, res) => {

    const { numero_conta, valor } = req.body;

    if (validarDados.validarContaValor(numero_conta, valor) === 0) {

        return res.status(400).json({ 'mensagem': 'O valor a ser depositado deverá ser maior que zero.' });

    } else if (!validarDados.validarContaValor(numero_conta, valor)) {

        return res.status(400).json({ 'mensagem': 'O número da conta e o valor deverá ser informado.' });

    };

    if (validarDados.localizarConta(numero_conta, contas) === -1) {

        return res.status(404).json({ 'mensagem': 'Conta inexistente.' });

    };

    const conta = validarDados.retornarConta(numero_conta, contas);

    conta.saldo += valor;

    const registroDeposito = {
        data: formatarData(new Date()),
        numero_conta,
        valor
    };

    depositos.push(registroDeposito);

    return res.status(204).json();

};

const sacarSaldo = (req, res) => {
    const { numero_conta, valor, senha } = req.body;

    if (validarDados.validarContaValor(numero_conta, valor) === 0 && senha) {

        return res.status(400).json({ 'mensagem': 'O valor a ser sacado deverá ser maior que zero.' });

    } else if (!validarDados.validarContaValor(numero_conta, valor) || !senha) {

        return res.status(400).json({ 'mensagem': 'O número da conta, valor e senha são obrigatórios!' });

    };

    const conta = validarDados.retornarConta(numero_conta, contas);

    if (!conta) {
        return res.status(404).json({ 'mensagem': 'Conta inexistente!' });
    };

    if (!validarDados.validarSenha(senha, conta)) {
        return res.status(401).json({ 'mensagem': 'A senha informada está incorreta.' });
    };

    if (!validarDados.verificarSaldoConta(valor, conta)) {
        return res.status(400).json({ 'mensagem': 'Saldo insuficiente!' });
    };

    conta.saldo -= valor;

    const registroSaque = {
        data: formatarData(new Date()),
        numero_conta,
        valor
    };

    saques.push(registroSaque);

    return res.status(204).json();
};

const transferirSaldo = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, senha, valor } = req.body;

    if (!numero_conta_origem || !numero_conta_destino || !senha) {

        return res.status(400).json({ 'mensagem': 'O número da conta de origem, destino, valor e senha são obrigatórios!' });

    } else if (valor <= 0) {

        return res.status(400).json({ 'mensagem': 'O valor a ser transferido deverá ser maior que zero.' });

    };

    const contaOrigem = validarDados.retornarConta(numero_conta_origem, contas);

    if (!contaOrigem) {

        return res.status(404).json({ 'mensagem': 'A conta de orgigem não existe.' });
    };

    const contaDestino = validarDados.retornarConta(numero_conta_destino, contas);

    if (!contaDestino) {

        return res.status(404).json({ 'mensagem': 'A conta de destino não existe.' });
    };

    if (!validarDados.validarSenha(senha, contaOrigem)) {

        return res.status(401).json({ 'mensagem': 'A senha informada está incorreta.' });
    };

    if (!validarDados.verificarSaldoConta(valor, contaOrigem)) {

        return res.status(400).json({ 'mensagem': 'Saldo insuficiente!' });
    };

    contaOrigem.saldo -= valor;

    contaDestino.saldo += valor;

    const registroTransferencia = {
        data: formatarData(new Date()),
        numero_conta_origem,
        numero_conta_destino,
        valor
    };

    transferencias.push(registroTransferencia);

    return res.status(204).json();

};

const exibirSaldo = (req, res) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) {
        return res.status(400).json({ 'mensagem': 'O número da conta e senha devem ser informados.' });
    };

    const conta = validarDados.retornarConta(numero_conta, contas);

    if (!conta) {
        return res.status(404).json({ 'mensagem': 'Conta inexistente!' });
    };

    if (!validarDados.validarSenha(senha, conta)) {
        return res.status(401).json({ 'mensagem': 'A senha informada está incorreta.' })
    };

    return res.status(200).json({ 'saldo': conta.saldo });
};

const exibirExtrato = (req, res) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) {
        return res.status(400).json({ 'mensagem': 'O número da conta e senha devem ser informados.' });
    };

    const conta = validarDados.retornarConta(numero_conta, contas);

    if (!conta) {
        return res.status(404).json({ 'mensagem': 'Conta inexistente!' });
    };

    if (!validarDados.validarSenha(senha, conta)) {
        return res.status(401).json({ 'mensagem': 'A senha informada está incorreta.' })
    };

    const depositosNaConta = depositos.filter(deposito => deposito.numero_conta === numero_conta);
    const saquesNaConta = saques.filter(saque => saque.numero_conta === numero_conta);
    const transferenciasEnviadas = transferencias.filter(transferencia => transferencia.numero_conta_origem === numero_conta);
    const transferenciasRecebidas = transferencias.filter(transferencia => transferencia.numero_conta_destino === numero_conta);

    const extratoConta = {
        depositos: depositosNaConta,
        saques: saquesNaConta,
        transferenciasEnviadas,
        transferenciasRecebidas
    }

    return res.status(200).json(extratoConta);
}

module.exports = {
    listarContas,
    cadastrarConta,
    atualizarUsuarioConta,
    removerConta,
    depositarSaldo,
    sacarSaldo,
    transferirSaldo,
    exibirSaldo,
    exibirExtrato
}