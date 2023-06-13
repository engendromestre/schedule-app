yarn add typescript -D - Instalar as dependências do typescript
yarn add express - levantar o servidor e fazer as rotas
npx tsc --init - para gerar as configurações do tsconfig.json
tsconfig.json
"target": "ES2020",
"rootDir": "./src",  - aponta o diretório cujo os arquivos serão compilados para JS
"outDir": "./dist",   - especifica a pasta de saída para todos os arquivos emitidos. Se não for definido, os arquivos JS serão emitidos no mesmo diretório dos arquivos .ts

yarn tsc - compila os arquivos .ts para .js

# Criar o servidor
add a tipagem do pacote express - yarn add @types/express -D   

# Compila seu aplicativo TS e reinicia quando os arquivos são modificados.
yarn add ts-node-dev -D

# criar o primeiro script - package.json
"dev": "ts-node-dev src/server.ts" - observando um arquivo específico

 - transpilar - recebe o código-fonte de um programa escrito em uma linguagem de programação como entrada e produz um código-fonte equivalente na mesma ou uma linguagem de programação diferente.

 # api/.gitignore
diz ao Git quais arquivos ou pastas ele deve ignorar em um projeto. 

# api/src/routes
 - Rotas de usuário: cadastrp, edição e autenticação

# api/src/controller
-  responsável por capturar pelo query body, query params 
-  responsável por receber todas as requisições da rota user e passar para o service.ts, o qual é reponsável por toda lógica de trativa 
- padronizações de nomes: 
    - index: buscar todos os registros
    - show:  buscar um único registro
    - store: criar um registro
    - auth: autenticar um usuário

# Criação do Usuário
 - Utilizar ORM Prisma
 - Banco de Dados SQLite

# ORM Prisma (Model)
- definir o model User
- formatar o documento CTRL + Shift + P - Format Document - Prisma
- trabalhar com o repository pattern
- yarn prisma migrate dev - default_avatar_url
- yarn add bcrypt - criptografar a senha do usuário
- yarn add @types/bcrypt -D - tipagens do bcrypt

- multipart/form-data
- yarn add multer
- yarn add @types/multer

Bucket AWS
- yarn add aws-sdk
- yarn add multer-s3
- yarn add uuid
- yarn add @types/uuid -D

Autenticação da Rota de Update
- yarn add jsonwebtoken
- yarn add @types/jsonwebtoken

https://www.md5hashgenerator.com/ - gerar secret key - 

## Schedules
- yarn add date-fns

Como será necessário conectar o front-end com a API é necessário autorizar que ela receba essas conexões. O cors libera conexões de outras portas 
- yarn add cors
- yarn add @types/cors -D

Relacionamento User x Schedule
Schedule
 - user_id
 - users
-> yarn prisma migrate dev 

Refresh Token - quando for utilizar o token no front-end, quando for buscar o token mais atualizado não passar dados de autenticação como e-mail e senha

# FRONT-END
-> yarn create vite - inicia o projeto com o vite (responsável pela compilação do front-end)
✔ Project name: … frontend
✔ Select a framework: › React
✔ Select a variant: › TypeScript + SWC
-> cd frontend 
-> yarn - instala todas as dependências	do projeto
-> yarn dev - inicializa o ambiente em modo de desenvolvimento

file tsconfig.json
{
  "compilerOptions": {
    "noImplicitAny": false,
  }
}