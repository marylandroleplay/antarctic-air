const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

// Setup nodemailer transport
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can swap this with Mailgun, SendGrid, etc.
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.submitContact = async (req, res) => {
    try {
        const { name, email, phone, serviceType, message } = req.body;

        if (!name || !email || !phone || !serviceType || !message) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const newContact = new Contact({ name, email, phone, serviceType, message });
        await newContact.save();

        // Send Email Notification
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.BUSINESS_EMAIL,
            subject: `New Contact Form Submission from ${name}`,
            text: `You have received a new contact request:
Name: ${name}
Email: ${email}
Phone: ${phone}
Service: ${serviceType}
Message: ${message}`
        };

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
             transporter.sendMail(mailOptions, (error, info) => {
                 if (error) {
                     console.error('Email error:', error);
                 }
             });
        }

        res.status(201).json({ message: 'Contact form submitted successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json(contacts);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.deleteContact = async (req, res) => {
    try {
        const { id } = req.params;
        await Contact.findByIdAndDelete(id);
        res.json({ message: 'Contact deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.resolveContact = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await Contact.findByIdAndUpdate(id, { resolved: true }, { new: true });
        res.json(contact);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};
