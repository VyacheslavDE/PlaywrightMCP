const fs = require('fs');
const path = require('path');

// Create a simple HTML report based on test results
function generateSimpleReport() {
  console.log('Generating simple HTML report...');
  
  // Create reports directory if it doesn't exist
  const reportsDir = path.join(__dirname, '..', 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  // Try to read test results
  let testResults = [];
  const allureResultsDir = path.join(__dirname, '..', 'allure-results');
  
  if (fs.existsSync(allureResultsDir)) {
    const files = fs.readdirSync(allureResultsDir);
    const resultFiles = files.filter(file => file.endsWith('-result.json'));
    
    testResults = resultFiles.map(file => {
      try {
        const content = fs.readFileSync(path.join(allureResultsDir, file), 'utf8');
        const result = JSON.parse(content);
        return {
          name: result.name || 'Unknown Test',
          status: result.status || 'unknown',
          duration: result.stop - result.start || 0,
          description: result.description || '',
          labels: result.labels || []
        };
      } catch (error) {
        console.error(`Error parsing ${file}:`, error);
        return {
          name: file,
          status: 'error',
          duration: 0,
          description: 'Error parsing test result',
          labels: []
        };
      }
    });
  }
  
  // Generate HTML content
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Playwright Test Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        h1 {
            color: #2c3e50;
            text-align: center;
            margin-bottom: 30px;
        }
        .summary {
            background-color: #f8f9fa;
            border-radius: 5px;
            padding: 15px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-around;
            text-align: center;
        }
        .summary-item {
            display: flex;
            flex-direction: column;
        }
        .summary-value {
            font-size: 24px;
            font-weight: bold;
        }
        .passed { color: #28a745; }
        .failed { color: #dc3545; }
        .skipped { color: #6c757d; }
        .broken { color: #fd7e14; }
        .unknown { color: #6c757d; }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            padding: 12px 15px;
            border-bottom: 1px solid #ddd;
            text-align: left;
        }
        th {
            background-color: #f8f9fa;
            font-weight: bold;
        }
        tr:hover {
            background-color: #f5f5f5;
        }
        .status-badge {
            padding: 5px 10px;
            border-radius: 4px;
            font-weight: bold;
            color: white;
            display: inline-block;
            min-width: 80px;
            text-align: center;
        }
        .status-passed { background-color: #28a745; }
        .status-failed { background-color: #dc3545; }
        .status-skipped { background-color: #6c757d; }
        .status-broken { background-color: #fd7e14; }
        .status-unknown { background-color: #6c757d; }
        .duration {
            color: #666;
            font-size: 0.9em;
        }
        .no-results {
            text-align: center;
            padding: 40px;
            color: #6c757d;
            font-style: italic;
        }
        .timestamp {
            text-align: right;
            color: #6c757d;
            font-size: 0.9em;
            margin-top: 30px;
        }
    </style>
</head>
<body>
    <h1>Playwright Test Report</h1>
    
    <div class="summary">
        <div class="summary-item">
            <div class="summary-value">${testResults.length}</div>
            <div>Total Tests</div>
        </div>
        <div class="summary-item">
            <div class="summary-value passed">${testResults.filter(t => t.status === 'passed').length}</div>
            <div>Passed</div>
        </div>
        <div class="summary-item">
            <div class="summary-value failed">${testResults.filter(t => t.status === 'failed').length}</div>
            <div>Failed</div>
        </div>
        <div class="summary-item">
            <div class="summary-value skipped">${testResults.filter(t => t.status === 'skipped').length}</div>
            <div>Skipped</div>
        </div>
        <div class="summary-item">
            <div class="summary-value broken">${testResults.filter(t => t.status === 'broken').length}</div>
            <div>Broken</div>
        </div>
    </div>
    
    ${testResults.length > 0 ? `
    <table>
        <thead>
            <tr>
                <th>Test Name</th>
                <th>Status</th>
                <th>Duration</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
            ${testResults.map(test => `
            <tr>
                <td>${test.name}</td>
                <td><span class="status-badge status-${test.status}">${test.status.toUpperCase()}</span></td>
                <td class="duration">${(test.duration / 1000).toFixed(2)}s</td>
                <td>${test.description}</td>
            </tr>
            `).join('')}
        </tbody>
    </table>
    ` : `
    <div class="no-results">
        <p>No test results found.</p>
        <p>Run your tests with Playwright to see results here.</p>
    </div>
    `}
    
    <div class="timestamp">
        Generated on: ${new Date().toLocaleString()}
    </div>
</body>
</html>
  `;
  
  // Write HTML file
  fs.writeFileSync(path.join(reportsDir, 'index.html'), htmlContent);
  
  // Create .nojekyll file to ensure GitHub Pages works correctly
  fs.writeFileSync(path.join(reportsDir, '.nojekyll'), '');
  
  console.log('Simple HTML report generated successfully at:', path.join(reportsDir, 'index.html'));
}

// Run the function if this script is executed directly
if (require.main === module) {
  generateSimpleReport();
}

module.exports = generateSimpleReport;
