# 🚗 Lavajato App - Aplicativo Mobile

Aplicativo React Native com Expo para clientes de lavajato agendarem serviços.

## ✨ Funcionalidades

### 🔐 Autenticação

- Login via número de celular (Firebase Auth)
- Verificação por código SMS
- Sessão persistente

### 🚙 Gestão de Veículos

- Cadastro de carros (modelo, placa, porte)
- Visualização de veículos cadastrados
- Edição de informações

### 🏢 Seleção de Unidade

- Lista de unidades disponíveis
- Informações de endereço e horários
- Seleção da unidade preferida

### 🧽 Seleção de Serviços

- Catálogo de serviços disponíveis
- Cálculo automático de preços
- Preços baseados no porte do veículo
- Seleção múltipla de serviços

### 📅 Agendamento

- Seleção de data e hora
- Confirmação de detalhes
- Resumo completo do agendamento

### 📱 Acompanhamento

- Status dos agendamentos
- Histórico de serviços
- Filtros por status

### 🎯 Programa de Fidelidade

- Visualização de pontos
- Acúmulo automático
- Benefícios para clientes

## 🛠️ Tecnologias

- **React Native** - Framework mobile
- **Expo** - Plataforma de desenvolvimento
- **NativeBase** - Biblioteca de componentes UI
- **React Navigation** - Navegação entre telas
- **Firebase Auth** - Autenticação
- **TypeScript** - Tipagem estática
- **AsyncStorage** - Armazenamento local

## 📱 Telas do Aplicativo

### 1. **LoginScreen**

- Autenticação por telefone
- Verificação por código

### 2. **HomeScreen**

- Dashboard principal
- Pontos de fidelidade
- Próximo agendamento
- Estatísticas rápidas
- Navegação para funcionalidades

### 3. **AddCarScreen**

- Formulário de cadastro de carro
- Validação de campos
- Seleção de porte

### 4. **CarsScreen**

- Lista de carros cadastrados
- Estatísticas por veículo
- Ações rápidas

### 5. **NewAppointmentScreen**

- Fluxo guiado de agendamento
- Seleção de carro, unidade e serviços
- Barra de progresso

### 6. **SelectUnitScreen**

- Lista de unidades disponíveis
- Informações detalhadas
- Seleção e confirmação

### 7. **SelectServicesScreen**

- Catálogo de serviços
- Cálculo de preços
- Seleção múltipla

### 8. **BookAppointmentScreen**

- Seleção de data e hora
- Resumo completo
- Confirmação final

### 9. **AppointmentsScreen**

- Lista de agendamentos
- Filtros por status
- Ações por agendamento

## 🚀 Como Executar

### Pré-requisitos

- Node.js 16+
- Expo CLI
- Android Studio / Xcode (para emuladores)

### Instalação

```bash
# Instalar dependências
npm install

# Iniciar o aplicativo
npm start

# Executar no Android
npm run android

# Executar no iOS
npm run ios

# Executar na web
npm run web
```

## 🔧 Configuração

### Firebase

1. Crie um projeto no Firebase Console
2. Ative a autenticação por telefone
3. Configure as credenciais em `src/config/firebase.ts`

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz:

```env
FIREBASE_API_KEY=sua_api_key
FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
FIREBASE_PROJECT_ID=seu_projeto
```

## 📱 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
├── contexts/           # Contextos React (Auth, App)
├── navigation/         # Configuração de navegação
├── screens/            # Telas do aplicativo
├── types/              # Definições TypeScript
└── config/             # Configurações (Firebase)
```

## 🎨 Design System

### Cores Principais

- **Azul** (#3b82f6) - Ações principais
- **Verde** (#10b981) - Sucesso/confirmação
- **Amarelo** (#f59e0b) - Avisos/em andamento
- **Vermelho** (#ef4444) - Erros/cancelamento
- **Roxo** (#8b5cf6) - Carros/veículos

### Componentes

- Botões com estados visuais
- Cards com sombras e bordas
- Badges para status
- Ícones Material Design
- Formulários validados

## 📊 Fluxo de Usuário

1. **Login** → Autenticação por telefone
2. **Home** → Dashboard principal
3. **Novo Agendamento** → Fluxo guiado:
   - Selecionar carro
   - Escolher unidade
   - Selecionar serviços
   - Confirmar agendamento
4. **Acompanhamento** → Status e histórico

## 🔒 Segurança

- Autenticação via Firebase
- Validação de dados
- Armazenamento seguro local
- Sessões com expiração

## 📈 Melhorias Futuras

- [ ] Notificações push
- [ ] Pagamento in-app
- [ ] Avaliações e comentários
- [ ] Chat com suporte
- [ ] Integração com GPS
- [ ] Modo offline
- [ ] Temas personalizáveis

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 📞 Suporte

Para dúvidas ou suporte, entre em contato:

- Email: suporte@lavajato.com
- WhatsApp: (11) 99999-9999

---

**Desenvolvido com ❤️ para o Lavajato**
