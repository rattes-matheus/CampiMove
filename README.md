# CampiMove: Sistema de Mobilidade do CEFET

O **CampiMove** tem como objetivo melhorar a mobilidade para os campi do CEFET, a partir do gerenciamento dos ônibus oficiais da instituição e de transportes alternativos. O sistema permitirá que alunos, professores, motoristas, administradores e fornecedores interajam para garantir um transporte eficiente e acessível.

## 👥 Equipe de Desenvolvimento
| Ordem | Nome                 |
|:------|:---------------------|
| 1     | Bruno Frade          |
| 2     | Francisco Eduardo    |
| 3     | Gabriela Pacheco     |
| 4     | Matheus Rattes       |
| 5     | Pedro Peixoto        |

## 🧩 Atores do Sistema
| Ator                        | Descrição                                                                 |
|:----------------------------|:--------------------------------------------------------------------------|
| Aluno                       | Utiliza ônibus e transportes alternativos.                                |
| Administrador               | Gerencia horários, notícias, usuários e cadastros.                        |
| Motorista                   | Atualiza a localização e os imprevistos do ônibus.                        |
| Fornecedor de transporte    | Disponibiliza veículos alternativos.                                      |
| Professor                   | Utiliza transportes e pode reservar o intercampi.                         |

## 📌 Requisitos Funcionais
| Id     | Ator                                        | Descrição                                                            |
|:-------|:--------------------------------------------|:---------------------------------------------------------------------|
| REQ001 | Administrador                               | Cadastrar horários dos ônibus.                                       |
| REQ002 | Aluno, Professor                            | Consultar horários dos ônibus.                                       |
| REQ003 | Aluno, Professor                            | Rastrear e exibir localização atual dos ônibus.                      |
| REQ004 | Administrador                               | Cadastrar transportes alternativos.                                  |
| REQ005 | Aluno, Professor                            | Consultar transportes alternativos.                                  |
| REQ006 | Motorista                                   | Atualizar localização do ônibus.                                     |
| REQ007 | Motorista                                   | Notificar atrasos ou mudanças de trajeto.                            |
| REQ008 | Administrador                               | Cadastrar novos motoristas.                                          |
| REQ009 | Administrador                               | Cadastrar novos ônibus oficiais.                                     |
| REQ010 | Aluno, Professor                            | Receber notificação sobre imprevistos nos transportes.               |
| REQ011 | Aluno, Professor                            | Avaliar o transporte alternativo.                                    |
| REQ012 | Administrador                               | Enviar mensagens e avisos para os usuários.                          |
| REQ013 | Professor                                   | Reservar o ônibus oficial.                                           |
| REQ014 | Aluno, Professor                            | Avaliar motorista ou o ônibus oficial.                               |
| REQ015 | Sistema                                     | Permitir cadastro de contas com confirmação de e-mail.               |
| REQ016 | Aluno, Professor, Motorista, Administrador  | Logar ou cadastrar no software.                                      |
| REQ017 | Fornecedor de transporte alternativo        | Entrar como fornecedor.                                              |
| REQ018 | Aluno, Professor                            | Escrever comentário ao avaliar motorista ou transporte.              |
| REQ019 | Aluno, Professor                            | Contratar transporte alternativo ao consultar.                       |
| REQ020 | Fornecedor de transporte alternativo        | Enviar cadastro para o administrador.                                |
| REQ021 | Fornecedor de transporte alternativo, aluno, professor | Enviar mensagens ao motorista.                            |

## 📜 Regras de Negócio
| Id     | Nome                       | Descrição                                                                 |
|:-------|:---------------------------|:--------------------------------------------------------------------------|
| RN001  | Localização do ônibus oficial | O motorista deve atualizar a localização do ônibus a cada parada.         |
| RN002  | Login para motoristas      | É necessário logar motorista para atualizar informações do ônibus.        |
| RN003  | Poder de administração     | Apenas administradores podem cadastrar motoristas, ônibus, etc.          |
| RN004  | Avaliação do motorista     | Caso receba muitas reclamações, a direção deve ser notificada.           |
| RN005  | Avaliação do transporte alternativo | As notas mudam conforme elogios e reclamações.                     |
| RN006  | Login de professor         | O professor precisa logar para reservar o ônibus oficial.                |
| RN007  | Cadastro de motorista      | O motorista deve ser maior de idade e possuir licença válida.            |
| RN008  | Login de fornecedor        | O fornecedor só pode enviar cadastro, sem acesso total ao sistema.       |
| RN009  | Login de aluno             | O aluno precisa logar para usar o sistema.                               |

## 📂 Casos de Uso  

| ID     | Nome                                             |
|--------|--------------------------------------------------|
| CSU01 | Cadastrar horários dos ônibus |
| CSU02 | Consultar horários dos ônibus |
| CSU03 | Cadastrar transporte alternativo |
| CSU04 | Consultar transportes alternativos com filtros |
| CSU05 | Atualizar horário de chegada do ônibus oficial |
| CSU06 | Denunciar usuários |
| CSU07 | Remover horário do ônibus |
| CSU08 | Cadastrar ônibus |
| CSU09 | Notificar usuários |
| CSU10 | Avaliar transporte alternativo |
| CSU11 | Cadastrar conta por tipo de usuário com confirmação de email |
| CSU12 | Banir usuários |
| CSU13 | Reservar transporte alternativo |
| CSU14 | Editar perfil de usuário |
| CSU15 | Login |
| CSU16 | Recuperar senha |
| CSU17 | Mandar e receber mensagens de motoristas |
| CSU18 | Logout |
| CSU19 | Listar usuários cadastrados |
| CSU20 | Gerenciar Relatórios de Problemas no Transporte |

## 🗂 Planejamento por Sprint  

| Sprint | Caso de Uso | Desenvolvedor        |
|--------|-------------|----------------------|
| 1      | CSU01       | Francisco Eduardo    |
| 2      | CSU02       | Gabriela Pacheco     |
| 2      | CSU20       | Gabriela Pacheco     |
| 1      | CSU03       | Matheus Rattes       |
| 3      | CSU04       | Gabriela Pacheco     |
| 1      | CSU05       | Bruno Frade          |
| 2      | CSU06       | Matheus Rattes       |
| 2      | CSU07       | Francisco Eduardo    |
| 3      | CSU08       | Matheus Rattes       |
| 3      | CSU09       | Francisco Eduardo    |
| 1      | CSU10       | Pedro Peixoto        |
| 2      | CSU11       | Matheus Rattes       |
| 3      | CSU12       | Bruno Frade          |
| 1      | CSU13       | Gabriela Pacheco     |
| 2      | CSU14       | Pedro Peixoto        |
| 3      | CSU15       | Pedro Peixoto        |
| 2      | CSU16       | Bruno Frade          |
| 2      | CSU17       | Bruno Frade          |
| 3      | CSU18       | Bruno Frade          |
| 2      | CSU19       | Matheus Rattes       |

