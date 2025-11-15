import React from 'react'
import Button from './Button'
import './TableFooter.css'

const TableFooter = ({ buttonText = 'Done', onButtonClick }) => {
  return (
    <div className="footer-section">
      <Button 
        text={buttonText} 
        onClick={onButtonClick}
        variant="primary"
      />
    </div>
  )
}

export default TableFooter

