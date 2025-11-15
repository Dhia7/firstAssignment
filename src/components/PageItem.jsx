import React from 'react'
import Checkbox from './Checkbox'
import './PageItem.css'

const PageItem = ({ page, isSelected, onSelect, clickCount, setClickCount }) => {
  const handleChange = (e) => {
    // Pass the checked state to onSelect so it can maintain the selection state
    onSelect(page.id, e.target.checked)
  }

  return (
    <div className={`page-item ${isSelected ? 'selected' : ''}`}>
      <span className="page-text">{page.name}</span>
      <Checkbox
        id={`page-${page.id}`}
        checked={isSelected}
        onChange={handleChange}
        clickCount={clickCount}
        setClickCount={setClickCount}
      />
    </div>
  )
}

export default PageItem
