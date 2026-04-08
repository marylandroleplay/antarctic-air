const Appointment = require('../models/Appointment');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.bookAppointment = async (req, res) => {
    try {
        const { name, email, phone, serviceType, preferredDate, preferredTime, notes } = req.body;

        if (!name || !email || !phone || !serviceType || !preferredDate || !preferredTime) {
            return res.status(400).json({ error: 'All fields except notes are required.' });
        }

        const newAppt = new Appointment({ name, email, phone, serviceType, preferredDate, preferredTime, notes });
        await newAppt.save();

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            // Notify Business Owner
            transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: process.env.BUSINESS_EMAIL,
                subject: `New Appointment Request: ${name}`,
                text: `New appointment requested by ${name}.
Email: ${email}
Phone: ${phone}
Service: ${serviceType}
Date: ${preferredDate}
Time: ${preferredTime}
Notes: ${notes || 'None'}`
            }, (err) => { if(err) console.error(err); });

            // Notify Customer
            transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Appointment Request Confirmation - Antarctic Air',
                text: `Hello ${name},

We have received your appointment request for ${serviceType} on ${preferredDate} at ${preferredTime}.
Our team will review this and contact you to confirm the appointment shortly.

Thank you,
Antarctic Air, Inc.`
            }, (err) => { if(err) console.error(err); });
        }

        res.status(201).json({ message: 'Appointment booked successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getAppointments = async (req, res) => {
    try {
        const appts = await Appointment.find().sort({ createdAt: -1 });
        res.json(appts);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.resolveAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const appt = await Appointment.findByIdAndUpdate(id, { resolved: true }, { new: true });
        res.json(appt);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        await Appointment.findByIdAndDelete(id);
        res.json({ message: 'Appointment deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};
