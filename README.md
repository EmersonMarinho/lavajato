# 🚗💧 **Lavajato - Sistema de Agendamento**

Sistema completo de agendamento para lavajatos, desenvolvido com React Native (mobile), Next.js (web) e NestJS (backend).

## 🚀 **Funcionalidades**

### **Mobile App (React Native + Expo)**

- 📱 Cadastro e login de usuários
- 🚗 Gestão de veículos
- 🏢 Seleção de unidades
- 🛠️ Catálogo de serviços
- 📅 Agendamento de horários
- 💳 Sistema de checkout
- 📍 Serviço de busca e entrega
- ⭐ Sistema de pontos de fidelidade

### **Web Dashboard (Next.js)**

- 📊 Dashboard administrativo
- 👥 Gestão de usuários
- 🚗 Controle de veículos
- 🏢 Administração de unidades
- 🛠️ Gestão de serviços
- 📅 Visualização de agendamentos
- 📈 Relatórios e analytics

### **Backend API (NestJS)**

- 🔐 Autenticação JWT
- 🗄️ Banco de dados PostgreSQL
- 📱 Notificações WhatsApp (Twilio)
- 🔄 API RESTful completa
- 📊 Cálculo automático de preços
- 🚚 Gestão de busca e entrega

## 🛠️ **Tecnologias Utilizadas**

### **Frontend Mobile**

- React Native 0.79.5
- Expo SDK 53
- React Navigation 7
- React Native Paper
- TypeScript

### **Frontend Web**

- Next.js 14
- React 19
- Tailwind CSS
- TypeScript
- React Hook Form

### **Backend**

- NestJS
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Twilio API

## 📱 **Como Executar**

### **Pré-requisitos**

- Node.js 18+
- npm ou yarn
- Expo CLI
- PostgreSQL

### **1. Clone o repositório**

```bash
git clone https://github.com/seu-usuario/lavajato.git
cd lavajato
```

### **2. Backend**

```bash
cd backend
npm install
cp .env.example .env
# Configure as variáveis de ambiente
npm run start:dev
```

### **3. Mobile App**

```bash
cd mobile
npm install
npx expo start
```

### **4. Web Dashboard**

```bash
cd web
npm install
npm run dev
```

## 🔧 **Configuração de Ambiente**

### **Variáveis de Ambiente (Backend)**

```env
DATABASE_URL="postgresql://user:password@localhost:5432/lavajato"
JWT_SECRET="sua-chave-secreta"
TWILIO_ACCOUNT_SID="seu-account-sid"
TWILIO_AUTH_TOKEN="seu-auth-token"
TWILIO_WHATSAPP_FROM="seu-numero-whatsapp"
```

## 📱 **Estrutura do Projeto**

```
lavajato/
├── backend/          # API NestJS
├── mobile/           # App React Native
├── web/              # Dashboard Next.js
├── prisma/           # Schema do banco
└── docs/             # Documentação
```

## 🎯 **Roadmap**

- [x] Sistema de autenticação
- [x] Gestão de veículos
- [x] Agendamento de serviços
- [x] Sistema de preços
- [x] Notificações WhatsApp
- [ ] Pagamentos online
- [ ] Avaliações e reviews
- [ ] Sistema de cupons
- [ ] Relatórios avançados
- [ ] App para funcionários

## 🤝 **Contribuição**

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 **Autor**

**Seu Nome** - [@seu-usuario](https://github.com/seu-usuario)

## 🙏 **Agradecimentos**

- Expo team pelo framework incrível
- NestJS pela arquitetura robusta
- Prisma pelo ORM moderno
- React Native Paper pelos componentes

---

⭐ **Se este projeto te ajudou, considere dar uma estrela!**
