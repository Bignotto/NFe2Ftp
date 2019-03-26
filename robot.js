const fs = require('fs')
const ftp = require('basic-ftp')
const _config = require('./config')

async function start() {
    const content = {}

    //check for new files
    content.files = getListaArquivosXml()
    content.path = _config.originFolder

    //conect to the FTP server
    const connection = await conectFtpServer()
    
    //upload all xml files to FTP server
    await upoladFiles()


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
                host: _config.ftpServer,
                user: _config.ftpUser,
                password: _config.ftpPass,
                secure: false
            })
            return client
        } catch (error) {
            console.error(error)
        }
    }

    async function upoladFiles() {
        await connection.ensureDir(_config.destinationFolder)
        for(i = 0;i<content.files.length;i++) {
            await connection.upload(fs.createReadStream(content.path + '/' + content.files[i]),content.files[i])
        }
        console.log('..............................subiu')
    }
}
start()