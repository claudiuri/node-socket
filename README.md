# node-socket

## Requisistos

* [NodeJs](https://nodejs.org/en/)

## Bibliotecas

* [ws](https://www.npmjs.com/package/ws) - Utilizada para criar um websocket

## Instalação

1. Faça um clone desse repositório;
2. Entre na pasta `cd node-socket`;
3. Execute `npm install` dentro da pasta para instalar as dependências ;



## Execução

Execute no terminal o seguinte comando para criar o servidor:

```bash
$ node servidor.js
```

Abra outro terminal e execute o seguinte comando para criar as vendas

```bash
$ node cliente-funcionario.js
```

Após excutar aparecerá a mensagem `OK` informando que foi adicionado com sucesso


Abra outro terminal e execute o seguinte comando para fazer as listagem do gerente
```bash
$ node cliente-gerente.js
```

```bash
A vendedor Bart vendeu 3 produtos
-------------------------------------------------------------------------------------------------------
A loja apple teve 3 vendas
-------------------------------------------------------------------------------------------------------
Vendas da loja apple de 28/11/2022 até 29/11/2022)
Código: 0001 | Vendedor Bart | Loja apple | Valor 1000 | Data 28/11/2022
Código: 0002 | Vendedor Bart | Loja apple | Valor 1000 | Data 29/11/2022
-------------------------------------------------------------------------------------------------------
O melhor vendedor Carl total de compras foram de 5010 compras: [{"code":"0001","seller":"Carl","store":"xiomi","date":"2022-11-30T03:00:00.000Z","ammount":5000},{"code":"0002","seller":"Carl","store":"xiomi","date":"2022-11-30T03:00:00.000Z","ammount":10}]
-------------------------------------------------------------------------------------------------------
Melhor loja xiomi total de compras foram de 5010 compras: [{"code":"0001","seller":"Carl","store":"xiomi","date":"2022-11-30T03:00:00.000Z","ammount":5000},{"code":"0002","seller":"Carl","store":"xiomi","date":"2022-11-30T03:00:00.000Z","ammount":10}]
-------------------------------------------------------------------------------------------------------
```


