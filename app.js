/*************************************************************************
 * Objetivo: Criar uma API para manipulação de dados de Estados e Cidades 
 * Autor: Moreno
 * Data: 10/03/2023
 * Versão: 1.0
 * 
 *************************************************************************/


/**
 * Express - dependencia do Node, que permite a integração entre o protocolo http com o codigo
 *          npm install express --save
 * 
 * Cors - Gerenciador de permissões para o protocolo HTTP
 *          npm install cors --save
 * 
 * Body-parser - É uma dependecia que permite manipular dados enviados pelo body da requisição
 *          npm install body-parser --save
 * 
 **/

//  Import das dependencias para criar a API 

// responsavel pelas requisições 
const express = require('express')
    // Responsavel pelas permissões das requisições 
const cors = require('cors')
    // Responsavel pela manipulação do body da requisição 
const bodyParser = require('body-parser');
// Import do arquivo de funções 
const estadosCidades = require('./modulo/estados_cidades')

const { request, response } = require('express');


// Cria um objeto com as imformações da classe express
const app = express();

// Define as permissões no header da API
app.use((request, response, next) => {
    // Permite gerenciar a origem das requisições da API
    // * - significa que a API será publica
    // IP - se colocar o IP, a API somente responderá para aquela maquina
    response.header('Access-Control-Allow-Origin', '*')

    // Permite gerenciar quais verbos (metodos) poderão fazer requisições
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    // Ativa no cors das requisições as permissões estabelecidas
    app.use(cors())

    next()
})

// endPoints

//  endPoints para Listar os Estados
app.get('/estados', cors(), async function(request, response, next) {

    
        // chama a função que retorna as estados
    let listaDeEstados = estadosCidades.getListaDeEstados();
    // Tratamento para validar se a função realizou o processamento
    if (listaDeEstados) {
        //Retorna o Json e o status code
        response.json(listaDeEstados)
        response.status(200)
    } else {
        response.status(500)
    }
})

// endPoint: Lista as caracteristicas do estados pela sigla
    app.get('/estado/sigla/:uf', cors(), async function(request, response, next) {
    // :uf - e uma variavel que sera utilizada para passagem de valores, na URL da requisição

    // Recebe o valor da variavel UF, que sera ecaminhada na URL da requisição
    let siglaEstado = request.params.uf;

    if (siglaEstado == '' || siglaEstado == undefined || siglaEstado.length != 2 || !isNaN(siglaEstado))  
    {
        response.status(400)
        response.json({ menssage: "Não é possivel processar a requisição pois a sigla do estado não foi informada ou não a tende a quantidade de caracteres (2 digitos)" })
    }else{
        //chama a função que filtra o estado pela sigla
        let estado = estadosCidades.getDadosEstados(siglaEstado)
        
        // Valida se houve retorno valido da função
        if(estado){
        response.status(200) // Estado encontrado
        response.json(estado)
    }else{

        response.status(400) // Estado não encontrado
        response.json()
    }

    
}})

// Permite carregar os endPointas criados e aguarda as requisições pelo protocolo http na porta 8080
app.listen(8080, function() {
    console.log('Servidor aguardando requisições na porta 8080')
})