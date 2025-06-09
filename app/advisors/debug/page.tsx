// Debug page to see what's happening with the data
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"

export default function DebugPage() {
  const [advisors, setAdvisors] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAdvisors() {
      try {
        console.log("🔍 Fetching advisors for debug...")

        const { data, error } = await supabase.from("ai_advisors").select("*")

        console.log("Debug query result:", { data, error })

        if (error) {
          setError(error.message)
        } else {
          setAdvisors(data || [])
        }
      } catch (err) {
        console.error("Debug fetch error:", err)
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchAdvisors()
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <Card className="bg-gray-900/50 border-gray-700 rounded-2xl max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-4xl font-bold mb-4">Advisor Debug Page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading && <p className="text-gray-400">Loading...</p>}

          {error && (
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
              <h3 className="text-red-400 font-bold mb-2">Error:</h3>
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <div>
              <h3 className="text-xl font-bold mb-4">Found {advisors.length} advisors:</h3>

              {advisors.length === 0 ? (
                <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
                  <p className="text-yellow-300">No advisors found. You need to populate the database.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {advisors.map((advisor) => (
                    <Card key={advisor.id} className="bg-gray-800 border-gray-600">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white font-bold">{advisor.full_name}</h4>
                            <p className="text-gray-400">Slug: {advisor.slug}</p>
                            <p className="text-gray-400">Specialties: {advisor.specialties?.join(", ") || "None"}</p>
                          </div>
                          <Button asChild>
                            <Link href={`/advisors/${advisor.slug}`}>View Memorial</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="pt-6 space-y-2">
            <Button asChild className="w-full">
              <Link href="/">← Back to Dashboard</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/advisors/test">Test Route</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
