// Simple test page to verify routing works
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestAdvisorPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <Card className="bg-gray-900/50 border-gray-700 rounded-2xl max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-4xl font-bold mb-4">Advisor Route Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-400">✅ If you can see this page, the routing is working.</p>

          <div className="space-y-2">
            <p className="text-gray-400">Try these advisor pages:</p>
            <div className="space-y-2">
              <Button variant="outline" asChild className="w-full justify-start">
                <Link href="/advisors/minerva-haugabrooks">/advisors/minerva-haugabrooks</Link>
              </Button>
              <Button variant="outline" asChild className="w-full justify-start">
                <Link href="/advisors/james-smith">/advisors/james-smith</Link>
              </Button>
            </div>
          </div>

          <div className="pt-4">
            <Button asChild>
              <Link href="/">← Back to Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
