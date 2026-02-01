# 📈 LSTM Stock Price Predictor

A professional web application that uses Long Short-Term Memory (LSTM) neural networks to predict next-day stock prices and provide trading recommendations.

## 🎯 What This Project Shows

### Technical Skills
- ✅ **Deep Learning**: LSTM neural network implementation using TensorFlow/Keras
- ✅ **Data Pipeline**: Real-time data fetching from Yahoo Finance API
- ✅ **Full-Stack Development**: Flask backend + JavaScript frontend
- ✅ **Data Preprocessing**: MinMaxScaler normalization, sequence preparation
- ✅ **Web Development**: Responsive UI with Chart.js visualization

### Business Value
- 📊 Converts complex ML predictions into actionable buy/sell/hold decisions
- 🎨 Clean, professional UI suitable for real-world deployment
- 🔄 Real-time prediction with confidence scoring
- 📈 Interactive visualization of historical and predicted prices

---

## 🚀 Quick Start

### Installation

```bash
# 1. Clone/Download the project
cd stock_predictor

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run the application
python app.py

# 4. Open browser
# Navigate to: http://localhost:5000
```

### Usage

1. **Select Stock**: Choose from Indian (NSE) or US stocks
2. **Set Date Range**: Pick training data period (recommended: 2-3 years)
3. **Click Predict**: Wait for model training (~10-30 seconds)
4. **View Results**: See predicted price, decision, and confidence

---

## 🏗️ Architecture

### Backend (Flask + TensorFlow)

```
User Request
    ↓
Flask API (/predict)
    ↓
Fetch Stock Data (yfinance)
    ↓
Preprocess Data (MinMaxScaler)
    ↓
Create Sequences (60-day lookback)
    ↓
Train LSTM Model
    ↓
Predict Next Day Price
    ↓
Calculate Buy/Sell/Hold Decision
    ↓
Return JSON Response
```

### LSTM Model Architecture

```python
Layer 1: LSTM(50 units, return_sequences=True)
Dropout: 0.2
Layer 2: LSTM(50 units)
Dropout: 0.2
Dense: 25 units
Output: 1 unit (predicted price)

Optimizer: Adam
Loss: MSE (Mean Squared Error)
Training: 10 epochs, batch_size=32
```

### Frontend (HTML/CSS/JavaScript)

```
User Interface
    ↓
Input Form (Stock, Dates)
    ↓
Fetch API Call to /predict
    ↓
Display Loading Animation
    ↓
Receive Prediction Results
    ↓
Render Chart.js Visualization
    ↓
Show Buy/Sell/Hold Decision
```

---

## 📊 UI Components

### 1. Input Section
- **Stock Selector**: Dropdown with popular stocks (RELIANCE.NS, TCS.NS, AAPL, GOOGL, etc.)
- **Date Range**: Start and end date pickers for training data
- **Predict Button**: Triggers the prediction process

### 2. Price Chart
- **Historical Prices**: Line chart showing past stock movement
- **Predicted Price**: Green dot showing next-day prediction
- **Interactive**: Hover tooltips with exact values

### 3. Results Display
- **Current Price**: Latest closing price from data
- **Predicted Price**: LSTM model's next-day prediction
- **Expected Change**: Percentage change (green/red colored)
- **Decision**: BUY/SELL/HOLD based on prediction
- **Confidence**: Algorithm confidence score (50-95%)

---

## 🧠 How It Works

### Data Preparation
1. Download historical stock data using `yfinance`
2. Extract closing prices
3. Normalize data using MinMaxScaler (0-1 range)
4. Create sequences of 60 days to predict day 61

### LSTM Training
1. Build sequential model with 2 LSTM layers
2. Add dropout for regularization (prevents overfitting)
3. Train on historical sequences
4. Optimize using Adam algorithm

### Prediction Logic
1. Take last 60 days of data
2. Feed into trained LSTM model
3. Get predicted price for next day
4. Calculate % change from current price

### Decision Algorithm
```
if change > +1.5%  → BUY  (confidence: 75-95%)
if change < -1.5%  → SELL (confidence: 75-95%)
else              → HOLD (confidence: 50-70%)
```

---

## 📁 Project Structure

```
stock_predictor/
│
├── app.py                 # Flask backend with LSTM logic
├── requirements.txt       # Python dependencies
│
├── templates/
│   └── index.html        # Main UI template
│
├── static/
│   ├── css/
│   │   └── style.css     # Professional styling
│   └── js/
│       └── app.js        # Chart rendering & API calls
│
└── README.md             # This file
```

---

## 🔧 Technology Stack

| Component | Technology |
|-----------|-----------|
| **ML Framework** | TensorFlow 2.15 + Keras |
| **Web Framework** | Flask 3.0 |
| **Data Source** | yfinance (Yahoo Finance API) |
| **Data Processing** | NumPy, Pandas, scikit-learn |
| **Visualization** | Chart.js |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |

---

## 📸 Screenshots

### Main Interface
- Clean input form with stock selector and date pickers
- Professional gradient background
- Responsive design

### Prediction Results
- Historical price chart with smooth line
- Predicted price shown as green dot
- Clear buy/sell/hold recommendation
- Confidence percentage

---

## 🎯 Key Features

1. **Real-Time Data**: Fetches latest stock prices from Yahoo Finance
2. **LSTM Neural Network**: 2-layer architecture with dropout regularization
3. **Interactive Chart**: Hover tooltips, zoom, pan functionality
4. **Decision Logic**: Converts predictions to actionable recommendations
5. **Confidence Scoring**: Provides reliability metric for each prediction
6. **Multi-Market Support**: Works with NSE (India) and US stocks
7. **Responsive Design**: Works on desktop, tablet, and mobile

---

## 👨‍💻 Developer Notes

### Model Parameters
- **Lookback Window**: 60 days (approximately 3 months of trading)
- **Epochs**: 10 (balanced for speed vs. accuracy)
- **Batch Size**: 32
- **Dropout Rate**: 0.2 (20% neurons dropped during training)

### API Response Format
```json
{
    "success": true,
    "dates": ["2022-01-01", "2022-01-02", ...],
    "historical_prices": [100.5, 101.2, ...],
    "current_price": 150.25,
    "predicted_price": 152.10,
    "price_change": 1.23,
    "decision": "BUY",
    "confidence": 81
}
```

---

