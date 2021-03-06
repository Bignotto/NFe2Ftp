require('dotenv').config()
const fs = require('fs')
const path = require('path')
const ftp = require('basic-ftp')
const _config = require('./config')

async function start() {
    const content = {}

    let timeDate = new Date();
    let currentDate = timeDate.getFullYear()+'-'+(timeDate.getMonth()+1)+'-'+timeDate.getDate();
    let currentTime = timeDate.getHours() + ":" + timeDate.getMinutes() + ":" + timeDate.getSeconds();

    //console.log(currentDate+' '+currentTime)

    //check for new files
    content.files = getXmlFilesList()

    //content.path = _config.originFolder
    content.path = process.env.ORIGINFOLDER

    if(content.files.length === 0) {
        console.log(currentDate + ' ' + currentTime + ': no XML files found on ' + process.env.ORIGINFOLDER)
        return
    } else {
        console.log(currentDate + ' ' + currentTime + ': found ' + content.files.length + ' XML files')
    }
    //conect to the FTP server
    const connection = await conectFtpServer()
    
    //upload all xml files to FTP server
    await upoladFiles()

    //validate if all files were uploaded
   if (await validateUploadedFiles() !== true) {
        await connection.close()
        console.log('Some file were not uploaded.')
        return
    } else {
        console.log('all files ok!!')
    }

    //deleteUploadedFiles
    await deleteUploadedFiles()
    
    await connection.close()

    //list all XML files to upload to FTP and return an array with their names
    function getXmlFilesList() {

        var xmlFiles = [];

        //XML match pattern
        var pattern=/\.[0-9a-z]+$/i;
        try {
            xmlFiles = fs.readdirSync(process.env.ORIGINFOLDER)
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

    //connects to the FTP server and return a connection
    async function conectFtpServer() {
        const client = new ftp.Client()
        client.ftp.verbose = true
        try {
            await client.access({
                host: process.env.FTPSERVER,
                user: process.env.FTPUSER,
                password: process.env.FTPPASS,
                secure: false
            })
            return client
        } catch (error) {
            console.error(error)
        }
    }

    //send files in the array to the ftp server
    async function upoladFiles() {
        await connection.ensureDir(process.env.DESTINATIONFOLDER)
        for(i = 0;i<content.files.length;i++) {
            await connection.upload(fs.createReadStream(content.path + '/' + content.files[i]),content.files[i])
        }
    }

    //validate if all files were uploaded
    async function validateUploadedFiles() {
        await connection.ensureDir(process.env.DESTINATIONFOLDER)
        let filesList = await connection.list()
        console.log('FTP server: ' + filesList.length + ' XML found')

        //validade number of files
        if(filesList.length !== content.files.length)
            return false

        //validade file names on both local folder and ftp folder
        for(i = 0;i<filesList.length;i++) {
            if(content.files.indexOf(filesList[i].name,0)===-1) {
                return false
            }
        }
        return true
    }

    async function deleteUploadedFiles() {
        await fs.readdir(process.env.ORIGINFOLDER, (err, files) => {
            if (err) throw err;
          
            for (const file of files) {
              fs.unlink(path.join(process.env.ORIGINFOLDER, file), err => {
                if (err) throw err;
              });
            }
          });
    }
}
//run the first time immediately
start()
//then run every 5 minutes 
setInterval(start,process.env.TIME * 1000)