# 🚀 Quick Start Guide - No Sudo Required

This guide will help you run the Omaha Drain KPI Dashboard without requiring sudo privileges.

## ✅ What's Already Done

- ✅ Node.js 18 installed via nvm (no sudo required)
- ✅ Project dependencies installed
- ✅ Startup script created
- ✅ nvm configured in your shell profile

## 🎯 How to Run the Application

### Method 1: Using the Startup Script (Recommended)

```bash
./start.sh
```

This script will:
- Load nvm automatically
- Check for Node.js
- Install dependencies if needed
- Start the development server

### Method 2: Manual Commands

```bash
# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Start the development server
npm run dev
```

## 🌐 Access the Application

Once the server starts, open your web browser and go to:
**http://localhost:3000**

## 📁 Project Files

Your dashboard is located at:
```
/Users/raadchfat/omaha-drain-dashboard/
```

## 🔧 Available Commands

- `./start.sh` - Start the development server
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 📊 Testing the Application

1. **Create Sample Excel Files** using the guide in `SAMPLE_DATA.md`
2. **Upload Files** using the drag-and-drop interface
3. **Select Week Range** using the date picker
4. **Process Data** to see KPI calculations
5. **View Results** in the interactive dashboard

## 🛠️ Troubleshooting

### If the server doesn't start:
```bash
# Check if Node.js is available
node --version

# If not found, reload nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 18
```

### If dependencies are missing:
```bash
npm install
```

### If port 3000 is in use:
The application will automatically try port 3001, 3002, etc.

## 📚 Next Steps

1. **Read the README.md** for detailed documentation
2. **Check SAMPLE_DATA.md** for testing data
3. **Create your Excel files** following the format guide
4. **Start using the dashboard!**

## 🎉 You're All Set!

The Omaha Drain KPI Dashboard is now ready to use. No sudo privileges were required, and everything is installed in your user directory. 