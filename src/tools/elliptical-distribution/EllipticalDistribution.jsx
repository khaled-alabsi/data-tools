import React, { useState, useMemo } from 'react';
import {
  ScatterChart,
  Scatter,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Download, Activity } from 'lucide-react';
import './EllipticalDistribution.css';

// ==================== Statistical Utility Functions ====================

// Generate multivariate normal samples using Cholesky decomposition
function generateMultivariateNormal(mean, covariance, n) {
  const dim = mean.length;

  // Cholesky decomposition
  const L = choleskyDecomposition(covariance);

  // Generate samples
  const samples = [];
  for (let i = 0; i < n; i++) {
    const z = Array(dim).fill(0).map(() => boxMullerTransform());
    const x = multiplyMatrixVector(L, z);
    const sample = x.map((val, idx) => val + mean[idx]);
    samples.push(sample);
  }

  return samples;
}

// Cholesky decomposition
function choleskyDecomposition(matrix) {
  const n = matrix.length;
  const L = Array(n).fill(0).map(() => Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let sum = 0;
      for (let k = 0; k < j; k++) {
        sum += L[i][k] * L[j][k];
      }

      if (i === j) {
        L[i][j] = Math.sqrt(Math.max(0, matrix[i][i] - sum));
      } else {
        L[i][j] = (matrix[i][j] - sum) / (L[j][j] || 1e-10);
      }
    }
  }

  return L;
}

// Matrix-vector multiplication
function multiplyMatrixVector(matrix, vector) {
  return matrix.map(row =>
    row.reduce((sum, val, idx) => sum + val * vector[idx], 0)
  );
}

// Box-Muller transform for normal random numbers
function boxMullerTransform() {
  const u1 = Math.random();
  const u2 = Math.random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

// Calculate covariance matrix from variances and correlations
function buildCovarianceMatrix(variances, correlations, dim) {
  const cov = Array(dim).fill(0).map(() => Array(dim).fill(0));

  for (let i = 0; i < dim; i++) {
    cov[i][i] = variances[i];
    for (let j = i + 1; j < dim; j++) {
      const corrIdx = i * dim + j - ((i + 1) * (i + 2)) / 2;
      const corr = correlations[corrIdx] || 0;
      cov[i][j] = cov[j][i] = corr * Math.sqrt(variances[i] * variances[j]);
    }
  }

  return cov;
}

// Calculate inverse of a matrix (using Gaussian elimination)
function invertMatrix(matrix) {
  const n = matrix.length;
  const A = matrix.map(row => [...row]);
  const I = Array(n).fill(0).map((_, i) =>
    Array(n).fill(0).map((_, j) => i === j ? 1 : 0)
  );

  // Forward elimination
  for (let i = 0; i < n; i++) {
    // Find pivot
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) {
        maxRow = k;
      }
    }
    [A[i], A[maxRow]] = [A[maxRow], A[i]];
    [I[i], I[maxRow]] = [I[maxRow], I[i]];

    // Scale pivot row
    const pivot = A[i][i] || 1e-10;
    for (let j = 0; j < n; j++) {
      A[i][j] /= pivot;
      I[i][j] /= pivot;
    }

    // Eliminate column
    for (let k = 0; k < n; k++) {
      if (k !== i) {
        const factor = A[k][i];
        for (let j = 0; j < n; j++) {
          A[k][j] -= factor * A[i][j];
          I[k][j] -= factor * I[i][j];
        }
      }
    }
  }

  return I;
}

// Calculate Mahalanobis distance
function mahalanobisDistance(point, mean, covInv) {
  const diff = point.map((val, idx) => val - mean[idx]);
  const temp = multiplyMatrixVector(covInv, diff);
  return Math.sqrt(diff.reduce((sum, val, idx) => sum + val * temp[idx], 0));
}

// Calculate Hotelling T² statistic
function hotellingT2(point, mean, covInv, n) {
  const d = mahalanobisDistance(point, mean, covInv);
  return d * d;
}

// Calculate UCL for Hotelling T²
function hotellingT2UCL(p, n, alpha) {
  // UCL = ((n-1) * p / (n - p)) * F(alpha, p, n-p)
  // Approximation using chi-square for large n
  return chiSquareQuantile(1 - alpha, p);
}

// Chi-square quantile (approximation)
function chiSquareQuantile(p, df) {
  // Wilson-Hilferty approximation
  const z = normalQuantile(p);
  return df * Math.pow(1 - 2/(9*df) + z * Math.sqrt(2/(9*df)), 3);
}

// Standard normal quantile (approximation)
function normalQuantile(p) {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;

  // Rational approximation
  const a = [
    -3.969683028665376e+01,
     2.209460984245205e+02,
    -2.759285104469687e+02,
     1.383577518672690e+02,
    -3.066479806614716e+01,
     2.506628277459239e+00
  ];

  const b = [
    -5.447609879822406e+01,
     1.615858368580409e+02,
    -1.556989798598866e+02,
     6.680131188771972e+01,
    -1.328068155288572e+01
  ];

  const c = [
    -7.784894002430293e-03,
    -3.223964580411365e-01,
    -2.400758277161838e+00,
    -2.549732539343734e+00,
     4.374664141464968e+00,
     2.938163982698783e+00
  ];

  const d = [
     7.784695709041462e-03,
     3.224671290700398e-01,
     2.445134137142996e+00,
     3.754408661907416e+00
  ];

  const pLow = 0.02425;
  const pHigh = 1 - pLow;

  let q, r;

  if (p < pLow) {
    q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) /
           ((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);
  } else if (p <= pHigh) {
    q = p - 0.5;
    r = q * q;
    return (((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5]) * q /
           (((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1);
  } else {
    q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) /
            ((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);
  }
}

// Kernel Density Estimation (Gaussian kernel)
function kernelDensityEstimation(data, bandwidth, gridSize = 100) {
  if (data.length === 0) return [];

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;
  const step = range / gridSize;

  const result = [];
  for (let i = 0; i <= gridSize; i++) {
    const x = min + i * step;
    let density = 0;

    for (const point of data) {
      const u = (x - point) / bandwidth;
      density += Math.exp(-0.5 * u * u) / Math.sqrt(2 * Math.PI);
    }

    density /= (data.length * bandwidth);
    result.push({ x, density });
  }

  return result;
}

// ==================== Main Component ====================

const EllipticalDistribution = () => {
  // State for dimension selection
  const [dimension, setDimension] = useState(2);

  // State for distribution type
  const [distType, setDistType] = useState('normal');
  const [dof, setDof] = useState(5); // degrees of freedom for t-distribution

  // State for mean vector
  const [means, setMeans] = useState([0, 0, 0]);

  // State for variances
  const [variances, setVariances] = useState([1, 1, 1]);

  // State for correlations (for 2D: 1 value, for 3D: 3 values)
  const [correlations, setCorrelations] = useState([0, 0, 0]);

  // State for sample size
  const [sampleSize, setSampleSize] = useState(500);

  // State for control chart settings
  const [alpha, setAlpha] = useState(0.05);
  const [highlightOutliers, setHighlightOutliers] = useState(false);

  // State for variable selection
  const [selectedVarsKDE, setSelectedVarsKDE] = useState([true, true, true]);
  const [selectedVarsMarginal, setSelectedVarsMarginal] = useState([true, true, true]);

  // Generate data based on current parameters
  const { samples, statistics } = useMemo(() => {
    const mean = means.slice(0, dimension);
    const variance = variances.slice(0, dimension);
    const correlation = correlations.slice(0, dimension === 2 ? 1 : 3);

    const covariance = buildCovarianceMatrix(variance, correlation, dimension);
    const samples = generateMultivariateNormal(mean, covariance, sampleSize);

    // Calculate Mahalanobis distances and T² values
    const covInv = invertMatrix(covariance);
    const t2Values = samples.map(sample => hotellingT2(sample, mean, covInv, sampleSize));
    const ucl = hotellingT2UCL(dimension, sampleSize, alpha);

    return {
      samples,
      statistics: {
        mean,
        covariance,
        covInv,
        t2Values,
        ucl,
      },
    };
  }, [dimension, means, variances, correlations, sampleSize, alpha, distType, dof]);

  // Prepare data for main scatter plot
  const scatterData = useMemo(() => {
    return samples.map((sample, idx) => {
      const t2 = statistics.t2Values[idx];
      const isOutlier = t2 > statistics.ucl;

      const point = {
        x: sample[0],
        t2,
        isOutlier,
      };

      if (dimension >= 2) point.y = sample[1];
      if (dimension >= 3) point.z = sample[2];

      return point;
    });
  }, [samples, statistics, dimension]);

  // Prepare KDE data
  const kdeData = useMemo(() => {
    const result = [];

    for (let i = 0; i < dimension; i++) {
      if (!selectedVarsKDE[i]) continue;

      const data = samples.map(s => s[i]);
      const mean = statistics.mean[i];
      const std = Math.sqrt(statistics.covariance[i][i]);
      const bandwidth = 1.06 * std * Math.pow(data.length, -1/5); // Silverman's rule

      const kde = kernelDensityEstimation(data, bandwidth);

      result.push({
        variable: `X${i + 1}`,
        kde,
        gaussian: kde.map(({ x }) => ({
          x,
          density: (1 / (std * Math.sqrt(2 * Math.PI))) *
                   Math.exp(-0.5 * Math.pow((x - mean) / std, 2)),
        })),
      });
    }

    return result;
  }, [samples, statistics, dimension, selectedVarsKDE]);

  // Prepare marginal distribution data
  const marginalData = useMemo(() => {
    const result = [];

    for (let i = 0; i < dimension; i++) {
      if (!selectedVarsMarginal[i]) continue;

      const data = samples.map(s => s[i]);
      const mean = statistics.mean[i];
      const std = Math.sqrt(statistics.covariance[i][i]);

      // Create histogram
      const nBins = 30;
      const min = Math.min(...data);
      const max = Math.max(...data);
      const binWidth = (max - min) / nBins;
      const bins = Array(nBins).fill(0);

      data.forEach(val => {
        const binIdx = Math.min(Math.floor((val - min) / binWidth), nBins - 1);
        bins[binIdx]++;
      });

      const histogram = bins.map((count, idx) => ({
        x: min + (idx + 0.5) * binWidth,
        count: count / (data.length * binWidth), // Normalize to density
      }));

      result.push({
        variable: `X${i + 1}`,
        histogram,
        mean,
        std,
      });
    }

    return result;
  }, [samples, statistics, dimension, selectedVarsMarginal]);

  // Prepare Mahalanobis distance distribution
  const mahalanobisData = useMemo(() => {
    // Create histogram of Mahalanobis distances
    const distances = samples.map((sample, idx) =>
      Math.sqrt(statistics.t2Values[idx])
    );

    const nBins = 40;
    const min = 0;
    const max = Math.max(...distances);
    const binWidth = max / nBins;
    const bins = Array(nBins).fill(0);

    distances.forEach(d => {
      const binIdx = Math.min(Math.floor(d / binWidth), nBins - 1);
      bins[binIdx]++;
    });

    const histogram = bins.map((count, idx) => ({
      distance: (idx + 0.5) * binWidth,
      density: count / (distances.length * binWidth),
    }));

    return histogram;
  }, [samples, statistics]);

  // Export to CSV
  const handleExport = () => {
    const headers = [];
    for (let i = 0; i < dimension; i++) {
      headers.push(`X${i + 1}`);
    }
    headers.push('T2', 'Mahalanobis_Distance', 'Is_Outlier');

    const rows = samples.map((sample, idx) => {
      const t2 = statistics.t2Values[idx];
      const mahal = Math.sqrt(t2);
      const isOutlier = t2 > statistics.ucl ? 1 : 0;

      return [...sample, t2, mahal, isOutlier].join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `elliptical_distribution_${dimension}D.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Color scale for T² values
  const getColorForT2 = (t2, ucl) => {
    if (highlightOutliers) {
      return t2 > ucl ? '#ef4444' : '#6366f1';
    } else {
      const ratio = Math.min(t2 / (ucl * 2), 1);
      const r = Math.floor(99 + ratio * (239 - 99));
      const g = Math.floor(102 + ratio * (68 - 102));
      const b = Math.floor(241 + ratio * (68 - 241));
      return `rgb(${r}, ${g}, ${b})`;
    }
  };

  return (
    <div className="elliptical-distribution">
      <div className="container">
        <div className="page-header">
          <h1>Elliptical Distribution Explorer for MSPC</h1>
          <p className="page-description">
            Explore elliptical distributions and understand how density functions work,
            and how they differ from histograms. Visualize multivariate distributions
            with interactive controls and real-time Hotelling T² monitoring.
          </p>
        </div>

        <Card>
          <h2>Configuration</h2>

          <div className="control-section">
            <h3>Dimension</h3>
            <div className="dimension-selector">
              <select
                value={dimension}
                onChange={(e) => setDimension(Number(e.target.value))}
                className="select-input"
              >
                <option value={1}>1D</option>
                <option value={2}>2D</option>
                <option value={3}>3D</option>
              </select>
            </div>
          </div>

          <div className="control-section">
            <h3>Distribution Type</h3>
            <div className="dist-type-selector">
              <select
                value={distType}
                onChange={(e) => setDistType(e.target.value)}
                className="select-input"
              >
                <option value="normal">Multivariate Normal</option>
                <option value="t">Student's t-distribution</option>
                <option value="mixture">Normal Mixture</option>
              </select>
              {distType === 't' && (
                <div className="slider-control">
                  <label>Degrees of Freedom: {dof}</label>
                  <input
                    type="range"
                    min={1}
                    max={30}
                    step={1}
                    value={dof}
                    onChange={(e) => setDof(Number(e.target.value))}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="control-section">
            <h3>Mean Vector (μ)</h3>
            <div className="slider-grid">
              {Array(dimension).fill(0).map((_, i) => (
                <div key={i} className="slider-control">
                  <label>μ{i + 1}: {means[i].toFixed(2)}</label>
                  <input
                    type="range"
                    min={-5}
                    max={5}
                    step={0.1}
                    value={means[i]}
                    onChange={(e) => {
                      const newMeans = [...means];
                      newMeans[i] = Number(e.target.value);
                      setMeans(newMeans);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="control-section">
            <h3>Covariance Structure</h3>
            <div className="covariance-section">
              <h4>Variances (σ²)</h4>
              <div className="slider-grid">
                {Array(dimension).fill(0).map((_, i) => (
                  <div key={i} className="slider-control">
                    <label>σ²{i + 1}: {variances[i].toFixed(2)}</label>
                    <input
                      type="range"
                      min={0.1}
                      max={5}
                      step={0.1}
                      value={variances[i]}
                      onChange={(e) => {
                        const newVariances = [...variances];
                        newVariances[i] = Number(e.target.value);
                        setVariances(newVariances);
                      }}
                    />
                  </div>
                ))}
              </div>

              {dimension >= 2 && (
                <>
                  <h4>Correlations (ρ)</h4>
                  <div className="slider-grid">
                    {dimension === 2 ? (
                      <div className="slider-control">
                        <label>ρ₁₂: {correlations[0].toFixed(2)}</label>
                        <input
                          type="range"
                          min={-0.95}
                          max={0.95}
                          step={0.05}
                          value={correlations[0]}
                          onChange={(e) => {
                            const newCorr = [...correlations];
                            newCorr[0] = Number(e.target.value);
                            setCorrelations(newCorr);
                          }}
                        />
                      </div>
                    ) : (
                      <>
                        <div className="slider-control">
                          <label>ρ₁₂: {correlations[0].toFixed(2)}</label>
                          <input
                            type="range"
                            min={-0.95}
                            max={0.95}
                            step={0.05}
                            value={correlations[0]}
                            onChange={(e) => {
                              const newCorr = [...correlations];
                              newCorr[0] = Number(e.target.value);
                              setCorrelations(newCorr);
                            }}
                          />
                        </div>
                        <div className="slider-control">
                          <label>ρ₁₃: {correlations[1].toFixed(2)}</label>
                          <input
                            type="range"
                            min={-0.95}
                            max={0.95}
                            step={0.05}
                            value={correlations[1]}
                            onChange={(e) => {
                              const newCorr = [...correlations];
                              newCorr[1] = Number(e.target.value);
                              setCorrelations(newCorr);
                            }}
                          />
                        </div>
                        <div className="slider-control">
                          <label>ρ₂₃: {correlations[2].toFixed(2)}</label>
                          <input
                            type="range"
                            min={-0.95}
                            max={0.95}
                            step={0.05}
                            value={correlations[2]}
                            onChange={(e) => {
                              const newCorr = [...correlations];
                              newCorr[2] = Number(e.target.value);
                              setCorrelations(newCorr);
                            }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="control-section">
            <h3>Sample Size</h3>
            <div className="slider-control">
              <label>n = {sampleSize}</label>
              <input
                type="range"
                min={100}
                max={5000}
                step={100}
                value={sampleSize}
                onChange={(e) => setSampleSize(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="control-section">
            <h3>Control Chart Settings</h3>
            <div className="slider-control">
              <label>Significance Level (α): {alpha.toFixed(3)}</label>
              <input
                type="range"
                min={0.001}
                max={0.1}
                step={0.001}
                value={alpha}
                onChange={(e) => setAlpha(Number(e.target.value))}
              />
            </div>
            <div className="checkbox-control">
              <label>
                <input
                  type="checkbox"
                  checked={highlightOutliers}
                  onChange={(e) => setHighlightOutliers(e.target.checked)}
                />
                Highlight outliers (beyond UCL = {statistics.ucl.toFixed(2)})
              </label>
            </div>
          </div>

          <div className="export-section">
            <Button onClick={handleExport} variant="primary">
              <Download size={20} />
              Export Data as CSV
            </Button>
          </div>
        </Card>

        {/* Main Distribution Visualization */}
        <Card>
          <h2>Distribution Visualization</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={500}>
              {dimension === 1 ? (
                <BarChart data={marginalData[0]?.histogram || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="x"
                    label={{ value: 'X₁', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis label={{ value: 'Density', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366f1" />
                </BarChart>
              ) : dimension === 2 ? (
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="X₁"
                    label={{ value: 'X₁', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="X₂"
                    label={{ value: 'X₂', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="Samples" data={scatterData}>
                    {scatterData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getColorForT2(entry.t2, statistics.ucl)}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              ) : (
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="X₁"
                    label={{ value: 'X₁', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="X₂"
                    label={{ value: 'X₂', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="Samples (X₁ vs X₂)" data={scatterData}>
                    {scatterData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getColorForT2(entry.t2, statistics.ucl)}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              )}
            </ResponsiveContainer>
          </div>
          <p className="chart-note">
            {dimension === 1 && "Histogram showing the distribution of X₁."}
            {dimension === 2 && "Scatter plot with points colored by Hotelling T² value."}
            {dimension === 3 && "2D projection showing X₁ vs X₂, colored by Hotelling T² value."}
          </p>
        </Card>

        {/* Density Curves */}
        <Card>
          <h2>Density Curves (KDE vs Gaussian)</h2>
          <div className="variable-selection">
            <label>Select variables:</label>
            {Array(dimension).fill(0).map((_, i) => (
              <label key={i} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedVarsKDE[i]}
                  onChange={(e) => {
                    const newSelected = [...selectedVarsKDE];
                    newSelected[i] = e.target.checked;
                    setSelectedVarsKDE(newSelected);
                  }}
                />
                X{i + 1}
              </label>
            ))}
          </div>

          <div className="density-curves-grid">
            {kdeData.map(({ variable, kde, gaussian }) => (
              <div key={variable} className="density-chart">
                <h3>{variable}</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="x"
                      type="number"
                      domain={['dataMin', 'dataMax']}
                    />
                    <YAxis label={{ value: 'Density', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line
                      data={kde}
                      type="monotone"
                      dataKey="density"
                      stroke="#6366f1"
                      strokeWidth={2}
                      name="KDE"
                      dot={false}
                    />
                    <Line
                      data={gaussian}
                      type="monotone"
                      dataKey="density"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Gaussian"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>
          <p className="chart-note">
            Solid lines show Kernel Density Estimation (KDE), dashed lines show theoretical Gaussian curves.
          </p>
        </Card>

        {/* Marginal Distributions */}
        <Card>
          <h2>Marginal Distributions</h2>
          <div className="variable-selection">
            <label>Select variables:</label>
            {Array(dimension).fill(0).map((_, i) => (
              <label key={i} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedVarsMarginal[i]}
                  onChange={(e) => {
                    const newSelected = [...selectedVarsMarginal];
                    newSelected[i] = e.target.checked;
                    setSelectedVarsMarginal(newSelected);
                  }}
                />
                X{i + 1}
              </label>
            ))}
          </div>

          <div className="marginal-grid">
            {marginalData.map(({ variable, histogram, mean, std }) => (
              <div key={variable} className="marginal-chart">
                <h3>{variable}</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={histogram}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="x" />
                    <YAxis label={{ value: 'Density', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
                <p className="stats-text">
                  μ = {mean.toFixed(3)}, σ = {std.toFixed(3)}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Mahalanobis Distance Distribution */}
        <Card>
          <h2>Mahalanobis Distance Distribution</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={mahalanobisData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="distance"
                  label={{ value: 'Mahalanobis Distance', position: 'insideBottom', offset: -5 }}
                />
                <YAxis label={{ value: 'Density', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Bar dataKey="density" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="chart-note">
            Distribution of Mahalanobis distances from the center of the distribution.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default EllipticalDistribution;
