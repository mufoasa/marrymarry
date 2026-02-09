'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const STORAGE_KEY = 'marry_terms_accepted_v1'

export function TermsPopup() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const accepted = localStorage.getItem(STORAGE_KEY)
    if (!accepted) {
      setOpen(true)
    }
  }, [])

  const acceptTerms = () => {
    localStorage.setItem(STORAGE_KEY, 'true')
    setOpen(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full md:max-w-lg rounded-t-2xl md:rounded-2xl shadow-xl animate-in slide-in-from-bottom md:zoom-in">
        <CardHeader>
          <CardTitle className="font-serif text-2xl">
            Terms & Conditions
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-sm text-muted-foreground max-h-[50vh] overflow-y-auto">
          <p>
            Welcome to <strong>Marry.mk</strong>. By using this platform, you agree
            to comply with and be bound by the following terms and conditions.
          </p>

          <p>
            Marry.mk is a discovery and reservation platform for wedding halls and
            wedding-related services. We do not own or operate the venues listed.
          </p>

          <p>
            Availability, pricing, and agreements are handled directly between users
            and service providers.
          </p>

          <p>
            Misuse of the platform (fake reservations, abuse, fraud) may result in
            removal or restrictions.
          </p>

          <p>
            By continuing, you confirm that you have read and accepted these terms.
          </p>
        </CardContent>

        <CardFooter>
          <Button className="w-full" onClick={acceptTerms}>
            I Accept
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
