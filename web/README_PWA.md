# 🚀 PWA - Progressive Web App

Este projeto foi configurado como um Progressive Web App (PWA), permitindo que seja instalado no dispositivo do usuário como um aplicativo nativo.

## 📱 Como Instalar o PWA

### No Chrome/Edge (Desktop)

1. Acesse o aplicativo em `http://localhost:3000`
2. Procure pelo ícone de instalação na barra de endereços ou no menu
3. Clique em "Instalar" ou "Adicionar à Tela Inicial"

### No Chrome/Edge (Mobile)

1. Abra o aplicativo no navegador
2. Toque no menu de três pontos
3. Selecione "Adicionar à tela inicial" ou "Instalar app"
4. O ícone do aplicativo aparecerá na tela inicial

### No Safari (iOS)

1. Abra o aplicativo no Safari
2. Toque no botão de compartilhar
3. Role para baixo e selecione "Adicionar à Tela Inicial"
4. Confirme a adição

## ✨ Funcionalidades PWA

- **Instalação**: O app pode ser instalado no dispositivo
- **Offline**: Funciona sem conexão (Service Worker)
- **Responsivo**: Adapta-se a diferentes tamanhos de tela
- **Notificações**: Suporte para notificações push (futuro)
- **Atualizações**: Atualiza automaticamente quando há nova versão

## 🛠️ Desenvolvimento

### Building para Produção

```bash
npm run build
npm run start
```

### Cache e Service Worker

O PWA utiliza cache para melhorar o desempenho:

- **Página**: Cacheado automaticamente
- **Assets**: CSS, JS e imagens são cacheados
- **API**: As chamadas de API também são cacheadas quando possível

### Desabilitar PWA em Desenvolvimento

O PWA é automaticamente desabilitado durante o desenvolvimento (`npm run dev`) para facilitar o debugging.

Para habilitá-lo:

1. Abra `next.config.ts`
2. Remova ou comente a linha `disable: process.env.NODE_ENV === "development"`

## 📋 Manifest.json

O arquivo `public/manifest.json` contém todas as configurações do PWA:

- Nome e descrição
- Ícones e splash screens
- Cores de tema
- Atalhos (shortcuts)
- Modo de exibição

## 🔧 Customização

### Alterar Tema

Edite o `theme_color` em `public/manifest.json`:

```json
{
  "theme_color": "#sua-cor"
}
```

### Adicionar Ícones

Adicione ícones PNG nas seguintes resoluções:

- `icon.png` - 192x192 e 512x512

O manifesto já está configurado para usar esses ícones.

## 📦 Workbox

Este projeto usa [Workbox](https://developers.google.com/web/tools/workbox) para gerenciar o Service Worker:

- Cache strategies configuráveis
- Background sync
- Periodic sync
- Request queuing

## 🎯 Próximos Passos

- [ ] Implementar sincronização offline
- [ ] Adicionar notificações push
- [ ] Implementar background sync para agendamentos
- [ ] Melhorar estratégias de cache
- [ ] Adicionar modo offline completo

## 📚 Recursos

- [PWA Checklist](https://web.dev/pwa-checklist/)
- [Next.js PWA](https://github.com/shadowwalker/next-pwa)
- [Workbox Documentation](https://developers.google.com/web/tools/workbox)

