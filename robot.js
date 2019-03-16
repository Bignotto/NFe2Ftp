var fs = require('fs')
var ftp = require('basic-ftp')
var _config = require('./config')

async function start() {
    const content = {}

    content.files = getListaArquivosXml()
    content.path = _config.originFolder

    const connection = await conectFtpServer()
    
    //upoladFiles()
    //validateFiles()
    
    await connection.close()
    console.log(content)

    function getListaArquivosXml() {
        //array com os nomes dos arquivos para upload
        var xmlFiles = [];

        //pattern para extensão do arqivo
        var pattern=/\.[0-9a-z]+$/i;
        try {
            xmlFiles = fs.readdirSync(_config.originFolder)
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

    async function conectFtpServer() {
        const client = new ftp.Client()
        client.ftp.verbose = true
        try {
            await client.access({
                host: 'localhost',
                user: 'anonymous',
                password: '',
                secure: false
            })
            return client
        } catch (error) {
            console.error(error)
        }
    }
}
start()