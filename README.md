# API Rest - Banco Digital Cubos Bank

Projeto acadêmico do curso de Back-end da Cubos Academy. 

API Rest desenvolvida para representar as seguintes operações diárias de um sistema bancário:

* Criar conta bancária
* Listar contas bancárias
* Atualizar os dados do usuário da conta bancária
* Excluir uma conta bancária
* Depósitar em uma conta bancária
* Sacar de uma conta bancária
* Transferir valores entre contas bancárias
* Consultar saldo da conta bancária
* Emitir extrato bancário

Todos os dados serão armazenados localmente no arquivo bancodigital.json

## 🚀 Começando

Essas instruções permitirão que você obtenha uma cópia do projeto em operação na sua máquina local para fins de desenvolvimento e testes.

Consulte **[Implantação](#-implanta%C3%A7%C3%A3o)** para saber como implantar o projeto.

### 📋 Pré-requisitos

Antes de executar este projeto no seu computador, você precisará de alguns pacotes instalados como:

```
Node.js - Para executar os códigos Javascript fora do navegador;
Express - Pacote do Node.js para subir um servidor http localmente;
Date-fns - Para trabalhar com o registro de datas nas transferências entre contas.
Insomnia ou Postman - Para testar a API com requisições via GET, POST, PUT e DELETE.
```

### 🔧 Instalação


Para executar o projeto no seu ambiente de desenvolvimento em execução, primeiramente faça o clone desse repositório em sua maquina local na pasta desejada:

```
git clone https://github.com/flavioms86/desafio-carreira-banco-digital.git
```

Depois abra o projeto em seu editor de códigos, abra o terminal e digite o seguinte comando para a instalação dos pacotes e dependencias necessárias:

```
npm install
```

Após a instalação, o servidor pode ser executado via nodemon (para não precisar restartar o servidor depois de alguma alteração):

```
npm run dev
```

Ou pelo node:

```
node .\src\index.js
```

## ⚙️ Estrutura do projeto

<img src="./src/images/estrutura.png" alt="Estrutura do Projeot">

### 🔩 Endpoints da API Rest

Para testar a API use Insomnia ou Postman para fazer as requisições.

#### Listar usuários:

#### `GET` `/contas?senha_banco=Cubos123Bank`

Retorno (Aqui resumido para fins de exemplo):

```json
[
	{
		"numero": "1",
		"saldo": 220333,
		"usuario": {
			"nome": "Foo Bar",
			"cpf": "00011122233",
			"data_nascimento": "2021-03-15",
			"telefone": "71999998888",
			"email": "foo@bar.com",
			"senha": "1234"
		}
	}	
]
```

#### Criar conta bancária:

#### `POST` `/contas`

Requisição via json body.

```json
{
	"nome": "Foo Bar",
	"cpf": "00011122233",	
	"data_nascimento": "2021-03-15",
	"telefone": "71999998888",
	"email": "foo@bar.com",
	"senha": "1234"
}

```
Retorno:

```
204 No Content
```

### ⌨️ E testes de estilo de codificação

Explique que eles verificam esses testes e porquê.

```
Dar exemplos
```

## 📦 Implantação

Adicione notas adicionais sobre como implantar isso em um sistema ativo

## 🛠️ Construído com

Mencione as ferramentas que você usou para criar seu projeto

* [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - O framework web usado
* [Maven](https://maven.apache.org/) - Gerente de Dependência
* [ROME](https://rometools.github.io/rome/) - Usada para gerar RSS

## 🖇️ Colaborando

Por favor, leia o [COLABORACAO.md](https://gist.github.com/usuario/linkParaInfoSobreContribuicoes) para obter detalhes sobre o nosso código de conduta e o processo para nos enviar pedidos de solicitação.

## 📌 Versão

Nós usamos [SemVer](http://semver.org/) para controle de versão. Para as versões disponíveis, observe as [tags neste repositório](https://github.com/suas/tags/do/projeto). 

## ✒️ Autores

Mencione todos aqueles que ajudaram a levantar o projeto desde o seu início

* **Um desenvolvedor** - *Trabalho Inicial* - [umdesenvolvedor](https://github.com/linkParaPerfil)
* **Fulano De Tal** - *Documentação* - [fulanodetal](https://github.com/linkParaPerfil)

Você também pode ver a lista de todos os [colaboradores](https://github.com/usuario/projeto/colaboradores) que participaram deste projeto.

## 📄 Licença

Este projeto está sob a licença (sua licença) - veja o arquivo [LICENSE.md](https://github.com/usuario/projeto/licenca) para detalhes.

## 🎁 Expressões de gratidão

* Conte a outras pessoas sobre este projeto 📢;
* Convide alguém da equipe para uma cerveja 🍺;
* Um agradecimento publicamente 🫂;
* etc.


---
⌨️ com ❤️ por [Armstrong Lohãns](https://gist.github.com/lohhans) 😊
