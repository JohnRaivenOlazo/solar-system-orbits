# 🌌 Solar System Orbits

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-0.175.0-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-Latest-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Latest-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

An interactive 3D visualization of our solar system, built with modern web technologies. Experience the beauty of planetary motion and explore the celestial bodies in our cosmic neighborhood.

## ✨ Features

- 🌍 Accurate 3D representations of planets
- 🛸 Realistic orbital mechanics
- 🎮 Interactive camera controls
- 📱 Responsive design
- 🎨 Beautiful UI with Radix UI components
- 📊 Real-time planetary data
- ⚡ Fast performance with Next.js

## 🛠️ Tech Stack

### Frontend
- Next.js 15.2.4
- React 18.3.1
- Three.js 0.175.0
- TypeScript
- Tailwind CSS
- Radix UI Components
- React Three Fiber

### Backend
- Python
- Flask
- CORS handling
- RESTful API

## 🚀 Getting Started

### Prerequisites
- Node.js (18.18.0 or higher)
- Python 3.8+
- pnpm (recommended) or npm

### Development Setup

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/solar-system-orbits.git
cd solar-system-orbits
\`\`\`

2. Frontend Setup:
\`\`\`bash
cd client
pnpm install
pnpm dev
\`\`\`

3. Backend Setup:
\`\`\`bash
cd server
pip install -r requirements.txt
python index.py
\`\`\`

The development server will be running at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 🌐 Deployment

The project is deployed on Vercel:
- Frontend: https://solar-system-orbits.vercel.app
- Backend: https://solar-system-orbits.api.vercel.app

## 🎯 API Endpoints

- GET `/simulation` - Get current simulation data
- POST `/simulation/settings` - Update simulation settings
- POST `/simulation/reset` - Reset simulation to default state

## 📱 Environment Variables

Frontend (.env.local):
\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:5000 # Development
NEXT_PUBLIC_API_URL=https://solar-system-orbits.api.vercel.app # Production
\`\`\`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## 🙏 Acknowledgments

- NASA for planetary data
- Three.js community for 3D graphics support
- Vercel for hosting services
