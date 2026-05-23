import { CheckCircle, XCircle, ExternalLink } from 'lucide-react'

function ResultsDisplay({ results }) {
  // Generate unique border colors for each university
  const getUniversityBorderColor = (index) => {
    const colors = [
      '#667eea',
      '#8b5cf6',
      '#ec4899',
      '#f59e0b',
      '#10b981',
      '#06b6d4',
    ]
    return colors[index % colors.length]
  }

  const getCreditBadge = (credit) => {
    if (credit.accepted) {
      return <span className="badge badge-success">Credit Granted</span>
    } else {
      return <span className="badge badge-error">No Credit</span>
    }
  }

  const getCreditDetails = (credit) => {
    if (!credit.accepted) {
      return null
    }

    // Parse score variations if present
    const scoreData = []
    
    if (credit.notes && credit.notes.includes('Credit varies by score')) {
      const matches = credit.notes.match(/Score (\d+): ([^;]+)/g)
      
      if (matches) {
        matches.forEach(match => {
          const scoreMatch = match.match(/Score (\d+): (\d+) credits?(?: \((.+?)\))?/)
          if (scoreMatch) {
            scoreData.push({
              score: scoreMatch[1],
              credits: scoreMatch[2],
              courses: scoreMatch[3] || ''
            })
          }
        })
      }
    } else {
      // Single score level - create table entry
      scoreData.push({
        score: credit.minScore || '-',
        credits: credit.creditHours || '-',
        courses: credit.notes || ''
      })
    }

    // Always show table format for consistency
    return (
      <div style={{ marginTop: '8px' }}>
        <table style={{ 
          width: '100%', 
          fontSize: '0.7rem', 
          borderCollapse: 'collapse',
          marginTop: '4px'
        }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
              <th style={{ padding: '4px', textAlign: 'left', fontWeight: '600' }}>Score</th>
              <th style={{ padding: '4px', textAlign: 'left', fontWeight: '600' }}>Credits</th>
              <th style={{ padding: '4px', textAlign: 'left', fontWeight: '600' }}>Course(s)</th>
            </tr>
          </thead>
          <tbody>
            {scoreData.map((row, idx) => (
              <tr key={idx} style={{ borderBottom: idx < scoreData.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none' }}>
                <td style={{ padding: '4px' }}>{row.score}</td>
                <td style={{ padding: '4px' }}>{row.credits}</td>
                <td style={{ padding: '4px', fontSize: '0.65rem' }}>{row.courses}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="card">
      <h2 style={{ fontSize: '1.3rem' }}>Credit Policy Results</h2>
      <div className="results-grid">
        {results.map((result, index) => (
          <div 
            key={index} 
            className="result-card"
            style={{
              borderLeft: `4px solid ${getUniversityBorderColor(index)}`,
              borderTop: `1px solid ${getUniversityBorderColor(index)}`,
              borderRight: `1px solid ${getUniversityBorderColor(index)}`,
              borderBottom: `1px solid ${getUniversityBorderColor(index)}`,
            }}
          >
            <h3 style={{ marginBottom: '10px', fontSize: '0.95rem' }}>
              {result.university.label}
            </h3>
            {result.url && (
              <a 
                href={result.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="college-board-link"
                style={{ fontSize: '0.75rem' }}
              >
                <ExternalLink size={14} style={{ marginRight: '4px' }} />
                View on College Board
              </a>
            )}
            <div style={{ marginTop: '14px' }}>
              {result.credits.map((credit, cIndex) => (
                <div key={cIndex} style={{ marginBottom: '14px', paddingBottom: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    {credit.accepted ? (
                      <CheckCircle size={16} color="#10b981" />
                    ) : (
                      <XCircle size={16} color="#ef4444" />
                    )}
                    <strong style={{ fontSize: '0.85rem' }}>{credit.course.label}</strong>
                  </div>
                  {getCreditBadge(credit)}
                  {getCreditDetails(credit)}
                </div>
              ))}
            </div>
            <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.2)', fontSize: '0.8rem' }}>
              <strong>Summary:</strong> {result.credits.filter(c => c.accepted).length} / {result.credits.length} courses accepted
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ResultsDisplay
