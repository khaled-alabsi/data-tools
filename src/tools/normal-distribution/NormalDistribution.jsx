import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { Plus, Trash2, RefreshCw } from 'lucide-react';
import './NormalDistribution.css';

// Generate normal distribution data
const generateNormalDistribution = (mean, stdDev, numPoints = 100) => {
  const data = [];
  const range = 4 * stdDev;
  const step = (2 * range) / numPoints;

  for (let i = 0; i < numPoints; i++) {
    const x = mean - range + i * step;
    const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2));
    const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
    data.push({ x: parseFloat(x.toFixed(2)), y: parseFloat(y.toFixed(4)) });
  }

  return data;
};

// Generate random samples from normal distribution
const generateRandomSamples = (mean, stdDev, count) => {
  const samples = [];
  for (let i = 0; i < count; i++) {
    // Box-Muller transform
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    const value = mean + stdDev * z0;
    samples.push({ id: i, x: parseFloat(value.toFixed(2)), y: Math.random() * 0.05 });
  }
  return samples;
};

// Generate 2D normal distribution samples
const generate2DNormalSamples = (meanX, stdDevX, meanY, stdDevY, count, correlation = 0) => {
  const samples = [];
  for (let i = 0; i < count; i++) {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    const z1 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);

    const x = meanX + stdDevX * z0;
    const y = meanY + stdDevY * (correlation * z0 + Math.sqrt(1 - correlation * correlation) * z1);

    samples.push({
      id: i,
      x: parseFloat(x.toFixed(2)),
      y: parseFloat(y.toFixed(2)),
    });
  }
  return samples;
};

const NormalDistribution = () => {
  const [dimensions, setDimensions] = useState(1);
  const [distributions, setDistributions] = useState([
    { id: 1, mean: 0, stdDev: 1, color: '#6366f1', name: 'Distribution 1' },
  ]);
  const [sampleSize, setSampleSize] = useState(100);
  const [showSamples, setShowSamples] = useState(false);
  const [correlation, setCorrelation] = useState(0);

  // Add new distribution
  const addDistribution = () => {
    if (distributions.length < 5) {
      const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];
      const newId = Math.max(...distributions.map(d => d.id)) + 1;
      setDistributions([
        ...distributions,
        {
          id: newId,
          mean: 0,
          stdDev: 1,
          color: colors[distributions.length % colors.length],
          name: `Distribution ${newId}`,
        },
      ]);
    }
  };

  // Remove distribution
  const removeDistribution = (id) => {
    if (distributions.length > 1) {
      setDistributions(distributions.filter(d => d.id !== id));
    }
  };

  // Update distribution parameters
  const updateDistribution = (id, field, value) => {
    setDistributions(
      distributions.map(d =>
        d.id === id ? { ...d, [field]: parseFloat(value) || 0 } : d
      )
    );
  };

  // Generate chart data
  const chartData = useMemo(() => {
    if (dimensions === 1) {
      return distributions.map(dist => ({
        ...dist,
        data: generateNormalDistribution(dist.mean, dist.stdDev),
        samples: showSamples ? generateRandomSamples(dist.mean, dist.stdDev, sampleSize) : [],
      }));
    } else if (dimensions === 2 && distributions.length >= 2) {
      return {
        samples: generate2DNormalSamples(
          distributions[0].mean,
          distributions[0].stdDev,
          distributions[1].mean,
          distributions[1].stdDev,
          sampleSize,
          correlation
        ),
      };
    }
    return [];
  }, [distributions, dimensions, sampleSize, showSamples, correlation]);

  // Calculate statistics
  const calculateStats = (dist) => {
    return {
      mean: dist.mean,
      stdDev: dist.stdDev,
      variance: Math.pow(dist.stdDev, 2).toFixed(4),
      range68: `[${(dist.mean - dist.stdDev).toFixed(2)}, ${(dist.mean + dist.stdDev).toFixed(2)}]`,
      range95: `[${(dist.mean - 2 * dist.stdDev).toFixed(2)}, ${(dist.mean + 2 * dist.stdDev).toFixed(2)}]`,
    };
  };

  return (
    <div className="normal-distribution">
      <div className="container">
        <div className="page-header">
          <h1>Normal Distribution Explorer</h1>
          <p className="page-description">
            Explore and visualize normal (Gaussian) distributions. Adjust parameters, compare multiple distributions,
            and analyze their properties in 1D, 2D, or 3D space.
          </p>
        </div>

        {/* Controls */}
        <Card className="controls-card">
          <h2>Configuration</h2>

          {/* Dimension Selector */}
          <div className="dimension-selector">
            <label className="control-label">Dimensions:</label>
            <div className="dimension-buttons">
              {[1, 2].map((dim) => (
                <Button
                  key={dim}
                  variant={dimensions === dim ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setDimensions(dim)}
                >
                  {dim}D
                </Button>
              ))}
            </div>
          </div>

          {/* Sample Controls */}
          <div className="sample-controls">
            <Input
              label="Sample Size"
              type="number"
              value={sampleSize}
              onChange={(e) => setSampleSize(parseInt(e.target.value) || 100)}
              min="10"
              max="1000"
              step="10"
            />
            {dimensions === 1 && (
              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  id="show-samples"
                  checked={showSamples}
                  onChange={(e) => setShowSamples(e.target.checked)}
                />
                <label htmlFor="show-samples">Show Random Samples</label>
              </div>
            )}
            {dimensions === 2 && distributions.length >= 2 && (
              <Input
                label="Correlation"
                type="number"
                value={correlation}
                onChange={(e) => setCorrelation(parseFloat(e.target.value) || 0)}
                min="-0.99"
                max="0.99"
                step="0.1"
              />
            )}
          </div>

          {/* Distribution Parameters */}
          <div className="distributions-config">
            <div className="distributions-header">
              <h3>Distributions</h3>
              {dimensions === 1 && distributions.length < 5 && (
                <Button variant="outline" size="sm" onClick={addDistribution}>
                  <Plus size={16} />
                  Add Distribution
                </Button>
              )}
            </div>

            {distributions.slice(0, dimensions === 2 ? 2 : 5).map((dist, index) => (
              <div key={dist.id} className="distribution-item">
                <div className="distribution-header">
                  <div className="distribution-color" style={{ background: dist.color }}></div>
                  <span className="distribution-name">
                    {dimensions === 2 ? (index === 0 ? 'X Variable' : 'Y Variable') : dist.name}
                  </span>
                  {dimensions === 1 && distributions.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDistribution(dist.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>
                <div className="distribution-inputs">
                  <Input
                    label="Mean (μ)"
                    type="number"
                    value={dist.mean}
                    onChange={(e) => updateDistribution(dist.id, 'mean', e.target.value)}
                    step="0.1"
                  />
                  <Input
                    label="Std Dev (σ)"
                    type="number"
                    value={dist.stdDev}
                    onChange={(e) => updateDistribution(dist.id, 'stdDev', e.target.value)}
                    min="0.1"
                    step="0.1"
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Visualization */}
        <Card className="chart-card">
          <h2>Visualization</h2>
          {dimensions === 1 ? (
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="x"
                    type="number"
                    domain={['auto', 'auto']}
                    label={{ value: 'Value', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis label={{ value: 'Probability Density', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  {chartData.map((dist) => (
                    <Line
                      key={dist.id}
                      data={dist.data}
                      type="monotone"
                      dataKey="y"
                      stroke={dist.color}
                      strokeWidth={2}
                      dot={false}
                      name={dist.name}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
              {showSamples && chartData.length > 0 && (
                <ResponsiveContainer width="100%" height={100}>
                  <ScatterChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="x" type="number" domain={['auto', 'auto']} hide />
                    <YAxis hide />
                    {chartData.map((dist) => (
                      <Scatter
                        key={`samples-${dist.id}`}
                        data={dist.samples}
                        fill={dist.color}
                        opacity={0.6}
                      />
                    ))}
                  </ScatterChart>
                </ResponsiveContainer>
              )}
            </div>
          ) : dimensions === 2 && distributions.length >= 2 ? (
            <ResponsiveContainer width="100%" height={500}>
              <ScatterChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="x"
                  type="number"
                  domain={['auto', 'auto']}
                  label={{ value: `X (μ=${distributions[0].mean}, σ=${distributions[0].stdDev})`, position: 'insideBottom', offset: -5 }}
                />
                <YAxis
                  dataKey="y"
                  type="number"
                  domain={['auto', 'auto']}
                  label={{ value: `Y (μ=${distributions[1].mean}, σ=${distributions[1].stdDev})`, angle: -90, position: 'insideLeft' }}
                />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter
                  data={chartData.samples}
                  fill={distributions[0].color}
                  opacity={0.5}
                />
              </ScatterChart>
            </ResponsiveContainer>
          ) : null}
        </Card>

        {/* Statistics */}
        {dimensions === 1 && (
          <div className="stats-grid">
            {distributions.map((dist) => {
              const stats = calculateStats(dist);
              return (
                <Card key={dist.id} className="stats-card">
                  <div className="stats-header">
                    <div className="distribution-color" style={{ background: dist.color }}></div>
                    <h3>{dist.name}</h3>
                  </div>
                  <div className="stats-list">
                    <div className="stat-item">
                      <span className="stat-label">Mean (μ):</span>
                      <span className="stat-value">{stats.mean}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Std Dev (σ):</span>
                      <span className="stat-value">{stats.stdDev}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Variance (σ²):</span>
                      <span className="stat-value">{stats.variance}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">68% Range:</span>
                      <span className="stat-value">{stats.range68}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">95% Range:</span>
                      <span className="stat-value">{stats.range95}</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default NormalDistribution;
