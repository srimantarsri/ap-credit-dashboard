import { useState, useEffect } from 'react'
import APCourseSelector from './components/APCourseSelector'
import UniversitySelector from './components/UniversitySelector'
import ResultsDisplay from './components/ResultsDisplay'
import ComparisonView from './components/ComparisonView'
import ExportButton from './components/ExportButton'
import { searchCreditPolicies } from './services/apCreditService'
import { BookOpen, GraduationCap, MessageSquare, Eye } from 'lucide-react'

function App() {
  const [selectedCourses, setSelectedCourses] = useState([])
  const [selectedUniversities, setSelectedUniversities] = useState([])
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState('comparison') // 'comparison' or 'detailed'
  const [visitCount, setVisitCount] = useState(0)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')

  useEffect(() => {
    // Track page visits
    const visits = parseInt(localStorage.getItem('apDashboardVisits') || '0')
    const newVisits = visits + 1
    localStorage.setItem('apDashboardVisits', newVisits.toString())
    setVisitCount(newVisits)

    // Load comments from localStorage
    const savedComments = JSON.parse(localStorage.getItem('apDashboardComments') || '[]')
    setComments(savedComments)
  }, [])

  const handleSearch = async () => {
    if (selectedCourses.length === 0 || selectedUniversities.length === 0) {
      alert('Please select at least one AP course and one university')
      return
    }

    setLoading(true)
    try {
      const searchResults = await searchCreditPolicies(selectedCourses, selectedUniversities)
      setResults(searchResults)
    } catch (error) {
      console.error('Error fetching credit policies:', error)
      alert('Error fetching credit policies. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSelectedCourses([])
    setSelectedUniversities([])
    setResults([])
    setViewMode('comparison')
  }

  const handleCommentSubmit = (e) => {
    e.preventDefault()
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        message: newComment,
        date: new Date().toLocaleDateString()
      }
      const updatedComments = [...comments, comment]
      setComments(updatedComments)
      localStorage.setItem('apDashboardComments', JSON.stringify(updatedComments))
      setNewComment('')
    }
  }

  return (
    <div className="container">
      <header className="header">
        <h1>
          <BookOpen size={48} style={{ display: 'inline-block', marginRight: '12px', verticalAlign: 'middle' }} />
          AP Credit Dashboard
        </h1>
        <p>Check if your AP courses will earn you college credit</p>
      </header>

      <div className="card">
        <h2>
          <BookOpen size={24} style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }} />
          Select Your AP Courses
        </h2>
        <APCourseSelector
          selectedCourses={selectedCourses}
          onChange={setSelectedCourses}
        />
      </div>

      <div className="card">
        <h2>
          <GraduationCap size={24} style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }} />
          Select Universities
        </h2>
        <UniversitySelector
          selectedUniversities={selectedUniversities}
          onChange={setSelectedUniversities}
        />
      </div>

      <div className="actions-bar">
        <button className="button" onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search Credit Policies'}
        </button>
        <button className="button button-secondary" onClick={handleReset}>
          Reset
        </button>
        {results.length > 0 && (
          <>
            <button
              className="button button-secondary"
              onClick={() => setViewMode(viewMode === 'comparison' ? 'detailed' : 'comparison')}
            >
              {viewMode === 'comparison' ? 'Detailed View' : 'Results View'}
            </button>
            <ExportButton data={results} courses={selectedCourses} universities={selectedUniversities} />
          </>
        )}
      </div>

      {loading && <div className="loader"></div>}

      {!loading && results.length > 0 && (
        viewMode === 'comparison' ? (
          <ComparisonView results={results} courses={selectedCourses} universities={selectedUniversities} />
        ) : (
          <ResultsDisplay results={results} />
        )
      )}

      {!loading && results.length === 0 && selectedCourses.length > 0 && selectedUniversities.length > 0 && (
        <div className="empty-state">
          <p>Click "Search Credit Policies" to see results</p>
        </div>
      )}

      <div className="card" style={{ marginTop: '40px' }}>
        <h2>
          <MessageSquare size={24} style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }} />
          Comments & Feedback
        </h2>
        <form onSubmit={handleCommentSubmit} style={{ marginBottom: '20px' }}>
          <div className="input-group">
            <label>Your Feedback:</label>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your feedback or suggestions..."
              className="comment-textarea"
              rows="3"
              required
            />
          </div>
          <button type="submit" className="button">Post Comment</button>
        </form>

        <div className="comments-list">
          {comments.length === 0 ? (
            <p style={{ opacity: 0.6, textAlign: 'center' }}>No comments yet. Be the first to share your thoughts!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '8px' }}>{comment.date}</div>
                <div>{comment.message}</div>
              </div>
            ))
          )}
        </div>
      </div>

      <footer className="footer">
        <p style={{ fontStyle: 'italic', opacity: 0.6, fontSize: '0.9rem' }}>
          An independent student initiative by <strong>Mansi Viswanath</strong>, Stratford Prep, Class of 2027
        </p>
        <div style={{ marginTop: '10px', fontSize: '0.9rem', opacity: 0.7 }}>
          <Eye size={16} style={{ display: 'inline-block', marginRight: '5px', verticalAlign: 'middle' }} />
          Page Visits: {visitCount.toLocaleString()}
        </div>
      </footer>
    </div>
  )
}

export default App
