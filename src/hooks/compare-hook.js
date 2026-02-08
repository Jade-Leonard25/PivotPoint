'use client'
import React, { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { regressionLinear } from 'd3-regression';
import Papa from 'papaparse';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Download,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  PieChart,
  Upload,
  LineChart,
  ScatterChart,
  Grid,
  Table as TableIcon,
  Eye
} from 'lucide-react';

export const CSVVisualizationTool = () => {
  const [csvData, setCsvData] = useState([]);
  const [csvContent, setCsvContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedXAxis, setSelectedXAxis] = useState('');
  const [selectedYAxis, setSelectedYAxis] = useState('');
  const [selectedChartType, setSelectedChartType] = useState('scatter');
  const [dataSummary, setDataSummary] = useState(null);
  const [parsedColumns, setParsedColumns] = useState([]);

  // Refs for D3 containers
  const chartRef = useRef(null);
  const statsRef = useRef(null);

  // Parse CSV using PapaParse
  const parseCSV = () => {
    if (!csvContent.trim()) {
      setError('Please enter CSV content');
      return;
    }

    setIsLoading(true);
    setError('');

    Papa.parse(csvContent, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setError(`Parsing errors: ${results.errors.map(e => e.message).join(', ')}`);
          setCsvData([]);
          setParsedColumns([]);
        } else {
          setCsvData(results.data);
          if (results.data.length > 0) {
            const columns = Object.keys(results.data[0]);
            setParsedColumns(columns);
            setSelectedXAxis(columns[0] || '');
            setSelectedYAxis(columns.length > 1 ? columns[1] : columns[0]);

            // Calculate data summary
            calculateDataSummary(results.data, columns);
          }
        }
        setIsLoading(false);
      },
      error: (error) => {
        setError(`Parse error: ${error.message}`);
        setIsLoading(false);
      }
    });
  };

  // Calculate summary statistics
  const calculateDataSummary = (data, columns) => {
    const summary = {};

    columns.forEach(col => {
      const values = data.map(row => row[col]).filter(v => typeof v === 'number');
      if (values.length > 0) {
        summary[col] = {
          count: values.length,
          mean: d3.mean(values),
          median: d3.median(values),
          min: d3.min(values),
          max: d3.max(values),
          stdDev: d3.deviation(values),
          sum: d3.sum(values),
          missing: data.length - values.length
        };
      }
    });

    setDataSummary(summary);
  };

  // Render D3 visualization
  useEffect(() => {
    if (!chartRef.current || !csvData.length || !selectedXAxis || !selectedYAxis) return;

    // Clear previous chart
    d3.select(chartRef.current).selectAll("*").remove();

    const margin = { top: 40, right: 30, bottom: 50, left: 60 };
    const width = chartRef.current.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(chartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Prepare data
    const filteredData = csvData.filter(
      row => typeof row[selectedXAxis] === 'number' && typeof row[selectedYAxis] === 'number'
    );

    if (filteredData.length === 0) return;

    // Set up scales
    const xScale = d3.scaleLinear()
      .domain(d3.extent(filteredData, d => d[selectedXAxis]))
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain(d3.extent(filteredData, d => d[selectedYAxis]))
      .range([height, 0]);

    // Add X axis
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .append("text")
      .attr("x", width / 2)
      .attr("y", 35)
      .attr("fill", "currentColor")
      .attr("text-anchor", "middle")
      .text(selectedXAxis);

    // Add Y axis
    svg.append("g")
      .call(d3.axisLeft(yScale))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -45)
      .attr("x", -height / 2)
      .attr("fill", "currentColor")
      .attr("text-anchor", "middle")
      .text(selectedYAxis);

    // Add grid lines
    svg.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickSize(-height).tickFormat(""));

    svg.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(""));

    // Add chart based on type
    if (selectedChartType === 'scatter') {
      // Add scatter points
      svg.selectAll("circle")
        .data(filteredData)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d[selectedXAxis]))
        .attr("cy", d => yScale(d[selectedYAxis]))
        .attr("r", 4)
        .attr("fill", "steelblue")
        .attr("opacity", 0.6);

      // Add regression line
      const regressionLine = regressionLinear()
        .x(d => d[selectedXAxis])
        .y(d => d[selectedYAxis])
        .domain(xScale.domain());

      const lineData = regressionLine(filteredData);

      svg.append("path")
        .datum(lineData)
        .attr("fill", "none")
        .attr("stroke", "#ff6b6b")
        .attr("stroke-width", 2)
        .attr("d", d3.line()
          .x(d => xScale(d[0]))
          .y(d => yScale(d[1]))
        );

    } else if (selectedChartType === 'line') {
      // Sort data by X axis
      const sortedData = [...filteredData].sort((a, b) => a[selectedXAxis] - b[selectedXAxis]);

      // Create line generator
      const line = d3.line()
        .x(d => xScale(d[selectedXAxis]))
        .y(d => yScale(d[selectedYAxis]))
        .curve(d3.curveMonotoneX);

      svg.append("path")
        .datum(sortedData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line);

      // Add points
      svg.selectAll("circle")
        .data(sortedData)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d[selectedXAxis]))
        .attr("cy", d => yScale(d[selectedYAxis]))
        .attr("r", 3)
        .attr("fill", "steelblue");
    }

    // Add title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", -10)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text(`${selectedYAxis} vs ${selectedXAxis}`);

  }, [csvData, selectedXAxis, selectedYAxis, selectedChartType]);

  // Render statistics visualization
  useEffect(() => {
    if (!statsRef.current || !dataSummary || !selectedYAxis) return;

    d3.select(statsRef.current).selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = statsRef.current.clientWidth - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    const svg = d3.select(statsRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const stats = dataSummary[selectedYAxis];
    if (!stats) return;

    // Create histogram
    const histogram = d3.histogram()
      .value(d => d)
      .domain([stats.min, stats.max])
      .thresholds(10);

    const numericData = csvData
      .map(row => row[selectedYAxis])
      .filter(v => typeof v === 'number');

    const bins = histogram(numericData);

    const x = d3.scaleLinear()
      .domain([stats.min, stats.max])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(bins, d => d.length)])
      .range([height, 0]);

    // Add bars
    svg.selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
      .attr("x", d => x(d.x0) + 1)
      .attr("y", d => y(d.length))
      .attr("width", d => x(d.x1) - x(d.x0) - 1)
      .attr("height", d => height - y(d.length))
      .attr("fill", "steelblue")
      .attr("opacity", 0.7);

    // Add axes
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append("g")
      .call(d3.axisLeft(y));

    // Add mean line
    svg.append("line")
      .attr("x1", x(stats.mean))
      .attr("x2", x(stats.mean))
      .attr("y1", 0)
      .attr("y2", height)
      .attr("stroke", "#ff6b6b")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "5,5");

    svg.append("text")
      .attr("x", x(stats.mean))
      .attr("y", -5)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .text(`Mean: ${stats.mean.toFixed(2)}`);

  }, [dataSummary, selectedYAxis, csvData]);

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsLoading(true);
    setError('');

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        setCsvData(results.data);
        if (results.data.length > 0) {
          const columns = Object.keys(results.data[0]);
          setParsedColumns(columns);
          setSelectedXAxis(columns[0] || '');
          setSelectedYAxis(columns.length > 1 ? columns[1] : columns[0]);
          calculateDataSummary(results.data, columns);
        }

        // Show first few rows in textarea
        const firstRows = results.data.slice(0, 5);
        const header = Object.keys(results.data[0] || {});
        const csvString = Papa.unparse({
          fields: header,
          data: firstRows.map(row => header.map(h => row[h]))
        });
        setCsvContent(csvString);
        setIsLoading(false);
      },
      error: (error) => {
        setError(`File parse error: ${error.message}`);
        setIsLoading(false);
      }
    });
  };

  // Export data
  const handleExport = (format = 'json') => {
    if (!csvData.length) return;

    let content, mimeType, filename;

    if (format === 'json') {
      content = JSON.stringify(csvData, null, 2);
      mimeType = 'application/json';
      filename = `data-export-${new Date().toISOString().split('T')[0]}.json`;
    } else if (format === 'csv') {
      content = Papa.unparse(csvData);
      mimeType = 'text/csv';
      filename = `data-export-${new Date().toISOString().split('T')[0]}.csv`;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Calculate correlation
  const calculateCorrelation = () => {
    if (!selectedXAxis || !selectedYAxis || !csvData.length) return null;

    const filteredData = csvData.filter(
      row => typeof row[selectedXAxis] === 'number' && typeof row[selectedYAxis] === 'number'
    );

    if (filteredData.length < 2) return null;

    const xValues = filteredData.map(d => d[selectedXAxis]);
    const yValues = filteredData.map(d => d[selectedYAxis]);

    const meanX = d3.mean(xValues);
    const meanY = d3.mean(yValues);

    const numerator = d3.sum(xValues.map((x, i) => (x - meanX) * (yValues[i] - meanY)));
    const denominator = Math.sqrt(
      d3.sum(xValues.map(x => Math.pow(x - meanX, 2))) *
      d3.sum(yValues.map(y => Math.pow(y - meanY, 2)))
    );

    return denominator === 0 ? 0 : numerator / denominator;
  };

  const correlation = calculateCorrelation();

  return (
    <div className="w-full p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT COLUMN: Data Input & Configuration */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TableIcon className="h-6 w-6" />
                <CardTitle>CSV Data Visualization Tool</CardTitle>
              </div>
              <CardDescription>
                Upload or paste CSV data to visualize with D3.js
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Upload */}
              <Card>
                <CardHeader>
                  <CardTitle>Upload CSV File</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Label htmlFor="csv-upload" className="cursor-pointer">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <div className="text-sm font-medium">Click to upload CSV</div>
                          <div className="text-xs text-gray-500 mt-1">or drag and drop</div>
                        </div>
                      </Label>
                      <input
                        id="csv-upload"
                        type="file"
                        accept=".csv,.txt"
                        onChange={handleFileUpload}
                        className="hidden"
                      />

                      <div className="text-sm text-gray-600">
                        <div className="font-medium mb-1">Supported formats:</div>
                        <div>• CSV files</div>
                        <div>• TSV files</div>
                        <div>• Plain text with commas</div>
                      </div>
                    </div>

                    <Separator />

                    <div className="text-center text-sm text-gray-500">or</div>

                    <div className="space-y-2">
                      <Label htmlFor="csv-content">Paste CSV Content</Label>
                      <Textarea
                        id="csv-content"
                        value={csvContent}
                        onChange={(e) => setCsvContent(e.target.value)}
                        placeholder={`Enter CSV data here...
name,age,salary
John,30,50000
Jane,25,60000
Bob,35,55000`}
                        className="min-h-[200px] font-mono text-sm"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={parseCSV}
                    disabled={isLoading || !csvContent.trim()}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Parsing...
                      </>
                    ) : (
                      <>
                        <Eye className="mr-2 h-4 w-4" />
                        Parse & Visualize CSV
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>

              {/* Chart Configuration */}
              {parsedColumns.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Chart Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="x-axis">X Axis</Label>
                        <Select value={selectedXAxis} onValueChange={setSelectedXAxis}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select X axis" />
                          </SelectTrigger>
                          <SelectContent>
                            {parsedColumns.map(col => (
                              <SelectItem key={`x-${col}`} value={col}>
                                {col}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="y-axis">Y Axis</Label>
                        <Select value={selectedYAxis} onValueChange={setSelectedYAxis}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Y axis" />
                          </SelectTrigger>
                          <SelectContent>
                            {parsedColumns.map(col => (
                              <SelectItem key={`y-${col}`} value={col}>
                                {col}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="chart-type">Chart Type</Label>
                      <Select value={selectedChartType} onValueChange={setSelectedChartType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select chart type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="scatter">
                            <div className="flex items-center gap-2">
                              <ScatterChart className="h-4 w-4" />
                              Scatter Plot
                            </div>
                          </SelectItem>
                          <SelectItem value="line">
                            <div className="flex items-center gap-2">
                              <LineChart className="h-4 w-4" />
                              Line Chart
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Correlation Display */}
                    {correlation !== null && (
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm font-medium">Correlation</div>
                              <div className="text-2xl font-bold">{correlation.toFixed(3)}</div>
                            </div>
                            <Badge
                              variant={
                                Math.abs(correlation) > 0.7 ? "default" :
                                  Math.abs(correlation) > 0.3 ? "secondary" : "outline"
                              }
                            >
                              {Math.abs(correlation) > 0.7 ? 'Strong' :
                                Math.abs(correlation) > 0.3 ? 'Moderate' : 'Weak'}
                            </Badge>
                          </div>
                          <Progress
                            value={Math.abs(correlation) * 100}
                            className="mt-2 h-2"
                          />
                        </CardContent>
                      </Card>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Data Summary */}
              {dataSummary && selectedYAxis && dataSummary[selectedYAxis] && (
                <Card>
                  <CardHeader>
                    <CardTitle>Statistics for {selectedYAxis}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-500">Count</div>
                        <div className="text-lg font-semibold">
                          {dataSummary[selectedYAxis].count}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-gray-500">Mean</div>
                        <div className="text-lg font-semibold">
                          {dataSummary[selectedYAxis].mean.toFixed(2)}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-gray-500">Min</div>
                        <div className="text-lg font-semibold">
                          {dataSummary[selectedYAxis].min.toFixed(2)}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-gray-500">Max</div>
                        <div className="text-lg font-semibold">
                          {dataSummary[selectedYAxis].max.toFixed(2)}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-gray-500">Std Dev</div>
                        <div className="text-lg font-semibold">
                          {dataSummary[selectedYAxis].stdDev.toFixed(2)}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-gray-500">Missing</div>
                        <div className="text-lg font-semibold">
                          {dataSummary[selectedYAxis].missing}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Visualizations & Data */}
        <div className="space-y-6">
          {/* Main Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Data Visualization</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleExport('json')}>
                    <Download className="h-4 w-4 mr-2" />
                    JSON
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
                    <FileText className="h-4 w-4 mr-2" />
                    CSV
                  </Button>
                </div>
              </div>
              <CardDescription>
                {csvData.length} rows, {parsedColumns.length} columns loaded
              </CardDescription>
            </CardHeader>
            <CardContent>
              {csvData.length > 0 ? (
                <div className="space-y-6">
                  <div
                    ref={chartRef}
                    className="w-full border rounded-lg p-4 min-h-[400px] bg-white"
                  />

                  {selectedYAxis && dataSummary && dataSummary[selectedYAxis] && (
                    <div className="space-y-4">
                      <div className="text-sm font-medium">Distribution of {selectedYAxis}</div>
                      <div
                        ref={statsRef}
                        className="w-full border rounded-lg p-4 bg-white"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <BarChart3 className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Data Loaded</h3>
                  <p className="text-gray-500 mb-6">
                    Upload a CSV file or paste CSV content to visualize data.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Data Preview Table */}
          {csvData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Data Preview</CardTitle>
                <CardDescription>
                  First {Math.min(10, csvData.length)} rows of {csvData.length} total
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {parsedColumns.map((col, index) => (
                          <TableHead key={index} className="font-bold">
                            {col}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {csvData.slice(0, 10).map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {parsedColumns.map((col, colIndex) => (
                            <TableCell key={colIndex} className="font-mono text-sm">
                              {row[col] !== undefined ? String(row[col]) : 'N/A'}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  View All {csvData.length} Rows
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default CSVVisualizationTool;