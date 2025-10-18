require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
connectDB(process.env.MONGO_URI);


const bootstrapAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPass = process.env.ADMIN_PASSWORD;
    if (!adminEmail || !adminPass) return;
    const UserModel = require('./models/User');
    const exists = await UserModel.findOne({ email: adminEmail });
    if (!exists) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(adminPass, salt);
      const admin = new UserModel({ email: adminEmail, passwordHash, role: 'admin' });
      await admin.save();
      console.log('Bootstrap admin created:', adminEmail);
    }
  } catch (err) {
    console.error('Bootstrap admin error', err);
  }
};
bootstrapAdmin();

app.use('/api/auth', require('./routes/auth'));
app.use('/api/agents', require('./routes/agents'));
app.use('/api/upload', require('./routes/upload'));

app.get('/', (req, res) => res.send('Agent Distributor API'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
