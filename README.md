# CampiMove: Sistema de Mobilidade do CEFET

O **CampiMove** tem como objetivo melhorar a mobilidade para os campi do CEFET, a partir do gerenciamento dos ônibus oficiais da instituição e de transportes alternativos. O sistema permitirá que alunos, professores, motoristas, administradores e fornecedores interajam para garantir um transporte eficiente e acessível.

---

## 👥 Equipe de Desenvolvimento

| Ordem | Nome              |
| :---- | :---------------- |
| 1     | Bruno Frade       |
| 2     | Francisco Eduardo |
| 3     | Gabriela Pacheco  |
| 4     | Matheus Rattes    |
| 5     | Pedro Peixoto     |

---

## 🧩 Atores do Sistema

| Ator                     | Descrição                                          |
| :----------------------- | :------------------------------------------------- |
| Aluno                    | Utiliza ônibus e transportes alternativos.         |
| Administrador            | Gerencia horários, notícias, usuários e cadastros. |
| Motorista                | Atualiza a localização e os imprevistos do ônibus. |
| Fornecedor de transporte | Disponibiliza veículos alternativos.               |
| Professor                | Utiliza transportes e pode reservar o intercampi.  |

---

## 📌 Requisitos Funcionais

| Id     | Ator                                 | Descrição                                               |
| :----- | :----------------------------------- | :------------------------------------------------------ |
| REQ001 | Administrador                        | Cadastrar horários dos ônibus.                          |
| REQ002 | Aluno, Professor                     | Consultar horários dos ônibus.                          |
| REQ003 | Aluno, Professor                     | Rastrear e exibir localização atual dos ônibus.         |
| REQ004 | Administrador                        | Cadastrar transportes alternativos.                     |
| REQ005 | Aluno, Professor                     | Consultar transportes alternativos.                     |
| REQ006 | Motorista                            | Atualizar localização do ônibus.                        |
| REQ007 | Motorista                            | Notificar atrasos ou mudanças de trajeto.               |
| REQ008 | Administrador                        | Cadastrar novos motoristas.                             |
| REQ009 | Administrador                        | Cadastrar novos ônibus oficiais.                        |
| REQ010 | Aluno, Professor                     | Receber notificação sobre imprevistos nos transportes.  |
| REQ011 | Aluno, Professor                     | Avaliar o transporte alternativo.                       |
| REQ012 | Administrador                        | Enviar mensagens e avisos para os usuários.             |
| REQ013 | Professor                            | Reservar o ônibus oficial.                              |
| REQ014 | Aluno, Professor                     | Avaliar motorista ou o ônibus oficial.                  |
| REQ015 | Sistema                              | Permitir cadastro de contas com confirmação de e-mail.  |
| REQ016 | Todos                                | Logar ou cadastrar no software.                         |
| REQ017 | Fornecedor de transporte alternativo | Entrar como fornecedor.                                 |
| REQ018 | Aluno, Professor                     | Escrever comentário ao avaliar motorista ou transporte. |
| REQ019 | Aluno, Professor                     | Contratar transporte alternativo.                       |
| REQ020 | Fornecedor de transporte alternativo | Enviar cadastro para o administrador.                   |
| REQ021 | Fornecedor, Aluno, Professor         | Enviar mensagens ao motorista.                          |

---

## 📜 Regras de Negócio

| Id    | Nome                                | Descrição                                                   |
| :---- | :---------------------------------- | :---------------------------------------------------------- |
| RN001 | Localização do ônibus oficial       | O motorista deve atualizar a localização a cada parada.     |
| RN002 | Login para motoristas               | É necessário estar logado para atualizar informações.       |
| RN003 | Poder de administração              | Apenas administradores podem cadastrar recursos do sistema. |
| RN004 | Avaliação do motorista              | Reclamações excessivas geram notificação à direção.         |
| RN005 | Avaliação do transporte alternativo | Notas variam conforme avaliações.                           |
| RN006 | Login de professor                  | Necessário para reservar o ônibus oficial.                  |
| RN007 | Cadastro de motorista               | Deve ser maior de idade e possuir licença válida.           |
| RN008 | Login de fornecedor                 | Acesso limitado apenas ao envio de cadastro.                |
| RN009 | Login de aluno                      | Necessário para uso do sistema.                             |

---

## 📂 Casos de Uso

| ID    | Nome                                           |
| ----- | ---------------------------------------------- |
| CSU01 | Cadastrar horários dos ônibus                  |
| CSU02 | Consultar horários dos ônibus                  |
| CSU03 | Cadastrar transporte alternativo               |
| CSU04 | Consultar transportes alternativos com filtros |
| CSU05 | Atualizar horário de chegada do ônibus oficial |
| CSU06 | Denunciar usuários                             |
| CSU07 | Remover horário do ônibus                      |
| CSU08 | Cadastrar ônibus                               |
| CSU09 | Notificar usuários                             |
| CSU10 | Avaliar transporte alternativo                 |
| CSU11 | Cadastrar conta com confirmação de e-mail      |
| CSU12 | Banir usuários                                 |
| CSU13 | Reservar transporte alternativo                |
| CSU14 | Editar perfil de usuário                       |
| CSU15 | Login                                          |
| CSU16 | Recuperar senha                                |
| CSU17 | Mandar e receber mensagens de motoristas       |
| CSU18 | Logout                                         |
| CSU19 | Listar usuários cadastrados                    |
| CSU20 | Gerenciar relatórios de problemas              |
| CSU21 | Gerenciar Avisos no Sistema                    |


---

## 🗂 Planejamento por Sprint

| Sprint | Caso de Uso | Desenvolvedor     |
| ------ | ----------- | ----------------- |
| 1      | CSU01       | Francisco Eduardo |
| 2      | CSU02       | Gabriela Pacheco  |
| 2      | CSU20       | Gabriela Pacheco  |
| 1      | CSU03       | Matheus Rattes    |
| 3      | CSU04       | Gabriela Pacheco  |
| 3      | CSU21       | Gabriela Pacheco  |
| 1      | CSU05       | Bruno Frade       |
| 2      | CSU06       | Matheus Rattes    |
| 2      | CSU07       | Francisco Eduardo |
| 3      | CSU08       | Matheus Rattes    |
| 3      | CSU09       | Francisco Eduardo |
| 1      | CSU10       | Pedro Peixoto     |
| 2      | CSU11       | Matheus Rattes    |
| 3      | CSU12       | Bruno Frade       |
| 1      | CSU13       | Gabriela Pacheco  |
| 2      | CSU14       | Pedro Peixoto     |
| 3      | CSU15       | Pedro Peixoto     |
| 2      | CSU16       | Bruno Frade       |
| 2      | CSU17       | Bruno Frade       |
| 3      | CSU18       | Bruno Frade       |
| 2      | CSU19       | Matheus Rattes    |

---

## 🐳 Docker – Como rodar o projeto

### Pré-requisitos

* Docker instalado
* Docker Compose instalado

Verificação:

```bash
docker --version
docker compose version
```

---

### Subir o projeto

Na raiz do projeto, execute:

```bash
docker compose up -d --build
```

Esse comando:

* constrói as imagens
* cria os containers
* sobe frontend e backend

---

### Parar o projeto

```bash
docker compose down
```

---

### Reset completo (containers + volumes)

```bash
docker compose down -v
```

---

### Ver containers ativos

```bash
docker ps
```

---

### Acessar o database

```bash
docker exec -it postgres-db psql -U postgres -d campimove_api
```

### Trocar o role de um usuário (já no sql)

```bash
update users set role = 'AMDIN' where id = id_do_usuario
```

### Selecionar table (já no sql)

```bash
select * from tabela_escolhida
```


---

### Ver logs

Logs gerais:

```bash
docker compose logs
```

Logs de um serviço específico:

```bash
docker compose logs backend
```

---

### Acessos padrão

* Frontend: [http://localhost:3000](http://localhost:3000)
* Backend: [http://localhost:8080](http://localhost:8080)

---

### Problemas comuns

* **Porta em uso**: encerrar serviço que esteja usando a porta ou alterar no `docker-compose.yml`
* **Erro de build**: executar reset completo e subir novamente

```bash
docker compose down -v
docker compose up --build
```
