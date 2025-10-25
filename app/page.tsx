"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Navbar from "@/components/navbar"
import {
  ArrowRight,
  Activity,
  Users,
  Shield,
  Zap,
  TrendingUp,
  Clock,
  AlertTriangle,
  Heart,
  Target,
  BarChart3,
  CheckCircle,
  Star,
  Play,
  ChevronRight,
  Trash2,
  Recycling,
  Leaf,
  Sparkles,
  MapPin,
  Stethoscope,
  Phone,
  MessageCircle,
} from "lucide-react"
import { useState, useEffect } from "react"

export default function Home() {
  const [currentStory, setCurrentStory] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [cleanlinessScore, setCleanlinessScore] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setIsVisible(true)
    const timer = setTimeout(() => {
      setCleanlinessScore(42)
    }, 1000)

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      clearTimeout(timer)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStory((prev) => (prev + 1) % stories.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  const stories = [
    {
      name: "Ahmed Raza",
      role: "Gulshan Resident",
      image: "/professional-man-smiling.png",
      story:
        "Our street was filled with garbage for weeks. No one was taking action until I reported it through Clean Karachi.",
      outcome: "Within 48 hours, the entire area was cleaned and now we have regular waste collection.",
      stat: "48-hour resolution",
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Sara Khan",
      role: "Clifton Citizen",
      image: "/professional-woman-confident.png",
      story:
        "The park near my house became a dumping ground. I reported it and mobilized my neighbors through this platform.",
      outcome: "Now it's a clean, safe space for children to play and families to gather.",
      stat: "Transformed public space",
      color: "from-emerald-500 to-teal-500",
    },
    {
      name: "Bilal Ahmed",
      role: "North Karachi Activist",
      image: "/community-leader.png",
      story:
        "Industrial waste was polluting our water supply. Through collective complaints, we forced action from authorities.",
      outcome: "The factories installed proper waste treatment systems and our water is clean again.",
      stat: "Stopped water pollution",
      color: "from-purple-500 to-pink-500",
    },
  ]

  const stats = [
    { number: "15K+", label: "complaints resolved successfully", icon: CheckCircle, color: "text-primary" },
    {
      number: "72%",
      label: "faster resolution than traditional methods",
      icon: Zap,
      color: "text-primary",
    },
    {
      number: "48hrs",
      label: "average time for complaint resolution",
      icon: Clock,
      color: "text-primary",
    },
    { number: "200+", label: "areas covered across Karachi", icon: MapPin, color: "text-primary" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-blue-50 to-cyan-50 pt-16">
        <div className="absolute inset-0 bg-[url('/karachi-cityscape.png')] opacity-10 bg-cover bg-center"></div>

        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-200 rounded-full blur-3xl animate-float"></div>
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className={`space-y-10 ${isVisible ? "animate-slide-up" : "opacity-0"}`}>
              <div className="space-y-8">
                <Badge
                  variant="outline"
                  className="text-green-600 border-green-300 bg-green-100 animate-pulse-glow text-sm px-4 py-2"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Community Action Required
                </Badge>

                <div className="space-y-6">
                  <h1 className="text-6xl lg:text-8xl font-bold text-balance leading-tight">
                    Your <span className="text-green-600">Complaint</span> Can Clean Karachi
                  </h1>
                  <div className="text-3xl font-semibold text-muted-foreground">Together, we can make it happen.</div>
                </div>

                <div className="glass-effect rounded-3xl p-8 border-l-4 border-l-green-500 hover-lift">
                  <div className="grid grid-cols-2 gap-6 text-center">
                    <div className="space-y-2">
                      <div className="text-4xl font-bold text-green-600 animate-count-up">15K+</div>
                      <div className="text-sm text-muted-foreground">issues resolved</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-4xl font-bold text-green-600 animate-count-up">48hrs</div>
                      <div className="text-sm text-muted-foreground">average resolution</div>
                    </div>
                  </div>
                </div>

                <p className="text-2xl text-muted-foreground text-pretty leading-relaxed">
                  <strong className="text-foreground">You're not alone in this fight.</strong> Thousands of Karachiites 
                  are taking action against pollution and mismanagement. Your voice matters.{" "}
                  <strong className="text-green-600">Report it, track it, resolve it.</strong>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <Button size="lg" className="text-xl px-10 py-4 bg-green-600 hover:bg-green-700 hover-glow group">
                  Report an Issue Now
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-xl px-10 py-4 hover-lift group glass-effect bg-transparent border-green-600 text-green-600"
                >
                  <Play className="mr-3 h-6 w-6" />
                  See How It Works
                </Button>
              </div>
            </div>

            <div className="relative animate-float">
              <div className="relative glass-effect rounded-3xl p-10 border-2 border-green-200 shadow-2xl hover-lift">
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-semibold text-foreground">Karachi Cleanliness Index</h3>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-muted-foreground">Live Tracking</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-medium">City Score</span>
                      <span className="text-4xl font-bold text-green-600 animate-count-up">{cleanlinessScore}</span>
                    </div>
                    <Progress value={cleanlinessScore} className="h-4 bg-gray-200" />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-background/80 rounded-2xl p-6 border hover-lift cursor-pointer group">
                      <div className="flex items-center gap-3 mb-3">
                        <Trash2 className="h-6 w-6 text-green-600 group-hover:scale-110 transition-transform" />
                        <span className="text-sm text-muted-foreground">Waste Management</span>
                      </div>
                      <div className="text-3xl font-bold text-green-600">Improving</div>
                    </div>
                    <div className="bg-background/80 rounded-2xl p-6 border hover-lift cursor-pointer group">
                      <div className="flex items-center gap-3 mb-3">
                        <Users className="h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform" />
                        <span className="text-sm text-muted-foreground">Community Participation</span>
                      </div>
                      <div className="text-3xl font-bold text-blue-600">Growing</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                      <span className="text-lg font-medium">30-Day Trend</span>
                    </div>
                    <div className="text-lg text-muted-foreground">↗ Community reports increasing</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y bg-green-50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center gap-12 text-lg text-muted-foreground">
            <div className="flex items-center gap-3 hover-lift cursor-pointer">
              <Shield className="h-6 w-6 text-green-600" />
              <span>Verified Reports</span>
            </div>
            <div className="flex items-center gap-3 hover-lift cursor-pointer">
              <Activity className="h-6 w-6 text-blue-600" />
              <span>Real-time Tracking</span>
            </div>
            <div className="flex items-center gap-3 hover-lift cursor-pointer">
              <Users className="h-6 w-6 text-green-600" />
              <span>Community Driven</span>
            </div>
            <div className="flex items-center gap-3 hover-lift cursor-pointer">
              <MapPin className="h-6 w-6 text-blue-600" />
              <span>Area-specific Action</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6 mb-20">
            <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50 text-lg px-4 py-2">
              <Sparkles className="w-5 h-5 mr-2" />
              Powerful Reporting Tools
            </Badge>
            <h2 className="text-5xl lg:text-6xl font-bold text-balance text-green-700">Your Clean Karachi Command Center</h2>
            <p className="text-2xl text-muted-foreground max-w-4xl mx-auto text-pretty">
              Everything you need to report, track, and resolve cleanliness issues in our city
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                icon: MapPin,
                title: "Pinpoint Reporting",
                description: "Drop a pin exactly where the issue is located with photos and detailed descriptions.",
                color: "text-green-600",
                bgColor: "bg-green-100",
              },
              {
                icon: Zap,
                title: "Quick Categories",
                description: "Report garbage piles, broken sewers, illegal dumping, or other issues with one tap.",
                color: "text-blue-600",
                bgColor: "bg-blue-100",
              },
              {
                icon: Target,
                title: "Priority Routing",
                description: "Urgent issues get fast-tracked to the relevant authorities automatically.",
                color: "text-green-600",
                bgColor: "bg-green-100",
              },
              {
                icon: Users,
                title: "Community Support",
                description: "Get neighbors to support your complaint and increase its priority.",
                color: "text-blue-600",
                bgColor: "bg-blue-100",
              },
              {
                icon: Shield,
                title: "Verified Updates",
                description: "Get real-time updates and photo verification when issues are resolved.",
                color: "text-green-600",
                bgColor: "bg-green-100",
              },
              {
                icon: TrendingUp,
                title: "Progress Tracking",
                description: "Monitor city-wide cleanliness trends and your impact over time.",
                color: "text-blue-600",
                bgColor: "bg-blue-100",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="border-2 hover:border-green-300 hover-lift transition-all duration-500 group cursor-pointer glass-effect"
              >
                <CardHeader className="pb-4">
                  <div
                    className={`w-20 h-20 ${feature.bgColor} rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className={`h-10 w-10 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-2xl group-hover:text-green-600 transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lg leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-balance text-green-800">Clean Karachi, Made Simple</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Three easy steps to report and resolve cleanliness issues in your area
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Report & Document",
                description: "Take photos, pin the location, and describe the issue. Categorize it for proper routing.",
              },
              {
                step: "02",
                title: "Track & Share",
                description: "Monitor your complaint's status in real-time. Share with neighbors to build support.",
              },
              {
                step: "03",
                title: "Resolve & Verify",
                description: "Get notified when action is taken. Verify the cleanup with before-after comparisons.",
              },
            ].map((step, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                  {step.step}
                </div>
                <h3 className="text-2xl font-semibold text-green-800">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-balance text-blue-800">Karachi Voices, Real Results</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              These aren't just complaints. They're success stories from citizens who refused to stay silent.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border-2 hover-lift transition-all duration-500 border-green-200">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-3 gap-8 items-center">
                  <div className="text-center">
                    <img
                      src={stories[currentStory].image || "/placeholder.svg"}
                      alt={stories[currentStory].name}
                      className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-green-200"
                    />
                    <h3 className="font-bold text-lg">{stories[currentStory].name}</h3>
                    <p className="text-sm text-muted-foreground">{stories[currentStory].role}</p>
                    <Badge variant="outline" className="mt-2 text-green-600 border-green-300">
                      {stories[currentStory].stat}
                    </Badge>
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    <blockquote className="text-lg leading-relaxed italic">"{stories[currentStory].story}"</blockquote>
                    <div className="bg-green-50 rounded-lg p-4 border-l-4 border-l-green-500">
                      <p className="font-semibold text-green-600">The Result:</p>
                      <p className="text-muted-foreground">{stories[currentStory].outcome}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center gap-2 mt-8">
              {stories.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStory(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentStory
                      ? "bg-green-600 scale-125"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-green-100 to-blue-100">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-balance text-green-800">The Power of Community Action</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              Every report matters. Every voice counts. Together, we're making Karachi cleaner.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="text-center hover-lift cursor-pointer group border-2 hover:border-green-300 transition-all duration-300"
              >
                <CardContent className="p-8">
                  <stat.icon
                    className={`h-12 w-12 mx-auto mb-4 ${stat.color} group-hover:scale-110 transition-transform`}
                  />
                  <div className="text-4xl font-bold mb-2 group-hover:scale-105 transition-transform text-green-700">
                    {stat.number}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto border-2 border-green-200">
              <h3 className="text-2xl font-bold mb-4 text-green-600">Ready to make a difference?</h3>
              <p className="text-lg text-muted-foreground mb-6">
                Every clean street starts with one report. Every beautiful neighborhood begins with one voice.{" "}
                <strong className="text-green-800">Your action creates the Karachi we deserve.</strong>
              </p>
              <Button size="lg" className="hover-glow bg-green-600 hover:bg-green-700">
                Report Your First Issue
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 via-blue-50 to-green-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-4">
              <Badge variant="outline" className="text-green-600 border-green-300 bg-green-100 text-lg px-4 py-2">
                <Clock className="w-5 h-5 mr-2" />
                Join 50,000+ Karachiites
              </Badge>
              <h2 className="text-5xl lg:text-6xl font-bold text-balance text-green-700">Your Karachi Needs You</h2>
              <p className="text-2xl text-muted-foreground text-pretty max-w-3xl mx-auto">
                Don't just complain about the mess. Be part of the solution. Join thousands of citizens who are taking action today.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border-2 border-green-200 max-w-2xl mx-auto">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">Report an Issue Now</div>
                  <p className="text-muted-foreground">Help us make Karachi cleaner, one report at a time</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    type="text"
                    placeholder="Enter your area/location"
                    className="flex-1 h-14 text-lg border-2 focus:border-green-500"
                  />
                  <Button size="lg" className="h-14 px-8 text-lg hover-glow group bg-green-600 hover:bg-green-700">
                    Start Reporting
                    <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>

                <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Anonymous reporting available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>Verified updates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-green-600" />
                    <span>Trusted by 50K+ citizens</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center space-y-2">
                <MessageCircle className="h-12 w-12 text-green-600 mx-auto" />
                <h3 className="font-semibold">Multiple Channels</h3>
                <p className="text-sm text-muted-foreground">Report via app, web, or WhatsApp</p>
              </div>
              <div className="text-center space-y-2">
                <Phone className="h-12 w-12 text-blue-600 mx-auto" />
                <h3 className="font-semibold">Instant Updates</h3>
                <p className="text-sm text-muted-foreground">Get SMS/email notifications</p>
              </div>
              <div className="text-center space-y-2">
                <Users className="h-12 w-12 text-green-600 mx-auto" />
                <h3 className="font-semibold">Community Power</h3>
                <p className="text-sm text-muted-foreground">Strength in numbers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-green-50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="text-2xl font-bold text-green-700">Clean Karachi</div>
              <p className="text-sm text-muted-foreground">Your Voice, Our City, Cleaner Future</p>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Report Issues</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Garbage Collection
                  </a>
                </div>
                <div>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Sewage Problems
                  </a>
                </div>
                <div>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Illegal Dumping
                  </a>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Get Involved</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Volunteer
                  </a>
                </div>
                <div>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Community Events
                  </a>
                </div>
                <div>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Awareness Campaigns
                  </a>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Support</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Help Center
                  </a>
                </div>
                <div>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Contact Authorities
                  </a>
                </div>
                <div>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Emergency Issues
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
            © 2024 Clean Karachi Initiative. Together for a cleaner city.
          </div>
        </div>
      </footer>
    </div>
  )
}