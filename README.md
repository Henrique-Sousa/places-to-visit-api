# Teste Desenvolvedor: Backend - Fase 2

## Henrique Sousa

email: sousa.henriquelopes@gmail.com \
telefone: (31)99730-1889 \
localização: Belo Horizonte, MG, Brasil \
linkedin: linkedin.com/in/henriquelsousa

para rodar, primeiro instale
```bash
npm i
```

entao crie as chaves publica e privada:
```bash
npm run keys
```

transpile o codigo
```bash
npm run build
```

e rode
```
npm start
```

<br>

grave um usuario no banco de dados com os seguintes campos
```
{
  name: 'user1',
  email: 'user1@mail.com',
  password: '$2a$10$BCdw6gBo5HfenKQVRnku1OFr2Jncrn4BQT5wtRMfp7xr9kAx69W1G'
}
```

usando `curl` e `jq`: \
para logar e gravar o token na variavel `TOKEN`
```bash
TOKEN=$(curl -s -X POST -H 'Content-Type: application/json' --data '{"name": "user1@mail.com", "password": "123456" }' localhost:3000/login  | jq -r '.token')
```

para acessar um endpoint protegido:
```bash
curl -s -X GET -H "Authorization: $TOKEN" localhost:3000/places | jq
```
