# 🚀 Instruções para Testar o Lavajato App

## 📱 Como Executar

### 1. **Instalar Dependências**

```bash
npm install
```

### 2. **Iniciar o Aplicativo**

```bash
npm start
```

### 3. **Escolher Plataforma**

- **Android**: Pressione `a` no terminal ou escaneie o QR code com o Expo Go
- **iOS**: Pressione `i` no terminal ou escaneie o QR code com a câmera
- **Web**: Pressione `w` no terminal

## 🔐 Teste de Autenticação

### **Login Simulado**

- Digite qualquer número de telefone (ex: 11999999999)
- Clique em "Enviar Código"
- Aguarde 2 segundos (simulação)
- Digite o código: **123456**
- Clique em "Verificar Código"

## 🚗 Funcionalidades para Testar

### **1. Dashboard (Home)**

- ✅ Visualizar pontos de fidelidade
- ✅ Ver estatísticas dos carros
- ✅ Navegar para funcionalidades

### **2. Cadastro de Carros**

- ✅ Adicionar novo carro
- ✅ Preencher modelo, placa e porte
- ✅ Validação de campos

### **3. Novo Agendamento**

- ✅ Selecionar carro
- ✅ Escolher unidade
- ✅ Selecionar serviços
- ✅ Calcular preço automaticamente
- ✅ Escolher data e hora
- ✅ Confirmar agendamento

### **4. Acompanhamento**

- ✅ Ver lista de agendamentos
- ✅ Filtrar por status
- ✅ Ver detalhes de cada agendamento

### **5. Gestão de Carros**

- ✅ Listar carros cadastrados
- ✅ Ver estatísticas por veículo
- ✅ Ações rápidas (editar, agendar)

## 🎯 Dados de Teste

### **Unidades Disponíveis**

- **Unidade Centro**: Rua das Flores, 123 - Centro
- **Unidade Zona Sul**: Av. Principal, 456 - Zona Sul

### **Serviços Disponíveis**

- **Lavagem Simples**: R$ 25,00 + adicional por porte
- **Lavagem Completa**: R$ 45,00 + adicional por porte
- **Cera**: R$ 30,00 + adicional por porte
- **Aspiração**: R$ 15,00 + adicional por porte

### **Cálculo de Preços**

- **Pequeno**: Preço base
- **Médio**: Preço base + adicional
- **Grande**: Preço base + (adicional × 2)

## 🔧 Configurações Importantes

### **Firebase (Opcional)**

Para usar autenticação real:

1. Crie projeto no Firebase Console
2. Ative Phone Authentication
3. Configure credenciais em `src/config/firebase.ts`

### **Variáveis de Ambiente**

```env
FIREBASE_API_KEY=sua_api_key
FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
FIREBASE_PROJECT_ID=seu_projeto
```

## 📱 Funcionalidades Implementadas

### ✅ **Completas**

- [x] Autenticação simulada
- [x] Dashboard principal
- [x] Cadastro de carros
- [x] Seleção de unidades
- [x] Seleção de serviços
- [x] Cálculo de preços
- [x] Agendamento completo
- [x] Acompanhamento de status
- [x] Gestão de veículos
- [x] Pontos de fidelidade
- [x] Navegação entre telas
- [x] Interface responsiva

### 🚧 **Em Desenvolvimento**

- [ ] Integração real com Firebase
- [ ] Notificações push
- [ ] Pagamento in-app
- [ ] Modo offline

## 🐛 Problemas Conhecidos

### **Compatibilidade**

- Algumas dependências podem ter conflitos de versão
- Use `--legacy-peer-deps` se necessário

### **Performance**

- Dados mock podem ser lentos em alguns dispositivos
- Em produção, use API real

## 📞 Suporte

### **Erros Comuns**

1. **Metro bundler não inicia**: Limpe cache com `npx expo start -c`
2. **Dependências conflitantes**: Use `npm install --legacy-peer-deps`
3. **Build falha**: Verifique versões do Node.js e Expo

### **Logs e Debug**

- Use `console.log()` para debug
- Verifique logs do Metro bundler
- Use React Native Debugger se necessário

## 🎉 Próximos Passos

### **Para Produção**

1. Configure Firebase real
2. Implemente API backend
3. Adicione testes automatizados
4. Configure CI/CD
5. Publique nas lojas

### **Melhorias Sugeridas**

1. Notificações push
2. Pagamento integrado
3. Avaliações e comentários
4. Chat com suporte
5. Integração GPS

---

**🎯 Aplicativo pronto para teste! Use o código 123456 para login simulado.**
