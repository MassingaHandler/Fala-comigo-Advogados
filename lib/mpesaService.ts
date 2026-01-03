/**
 * SERVIÇO DE INTEGRAÇÃO M-PESA (VODACOM MOÇAMBIQUE)
 * 
 * Nota para o Desenvolvedor (Backend):
 * Esta é uma simulação (Mock) para o frontend. 
 * Em produção, você deve implementar estas chamadas num servidor backend (NodeJS, Python, etc.)
 * para proteger as credenciais (API Keys, Public Keys).
 * 
 * Endpoint Base (Sandbox): https://api.sandbox.vm.co.mz:18352
 * Endpoint Base (Produção): https://api.vm.co.mz:18352
 */

export interface MpesaPaymentRequest {
    phoneNumber: string; // Formato 25884XXXXXXX ou 84XXXXXXX
    amount: number;
    reference: string;   // ID da transação interna (ex: FC-12345)
}

export interface MpesaPaymentResponse {
    success: boolean;
    transactionId?: string;
    message: string;
}

/**
 * Inicia uma transação C2B (Customer to Business)
 * Envia um STK Push (USSD) para o telemóvel do cliente pedir o PIN.
 */
export const initiateMpesaPayment = async (data: MpesaPaymentRequest): Promise<MpesaPaymentResponse> => {
    console.log("--- M-PESA INTEGRATION START ---");
    console.log(`Iniciando cobrança para: ${data.phoneNumber}`);
    console.log(`Valor: ${data.amount} MZN`);
    console.log(`Referência: ${data.reference}`);
    
    // SIMULAÇÃO DA CHAMADA API (Substituir por fetch ao seu backend)
    // Exemplo Backend: POST /api/v1/mpesa/pay { number, amount, ref }
    
    return new Promise((resolve) => {
        setTimeout(() => {
            // Validar número (Mock)
            const cleanNumber = data.phoneNumber.replace(/\s/g, '');
            if (!cleanNumber.startsWith('84') && !cleanNumber.startsWith('85') && !cleanNumber.startsWith('25884') && !cleanNumber.startsWith('25885')) {
                resolve({
                    success: false,
                    message: "Número inválido. Use um número Vodacom (84/85)."
                });
                return;
            }

            // Sucesso Simulado
            resolve({
                success: true,
                transactionId: `VM${Date.now()}7G`, // ID gerado pela Vodacom
                message: "Pedido enviado para o telemóvel."
            });
            console.log("--- M-PESA REQUEST SENT (STK PUSH) ---");
        }, 2000); // Delay de rede simulado
    });
};

/**
 * Verifica o estado do pagamento.
 * Na integração real, a Vodacom envia um Webhook (Callback) para o seu servidor
 * quando o utilizador insere o PIN com sucesso.
 * Aqui, simulamos um "Polling" ou espera pela confirmação.
 */
export const waitForMpesaConfirmation = async (transactionId: string): Promise<boolean> => {
    console.log(`A aguardar PIN do utilizador para Transação: ${transactionId}...`);
    
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("--- M-PESA PAYMENT CONFIRMED ---");
            resolve(true);
        }, 4000); // Simula tempo do utilizador digitar o PIN
    });
};

/**
 * Snippet de Código para Backend NodeJS (Exemplo para integração real)
 */
/*
const axios = require('axios');
const constants = {
    apiKey: process.env.MPESA_API_KEY,
    publicKey: process.env.MPESA_PUBLIC_KEY,
    serviceProviderCode: '171717', // Exemplo "Fala Comigo" Shortcode
    baseUrl: 'https://api.sandbox.vm.co.mz:18352'
};

async function sendPaymentRequest(phone, amount, ref) {
    // 1. Gerar Bearer Token (Auth)
    // 2. Gerar ThirdPartyReference
    // 3. POST /ipg/v1x/c2bPayment/singleStage/
    const payload = {
        input_TransactionReference: ref,
        input_CustomerMSISDN: phone,
        input_Amount: amount,
        input_ThirdPartyReference: generateRef(),
        input_ServiceProviderCode: constants.serviceProviderCode
    };
    // ... axios.post(...)
}
*/