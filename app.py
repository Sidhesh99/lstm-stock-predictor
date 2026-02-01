from flask import Flask, render_template, request, jsonify
import yfinance as yf
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
import warnings
warnings.filterwarnings('ignore')

app = Flask(__name__)

class StockPredictor:
    def __init__(self):
        self.scaler = MinMaxScaler(feature_range=(0, 1))
        self.model = None
        
    def create_model(self, input_shape):
        """Create LSTM model"""
        model = Sequential([
            LSTM(50, return_sequences=True, input_shape=input_shape),
            Dropout(0.2),
            LSTM(50, return_sequences=False),
            Dropout(0.2),
            Dense(25),
            Dense(1)
        ])
        model.compile(optimizer='adam', loss='mean_squared_error')
        return model
    
    def prepare_data(self, data, lookback=60):
        """Prepare data for LSTM"""
        scaled_data = self.scaler.fit_transform(data.reshape(-1, 1))
        
        X, y = [], []
        for i in range(lookback, len(scaled_data)):
            X.append(scaled_data[i-lookback:i, 0])
            y.append(scaled_data[i, 0])
        
        X, y = np.array(X), np.array(y)
        X = np.reshape(X, (X.shape[0], X.shape[1], 1))
        
        return X, y, scaled_data
    
    def predict_next_day(self, stock_symbol, start_date, end_date):
        """Main prediction function"""
        try:
            # Fetch data
            stock = yf.download(stock_symbol, start=start_date, end=end_date, progress=False)
            
            if stock.empty or len(stock) < 70:
                return None, "Insufficient data for prediction"
            
            prices = stock['Close'].values
            
            # Prepare data
            lookback = 60
            X, y, scaled_data = self.prepare_data(prices, lookback)
            
            if len(X) < 10:
                return None, "Insufficient data for training"
            
            # Create and train model
            self.model = self.create_model((X.shape[1], 1))
            self.model.fit(X, y, batch_size=32, epochs=10, verbose=0)
            
            # Predict next day
            last_sequence = scaled_data[-lookback:]
            last_sequence = np.reshape(last_sequence, (1, lookback, 1))
            
            predicted_scaled = self.model.predict(last_sequence, verbose=0)
            predicted_price = self.scaler.inverse_transform(predicted_scaled)[0][0]
            
            # Calculate metrics
            current_price = prices[-1]
            price_change = ((predicted_price - current_price) / current_price) * 100
            
            # Determine decision
            if price_change > 1.5:
                decision = "BUY"
                confidence = min(75 + abs(price_change) * 2, 95)
            elif price_change < -1.5:
                decision = "SELL"
                confidence = min(75 + abs(price_change) * 2, 95)
            else:
                decision = "HOLD"
                confidence = max(50, 70 - abs(price_change) * 3)
            
            # Prepare historical data for chart
            dates = stock.index.strftime('%Y-%m-%d').tolist()
            historical_prices = prices.tolist()
            
            result = {
                'success': True,
                'dates': dates,
                'historical_prices': historical_prices,
                'current_price': float(current_price),
                'predicted_price': float(predicted_price),
                'price_change': float(price_change),
                'decision': decision,
                'confidence': int(confidence)
            }
            
            return result, None
            
        except Exception as e:
            return None, f"Error: {str(e)}"

predictor = StockPredictor()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        stock_symbol = data.get('stock', 'RELIANCE.NS')
        start_date = data.get('start_date', '2022-01-01')
        end_date = data.get('end_date', '2025-01-01')
        
        result, error = predictor.predict_next_day(stock_symbol, start_date, end_date)
        
        if error:
            return jsonify({'success': False, 'error': error})
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
