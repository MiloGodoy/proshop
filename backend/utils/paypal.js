import dotenv from 'dotenv';
dotenv.config();

// Configuración centralizada
const paypalConfig = {
  clientId: process.env.PAYPAL_CLIENT_ID,
  secret: process.env.PAYPAL_APP_SECRET || process.env.PAYPAL_SECRET_ID, // Compatibilidad con ambos nombres
  apiUrl: process.env.PAYPAL_API_URL || 'https://api.sandbox.paypal.com'
};

// Validación de configuración
if (!paypalConfig.clientId || !paypalConfig.secret) {
  throw new Error('❌ Configuración de PayPal incompleta. Faltan credenciales');
}

export async function getPayPalAccessToken() {
  try {
    const auth = Buffer.from(
      `${paypalConfig.clientId}:${paypalConfig.secret}`
    ).toString('base64');

    const response = await fetch(
      `${paypalConfig.apiUrl}/v1/oauth2/token`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Accept-Language': 'en_US',
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`PayPal API error: ${error.error_description || response.statusText}`);
    }

    return (await response.json()).access_token;
  } catch (error) {
    console.error('Error en getPayPalAccessToken:', error);
    throw new Error('Failed to get PayPal access token');
  }
}

export async function verifyPayPalPayment(paypalTransactionId) {
  try {
    const accessToken = await getPayPalAccessToken();
    const response = await fetch(
      `${paypalConfig.apiUrl}/v2/checkout/orders/${paypalTransactionId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) throw new Error('Failed to verify payment');

    const paypalData = await response.json();
    return {
      verified: paypalData.status === 'COMPLETED',
      value: paypalData.purchase_units[0]?.amount?.value,
    };
  } catch (error) {
    console.error('Error en verifyPayPalPayment:', error);
    throw new Error('Payment verification failed');
  }
}

export async function checkIfNewTransaction(orderModel, paypalTransactionId) {
  try {
    const orders = await orderModel.find({
      'paymentResult.id': paypalTransactionId,
    });
    return orders.length === 0;
  } catch (err) {
    console.error('Error en checkIfNewTransaction:', err);
    throw new Error('Database query failed');
  }
}
