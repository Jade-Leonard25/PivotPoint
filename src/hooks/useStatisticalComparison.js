// File: src/hooks/useStatisticalComparison.js
import { useState, useMemo, useCallback } from "react";

export const useStatisticalComparison = (initialConfig = {}) => {
  const [comparisonConfig, setComparisonConfig] = useState({
    significanceLevel: 0.05,
    testNormality: true,
    similarityMethod: "euclidean",
    minSampleSize: 30,
    useBootstrap: false,
    bootstrapSamples: 1000,
    ...initialConfig,
  });

  const [comparisonHistory, setComparisonHistory] = useState([]);

  /* ===========================
     MATH HELPER FUNCTIONS
  ============================ */

  // Calculate mean
  const calculateMean = useCallback((data) => {
    if (!data.length) return 0;
    return data.reduce((sum, val) => sum + val, 0) / data.length;
  }, []);

  // Calculate median
  const calculateMedian = useCallback((data) => {
    if (!data.length) return 0;
    const sorted = [...data].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 
      ? sorted[mid] 
      : (sorted[mid - 1] + sorted[mid]) / 2;
  }, []);

  // Calculate variance
  const calculateVariance = useCallback((data) => {
    if (data.length < 2) return 0;
    const mean = calculateMean(data);
    return data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
  }, [calculateMean]);

  // Calculate standard deviation
  const calculateStdDev = useCallback((data) => {
    return Math.sqrt(calculateVariance(data));
  }, [calculateVariance]);

  // Calculate correlation
  const calculateCorrelation = useCallback((data1, data2) => {
    if (data1.length !== data2.length || data1.length < 2) return 0;
    
    const mean1 = calculateMean(data1);
    const mean2 = calculateMean(data2);
    
    let numerator = 0;
    let denom1 = 0;
    let denom2 = 0;
    
    for (let i = 0; i < data1.length; i++) {
      const diff1 = data1[i] - mean1;
      const diff2 = data2[i] - mean2;
      numerator += diff1 * diff2;
      denom1 += Math.pow(diff1, 2);
      denom2 += Math.pow(diff2, 2);
    }
    
    return denom1 && denom2 ? numerator / Math.sqrt(denom1 * denom2) : 0;
  }, [calculateMean]);

  // Calculate percentile
  const calculatePercentile = useCallback((data, percentile) => {
    if (!data.length) return 0;
    const sorted = [...data].sort((a, b) => a - b);
    const index = (percentile / 100) * (sorted.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    
    if (upper >= sorted.length) return sorted[lower];
    const weight = index - lower;
    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
  }, []);

  // Calculate skewness
  const calculateSkewness = useCallback((data) => {
    if (data.length < 3) return 0;
    const mean = calculateMean(data);
    const stdDev = calculateStdDev(data);
    if (stdDev === 0) return 0;
    
    const n = data.length;
    const cubedDeviations = data.reduce((sum, val) => {
      return sum + Math.pow((val - mean) / stdDev, 3);
    }, 0);
    
    return (n / ((n - 1) * (n - 2))) * cubedDeviations;
  }, [calculateMean, calculateStdDev]);

  // Calculate kurtosis
  const calculateKurtosis = useCallback((data) => {
    if (data.length < 4) return 0;
    const mean = calculateMean(data);
    const stdDev = calculateStdDev(data);
    if (stdDev === 0) return 0;
    
    const n = data.length;
    const fourthDeviations = data.reduce((sum, val) => {
      return sum + Math.pow((val - mean) / stdDev, 4);
    }, 0);
    
    return ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) * fourthDeviations - 
           (3 * Math.pow(n - 1, 2)) / ((n - 2) * (n - 3));
  }, [calculateMean, calculateStdDev]);

  /* ===========================
     CORE STATISTICAL METRICS
  ============================ */

  const calculateStatisticalMetrics = useCallback((data) => {
    if (!data.length) {
      return {
        descriptive: {
          count: 0,
          sum: 0,
          mean: 0,
          median: 0,
          mode: [],
          min: 0,
          max: 0,
          range: 0,
          variance: 0,
          standardDeviation: 0,
          coefficientOfVariation: 0,
          quartiles: { q1: 0, q2: 0, q3: 0 },
          iqr: 0,
          skewness: 0,
          kurtosis: 0,
        },
        shape: {
          isNormal: false,
          isUniform: false,
          isBimodal: false,
          peaks: 0,
          symmetry: "symmetric",
        },
        distribution: {
          entropy: 0,
          giniCoefficient: 0,
          percentileValues: {},
        },
        trend: {
          slope: 0,
          intercept: 0,
          rSquared: 0,
          autocorrelation: [],
        },
        quality: {
          outliers: 0,
          missingValues: 0,
          dataQualityScore: 0,
        },
      };
    }

    const sortedData = [...data].sort((a, b) => a - b);
    const n = data.length;
    const sum = data.reduce((a, b) => a + b, 0);
    const mean = calculateMean(data);
    const median = calculateMedian(data);
    const min = sortedData[0];
    const max = sortedData[n - 1];
    const range = max - min;
    const variance = calculateVariance(data);
    const stdDev = calculateStdDev(data);
    const coefficientOfVariation = mean !== 0 ? stdDev / Math.abs(mean) : 0;
    const q1 = calculatePercentile(data, 25);
    const q2 = calculatePercentile(data, 50);
    const q3 = calculatePercentile(data, 75);
    const iqr = q3 - q1;
    const skewness = calculateSkewness(data);
    const kurtosis = calculateKurtosis(data);
    
    // Calculate mode
    const frequencyMap = new Map();
    data.forEach(val => {
      frequencyMap.set(val, (frequencyMap.get(val) || 0) + 1);
    });
    const maxFrequency = Math.max(...frequencyMap.values());
    const mode = Array.from(frequencyMap.entries())
      .filter(([, freq]) => freq === maxFrequency)
      .map(([val]) => val);

    // Determine symmetry
    let symmetry = "symmetric";
    if (skewness > 0.5) symmetry = "right_skewed";
    else if (skewness < -0.5) symmetry = "left_skewed";

    // Check normality (simplified)
    const isNormal = Math.abs(skewness) < 0.5 && Math.abs(kurtosis - 3) < 1;

    // Percentile values
    const percentiles = [10, 25, 50, 75, 90, 95, 99];
    const percentileValues = {};
    percentiles.forEach(p => {
      percentileValues[p] = calculatePercentile(data, p);
    });

    return {
      descriptive: {
        count: n,
        sum,
        mean,
        median,
        mode,
        min,
        max,
        range,
        variance,
        standardDeviation: stdDev,
        coefficientOfVariation,
        quartiles: { q1, q2, q3 },
        iqr,
        skewness,
        kurtosis,
      },
      shape: {
        isNormal,
        isUniform: Math.abs(range / n) < 0.1,
        isBimodal: mode.length > 1,
        peaks: mode.length,
        symmetry,
      },
      distribution: {
        entropy: 0, // Simplified - you can implement entropy calculation
        giniCoefficient: 0, // Simplified
        percentileValues,
      },
      trend: {
        slope: 0, // Simplified
        intercept: 0,
        rSquared: 0,
        autocorrelation: [],
      },
      quality: {
        outliers: 0,
        missingValues: 0,
        dataQualityScore: 100,
      },
    };
  }, [
    calculateMean,
    calculateMedian,
    calculateVariance,
    calculateStdDev,
    calculatePercentile,
    calculateSkewness,
    calculateKurtosis,
  ]);

  /* ===========================
     COMPARISON FUNCTIONS
  ============================ */

  const compareStatisticalMetrics = useCallback((
    data1, 
    data2, 
    name1 = "Dataset 1", 
    name2 = "Dataset 2"
  ) => {
    // Calculate metrics for both datasets
    const metrics1 = calculateStatisticalMetrics(data1);
    const metrics2 = calculateStatisticalMetrics(data2);
    
    // Calculate correlation
    const correlation = calculateCorrelation(data1, data2);
    
    // Calculate similarity scores
    const meanDiff = Math.abs(metrics1.descriptive.mean - metrics2.descriptive.mean);
    const meanSimilarity = 100 / (1 + meanDiff / Math.max(Math.abs(metrics1.descriptive.mean), 1));
    
    const stdDiff = Math.abs(metrics1.descriptive.standardDeviation - metrics2.descriptive.standardDeviation);
    const stdSimilarity = 100 / (1 + stdDiff / Math.max(metrics1.descriptive.standardDeviation, 1));
    
    const overallSimilarity = (meanSimilarity * 0.6 + stdSimilarity * 0.3 + Math.abs(correlation) * 10);
    
    // Generate verdict
    const keyDifferences = [];
    if (meanDiff > metrics1.descriptive.mean * 0.1) {
      keyDifferences.push(`Mean difference: ${meanDiff.toFixed(2)} (${(meanDiff / metrics1.descriptive.mean * 100).toFixed(1)}%)`);
    }
    if (Math.abs(correlation) < 0.3) {
      keyDifferences.push(`Low correlation: ${correlation.toFixed(3)}`);
    }
    
    const recommendations = [];
    if (Math.abs(correlation) > 0.7) {
      recommendations.push("Strong correlation suggests similar underlying patterns.");
    } else {
      recommendations.push("Consider analyzing the relationship between these datasets further.");
    }
    
    const result = {
      metrics1,
      metrics2,
      differences: {
        mean: metrics2.descriptive.mean - metrics1.descriptive.mean,
        meanPercent: ((metrics2.descriptive.mean - metrics1.descriptive.mean) / Math.abs(metrics1.descriptive.mean)) * 100,
        variance: metrics2.descriptive.variance - metrics1.descriptive.variance,
        variancePercent: ((metrics2.descriptive.variance - metrics1.descriptive.variance) / Math.abs(metrics1.descriptive.variance)) * 100,
      },
      similarity: {
        overall: Math.min(100, overallSimilarity),
        distributionSimilarity: stdSimilarity,
        trendSimilarity: Math.abs(correlation) * 100,
        shapeSimilarity: metrics1.shape.symmetry === metrics2.shape.symmetry ? 80 : 40,
        statisticalDistance: meanDiff,
        correlation,
      },
      verdict: {
        areSimilar: overallSimilarity > 70,
        confidence: overallSimilarity,
        keyDifferences,
        recommendations,
      },
    };

    // Add to history
    const comparisonEntry = {
      id: `${name1}-${name2}-${Date.now()}`,
      timestamp: new Date(),
      graph1Name: name1,
      graph2Name: name2,
      result,
    };
    
    setComparisonHistory(prev => [comparisonEntry, ...prev.slice(0, 9)]);

    return result;
  }, [calculateStatisticalMetrics, calculateCorrelation]);

  /* ===========================
     DERIVED STATE & UTILITIES
  ============================ */

  const recentComparisons = useMemo(
    () => comparisonHistory.slice(0, 5),
    [comparisonHistory]
  );

  const hasHistory = useMemo(
    () => comparisonHistory.length > 0,
    [comparisonHistory]
  );

  // Clear history
  const clearHistory = useCallback(() => {
    setComparisonHistory([]);
  }, []);

  return {
    // Configuration
    comparisonConfig,
    setComparisonConfig,
    
    // Math Functions
    calculateMean,
    calculateMedian,
    calculateVariance,
    calculateStdDev,
    calculateCorrelation,
    calculatePercentile,
    calculateSkewness,
    calculateKurtosis,
    
    // Core Functions
    calculateStatisticalMetrics,
    compareStatisticalMetrics,
    
    // History
    comparisonHistory,
    recentComparisons,
    hasHistory,
    clearHistory,
    
    // Utilities
    isValidSampleSize: (data) => data.length >= comparisonConfig.minSampleSize,
  };
};