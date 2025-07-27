import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
      <Card className="bg-gray-900/50 border-gray-700 rounded-2xl max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">Page Not Found</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-400">The page you're looking for doesn't exist or may have been moved.</p>
          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/">Return to Dashboard</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/advisors/test">Test Advisor Route</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
