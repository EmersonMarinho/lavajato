# 🚀 Lavajato PWA - Aplicativo Web Progressivo

Este é um **Progressive Web App (PWA)** desenvolvido com [Next.js](https://nextjs.org) que permite instalação como aplicativo nativo.

## ✨ Características

- 🎯 **PWA Instalável**: Instale no dispositivo como app nativo
- 📱 **Responsivo**: Funciona em desktop, tablet e mobile
- 🔄 **Offline**: Funcionalidade offline através de Service Worker
- ⚡ **Performance**: Cache inteligente com Workbox
- 🎨 **Material Design**: Interface moderna com Tailwind CSS

## 🚀 Como Iniciar

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Execute o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Abra no navegador:**
   ```
   http://localhost:3000
   ```

## 📱 Como Instalar como PWA

### Chrome/Edge (Desktop)
1. Acesse o app em `http://localhost:3000`
2. Procure o ícone de instalação na barra de endereços
3. Clique em "Instalar"

### Chrome/Edge (Mobile)
1. Abra o app no navegador
2. Toque no menu (três pontos)
3. Selecione "Adicionar à tela inicial"

### Safari (iOS)
1. Abra no Safari
2. Toque no botão de compartilhar
3. Selecione "Adicionar à Tela Inicial"

## 🛠️ Tecnologias

- **Next.js 15.4.6** - Framework React
- **React 19** - Biblioteca UI
- **Tailwind CSS 4** - Estilização
- **TypeScript** - Type safety
- **next-pwa** - Service Worker
- **Workbox** - Cache strategies

## 📚 Documentação

Consulte o arquivo [README_PWA.md](./README_PWA.md) para informações detalhadas sobre:
- Configuração avançada do PWA
- Estratégias de cache
- Customização do manifest
- Desenvolvimento offline

## 🎯 Funcionalidades

- ✅ Autenticação com JWT
- ✅ Gestão de veículos
- ✅ Agendamento de serviços
- ✅ Cálculo de preços dinâmico
- ✅ Sistema de pontos
- ✅ Dashboard administrativo
- ✅ Instalação PWA
- 🔜 Sincronização offline
- 🔜 Notificações push

## 🚢 Deploy

O deploy pode ser feito facilmente na [Vercel](https://vercel.com):

```bash
npm run build
npm run start
```

Ou use o botão de deploy da Vercel para integração automática.
