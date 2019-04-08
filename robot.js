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
    var files = await connection.list();
    
    //upload all xml files to FTP server
    await upoladFiles()


   if (await validateUploadedFiles() !== true) {
        console.log('Validation failed')
        return
    }

    //deleteUploadedFiles
    
    await connection.close()
    console.log(content)
    console.log(files)

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

    async function validateUploadedFiles() {
        await connection.ensureDir(_config.destinationFolder)
        let filesList = await connection.list()

        //validade number of files
        if(filesList.length !== content.files.length)
            return false

        for(i = 0;i<filesList.length;i++) {
            if(content.files.findIndex(filesList[i].name) === -1)
                return false
        }
    }
}
start()