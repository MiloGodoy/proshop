import dotenv from "dotenv";
import path from 'path'
import express from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser'
import { fileURLToPath } from 'node:url';

// Cargar variables de entorno
dotenv.config()

console.log('Verificación de variables PayPal:', {
  clientId: process.env.PAYPAL_CLIENT_ID ? 'OK' : 'Falta',
  secret: process.env.PAYPAL_APP_SECRET ? 'OK' : 'Falta',
  apiUrl: process.env.PAYPAL_API_URL || 'Usando valor por defecto'
});

import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js"
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js'
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// const __dirname = path.resolve();

// Obtener el directorio raíz del proyecto (un nivel arriba de backend)
const rootDir = path.resolve(__dirname, "..")

// Importa los módulos de PayPal después de configurar dotenv
const { getPayPalAccessToken } = await import('./utils/paypal.js');

// Prueba inmediata (opcional)
async function testPayPalConnection() {
  try {
    console.log('Probando conexión con PayPal...');
    const token = await getPayPalAccessToken();
    console.log('✅ Conexión exitosa con PayPal. Token obtenido.');
    return true;
  } catch (error) {
    console.error('❌ Fallo en conexión PayPal:', error.message);
    return false;
  }
}

testPayPalConnection();

const port = process.env.PORT || 5000;

connectDB();  // Connect to MongoDB

const app = express();

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CLIENT_URL
    : 'http://localhost:5173',
  credentials: true
}))

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

// Rutas de la API
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

// Ruta para configuración de PayPal
app.get('/api/config/paypal', (req, res) => 
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

// Servir archivos estáticos de la carpeta uploads
// const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


// Configuración para producción
if (process.env.NODE_ENV === 'production') {
  // set static folder
  app.use(express.static(path.join(rootDir, "frontend/dist")))

   // Cualquier ruta que no sea API redirigirá a index.html
   app.get("*", (req, res) => res.sendFile(path.resolve(rootDir, "frontend", "dist", "index.html")))
  } else {
    // Ruta de prueba para desarrollo
    app.get("/", (req, res) => {
      res.send("API is running...")
    })
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));
