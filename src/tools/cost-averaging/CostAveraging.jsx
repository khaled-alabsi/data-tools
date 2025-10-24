import React, { useState, useMemo, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { TrendingDown, TrendingUp, AlertCircle, CheckCircle2, Plus, Minus, Info, Copy, Share2 } from 'lucide-react';
import './CostAveraging.css';

// Generate random starting values
const generateRandomValues = () => {
  const shares = Math.floor(Math.random() * (5000 - 100) + 100);
  const currentPrice = Number((Math.random() * (100 - 1) + 1).toFixed(2));
  const targetPrice = Number((currentPrice * (0.7 + Math.random() * 0.25)).toFixed(2));

  return {
    shares,
    currentPrice,
    targetPrice,
  };
};

const CostAveraging = () => {
  // Generate random initial values
  const [initialValues] = useState(() => generateRandomValues());

  // Input states with random initial values
  const [currentShares, setCurrentShares] = useState(initialValues.shares);
  const [currentPrice, setCurrentPrice] = useState(initialValues.currentPrice);
  const [targetPrice, setTargetPrice] = useState(initialValues.targetPrice);
  const [newPrice, setNewPrice] = useState(0);
  const [currency, setCurrency] = useState('€');

  // Track if user has manually edited the new price
  const [hasEditedNewPrice, setHasEditedNewPrice] = useState(false);

  // Initialize smart default price (25% less than current price) only once
  useEffect(() => {
    if (newPrice === 0 && !hasEditedNewPrice) {
      setNewPrice(Number((currentPrice * 0.75).toFixed(2)));
    }
  }, [currentPrice, newPrice, hasEditedNewPrice]);

  // Update smart default when current price changes, but only if user hasn't edited it
  useEffect(() => {
    if (!hasEditedNewPrice) {
      setNewPrice(Number((currentPrice * 0.75).toFixed(2)));
    }
  }, [currentPrice, hasEditedNewPrice]);

  // Smart increment/decrement based on decimal places
  const getSmartIncrement = (value) => {
    const strValue = value.toString();
    if (!strValue.includes('.')) {
      return 1; // No decimal, increment by 1
    }
    const decimals = strValue.split('.')[1].length;
    if (decimals === 1) return 0.1;
    if (decimals === 2) return 0.01;
    return 0.001; // 3 or more decimals
  };

  // Smart adjust function
  const smartAdjust = (value, setValue, isIncrease) => {
    const increment = getSmartIncrement(value);
    const newValue = isIncrease ? value + increment : value - increment;
    setValue(Number(Math.max(0.001, newValue).toFixed(3)));
  };

  // Handle new price change
  const handleNewPriceChange = (value) => {
    setNewPrice(value);
    setHasEditedNewPrice(true);
  };

  // Calculate results
  const calculation = useMemo(() => {
    // Validate inputs
    if (currentShares <= 0 || currentPrice <= 0 || targetPrice <= 0 || newPrice <= 0) {
      return {
        valid: false,
        error: 'All values must be greater than zero',
      };
    }

    // Check if averaging down or up
    const isAveragingDown = newPrice < currentPrice;
    const isAveragingUp = newPrice > currentPrice;

    // Calculate new shares needed
    const numerator = currentShares * (targetPrice - currentPrice);
    const denominator = newPrice - targetPrice;

    // Check if denominator is zero
    if (Math.abs(denominator) < 0.0001) {
      return {
        valid: false,
        error: 'Target price cannot equal the new price',
      };
    }

    const newSharesNeeded = numerator / denominator;

    // Validate the result makes sense
    if (newSharesNeeded < 0) {
      if (isAveragingDown && targetPrice > currentPrice) {
        return {
          valid: false,
          error: 'Cannot average down to a higher price',
        };
      }
      if (isAveragingUp && targetPrice < currentPrice) {
        return {
          valid: false,
          error: 'Cannot average up to a lower price',
        };
      }
      return {
        valid: false,
        error: 'Target not achievable with this price',
      };
    }

    // Validate target is in correct range
    if (isAveragingDown && (targetPrice < newPrice || targetPrice > currentPrice)) {
      return {
        valid: false,
        error: 'Target must be between new price and current price',
      };
    }

    if (isAveragingUp && (targetPrice > newPrice || targetPrice < currentPrice)) {
      return {
        valid: false,
        error: 'Target must be between current price and new price',
      };
    }

    // Calculate final values
    const totalShares = currentShares + newSharesNeeded;
    const currentInvestment = currentShares * currentPrice;
    const newInvestment = newSharesNeeded * newPrice;
    const totalInvestment = currentInvestment + newInvestment;
    const finalAveragePrice = totalInvestment / totalShares;
    const priceChangePercent = ((finalAveragePrice - currentPrice) / currentPrice) * 100;

    return {
      valid: true,
      newSharesNeeded: Math.round(newSharesNeeded),
      newSharesNeededExact: newSharesNeeded,
      totalShares: Math.round(totalShares),
      currentInvestment,
      newInvestment,
      totalInvestment,
      finalAveragePrice,
      priceChangePercent,
      isAveragingDown,
      isAveragingUp,
    };
  }, [currentShares, currentPrice, targetPrice, newPrice]);

  // Copy to clipboard function
  const copyToClipboard = () => {
    if (!calculation.valid) return;

    const text = `Portfolio Averaging Tool - Results

Current Position:
• Shares: ${currentShares.toLocaleString()}
• Average Price: ${currency}${currentPrice.toFixed(2)}
• Total Investment: ${currency}${calculation.currentInvestment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}

Action Required:
• Buy ${calculation.newSharesNeeded.toLocaleString()} shares
• At ${currency}${newPrice.toFixed(2)} per share
• Additional Investment: ${currency}${calculation.newInvestment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}

Final Position:
• Total Shares: ${calculation.totalShares.toLocaleString()}
• Final Average Price: ${currency}${calculation.finalAveragePrice.toFixed(2)}
• Total Investment: ${currency}${calculation.totalInvestment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
• Price Change: ${calculation.priceChangePercent > 0 ? '+' : ''}${calculation.priceChangePercent.toFixed(2)}%

${calculation.isAveragingDown ? '📉 Averaging Down' : '📈 Averaging Up'}`;

    navigator.clipboard.writeText(text).then(() => {
      alert('Results copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy to clipboard');
    });
  };

  // Share function
  const shareResults = async () => {
    if (!calculation.valid) return;

    const text = `I need to buy ${calculation.newSharesNeeded.toLocaleString()} shares at ${currency}${newPrice.toFixed(2)} to reach my target average of ${currency}${calculation.finalAveragePrice.toFixed(2)}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Portfolio Averaging Results',
          text: text,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="cost-averaging">
      <div className="container">
        <div className="page-header">
          <h1>Portfolio Averaging Tool</h1>
          <p className="page-description">
            Calculate how many shares to buy to reach your target average price.
            Smart tool for averaging down or up your positions.
          </p>
        </div>

        {/* Main Calculator Card */}
        <Card>
          <div className="calculator-compact">
            {/* Currency Selection */}
            <div className="compact-row">
              <label className="compact-label">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="compact-select"
              >
                <option value="€">€ Euro</option>
                <option value="$">$ USD</option>
                <option value="£">£ GBP</option>
                <option value="¥">¥ Yen</option>
                <option value="CHF">CHF</option>
                <option value="kr">kr</option>
              </select>
            </div>

            {/* Current Position */}
            <div className="section-header">
              <h3>Current Position</h3>
            </div>

            <div className="compact-row">
              <label className="compact-label">Shares</label>
              <div className="input-with-buttons">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => smartAdjust(currentShares, setCurrentShares, false)}
                  className="adjust-btn"
                >
                  <Minus size={16} />
                </Button>
                <input
                  type="number"
                  className="compact-input"
                  value={currentShares}
                  onChange={(e) => setCurrentShares(Number(e.target.value))}
                  min={1}
                  step={1}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => smartAdjust(currentShares, setCurrentShares, true)}
                  className="adjust-btn"
                >
                  <Plus size={16} />
                </Button>
              </div>
            </div>

            <div className="compact-row">
              <label className="compact-label">Avg Price</label>
              <div className="input-with-buttons">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => smartAdjust(currentPrice, setCurrentPrice, false)}
                  className="adjust-btn"
                >
                  <Minus size={16} />
                </Button>
                <div className="input-with-currency">
                  <span className="currency-symbol">{currency}</span>
                  <input
                    type="number"
                    className="compact-input with-currency"
                    value={currentPrice}
                    onChange={(e) => setCurrentPrice(Number(e.target.value))}
                    min={0.01}
                    step={0.01}
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => smartAdjust(currentPrice, setCurrentPrice, true)}
                  className="adjust-btn"
                >
                  <Plus size={16} />
                </Button>
              </div>
            </div>

            <div className="info-box">
              <span className="info-label">Total Investment:</span>
              <span className="info-value">
                {currency}{(currentShares * currentPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            {/* Target & New Price */}
            <div className="section-header">
              <h3>Target & New Price</h3>
            </div>

            <div className="compact-row">
              <label className="compact-label">Target Avg</label>
              <div className="input-with-buttons">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => smartAdjust(targetPrice, setTargetPrice, false)}
                  className="adjust-btn"
                >
                  <Minus size={16} />
                </Button>
                <div className="input-with-currency">
                  <span className="currency-symbol">{currency}</span>
                  <input
                    type="number"
                    className="compact-input with-currency"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(Number(e.target.value))}
                    min={0.01}
                    step={0.01}
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => smartAdjust(targetPrice, setTargetPrice, true)}
                  className="adjust-btn"
                >
                  <Plus size={16} />
                </Button>
              </div>
            </div>

            <div className="compact-row">
              <label className="compact-label">
                New Price
                <span className="label-hint">(auto: -25%)</span>
              </label>
              <div className="input-with-buttons">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    smartAdjust(newPrice, handleNewPriceChange, false);
                  }}
                  className="adjust-btn"
                >
                  <Minus size={16} />
                </Button>
                <div className="input-with-currency">
                  <span className="currency-symbol">{currency}</span>
                  <input
                    type="number"
                    className="compact-input with-currency centered"
                    value={newPrice}
                    onChange={(e) => handleNewPriceChange(Number(e.target.value))}
                    min={0.01}
                    step={0.01}
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    smartAdjust(newPrice, handleNewPriceChange, true);
                  }}
                  className="adjust-btn"
                >
                  <Plus size={16} />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Results Card */}
        <Card>
          {!calculation.valid ? (
            <div className="error-display">
              <AlertCircle size={40} />
              <h3>Cannot Calculate</h3>
              <p>{calculation.error}</p>
            </div>
          ) : (
            <div className="results-compact">
              {/* Main Result */}
              <div className={`main-result-compact ${calculation.isAveragingDown ? 'averaging-down' : 'averaging-up'}`}>
                <div className="result-icon">
                  {calculation.isAveragingDown ? (
                    <TrendingDown size={32} />
                  ) : (
                    <TrendingUp size={32} />
                  )}
                </div>
                <div className="result-content">
                  <div className="result-label">
                    {calculation.isAveragingDown ? 'Averaging Down' : 'Averaging Up'}
                  </div>
                  <div className="result-main">
                    Buy <strong>{calculation.newSharesNeeded.toLocaleString()}</strong> shares
                  </div>
                  <div className="result-detail">
                    @ {currency}{newPrice.toFixed(2)} per share
                  </div>
                </div>
                <CheckCircle2 className="check-icon" size={24} />
              </div>

              {/* Share/Copy Buttons */}
              <div className="share-buttons">
                <Button variant="outline" size="sm" onClick={shareResults}>
                  <Share2 size={16} />
                  Share
                </Button>
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  <Copy size={16} />
                  Copy
                </Button>
              </div>

              {/* Key Metrics */}
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-label">Additional Investment</div>
                  <div className="metric-value highlight">
                    {currency}{calculation.newInvestment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-label">Final Average Price</div>
                  <div className="metric-value">
                    {currency}{calculation.finalAveragePrice.toFixed(2)}
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-label">Total Shares</div>
                  <div className="metric-value">
                    {calculation.totalShares.toLocaleString()}
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-label">Price Change</div>
                  <div className={`metric-value ${calculation.priceChangePercent < 0 ? 'positive' : 'negative'}`}>
                    {calculation.priceChangePercent > 0 ? '+' : ''}
                    {calculation.priceChangePercent.toFixed(2)}%
                  </div>
                </div>
              </div>

              {/* Comparison */}
              <div className="comparison-compact">
                <div className="comparison-header">Before → After</div>
                <div className="comparison-row">
                  <span className="comparison-label">Shares:</span>
                  <span className="comparison-before">{currentShares.toLocaleString()}</span>
                  <span className="comparison-arrow">→</span>
                  <span className="comparison-after">{calculation.totalShares.toLocaleString()}</span>
                </div>
                <div className="comparison-row">
                  <span className="comparison-label">Avg Price:</span>
                  <span className="comparison-before">{currency}{currentPrice.toFixed(2)}</span>
                  <span className="comparison-arrow">→</span>
                  <span className="comparison-after">{currency}{calculation.finalAveragePrice.toFixed(2)}</span>
                </div>
                <div className="comparison-row">
                  <span className="comparison-label">Investment:</span>
                  <span className="comparison-before">{currency}{calculation.currentInvestment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  <span className="comparison-arrow">→</span>
                  <span className="comparison-after">{currency}{calculation.totalInvestment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Info Card */}
        <Card>
          <div className="info-section">
            <div className="info-header">
              <Info size={20} />
              <h3>How It Works</h3>
            </div>
            <p className="info-text">
              <strong>Formula:</strong> New Shares = Current Shares × (Target - Current) / (New - Target)
            </p>
            <p className="info-text">
              <strong>Smart Buttons:</strong> +/- buttons adjust values based on decimal places (1, 0.1, 0.01, or 0.001)
            </p>
            <div className="info-tips">
              <div className="tip">• Starting values are randomized each time you load the page</div>
              <div className="tip">• New price defaults to 25% below current price</div>
              <div className="tip">• Use +/- buttons for precise adjustments</div>
              <div className="tip">• Share or copy results to clipboard</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CostAveraging;
