import Select from 'react-select'
import { AP_COURSES } from '../data/courses'

function APCourseSelector({ selectedCourses, onChange }) {
  const handleChange = (selected) => {
    onChange(selected || [])
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
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: 'rgba(102, 126, 234, 0.3)',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#fff',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: '#fff',
      ':hover': {
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        color: '#fff',
      },
    }),
  }

  return (
    <div className="input-group">
      <label>Select AP Courses (multiple selection):</label>
      <Select
        isMulti
        options={AP_COURSES}
        value={selectedCourses}
        onChange={handleChange}
        placeholder="Search and select AP courses..."
        styles={customStyles}
        className="react-select-container"
        classNamePrefix="react-select"
      />
      <p style={{ marginTop: '8px', fontSize: '0.9rem', opacity: 0.7 }}>
        Selected: {selectedCourses.length} course{selectedCourses.length !== 1 ? 's' : ''}
      </p>
    </div>
  )
}

export default APCourseSelector
