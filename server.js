import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';  // Corrected this line
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;  // Default to 5000 if no port is specified

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MON, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Define Schema and Model
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phno: { type: Number, required: true, unique: true },
});

const Contact = mongoose.model('Contact', userSchema);

// Routes
app.get('/contacts', async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ name: 1 });
        res.status(200).json(contacts);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching contacts', error: err });
    }
});

app.post('/contacts', async (req, res) => {
    const { name, phno } = req.body;
    try {
        const newContact = new Contact({ name, phno });
        await newContact.save();
        res.status(201).json(newContact);
    } catch (err) {
        res.status(500).json({ message: 'Error adding contact', error: err });
    }
});

app.delete('/contacts/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedContact = await Contact.findByIdAndDelete(id);
        res.status(200).json({ message: 'Contact deleted', deletedContact });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting contact', error: err });
    }
});

app.put('/contacts/:id', async (req, res) => {
    const { id } = req.params;
    const { name, phno } = req.body;
    try {
        const updatedContact = await Contact.findByIdAndUpdate(id, { name, phno }, { new: true });
        res.status(200).json(updatedContact);
    } catch (err) {
        res.status(500).json({ message: 'Error updating contact', error: err });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
