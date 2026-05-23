import { Download } from 'lucide-react'

function ExportButton({ data, courses, universities }) {
  const exportToCSV = () => {
    // Create CSV header
    const header = ['University', 'AP Course', 'Credit Granted', 'Minimum Score', 'Credit Hours', 'Notes']
    
    // Create CSV rows
    const rows = data.flatMap(result => 
      result.credits.map(credit => [
        result.university.label,
        credit.course.label,
        credit.accepted ? 'Yes' : 'No',
        credit.minScore || 'N/A',
        credit.creditHours || 'N/A',
        credit.notes || ''
      ])
    )
    
    // Combine header and rows
    const csvContent = [
      header.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `ap-credit-results-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToHTML = () => {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AP Credit Results</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
    }
    h1 {
      color: #333;
      border-bottom: 3px solid #667eea;
      padding-bottom: 10px;
    }
    .university {
      background: white;
      margin: 20px 0;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .university h2 {
      color: #667eea;
      margin-top: 0;
    }
    .course {
      border-left: 3px solid #ddd;
      padding-left: 15px;
      margin: 15px 0;
    }
    .accepted {
      border-left-color: #10b981;
    }
    .rejected {
      border-left-color: #ef4444;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.85em;
      font-weight: bold;
      margin-left: 10px;
    }
    .badge-success {
      background: #10b981;
      color: white;
    }
    .badge-error {
      background: #ef4444;
      color: white;
    }
    .info {
      color: #666;
      font-size: 0.9em;
      margin-top: 5px;
    }
    .export-info {
      text-align: center;
      color: #666;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
    }
  </style>
</head>
<body>
  <h1>AP Credit Results</h1>
  <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
  <p><strong>AP Courses:</strong> ${courses.map(c => c.label).join(', ')}</p>
  
  ${data.map(result => `
    <div class="university">
      <h2>${result.university.label}</h2>
      ${result.credits.map(credit => `
        <div class="course ${credit.accepted ? 'accepted' : 'rejected'}">
          <strong>${credit.course.label}</strong>
          <span class="badge ${credit.accepted ? 'badge-success' : 'badge-error'}">
            ${credit.accepted ? 'Credit Granted' : 'No Credit'}
          </span>
          ${credit.accepted && credit.minScore ? `
            <div class="info">Minimum Score: ${credit.minScore}</div>
          ` : ''}
          ${credit.accepted && credit.creditHours ? `
            <div class="info">Credit Hours: ${credit.creditHours}</div>
          ` : ''}
          ${credit.notes ? `
            <div class="info">${credit.notes}</div>
          ` : ''}
        </div>
      `).join('')}
      <p><strong>Summary:</strong> ${result.credits.filter(c => c.accepted).length} / ${result.credits.length} courses accepted</p>
    </div>
  `).join('')}
  
  <div class="export-info">
    <p>Exported from AP Credit Dashboard</p>
  </div>
</body>
</html>
    `
    
    const blob = new Blob([html], { type: 'text/html' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `ap-credit-results-${new Date().toISOString().split('T')[0]}.html`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div style={{ display: 'inline-block' }}>
      <button className="button" onClick={exportToCSV}>
        <Download size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
        Export CSV
      </button>
      <button className="button button-secondary" onClick={exportToHTML}>
        <Download size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
        Export HTML
      </button>
    </div>
  )
}

export default ExportButton
