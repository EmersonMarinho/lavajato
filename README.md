# 🚗💧 **Lavajato - Sistema de Agendamento**

Sistema completo de agendamento para lavajatos, desenvolvido com PWA (Progressive Web App) e NestJS (backend).

## 🚀 **Funcionalidades**

### **PWA App (Next.js + PWA)**

- 📱 Aplicativo instalável (PWA)
- 🚗 Gestão de veículos
- 🏢 Seleção de unidades
- 🛠️ Catálogo de serviços
- 📅 Agendamento de horários
- 💳 Sistema de checkout
- 📍 Serviço de busca e entrega
- ⭐ Sistema de pontos de fidelidade
- 📊 Dashboard administrativo
- 👥 Gestão de usuários
- 🛠️ Gestão de serviços
- 📈 Relatórios e analytics

### **Backend API (NestJS)**

- 🔐 Autenticação JWT
- 🗄️ Banco de dados PostgreSQL
- 📱 Notificações WhatsApp (Twilio)
- 🔄 API RESTful completa
- 📊 Cálculo automático de preços
- 🚚 Gestão de busca e entrega

## 🛠️ **Tecnologias Utilizadas**

### **Frontend PWA**

- Next.js 15.4.6
- React 19
- PWA (next-pwa)
- Tailwind CSS 4
- TypeScript
- React Hook Form
- Service Worker para funcionalidade offline

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
- PostgreSQL

### **1. Clone o repositório**

```bash
git clone https://github.com/seu-usuario/lavajato.git
cd lavajato
```

### **2. Backend**

```bash
cd lavajato/backend
npm install
cp env.example .env
# Configure as variáveis de ambiente
npm run start:dev
```

### **3. PWA App**

```bash
cd lavajato/web
npm install
npm run dev
```

O app estará disponível em `http://localhost:3000` e pode ser instalado como PWA no navegador.

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
├── web/              # PWA Next.js
│   ├── public/       # Assets e manifest PWA
│   └── src/          # Código fonte
└── prisma/           # Schema do banco
```

## 🎯 **Roadmap**

- [x] Sistema de autenticação
- [x] Gestão de veículos
- [x] Agendamento de serviços
- [x] Sistema de preços
- [x] Notificações WhatsApp
- [x] PWA instalável
- [ ] Funcionalidade offline completa
- [ ] Pagamentos online
- [ ] Avaliações e reviews
- [ ] Sistema de cupons
- [ ] Relatórios avançados

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

- Next.js team pelo framework incrível
- NestJS pela arquitetura robusta
- Prisma pelo ORM moderno
- PWA por tornar o app instalável

---

⭐ **Se este projeto te ajudou, considere dar uma estrela!**
