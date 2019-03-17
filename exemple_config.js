/*
Copy this file to config.js

Thiago Bignotto
03/14/2019 : 22h56
*/
var appConfig = {};

appConfig.testing = {
    'envName' : 'testing',
    'hashSecret' : 'nonono',
    'originFolder' : '/mnt/c/xml/nao_processado', //pasta onde os xmls são criados
    'destinationFolder' : '/mnt/E/FTP/nao_processado',
    'ftpFolder' : '', //pasta para enviar arquivos xmls
    'time' : 1000 * 5, //tempo para verificar a pasta por novos xmls
    'ftpServer' : 'localhost',
    'ftpPort' : '21',
    'ftpUser' : 'anonymous',
    'ftpPass' : ''
};

appConfig.production = {
    'envName' : 'production',
    'hashSecret' : 'nonono',
    'originFolder' : '/mnt/c/xml/nao_processado', //pasta onde os xmls são criados
    'destinationFolder' : '/mnt/E/FTP/nao_processado',
    'ftpFolder' : 'nao_processado', //pasta para enviar arquivos xmls
    'time' : 1000 * 5, //tempo para verificar a pasta por novos xmls
    'ftpServer' : '',
    'ftpPort' : 2121,
    'ftpUser' : '',
    'ftpPass' : ''
};

//determining wich config variables to export based on the environment variable
var chosenConfig = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

//check if there is a config variables for the chosen environment otherwise default testing environment
var configToExport = typeof(appConfig[chosenConfig]) == 'object' ? appConfig[chosenConfig] : appConfig.testing;

//export config
module.exports = configToExport;