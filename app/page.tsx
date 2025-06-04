import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Music, Star, Users } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const upcomingEvents = [
    {
      id: 1,
      title: "Spring Recital 2024",
      date: "March 15, 2024",
      time: "7:00 PM",
      location: "Community Center Hall",
      description: "Join us for our annual spring recital featuring students from all instrument programs.",
    },
    {
      id: 2,
      title: "Guitar Workshop",
      date: "March 22, 2024",
      time: "2:00 PM",
      location: "Music Studio",
      description: "Advanced guitar techniques workshop for intermediate and advanced students.",
    },
  ]

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      instrument: "Piano",
      rating: 5,
      text: "Wlanvi is an incredible teacher! My daughter has made amazing progress in just 6 months.",
    },
    {
      id: 2,
      name: "Mike Chen",
      instrument: "Guitar",
      rating: 5,
      text: "The flexibility of scheduling and the quality of instruction is outstanding.",
    },
    {
      id: 3,
      name: "Emma Davis",
      instrument: "Viola",
      rating: 5,
      text: "Professional, patient, and passionate about music. Highly recommend!",
    },
  ]

  const instruments = [
    { name: "Piano", icon: "🎹", description: "Classical and contemporary piano lessons" },
    { name: "Guitar", icon: "🎸", description: "Acoustic and electric guitar instruction" },
    { name: "Viola", icon: "🎻", description: "Classical viola technique and repertoire" },
    { name: "Harp", icon: "🪕", description: "Celtic and classical harp lessons" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Music className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900">wlanvi</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="#instruments" className="text-gray-700 hover:text-purple-600">
                Instruments
              </Link>
              <Link href="#events" className="text-gray-700 hover:text-purple-600">
                Events
              </Link>
              <Link href="#testimonials" className="text-gray-700 hover:text-purple-600">
                Testimonials
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-purple-600">
                Contact
              </Link>
            </nav>
            <div className="flex space-x-4">
              <Button variant="outline" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">Master Your Musical Journey</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Professional music lessons in Piano, Guitar, Viola, and Harp. Flexible scheduling, multiple locations, and
            personalized instruction to help you achieve your musical goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/booking">Book a Lesson</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#instruments">View Instruments</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Instruments Section */}
      <section id="instruments" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Instruments We Teach</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {instruments.map((instrument, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="text-4xl mb-4">{instrument.icon}</div>
                  <CardTitle>{instrument.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{instrument.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-purple-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose wlanvi?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Calendar className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Flexible Scheduling</h3>
              <p className="text-gray-600">Book lessons at your convenience with our easy online scheduling system.</p>
            </div>
            <div className="text-center">
              <MapPin className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Multiple Locations</h3>
              <p className="text-gray-600">Lessons available at various locations or in the comfort of your home.</p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Personalized Learning</h3>
              <p className="text-gray-600">Customized lesson plans tailored to your skill level and musical goals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section id="events" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                      <CardDescription className="flex items-center mt-2">
                        <Calendar className="h-4 w-4 mr-2" />
                        {event.date} at {event.time}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">Event</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-2" />
                    {event.location}
                  </div>
                  <p className="text-gray-700">{event.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 px-4 sm:px-6 lg:px-8 bg-purple-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What Students Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="bg-white">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.instrument} Student</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Musical Journey?</h2>
          <p className="text-xl mb-8">Join hundreds of satisfied students and discover the joy of music.</p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/booking">Book Your First Lesson</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Music className="h-6 w-6" />
                <span className="text-xl font-bold">wlanvi</span>
              </div>
              <p className="text-gray-400">Professional music instruction for all ages and skill levels.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/booking" className="hover:text-white">
                    Book Lessons
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Instruments</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Piano</li>
                <li>Guitar</li>
                <li>Viola</li>
                <li>Harp</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact Info</h3>
              <div className="space-y-2 text-gray-400">
                <p>📧 hello@wlanvi.com</p>
                <p>📱 (555) 123-4567</p>
                <p>📍 Multiple Locations</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 wlanvi Music Lessons. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
