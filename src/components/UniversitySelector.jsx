import { useState, useEffect } from 'react'
import Select from 'react-select'
import { X } from 'lucide-react'
import Papa from 'papaparse'

function UniversitySelector({ selectedUniversities, onChange }) {
  const [universities, setUniversities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load universities from CSV
    fetch('/ap_credits_master.csv')
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          complete: (results) => {
            // Extract unique colleges
            const collegeSet = new Set()
            results.data.forEach(row => {
              if (row.college && row.college.trim()) {
                collegeSet.add(row.college.trim())
              }
            })
            
            // Convert to react-select format and sort
            const universityList = Array.from(collegeSet)
              .sort()
              .map(college => ({
                value: college.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                label: college
              }))
            
            setUniversities(universityList)
            setLoading(false)
          }
        })
      })
      .catch(error => {
        console.error('Error loading universities:', error)
        setLoading(false)
      })
  }, [])

  const handleAdd = (selected) => {
    if (selected && !selectedUniversities.find(u => u.value === selected.value)) {
      onChange([...selectedUniversities, selected])
    }
  }

  const handleRemove = (university) => {
    onChange(selectedUniversities.filter(u => u.value !== university.value))
  }

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      minHeight: '48px',
    }),
    input: (provided) => ({
      ...provided,
      color: '#fff',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: 'rgba(255, 255, 255, 0.5)',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#1a1a1a',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? 'rgba(102, 126, 234, 0.3)' : 'transparent',
      color: '#fff',
      cursor: 'pointer',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#fff',
    }),
  }

  return (
    <div className="input-group">
      <label>Add Universities:</label>
      <Select
        options={universities}
        onChange={handleAdd}
        placeholder={loading ? "Loading universities..." : "Search and add universities..."}
        isLoading={loading}
        isDisabled={loading}
        styles={customStyles}
        value={null}
        className="react-select-container"
        classNamePrefix="react-select"
      />
      
      {selectedUniversities.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <p style={{ marginBottom: '8px', fontWeight: '500' }}>
            Selected Universities ({selectedUniversities.length}):
          </p>
          <div>
            {selectedUniversities.map((university) => (
              <span key={university.value} className="university-chip">
                {university.label}
                <button onClick={() => handleRemove(university)} aria-label="Remove">
                  <X size={16} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default UniversitySelector
