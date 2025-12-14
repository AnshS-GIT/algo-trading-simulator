# Algo Trading Simulator

A full-stack application for simulating algorithmic trading strategies.

## Features
- Real-time stock market dashboard
- Historical data backtesting (Python engine)
- Strategy management: SMA, EMA, RSI
- Performance analytics

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Chart.js
- **Backend**: Node.js, Express, WebSocket
- **Engine**: Python, Pandas, yfinance
- **Database**: MongoDB

## Setup

### Prerequisites
- Node.js
- Python 3.8+
- MongoDB

### Installation
1. Server: `cd server && npm install`
2. Client: `cd client && npm install`
3. Engine: `cd engine && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt`

### Running
1. Start Backend: `cd server && npm run dev`
2. Start Frontend: `cd client && npm run dev`

## Deployment

1.  **Backend**:
    - Set environment variables (see `.env.sample`).
    - Run `npm start`.
2.  **Frontend**:
    - Set `VITE_API_URL` to backend URL.
    - Run `npm run build`.
    - Serve `dist/` folder.
3.  **Python Service**:
    - Install requirements: `pip install -r requirements.txt`.
    - Run `uvicorn main:app --host 0.0.0.0 --port 8000`.

## Resume / Project Description

**Summary**: Full-stack algorithmic trading platform featuring a Python-based backtesting engine, WebSocket live market data, and a secure MERN stack dashboard for strategy visualization.

**Tech Stack**:
- **Frontend**: React, Vite, TailwindCSS, Chart.js
- **Backend**: Node.js, Express, MongoDB (JWT Auth)
- **Engine**: Python, Pandas, FastAPI, Vectorized Backtesting
- **Real-time**: WebSocket (Mock Feed)

**Key Features**:
- **Vectorized Backtesting**: High-performance Python engine using Pandas for SMA, RSI, and Breakout strategies.
- **Secure Architecture**: JWT-based authentication with bcrypt password hashing and protected API routes.
- **Interactive Visualization**: Dynamic equity curve charts and detailed performance metrics (ROI, Win Rate, Drawdown).
- **User Persistence**: MongoDB storage for user-specific backtest history and strategy parameters.

**Quant Relevance**:
- Demonstrates understanding of **Event-Driven vs Vectorized** backtesting.
- Implements core financial metrics (Sharpe Ratio proxy, Max Drawdown).
- Handles real-time data ingestion via WebSockets.
