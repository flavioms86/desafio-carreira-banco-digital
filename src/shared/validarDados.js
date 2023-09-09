const validarDadosCliente = (nome, cpf, data_nascimento, telefone, email, senha) => {
    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return false;
    } else {
        return true;
    }
};

const validarContaValor = (numero_conta, valor) => {

    if (numero_conta && valor === 0) {

        return 0;

    } else if (!numero_conta || !valor) {

        return false;

    } else {

        return true;
    };

};

const verificarCpfEmail = (cpf, email, contas) => {
    const cliente = contas.find((cliente) => {
        return cliente.usuario.cpf === cpf || cliente.usuario.email === email;
    });

    return cliente;
};

const localizarConta = (numeroConta, contas) => {
    const usuarioConta = contas.findIndex((conta) => {
        return conta.numero === numeroConta;
    });
    return usuarioConta;

};

const retornarConta = (numeroConta, contas) => {
    const cliente = contas.find((cliente) => {
        return cliente.numero === numeroConta;
    });
    return cliente;
}

const verificarSaldo = (numeroConta, contas) => {
    const conta = retornarConta(numeroConta, contas);
    return conta.saldo;
};

const validarSenha = (senha, conta) => {

    return conta.usuario.senha === senha;

};

const verificarSaldoConta = (valor, conta) => {
    return valor <= conta.saldo;
}

module.exports = {
    validarDadosCliente,
    validarContaValor,
    verificarCpfEmail,
    localizarConta,
    verificarSaldo,
    retornarConta,
    validarSenha,
    verificarSaldoConta

}