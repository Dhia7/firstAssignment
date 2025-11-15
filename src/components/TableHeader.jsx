import React from 'react'
import Checkbox from './Checkbox'
import './TableHeader.css'

const TableHeader = ({ allSelected, someSelected, onSelectAll, clickCount, setClickCount }) => {
  return (
    <div className="header-section">
      <div className="header-item">
        <span className="header-text">All pages</span>
        <Checkbox
          id="selectAll"
          checked={allSelected}
          indeterminate={someSelected}
          onChange={onSelectAll}
          clickCount={clickCount}
          setClickCount={setClickCount}
        />
      </div>
    </div>
  )
}

export default TableHeader
