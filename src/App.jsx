import React, { useState, useEffect, useMemo } from 'react'
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
    { id: 3, name: 'Page 3' },
    { id: 4, name: 'Page 4' },
  ]

  const {
    selectedPages,
    allPagesSelected,
    somePagesSelected,
    handleSelectAll: originalHandleSelectAll,
    handlePageSelect,
  } = usePageSelection(pages)

  // Dynamic clickCount state for all pages - uses page ID as key
  const [pageClickCounts, setPageClickCounts] = useState(() => {
    const initialCounts = {}
    pages.forEach(page => {
      initialCounts[page.id] = 0
    })
    return initialCounts
  })
  
  // "All pages" has its own independent clickCount
  const [allPagesClickCount, setAllPagesClickCount] = useState(0)
  
  // Handler for updating any page's clickCount independently
  const handlePageClickCount = (pageId) => (newCountOrFunction) => {
    setPageClickCounts(prev => {
      const currentCount = prev[pageId] || 0
      const newCount = typeof newCountOrFunction === 'function' 
        ? newCountOrFunction(currentCount) 
        : newCountOrFunction
      return {
        ...prev,
        [pageId]: newCount
      }
    })
  }
  
  // Check if all pages have the same clickCount
  const allPagesHaveSameClickCount = useMemo(() => {
    const counts = Object.values(pageClickCounts)
    if (counts.length === 0) return true
    const firstCount = counts[0]
    return counts.every(count => count === firstCount)
  }, [pageClickCounts])
  
  // "All pages" has priority: if pages don't match, reset "All pages" to 0 (empty checkbox)
  useEffect(() => {
    if (!allPagesHaveSameClickCount) {
      setAllPagesClickCount(0)
    }
  }, [allPagesHaveSameClickCount])
  
  // "All pages" display clickCount: follows pages when they match, otherwise shows 0 (empty checkbox)
  const allPagesDisplayClickCount = allPagesHaveSameClickCount 
    ? (Object.values(pageClickCounts)[0] || 0)
    : 0
  
  // When pages don't match, "All pages" checkbox should be unchecked (empty)
  const allPagesChecked = allPagesHaveSameClickCount && allPagesSelected
  
  // "All pages" setClickCount handler - has priority: when clicked, all pages follow
  const handleAllPagesClickCount = (newCountOrFunction) => {
    // Use the current displayed clickCount as starting point (could be from pages if they match)
    const currentDisplayCount = allPagesDisplayClickCount
    
    const newAllPagesCount = typeof newCountOrFunction === 'function' 
      ? newCountOrFunction(currentDisplayCount) 
      : newCountOrFunction
    
    // Update "All pages" own state
    setAllPagesClickCount(newAllPagesCount)
    
    // "All pages" has priority: update all pages to follow "All pages" clickCount
    const updatedCounts = {}
    pages.forEach(page => {
      updatedCounts[page.id] = newAllPagesCount
    })
    setPageClickCounts(updatedCounts)
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
            clickCount={pageClickCounts[page.id] || 0}
            setClickCount={handlePageClickCount(page.id)}
          />
        ))}
        <Divider />
      </div>

      <TableFooter buttonText="Done" onButtonClick={handleDone} />
      
    </div>
  )
}

export default App
