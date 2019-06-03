# NFe2Ftp
Robo que envia arquivos XML de notas fiscais eletrônicas para um repositório usando FTP para transferir os arquivos.

## Configuração
É preciso criar um arquivo `.ENV` na raiz do projeto para guardar as configurações do Robo.

`ORIGINFOLDER=c:\caminho\arquivos\xml`
Caminho dos arquivos XML no disco de origem. 

`DESTINATIONFOLDER=/caminho/destino/no/servidor`
Caminho dos arquivos no servidor FTP.

`FTPFOLDER=/nomde/da/pasta/no/servidor/`
Nome da pasta de destino no servidor FTP.

`TIME=5000`
Tempo de espera do Robo para procurar por arquivos XML. Em segundos.

`FTPSERVER=ftp.server.com.br`
Endereço do servidor de FTP.

`FTPPORT=21`
Porta do servidor FTP.

`FTPUSER=ftpusername`
Nome de usuário.

`FTPPASS=ftppassword`
Senha.

## Como usar
Iniciar com `node robot.js`

O Robo passará a monitorar a pasta de origem no tempo informado no arquivo de configuração. Após enviar os arquivos faz uma verificação se todos foram enviados comparando primeiro a quantidade de arquivos e depois nominalmente um a um. Se todos subiram apaga todo o conteúdo da pasta de origem.

## Windows Service
Para a próxima versão este robo será instalado como um serviço do Windows.
