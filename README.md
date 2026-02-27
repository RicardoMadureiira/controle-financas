# 💰 Controle de Fluxo de Caixa

Este é o meu projeto de maior escala até o momento, onde desenvolvi uma aplicação Fullstack completa para gerenciamento financeiro pessoal. O sistema permite o controle rigoroso de entradas e saídas com interface responsiva e feedback em tempo real.

---

## 🚀 Demonstração
**Acesse o projeto online:** [https://controle-financasrm.vercel.app/](https://controle-financasrm.vercel.app/)

---

## 🛠️ Tecnologias e Ferramentas

### Frontend
- **React (Vite)**: Estrutura ágil para o desenvolvimento da interface.
- **TypeScript**: Garantia de tipagem e segurança no código.
- **Tailwind CSS**: Estilização moderna e responsiva.
- **Lucide React**: Biblioteca de ícones elegantes.
- **React-Toastify**: Sistema de notificações dinâmicas (Sucesso/Erro).

### Backend & Banco de Dados
- **Node.js**: Ambiente de execução para o servidor.
- **Prisma ORM**: Modelagem de dados e integração eficiente com o banco.
- **MongoDB Atlas**: Banco de dados NoSQL escalável na nuvem.
- **Insomnia**: Testes de rotas e validação da API.

### Deploy
- **Vercel**: Hospedagem da aplicação frontend.
- **Render**: Hospedagem da API backend.

---

## 💡 Principais Desafios & Aprendizados

Neste projeto, não foquei apenas em "fazer o código funcionar", mas em aplicar boas práticas de desenvolvimento:

* **Integração Fullstack**: Conexão fluida entre o front e a API no Render, lidando com CORS e variáveis de ambiente.
* **Localização (i18n)**: Implementação do `toLocaleString` para garantir que o usuário brasileiro veja os valores no formato R$ 1.250,00, elevando a experiência do usuário (UX).
* **Lógica de UI Reativa**: O dashboard reage instantaneamente aos dados, mudando cores de saldo e totalizadores de forma dinâmica.
* **Persistência Real**: Uso do MongoDB Atlas para garantir que os dados não se percam após o refresh da página.
* **Identificação Anônima**: Implementação de lógica para que cada usuário acesse apenas seus próprios dados através de um `anonUserId`.

---
