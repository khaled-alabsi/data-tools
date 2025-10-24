import React, { useState, useMemo } from 'react';
import Card from '../../components/Card';
import Input from '../../components/Input';
import { TrendingDown, TrendingUp, Calculator, AlertCircle, CheckCircle2 } from 'lucide-react';
import './CostAveraging.css';

const CostAveraging = () => {
  // Input states
  const [currentShares, setCurrentShares] = useState(1030);
  const [currentPrice, setCurrentPrice] = useState(5.53);
  const [targetPrice, setTargetPrice] = useState(5.00);
  const [newPrice, setNewPrice] = useState(4.50);
  const [currency, setCurrency] = useState('€');

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
    // Formula: New shares = Current shares × (Target - Current) / (New - Target)
    const numerator = currentShares * (targetPrice - currentPrice);
    const denominator = newPrice - targetPrice;

    // Check if denominator is zero or very close to zero
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
          error: 'Cannot average down to a price higher than current price',
        };
      }
      if (isAveragingUp && targetPrice < currentPrice) {
        return {
          valid: false,
          error: 'Cannot average up to a price lower than current price',
        };
      }
      return {
        valid: false,
        error: 'Target price is not achievable with this new price',
      };
    }

    // Additional validation: check if target is between current and new price
    if (isAveragingDown && (targetPrice < newPrice || targetPrice > currentPrice)) {
      return {
        valid: false,
        error: 'When averaging down, target price must be between new price and current price',
      };
    }

    if (isAveragingUp && (targetPrice > newPrice || targetPrice < currentPrice)) {
      return {
        valid: false,
        error: 'When averaging up, target price must be between current price and new price',
      };
    }

    // Calculate final values
    const totalShares = currentShares + newSharesNeeded;
    const currentInvestment = currentShares * currentPrice;
    const newInvestment = newSharesNeeded * newPrice;
    const totalInvestment = currentInvestment + newInvestment;
    const finalAveragePrice = totalInvestment / totalShares;

    // Calculate percentage changes
    const priceChangePercent = ((finalAveragePrice - currentPrice) / currentPrice) * 100;
    const investmentIncrease = (newInvestment / currentInvestment) * 100;

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
      investmentIncrease,
      isAveragingDown,
      isAveragingUp,
    };
  }, [currentShares, currentPrice, targetPrice, newPrice]);

  return (
    <div className="cost-averaging">
      <div className="container">
        <div className="page-header">
          <h1>Cost Averaging Calculator</h1>
          <p className="page-description">
            Calculate how many shares you need to buy at a new price to reach your target average price.
            Perfect for averaging down or averaging up your stock portfolio positions.
          </p>
        </div>

        <div className="calculator-layout">
          {/* Input Card */}
          <Card>
            <h2>
              <Calculator size={24} />
              Input Parameters
            </h2>

            <div className="input-section">
              <h3>Currency</h3>
              <div className="currency-selector">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="select-input"
                >
                  <option value="€">Euro (€)</option>
                  <option value="$">US Dollar ($)</option>
                  <option value="£">British Pound (£)</option>
                  <option value="¥">Japanese Yen (¥)</option>
                  <option value="CHF">Swiss Franc (CHF)</option>
                  <option value="kr">Swedish Krona (kr)</option>
                </select>
              </div>
            </div>

            <div className="input-section">
              <h3>Current Position</h3>
              <div className="input-grid">
                <Input
                  label="Current Shares"
                  type="number"
                  value={currentShares}
                  onChange={(e) => setCurrentShares(Number(e.target.value))}
                  min={0}
                  step={1}
                />
                <Input
                  label={`Current Price (${currency})`}
                  type="number"
                  value={currentPrice}
                  onChange={(e) => setCurrentPrice(Number(e.target.value))}
                  min={0}
                  step={0.01}
                />
              </div>
            </div>

            <div className="input-section">
              <h3>Target & New Price</h3>
              <div className="input-grid">
                <Input
                  label={`Target Average Price (${currency})`}
                  type="number"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(Number(e.target.value))}
                  min={0}
                  step={0.01}
                />
                <Input
                  label={`New Price Available (${currency})`}
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(Number(e.target.value))}
                  min={0}
                  step={0.01}
                />
              </div>
            </div>

            <div className="current-position-summary">
              <div className="summary-item">
                <span className="summary-label">Current Investment:</span>
                <span className="summary-value">
                  {currency}{(currentShares * currentPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Current Average Price:</span>
                <span className="summary-value">
                  {currency}{currentPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </Card>

          {/* Results Card */}
          <Card>
            <h2>
              {calculation.valid ? (
                calculation.isAveragingDown ? (
                  <>
                    <TrendingDown size={24} />
                    Results (Averaging Down)
                  </>
                ) : (
                  <>
                    <TrendingUp size={24} />
                    Results (Averaging Up)
                  </>
                )
              ) : (
                <>
                  <AlertCircle size={24} />
                  Results
                </>
              )}
            </h2>

            {!calculation.valid ? (
              <div className="error-message">
                <AlertCircle size={48} />
                <h3>Cannot Calculate</h3>
                <p>{calculation.error}</p>
              </div>
            ) : (
              <div className="results-content">
                <div className="main-result">
                  <CheckCircle2 size={48} className="success-icon" />
                  <div className="result-text">
                    <h3>Buy {calculation.newSharesNeeded.toLocaleString()} shares</h3>
                    <p>at {currency}{newPrice.toFixed(2)} per share</p>
                  </div>
                </div>

                <div className="result-breakdown">
                  <div className="breakdown-section">
                    <h4>Transaction Details</h4>
                    <div className="breakdown-item">
                      <span className="label">Shares to buy:</span>
                      <span className="value">
                        {calculation.newSharesNeeded.toLocaleString()}
                        {calculation.newSharesNeededExact !== calculation.newSharesNeeded && (
                          <span className="exact-value">
                            {' '}(exact: {calculation.newSharesNeededExact.toFixed(2)})
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="breakdown-item">
                      <span className="label">Price per share:</span>
                      <span className="value">{currency}{newPrice.toFixed(2)}</span>
                    </div>
                    <div className="breakdown-item highlight">
                      <span className="label">Additional investment:</span>
                      <span className="value">
                        {currency}{calculation.newInvestment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  <div className="breakdown-section">
                    <h4>Final Position</h4>
                    <div className="breakdown-item">
                      <span className="label">Total shares:</span>
                      <span className="value">{calculation.totalShares.toLocaleString()}</span>
                    </div>
                    <div className="breakdown-item">
                      <span className="label">Total investment:</span>
                      <span className="value">
                        {currency}{calculation.totalInvestment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="breakdown-item highlight">
                      <span className="label">Final average price:</span>
                      <span className="value">
                        {currency}{calculation.finalAveragePrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="breakdown-item">
                      <span className="label">Price change:</span>
                      <span className={`value ${calculation.priceChangePercent < 0 ? 'positive' : 'negative'}`}>
                        {calculation.priceChangePercent > 0 ? '+' : ''}
                        {calculation.priceChangePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="comparison-table">
                  <h4>Before vs After Comparison</h4>
                  <table>
                    <thead>
                      <tr>
                        <th></th>
                        <th>Before</th>
                        <th>After</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Shares</td>
                        <td>{currentShares.toLocaleString()}</td>
                        <td>{calculation.totalShares.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td>Average Price</td>
                        <td>{currency}{currentPrice.toFixed(2)}</td>
                        <td>{currency}{calculation.finalAveragePrice.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td>Total Investment</td>
                        <td>{currency}{calculation.currentInvestment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td>{currency}{calculation.totalInvestment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Formula Explanation Card */}
        <Card>
          <h2>How It Works</h2>
          <div className="formula-section">
            <div className="formula-box">
              <h3>The Formula</h3>
              <code className="formula">
                New Shares = Current Shares × (Target Price - Current Price) / (New Price - Target Price)
              </code>
            </div>

            <div className="explanation">
              <h3>Example</h3>
              <ul>
                <li>You have: <strong>1,030 shares @ {currency}5.53</strong></li>
                <li>Target average: <strong>{currency}5.00</strong></li>
                <li>New price: <strong>{currency}4.50</strong></li>
                <li>Result: <strong>Buy ~111 shares at {currency}4.50</strong> to average down to {currency}5.00</li>
              </ul>
            </div>

            <div className="important-notes">
              <h3>Important Notes</h3>
              <ul>
                <li>
                  <strong>Averaging Down:</strong> When the new price is lower than your current price,
                  the target price must be between the new price and your current price.
                </li>
                <li>
                  <strong>Averaging Up:</strong> When the new price is higher than your current price,
                  the target price must be between your current price and the new price.
                </li>
                <li>
                  The calculator shows you exactly how many shares to buy and how much additional
                  investment is needed.
                </li>
                <li>
                  Results are rounded to whole shares, but the exact value is also shown when different.
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CostAveraging;
