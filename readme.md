# WebChat - Real-Time Chat Application

A full-stack, real-time web chat application built with **React**, **Node.js**, **Express**, **Socket.IO**, and **MongoDB**. This app enables users to register, log in, view online users, and exchange text and image messages instantly.

---

## 🚀 Live Demo

- **Frontend**: [https://webchat-frontend-p.onrender.com](https://webchat-frontend-p.onrender.com)
- **Backend**: [https://webchat-backend-mbbq.onrender.com/api/status](https://webchat-backend-mbbq.onrender.com/api/status)

---

## 🖼️ Screenshots

### 1. Login Page

<img width="1422" height="806" alt="image" src="https://github.com/user-attachments/assets/35f2e48b-9a72-4603-805a-74ccd76c781e" />


### 2. Chat UI

<img width="1848" height="811" alt="image" src="https://github.com/user-attachments/assets/2808bbab-93a8-402d-a350-7416a0a24b10" />


### 3. Image Messaging

<img width="669" height="813" alt="image" src="https://github.com/user-attachments/assets/2b72e85d-6327-4967-a895-4e0aaa0b3077" />

### 4. Edit Profile Page

<img width="1452" height="752" alt="image" src="https://github.com/user-attachments/assets/0fd1ed83-a50b-4147-affc-1bf49a42af3b" />


---

## 🧠 Features

- Real-time messaging via **Socket.IO**
- User authentication with **JWT** and **HttpOnly Cookies**
- **Image message support** via **Multer** + **Cloudinary**
- Fully responsive UI built with **React + Tailwind CSS**
- View online users in real-time
- Profile update functionality

---

## 🏗️ Tech Stack

- **Frontend**: Vite + React + Tailwind CSS + Socket.IO client
- **Backend**: Node.js + Express + MongoDB + Socket.IO server
- **Authentication**: JWT with refresh token rotation (stored in cookies)
- **Image Uploads**: Multer for file handling + Cloudinary
- **Deployment**: Render (Static + Web Service)

---

## 📦 Installation (Local Development)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/webchat.git
cd webchat
```

### 2. Setup Backend

```bash
cd backend
npm install
```

- Create `.env` file with:

```env
PORT=5000
MONGO_URI=your_mongo_connection
CORS_ORIGIN=*

ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_SECRET=
CLOUDINARY_API_KEY=
```

- Start the backend:

```bash
npm run start
```

### 3. Setup Frontend

```bash
cd ../client
npm install
npm run dev
```

Make sure `axios.defaults.baseURL` points to your local backend:

```js
axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;
```

---

## 🚀 Deployment on Render

### Backend (Web Service)

1. Create a new Web Service
2. Set **build command**: `npm install`
3. Set **start command**: `npm run dev`
4. Add environment variables as per `.env`

### Frontend (Static Site)

1. `cd client`
2. Run:

```bash
npm run build
```

3. Push to GitHub
4. Create **Static Site** on Render
5. Set **build command**: `npm install && npm run build`
6. Set **publish directory**: `dist`

Make sure to update the backend `CORS` config to allow the frontend domain:

```js
origin: "https://webchat-frontend-p.onrender.com",
```

---

## 🙋‍♂️ Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss.

---

## 📄 License

[MIT](https://choosealicense.com/licenses/mit/)

---
