# HealthSure - Deployment Guide

## 🏗️ Architecture Overview

This is a **full-stack application** with:
- **Frontend**: React + Vite + Tailwind (deployed on Vercel/Lovable)
- **Backend**: Node.js + Express + MySQL (deploy separately on Render/Railway/Heroku)
- **Database**: MySQL (use db4free.net, FreeMySQLHosting, or PlanetScale)

## 📁 Project Structure

```
healthsure/
├── src/                          # Frontend React app (current project)
├── database/
│   └── schema.sql               # Complete MySQL schema
├── backend-reference/           # Backend API reference code
│   ├── server.js                # Main Express server
│   ├── routes/                  # API routes
│   ├── middleware/              # Auth middleware
│   ├── .env.example            # Environment variables template
│   └── package.json            # Backend dependencies
└── README-DEPLOYMENT.md        # This file
```

## 🗄️ Step 1: Setup MySQL Database

### Option A: db4free.net (Free, Easy)
1. Go to https://www.db4free.net/signup.php
2. Create account and database
3. Note your credentials:
   - Host: `db4free.net`
   - Port: `3306`
   - Database name: `your_db_name`
   - Username: `your_username`
   - Password: `your_password`

### Option B: PlanetScale (Recommended, Free tier)
1. Go to https://planetscale.com
2. Create free account and database
3. Get connection string

### Import Schema
```bash
# Connect to your MySQL database
mysql -h db4free.net -u your_username -p your_db_name

# Import the schema
mysql -h db4free.net -u your_username -p your_db_name < database/schema.sql
```

Or use a GUI tool like MySQL Workbench, phpMyAdmin, or DBeaver.

## 🚀 Step 2: Deploy Backend

### Deploy on Render.com

1. **Create a new repository** for your backend:
   ```bash
   # Copy backend-reference to a new folder
   mkdir healthsure-backend
   cp -r backend-reference/* healthsure-backend/
   cd healthsure-backend
   git init
   git add .
   git commit -m "Initial backend"
   ```

2. **Push to GitHub**:
   ```bash
   # Create a new repo on GitHub
   git remote add origin https://github.com/yourusername/healthsure-backend.git
   git push -u origin main
   ```

3. **Deploy on Render**:
   - Go to https://render.com
   - Click "New" → "Web Service"
   - Connect your GitHub repo
   - Settings:
     - Name: `healthsure-api`
     - Environment: `Node`
     - Build Command: `npm install`
     - Start Command: `npm start`
   - Add Environment Variables:
     ```
     DB_HOST=db4free.net
     DB_USER=your_username
     DB_PASSWORD=your_password
     DB_NAME=your_db_name
     JWT_SECRET=your-super-secret-key-change-this
     PORT=5000
     NODE_ENV=production
     ```
   - Click "Create Web Service"

4. **Note your API URL**: `https://healthsure-api.onrender.com`

### Alternative: Railway.app
- Similar process, just import from GitHub
- Add same environment variables

## 🎨 Step 3: Connect Frontend to Backend

Update your frontend API calls to use your deployed backend URL.

Create `src/config/api.ts`:
```typescript
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://healthsure-api.onrender.com';

export const apiClient = {
  get: async (endpoint: string) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });
    return response.json();
  },
  
  post: async (endpoint: string, data: any) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};
```

## 🌐 Step 4: Deploy Frontend

### Via Lovable (Current)
Your frontend is already deployed on Lovable. Just publish it!

### Via Vercel (Alternative)
1. Push your frontend code to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Add environment variable:
   ```
   VITE_API_URL=https://healthsure-api.onrender.com
   ```
5. Deploy

## 🔐 Step 5: Configure CORS

Update your backend's CORS settings to allow your frontend domain:

```javascript
// In backend-reference/server.js
app.use(cors({
  origin: [
    'https://your-lovable-domain.lovable.app',
    'https://your-vercel-domain.vercel.app',
    'http://localhost:8080' // for local development
  ],
  credentials: true
}));
```

## ✅ Step 6: Test the Application

1. **Test Database**:
   ```bash
   curl https://healthsure-api.onrender.com/api/health
   ```

2. **Test Registration**:
   ```bash
   curl -X POST https://healthsure-api.onrender.com/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"Test@123","role":"customer","name":"Test User","phone":"9876543210"}'
   ```

3. **Test Login**:
   ```bash
   curl -X POST https://healthsure-api.onrender.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"Test@123"}'
   ```

## 📋 API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Policies
- `GET /api/policies` - Get all policies
- `POST /api/policies` - Create policy (admin only)
- `PUT /api/policies/:id` - Update policy (admin only)
- `DELETE /api/policies/:id` - Delete policy (admin only)

### Claims
- `GET /api/claims` - Get user's claims
- `POST /api/claims` - File new claim
- `PUT /api/claims/:id` - Update claim status (admin/agent)

### Payments
- `GET /api/payments` - Get payment history
- `POST /api/payments` - Record payment

### Support
- `GET /api/support` - Get support tickets
- `POST /api/support` - Create support ticket
- `PUT /api/support/:id` - Respond to ticket (admin/agent)

## 🛠️ Local Development

### Backend
```bash
cd backend-reference
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

### Frontend (Current Project)
```bash
npm install
npm run dev
```

## 🔒 Security Checklist

- ✅ Change JWT_SECRET to a strong random string
- ✅ Use environment variables for all credentials
- ✅ Enable HTTPS on all endpoints
- ✅ Implement rate limiting on auth endpoints
- ✅ Validate all user inputs
- ✅ Use prepared statements (already done in code)
- ✅ Set proper CORS origins

## 📊 Database Backup

Regular backup command:
```bash
mysqldump -h db4free.net -u your_username -p your_db_name > backup.sql
```

## 🚨 Troubleshooting

### Backend won't start
- Check environment variables are set correctly
- Verify MySQL connection credentials
- Check Render logs

### Frontend can't reach backend
- Verify CORS settings
- Check API_BASE_URL is correct
- Ensure backend is running

### Database connection fails
- Verify MySQL host is accessible
- Check firewall settings
- Confirm credentials are correct

## 📚 Resources

- [Render Documentation](https://render.com/docs)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Express.js Guide](https://expressjs.com/)
- [JWT Best Practices](https://jwt.io/introduction)

## 🎉 You're Done!

Your HealthSure application is now fully deployed with:
- ✅ MySQL database
- ✅ Node.js + Express backend
- ✅ React frontend
- ✅ JWT authentication
- ✅ All 7 features working

Access your app and start managing health insurance!
