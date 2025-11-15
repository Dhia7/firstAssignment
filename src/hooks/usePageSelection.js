import { useState, useMemo } from 'react'

export const usePageSelection = (pages) => {
  const [selectedPages, setSelectedPages] = useState(new Set())

  const allPagesSelected = useMemo(
    () => selectedPages.size === pages.length && pages.length > 0,
    [selectedPages.size, pages.length]
  )

  const somePagesSelected = useMemo(
    () => selectedPages.size > 0 && selectedPages.size < pages.length,
    [selectedPages.size, pages.length]
  )

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = new Set(pages.map(page => page.id))
      setSelectedPages(allIds)
    } else {
      setSelectedPages(new Set())
    }
  }

  const handlePageSelect = (pageId, checked = undefined) => {
    setSelectedPages(prev => {
      const newSelected = new Set(prev)
      // If checked state is explicitly provided, use it
      // Otherwise, toggle as before
      if (checked !== undefined) {
        if (checked) {
          newSelected.add(pageId)
        } else {
          newSelected.delete(pageId)
        }
      } else {
        // Toggle behavior (for backward compatibility)
        if (newSelected.has(pageId)) {
          newSelected.delete(pageId)
        } else {
          newSelected.add(pageId)
        }
      }
      return newSelected
    })
  }

  return {
    selectedPages,
    allPagesSelected,
    somePagesSelected,
    handleSelectAll,
    handlePageSelect,
  }
}

