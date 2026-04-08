# Antarctic Air - Full Stack Application

This is the full-stack MERN-like application for Antarctic Air (HTML/CSS/JS Frontend, Node/Express Backend, MongoDB Database).

## Features
- **Frontend**: Clean, high-end design using Tailwind CSS, vanilla JS, HTML
- **Backend API**: Contact form handling, Booking appointments, Promotional Banner management
- **Admin Dashboard**: Password protected, view/resolve/delete submissions, toggle promo banner
- **Emails**: Automated emails sent to business owner and customer via Nodemailer
- **Security**: Rate limiting, Helmet.js headers, strict authentication

## Project Structure
```text
antarctic-air/
├── public/          (frontend HTML/CSS/JS files)
├── routes/          (Express route files)
├── models/          (Mongoose models)
├── middleware/      (auth, rate limiting)
├── controllers/     (business logic)
├── .env.example
├── server.js
└── README.md
```

## Prerequisites
- Node.js (v14 or above)
- MongoDB (Running locally or MongoDB Atlas)
- Gmail App Password (if using Gmail for Nodemailer)

## Local Setup Instructions

1. **Install Dependencies**
   Navigate to the project folder and run:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Rename `.env.example` to `.env` and fill out the values:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/antarctic_air
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=secretpassword
   SESSION_SECRET=enter_a_random_long_string_here
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_gmail_app_password
   BUSINESS_EMAIL=your_business_email@test.com
   ```
   *Note: For the `EMAIL_PASS`, you need to set up an "App Password" if you are using Gmail.*

3. **Start MongoDB**
   Make sure MongoDB is running. If using a local instance, usually `mongod` is all you need. If using MongoDB Atlas, replace `MONGODB_URI` with your connection string.

4. **Run the server**
   ```bash
   npm run dev
   ```
   *Or `npm start` for production.*

5. **Open in Browser**
   - Website: `http://localhost:3000`
   - Admin Panel: `http://localhost:3000/admin.html`

## Deployment (Railway / Render)

### Database (MongoDB Atlas)
1. Set up a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Allow access from anywhere (`0.0.0.0/0`) under Network Access.
3. Keep your connection string handy.

### Hosting (Render / Railway)

**Render:**
1. Connect your Github repository to Render.
2. Select "Web Service".
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Click **Advanced** and add your **Environment Variables** (exactly matching your `.env` file).

**Railway:**
1. Connect Github repo.
2. Under Variables, add all your Environment Variables.
3. Railway will detect `package.json` and deploy it automatically.

### Nodemailer Note for Production
Using Gmail in production can sometimes cause blocks due to "Less secure apps" restrictions. Keep your App Password handy or consider using a real SMTP service like SendGrid, Mailgun, or Brevo (Sendinblue) for production emailing. If swapping, just change the `transporter` settings in the controllers.
