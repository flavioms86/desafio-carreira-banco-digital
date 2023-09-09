const verificarUsuario = (req, res, next) => {
    const { senha_banco } = req.query;

    if (!senha_banco) {

        return res.status(400).json({ 'mensagem': 'A senha do banco deve ser informada.' });

    } else if (senha_banco === 'Cubos123Bank') {

        next();

    } else {

        return res.status(403).json({ 'mensagem': 'A senha do banco informada é inválida' });

    };
};

module.exports = {
    verificarUsuario
}