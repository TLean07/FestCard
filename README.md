# FestCard

## Descrição

O **FestCard** é um aplicativo mobile desenvolvido com Ionic React que oferece aos usuários uma maneira rápida e segura de gerenciar eventos, ingressos e transações. O sistema permite o uso de NFC para pagamentos e a acumulação de moedas virtuais ('FestCoins'), que podem ser trocadas por ingressos e outros benefícios.

## Tecnologias Utilizadas

- **JavaScript**: Linguagem de programação usada para criar e controlar o comportamento dinâmico no projeto, permitindo interatividade nas páginas, integração com APIs, manipulação do DOM e lógica de negócios do aplicativo.
- **Ionic Framework**: Para o desenvolvimento da interface e navegação.
- **React**: Biblioteca JavaScript para construção de interfaces de usuário.
- **Capacitor**: Para integração com funcionalidades nativas de dispositivos móveis.
- **Firebase Authentication**: Para autenticação de usuários.
- **Firestore**: Para armazenamento de dados em tempo real.
- **NFC**: Para pagamentos rápidos por aproximação.
- **Tailwind CSS**: Para a estilização dos componentes.

<div align="left">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" height="40" alt="javascript logo" />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" height="40" alt="react logo" />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ionic/ionic-original.svg" height="40" alt="ionic logo" />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" height="40" alt="firebase logo" />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" height="40" alt="tailwindcss logo" />
  <img width="12" />
  <img src="https://upload.wikimedia.org/wikipedia/commons/7/75/NFC_logo.svg" height="40" alt="nfc logo" />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/capacitorjs/capacitorjs-original.svg" height="40" alt="capacitor logo" />
</div>

## Como Rodar o Projeto

1. **Clone o repositório**:
    ```bash
    git clone https://github.com/TLean07/FestCard.git
    ```

2. **Abra a pasta**:
    ```bash
   cd FestCard
    ```

3. **Instale as dependências**:
    Navegue até a pasta do projeto e execute:
    ```bash
    npm install
    ```

4. **Execute o projeto**:
    Após a instalação das dependências, inicie o servidor de desenvolvimento com:
    ```bash
    npm start
    ```

5. **Executar no Android/iOS**:
    Caso queira testar o aplicativo em dispositivos móveis, utilize o Capacitor para criar o build:
    ```bash
    ionic build
    ```
    ```bash
    npx cap add android
    npx cap open android
    ```
    Para iOS:
    ```bash
    ionic build
    ```
    ```bash
    npx cap add ios
    npx cap open ios
    ```

5. **Configuração Firebase**:
    Certifique-se de ter configurado as credenciais do Firebase no arquivo `.env` ou diretamente no código, conforme necessário.

## Integrantes do Grupo

- **Leandro Afonso Silva Santos Júnior**  
    Função: Desenvolvedor Chefe e Desenvolvedor Full Stack (FrontEnd e BackEnd)
    GitHub: [Leandro](https://github.com/TLean07)

- **Kauai Rosa de Assis Rocha**  
    Função: Chefe de Marketing 
    GitHub: [Kauai](https://github.com/KauaiRosa)

- **Pedro Henrique Sartorelli Ferreira**  
    Função: Desenvolvedor FrontEnd
    GitHub: [Pedro Henrique](https://github.com/Pedro2007596)

- **Victor Cecilio Alves de Oliveira**  
    Função: Desenvolvedor FrontEnd
    GitHub: [Victor](https://github.com/VictorC-tech)    

- **Eduardo Martins Carmo**  
    Função: Chefe das Finanças
    GitHub: [Eduardo](https://github.com/Tidlle)  

- **Kaio Luis Lima Pimentel**  
    Função: Chefe de Design
    GitHub: [Kaio](https://github.com/KaioPimentel8)    