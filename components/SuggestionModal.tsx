'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface SuggestionModalProps {
  isOpen: boolean
  onClose: () => void
  suggestion: {
    title: string
    content: string
  } | null
}

export function SuggestionModal({ isOpen, onClose, suggestion }: SuggestionModalProps) {
  if (!suggestion) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{suggestion.title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 whitespace-pre-wrap break-words text-sm">{suggestion.content}</div>
      </DialogContent>
    </Dialog>
  )
}

