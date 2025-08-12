// Configuração do Firebase para autenticação
// Em produção, configure com suas credenciais reais

export const firebaseConfig = {
  apiKey: "sua-api-key",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "seu-app-id"
};

// Para teste, vamos simular a autenticação
export const mockAuth = {
  signInWithPhoneNumber: async (phoneNumber: string) => {
    // Simular envio de código
    return Promise.resolve({
      verificationId: 'mock-verification-id',
      confirm: async (code: string) => {
        // Simular verificação
        if (code === '123456') {
          return Promise.resolve({
            user: {
              uid: 'mock-user-id',
              phoneNumber,
            }
          });
        } else {
          throw new Error('Código inválido');
        }
      }
    });
  }
};

export default { firebaseConfig, mockAuth };
