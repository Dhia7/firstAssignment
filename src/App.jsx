import React, { useState, useEffect } from 'react'
import TableHeader from './components/TableHeader'
import Divider from './components/Divider'
import PageItem from './components/PageItem'
import TableFooter from './components/TableFooter'
import { usePageSelection } from './hooks/usePageSelection'
import './App.css'

const App = () => {
  const pages = [
    { id: 1, name: 'Page 1' },
    { id: 2, name: 'Page 2' },
  ]

  const {
    selectedPages,
    allPagesSelected,
    somePagesSelected,
    handleSelectAll: originalHandleSelectAll,
    handlePageSelect,
  } = usePageSelection(pages)

  // Each page has its own independent clickCount - completely separate
  const [page1ClickCount, setPage1ClickCount] = useState(0)
  const [page2ClickCount, setPage2ClickCount] = useState(0)
  
  // "All pages" has its own independent clickCount
  const [allPagesClickCount, setAllPagesClickCount] = useState(0)
  
  // Handlers for updating each page's clickCount independently
  const handlePage1ClickCount = (newCountOrFunction) => {
    if (typeof newCountOrFunction === 'function') {
      setPage1ClickCount(newCountOrFunction)
    } else {
      setPage1ClickCount(newCountOrFunction)
    }
  }
  
  const handlePage2ClickCount = (newCountOrFunction) => {
    if (typeof newCountOrFunction === 'function') {
      setPage2ClickCount(newCountOrFunction)
    } else {
      setPage2ClickCount(newCountOrFunction)
    }
  }
  
  // "All pages" has priority: if Page 1 and Page 2 don't match, reset "All pages" to 0 (empty checkbox)
  useEffect(() => {
    if (page1ClickCount !== page2ClickCount) {
      setAllPagesClickCount(0)
    }
  }, [page1ClickCount, page2ClickCount])
  
  // "All pages" display clickCount: follows Page 1 and Page 2 when they match, otherwise shows 0 (empty checkbox)
  const allPagesDisplayClickCount = (page1ClickCount === page2ClickCount) 
    ? page1ClickCount 
    : 0
  
  // When Page 1 and Page 2 don't match, "All pages" checkbox should be unchecked (empty)
  const allPagesChecked = (page1ClickCount === page2ClickCount) && allPagesSelected
  
  // "All pages" setClickCount handler - has priority: when clicked, Page 1 and Page 2 follow
  const handleAllPagesClickCount = (newCountOrFunction) => {
    // Use the current displayed clickCount as starting point (could be from Page 1/Page 2 if they match)
    const currentDisplayCount = allPagesDisplayClickCount
    
    const newAllPagesCount = typeof newCountOrFunction === 'function' 
      ? newCountOrFunction(currentDisplayCount) 
      : newCountOrFunction
    
    // Update "All pages" own state
    setAllPagesClickCount(newAllPagesCount)
    
    // "All pages" has priority: update both Page 1 and Page 2 to follow "All pages" clickCount
    setPage1ClickCount(newAllPagesCount)
    setPage2ClickCount(newAllPagesCount)
  }

  // Wrapper to handle checkbox staying checked during style progression
  const handleSelectAll = (e) => {
    // Always use the event's checked value
    originalHandleSelectAll(e)
  }

  const handleDone = () => {
    console.log('Selected pages:', Array.from(selectedPages))
    // Add your done button logic here
  }

  return (
    <div className="main-container">
      <TableHeader
        allSelected={allPagesChecked}
        someSelected={somePagesSelected}
        onSelectAll={handleSelectAll}
        clickCount={allPagesDisplayClickCount}
        setClickCount={handleAllPagesClickCount}
      />

      <Divider />

      <div className="pages-list">
        {pages.map((page) => (
          <PageItem
            key={page.id}
            page={page}
            isSelected={selectedPages.has(page.id)}
            onSelect={handlePageSelect}
            clickCount={page.id === 1 ? page1ClickCount : page.id === 2 ? page2ClickCount : undefined}
            setClickCount={page.id === 1 ? handlePage1ClickCount : page.id === 2 ? handlePage2ClickCount : undefined}
          />
        ))}
        <Divider />
      </div>

      <TableFooter buttonText="Done" onButtonClick={handleDone} />
      
    </div>
  )
}

export default App
