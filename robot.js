var fs = require('fs')
var _config = require('./config')

function start() {
    const content = {}

    content.files = getListaArquivosXml()

    
    console.log(content)

    function getListaArquivosXml() {
        //array com os nomes dos arquivos para upload
        var xmlFiles = [];

        //pattern para extensão do arqivo
        var pattern=/\.[0-9a-z]+$/i;
        try {
            xmlFiles = fs.readdirSync('/mnt/c/xml/nao_processado')
        } catch (err) {
            console.error(err)
        }
        
        //keep only files with .XML extension
        return xmlFiles.filter(function(fileName) {
            var ext = fileName.match(pattern);
            if(ext.toString().toLowerCase() == '.xml') return true
            else false
        })
    }
}
start()