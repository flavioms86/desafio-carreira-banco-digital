const gerarNumeroConta = (contas) => {

    let gerador = 1;
    let existeUsuario = true;

    while (existeUsuario) {

        const numero = contas.findIndex((conta) => {
            return parseInt(conta.numero) === gerador;
        });

        if (numero === -1) {
            existeUsuario = false;
        } else {
            gerador++;
        }

    }

    return gerador;
};

module.exports = gerarNumeroConta;