const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); // <-- NEW Node built-in import
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes'); // <-- NEW IMPORT
const paymentRoutes = require('./routes/paymentRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Expose the uploads folder statically to the web browser
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes); // <-- NEW MOUNT
app.use('/api/payment', paymentRoutes);

app.get('/', (req, res) => res.status(200).json({ message: "API Live." }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));