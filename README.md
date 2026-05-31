# Imagica ✨
**Unleash Your Creativity – Turn Text into Stunning Visuals Instantly!**

![React](https://img.shields.io/badge/React-17.0.2-blue?logo=react) ![Node.js](https://img.shields.io/badge/Node.js-18-green?logo=node.js) ![MongoDB](https://img.shields.io/badge/MongoDB-5.0-green?logo=mongodb) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3-blue?logo=tailwind-css) ![Render](https://img.shields.io/badge/Render-Deployed-blueviolet)

**Imagica** is an AI-powered platform that transforms your text prompts into beautiful, high-quality images in seconds. Whether you're a designer, developer, or content creator, Imagica helps you visualize your ideas effortlessly.

---

## 🚀 Product Highlights

- **AI Text-to-Image Generation:** Turn simple text prompts into high-quality visuals in real-time.  
- **Seamless Authentication:** Secure signup/login with JWT and bcrypt.  
- **Password Reset via Email:** Forgot your password? Receive instant reset links via SendGrid.  
- **Credit-Based System:** Purchase credits for premium image generations via Razorpay.  
- **Responsive & Interactive UI:** Smooth animations with Framer Motion and modern TailwindCSS design.  
- **Notifications & Feedback:** Real-time feedback using React Hot Toast ensures a seamless experience.

---

## 🖥 Tech Stack

**Frontend:** React.js, TailwindCSS, Framer Motion, Axios, React Hot Toast, Context API  
**Backend:** Node.js, Express.js, MongoDB, JWT, bcrypt, SendGrid (emails), Razorpay (payments)

---

## 🛠 Key Functionalities

### Authentication
- **Secure Registration & Login:** Passwords hashed using bcrypt.  
- **JWT Tokens:** Protect routes and manage user sessions.  
- **Password Reset:** Reset links sent via SendGrid, redirecting users after update.

### Credits & Payments
- **Plans:** Basic, Advanced, Business with respective credits.  
- **Razorpay Integration:** Safe, real-time payment processing.  
- **Transaction Logging:** Payments and credit updates tracked in MongoDB.

### AI Image Generation
- **Text Input:** Users submit a text prompt.  
- **Instant Output:** Backend processes request and returns generated image.  
- **Premium Access:** Limited free credits, with ability to purchase more.

---

## 🌟 User Journey

1. **Signup/Login:** Create an account or log in securely.  
2. **Prompt Submission:** Enter your creative idea as text.  
3. **Image Generation:** Get AI-generated images instantly.  
4. **Credits Management:** Buy credits to unlock premium features.  
5. **Password Reset:** Easily recover your account via email if needed.

---

## 📁 Project Structure

Imagica/
│
├── client/ # React frontend
│ ├── src/
│ │ ├── components/ # UI components
│ │ ├── context/ # Global state with Context API
│ │ └── assets/ # Images & icons
│ └── .env # FRONTEND_URL
│
├── server/ # Node.js backend
│ ├── controllers/ # User & payment controllers
│ ├── models/ # MongoDB models
│ ├── routes/ # Express routes
│ ├── middlewares/ # JWT auth middleware
│ └── server.js # Entry point
│
└── README.md

🎯 Why Imagica?

Fast, AI-driven creative output.
Secure authentication & data management.
Scalable with credits & premium plans.
Modern and responsive user experience.
Ideal for designers, content creators, and developers.

📫 Contact

Developer: Parv Chaturvedi
GitHub: https://github.com/ParvChaturvedi
Email: parvchaturvedi2005@gmail.com
