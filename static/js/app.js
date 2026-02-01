let priceChart = null;

async function makePrediction() {
    const stock = document.getElementById('stock').value;
    const startDate = document.getElementById('start_date').value;
    const endDate = document.getElementById('end_date').value;

    // Show loading, hide results
    document.getElementById('loading').style.display = 'block';
    document.getElementById('error').style.display = 'none';
    document.getElementById('chartSection').style.display = 'none';
    document.getElementById('results').style.display = 'none';

    try {
        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                stock: stock,
                start_date: startDate,
                end_date: endDate
            })
        });

        const data = await response.json();

        // Hide loading
        document.getElementById('loading').style.display = 'none';

        if (!data.success) {
            showError(data.error);
            return;
        }

        // Display results
        displayResults(data);

    } catch (error) {
        document.getElementById('loading').style.display = 'none';
        showError('Network error: ' + error.message);
    }
}

function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function displayResults(data) {
    // Update price information
    const currency = data.dates[0].includes('.NS') ? '₹' : '$';
    document.getElementById('currentPrice').textContent = 
        `${currency}${data.current_price.toFixed(2)}`;
    document.getElementById('predictedPrice').textContent = 
        `${currency}${data.predicted_price.toFixed(2)}`;
    
    const changeElement = document.getElementById('priceChange');
    const change = data.price_change;
    changeElement.textContent = `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
    changeElement.style.color = change >= 0 ? '#10b981' : '#ef4444';

    // Update decision
    const decisionElement = document.getElementById('decision');
    decisionElement.textContent = data.decision;
    decisionElement.className = `decision ${data.decision}`;

    document.getElementById('confidence').textContent = `${data.confidence}%`;

    // Show results
    document.getElementById('results').style.display = 'block';

    // Draw chart
    drawChart(data);
}

function drawChart(data) {
    const ctx = document.getElementById('priceChart').getContext('2d');

    // Destroy existing chart
    if (priceChart) {
        priceChart.destroy();
    }

    // Prepare data for chart
    const labels = data.dates;
    const prices = data.historical_prices;

    // Add predicted point
    const nextDay = new Date(labels[labels.length - 1]);
    nextDay.setDate(nextDay.getDate() + 1);
    const nextDayStr = nextDay.toISOString().split('T')[0];

    labels.push(nextDayStr);
    
    // Historical prices
    const historicalData = prices.map((price, index) => ({
        x: labels[index],
        y: price
    }));

    // Predicted price (only the last point)
    const predictedData = Array(prices.length).fill(null);
    predictedData.push(data.predicted_price);

    priceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Historical Price',
                    data: historicalData,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.1,
                    pointRadius: 0,
                    pointHoverRadius: 5
                },
                {
                    label: 'Predicted Price',
                    data: predictedData,
                    borderColor: '#10b981',
                    backgroundColor: '#10b981',
                    borderWidth: 0,
                    pointRadius: 8,
                    pointHoverRadius: 10,
                    pointStyle: 'circle',
                    showLine: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                const currency = data.dates[0].includes('.NS') ? '₹' : '$';
                                label += currency + context.parsed.y.toFixed(2);
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Date',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        maxTicksLimit: 10,
                        autoSkip: true
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Price',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        callback: function(value) {
                            const currency = data.dates[0].includes('.NS') ? '₹' : '$';
                            return currency + value.toFixed(2);
                        }
                    }
                }
            }
        }
    });

    // Show chart section
    document.getElementById('chartSection').style.display = 'block';
}

// Set default dates on page load
window.onload = function() {
    const today = new Date();
    const threeYearsAgo = new Date();
    threeYearsAgo.setFullYear(today.getFullYear() - 3);

    document.getElementById('end_date').value = today.toISOString().split('T')[0];
    document.getElementById('start_date').value = threeYearsAgo.toISOString().split('T')[0];
};
