import { CheckCircle, XCircle } from 'lucide-react'

function ComparisonView({ results, courses, universities }) {
  const getCreditStatus = (universityValue, courseValue) => {
    const result = results.find(r => r.university.value === universityValue)
    if (!result) return null
    
    const credit = result.credits.find(c => c.course.value === courseValue)
    return credit
  }

  const parseScoreVariations = (notes) => {
    const scoreData = []
    const matches = notes.match(/Score (\d+): ([^;]+)/g)
    
    if (matches) {
      matches.forEach(match => {
        const scoreMatch = match.match(/Score (\d+): (\d+) credits?(?: \((.+?)\))?/)
        if (scoreMatch) {
          scoreData.push({
            score: scoreMatch[1],
            credits: scoreMatch[2],
            notes: scoreMatch[3] || ''
          })
        }
      })
    }
    return scoreData
  }

  return (
    <div className="card">
      <h2>University Comparison</h2>
      <p style={{ marginBottom: '20px', opacity: 0.8 }}>
        Compare credit policies across {universities.length} universities for {courses.length} AP courses
      </p>
      
      <div style={{ overflowX: 'auto' }}>
        <table className="comparison-table">
          <thead>
            <tr>
              <th style={{ minWidth: '200px' }}>AP Course</th>
              {universities.map((university) => (
                <th key={university.value} style={{ minWidth: '150px' }}>
                  {university.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.value}>
                <td style={{ fontWeight: '500' }}>{course.label}</td>
                {universities.map((university) => {
                  const credit = getCreditStatus(university.value, course.value)
                  
                  // Check if credit varies by score
                  const hasScoreVariations = credit?.notes && credit.notes.includes('Credit varies by score')
                  const scoreData = hasScoreVariations ? parseScoreVariations(credit.notes) : []
                  
                  return (
                    <td key={`${university.value}-${course.value}`}>
                      {credit ? (
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                            {credit.accepted ? (
                              <>
                                <CheckCircle size={14} color="#10b981" />
                                <span style={{ color: '#10b981', fontSize: '0.8rem' }}>Yes</span>
                              </>
                            ) : (
                              <>
                                <XCircle size={14} color="#ef4444" />
                                <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>No</span>
                              </>
                            )}
                          </div>
                          
                          {credit.accepted && scoreData.length > 0 ? (
                            // Show score variations in compact format
                            <div style={{ fontSize: '0.7rem', lineHeight: '1.4' }}>
                              {scoreData.map((row, idx) => (
                                <div key={idx} style={{ marginBottom: '2px' }}>
                                  <strong>Score {row.score}:</strong> {row.credits} credits
                                </div>
                              ))}
                            </div>
                          ) : credit.accepted ? (
                            // Show single score/credit
                            <>
                              {credit.minScore && (
                                <div style={{ fontSize: '0.75rem', marginTop: '2px' }}>
                                  <strong>Score:</strong> {credit.minScore}
                                </div>
                              )}
                              {credit.creditHours && (
                                <div style={{ fontSize: '0.75rem' }}>
                                  <strong>Credits:</strong> {credit.creditHours}
                                </div>
                              )}
                            </>
                          ) : null}
                        </div>
                      ) : (
                        <span style={{ opacity: 0.5 }}>-</span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '12px' }}>Summary Statistics</h3>
        {universities.map((university) => {
          const result = results.find(r => r.university.value === university.value)
          if (!result) return null
          
          const accepted = result.credits.filter(c => c.accepted).length
          const total = result.credits.length
          const percentage = total > 0 ? Math.round((accepted / total) * 100) : 0
          
          return (
            <div key={university.value} style={{ marginBottom: '8px' }}>
              <strong>{university.label}:</strong> {accepted}/{total} courses ({percentage}%)
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ComparisonView

