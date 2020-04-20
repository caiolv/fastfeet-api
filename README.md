<h1 align="center">
  <img alt="GoStack" src="https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/bootcamp-header.png" width="200px" />
</h1>

<h3 align="center">FastFeet - API</h3>

<p align="center">Backend do projeto de entrega de encomendas.</p>

## 🚀 Instalação e execução
1. Para esse projeto, é necessário o [Docker](https://www.docker.com/products/docker-desktop).
2. Após a instalação do Docker, execute os comandos abaixo para instalar as imagens necessárias:
```bash
docker run --name redisfastfeet -p 6379:6379 -d -t redis:alpine
docker run --name fastfeet -e POSTGRES_PASSWORD=fastfeet -p 5432:5432 -d postgres

docker start redisfastfeet
docker start fastfeet
```
3. Clone esse repositório
```bash
git clone https://github.com/caiolv/gostack-fastfeet-api.git
cd gostack-fastfeet-api
```
4. Instale as dependências:
```bash
yarn install
```
5. Adicione o arquivo .env e faça as alterações com as suas variáveis de ambiente.
```bash
cp .env.example .env
```
6. Execute as migrations com
```bash
yarn sequelize db:migrate
```
7. Execute as seeds:
```bash
yarn sequelize db:seed:all
```
8. Execute `yarn dev` para iniciar a aplicação.
9. Execute `yarn queue` para iniciar a a fila de email.


