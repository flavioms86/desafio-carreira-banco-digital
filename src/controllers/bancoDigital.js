const gerarNumeroConta = require("../shared/gerarNumeroConta");
const validarDados = require("../shared/validarDados");
const formatarData = require("../shared/registroData");
const fs = require('fs/promises');

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

    try {

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

    } catch (error) {
        return res.status(500).json({ 'mensagem': 'Erro interno.' });
    }

};

const removerConta = async (req, res) => {
    const { numeroConta } = req.params;

    try {

        const contasCadastradas = await fs.readFile('./src/data/bancodigital.json');

        const contasCadastradasObj = JSON.parse(contasCadastradas);

        if (validarDados.localizarConta(numeroConta, contasCadastradasObj.contas) === -1) {

            return res.status(404).json({ 'mensagem': 'Conta inexistente!' });
        };

        if (validarDados.verificarSaldo(numeroConta, contasCadastradasObj.contas) !== 0) {

            return res.status(400).json({ 'mensagem': 'A conta só pode ser removida se o saldo for zero!' });
        };

        contasCadastradasObj.contas = contasCadastradasObj.contas.filter((contas) => {
            return contas.numero !== numeroConta;
        });

        await fs.writeFile('./src/data/bancodigital.json', JSON.stringify(contasCadastradasObj));

        return res.status(204).json();

    } catch (error) {
        return res.status(500).json({ 'mensagem': 'Erro interno.' });
    }

};

const depositarSaldo = async (req, res) => {

    const { numero_conta, valor } = req.body;

    if (validarDados.validarContaValor(numero_conta, valor) === 0) {

        return res.status(400).json({ 'mensagem': 'O valor a ser depositado deverá ser maior que zero.' });

    } else if (!validarDados.validarContaValor(numero_conta, valor)) {

        return res.status(400).json({ 'mensagem': 'O número da conta e o valor deverá ser informado.' });

    };

    try {

        const contasCadastradas = await fs.readFile('./src/data/bancodigital.json');

        const contasCadastradasObj = JSON.parse(contasCadastradas);

        if (validarDados.localizarConta(numero_conta, contasCadastradasObj.contas) === -1) {

            return res.status(404).json({ 'mensagem': 'Conta inexistente.' });

        };

        const conta = validarDados.retornarConta(numero_conta, contasCadastradasObj.contas);

        conta.saldo += valor;

        const registroDeposito = {
            data: formatarData(new Date()),
            numero_conta,
            valor
        };

        contasCadastradasObj.depositos.push(registroDeposito);

        await fs.writeFile('./src/data/bancodigital.json', JSON.stringify(contasCadastradasObj));

        return res.status(204).json();

    } catch (error) {
        return res.status(500).json({ 'mensagem': 'Erro interno.' });
    }


};

const sacarSaldo = async (req, res) => {
    const { numero_conta, valor, senha } = req.body;

    if (validarDados.validarContaValor(numero_conta, valor) === 0 && senha) {

        return res.status(400).json({ 'mensagem': 'O valor a ser sacado deverá ser maior que zero.' });

    } else if (!validarDados.validarContaValor(numero_conta, valor) || !senha) {

        return res.status(400).json({ 'mensagem': 'O número da conta, valor e senha são obrigatórios!' });

    };

    try {

        const contasCadastradas = await fs.readFile('./src/data/bancodigital.json');

        const contasCadastradasObj = JSON.parse(contasCadastradas);

        const conta = validarDados.retornarConta(numero_conta, contasCadastradasObj.contas);

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

        contasCadastradasObj.saques.push(registroSaque);

        await fs.writeFile('./src/data/bancodigital.json', JSON.stringify(contasCadastradasObj));

        return res.status(204).json();

    } catch (error) {
        return res.status(500).json({ 'mensagem': 'Erro interno.' });
    }

};

const transferirSaldo = async (req, res) => {
    const { numero_conta_origem, numero_conta_destino, senha, valor } = req.body;

    if (!numero_conta_origem || !numero_conta_destino || !senha) {

        return res.status(400).json({ 'mensagem': 'O número da conta de origem, destino, valor e senha são obrigatórios!' });

    } else if (valor <= 0) {

        return res.status(400).json({ 'mensagem': 'O valor a ser transferido deverá ser maior que zero.' });

    };

    try {

        const contasCadastradas = await fs.readFile('./src/data/bancodigital.json');

        const contasCadastradasObj = JSON.parse(contasCadastradas);

        const contaOrigem = validarDados.retornarConta(numero_conta_origem, contasCadastradasObj.contas);

        if (!contaOrigem) {

            return res.status(404).json({ 'mensagem': 'A conta de origem não existe.' });
        };

        const contaDestino = validarDados.retornarConta(numero_conta_destino, contasCadastradasObj.contas);

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

        contasCadastradasObj.transferencias.push(registroTransferencia);

        await fs.writeFile('./src/data/bancodigital.json', JSON.stringify(contasCadastradasObj));

        return res.status(204).json();

    } catch (error) {
        return res.status(500).json({ 'mensagem': 'Erro interno.' });
    }
};

const exibirSaldo = async (req, res) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) {
        return res.status(400).json({ 'mensagem': 'O número da conta e senha devem ser informados.' });
    };

    try {

        const contasCadastradas = await fs.readFile('./src/data/bancodigital.json');

        const contasCadastradasObj = JSON.parse(contasCadastradas);

        const conta = validarDados.retornarConta(numero_conta, contasCadastradasObj.contas);

        if (!conta) {
            return res.status(404).json({ 'mensagem': 'Conta inexistente!' });
        };

        if (!validarDados.validarSenha(senha, conta)) {
            return res.status(401).json({ 'mensagem': 'A senha informada está incorreta.' })
        };

        return res.status(200).json({ 'saldo': conta.saldo });

    } catch (error) {
        return res.status(500).json({ 'mensagem': 'Erro interno.' });
    }
};

const exibirExtrato = async (req, res) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) {
        return res.status(400).json({ 'mensagem': 'O número da conta e senha devem ser informados.' });
    };

    try {

        const contasCadastradas = await fs.readFile('./src/data/bancodigital.json');

        const contasCadastradasObj = JSON.parse(contasCadastradas);

        const conta = validarDados.retornarConta(numero_conta, contasCadastradasObj.contas);

        if (!conta) {
            return res.status(404).json({ 'mensagem': 'Conta inexistente!' });
        };

        if (!validarDados.validarSenha(senha, conta)) {
            return res.status(401).json({ 'mensagem': 'A senha informada está incorreta.' })
        };

        const depositosNaConta = contasCadastradasObj.depositos.filter(deposito => deposito.numero_conta === numero_conta);
        const saquesNaConta = contasCadastradasObj.saques.filter(saque => saque.numero_conta === numero_conta);
        const transferenciasEnviadas = contasCadastradasObj.transferencias.filter(transferencia => transferencia.numero_conta_origem === numero_conta);
        const transferenciasRecebidas = contasCadastradasObj.transferencias.filter(transferencia => transferencia.numero_conta_destino === numero_conta);

        const extratoConta = {
            depositos: depositosNaConta,
            saques: saquesNaConta,
            transferenciasEnviadas,
            transferenciasRecebidas
        }

        return res.status(200).json(extratoConta);

    } catch (error) {
        return res.status(500).json({ 'mensagem': 'Erro interno.' });
    }

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