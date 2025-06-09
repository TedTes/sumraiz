import './globals.css'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'MeetingMind - AI Meeting Summarizer',
  description: 'Transform your meeting recordings into actionable summaries in minutes. Upload audio, get structured insights.',
  keywords: 'meeting summarizer, AI transcription, meeting notes, action items',
  openGraph: {
    title: 'MeetingMind - AI Meeting Summarizer',
    description: 'Transform meeting recordings into actionable summaries instantly',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-gray-50 min-h-screen`}>
          <div className="min-h-screen flex flex-col">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}