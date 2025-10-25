"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Users, 
  Target, 
  Heart, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Star, 
  MessageCircle,
  Shield,
  Zap,
  TrendingUp,
  Mail,
  Phone,
  Map,
  Calendar
} from "lucide-react"
import { useState } from "react"

export default function AboutPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    area: "",
    interest: "",
    message: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission - connect to backend or email service
    console.log("Interest form submitted:", formData)
    alert("Thank you for your interest! We'll contact you soon.")
    setFormData({ name: "", email: "", area: "", interest: "", message: "" })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const teamMembers = [
    {
      name: "Sarah Ahmed",
      role: "Campaign Director",
      bio: "Leading the Clean Karachi initiative with 10+ years in community development",
      image: "/team-sarah.png"
    },
    {
      name: "Ali Raza",
      role: "Tech Lead",
      bio: "Building the platform that connects citizens with authorities efficiently",
      image: "/team-ali.png"
    },
    {
      name: "Fatima Khan",
      role: "Community Manager",
      bio: "Engaging neighborhoods and organizing local clean-up drives",
      image: "/team-fatima.png"
    }
  ]

  const milestones = [
    { year: "2023", event: "Campaign Launch", description: "Started with 100 volunteers" },
    { year: "2024", event: "Platform Launch", description: "Digital reporting system launched" },
    { year: "2024", event: "15K+ Issues Resolved", description: "Major milestone achieved" },
    { year: "2025", event: "City-wide Expansion", description: "Covering all Karachi districts" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 pt-20">
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <Badge variant="outline" className="text-green-600 border-green-300 bg-green-100 text-lg px-4 py-2">
              <Heart className="w-5 h-5 mr-2" />
              Community Powered
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-bold text-green-800">
              About Clean Karachi
            </h1>
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto">
              We're a community-driven movement transforming Karachi into the clean, beautiful city it deserves to be.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-green-600 text-white text-lg px-4 py-2">
                <Target className="w-4 h-4 mr-2" />
                Our Mission
              </Badge>
              <h2 className="text-4xl font-bold text-green-800">
                Empowering Citizens, Transforming Karachi
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Clean Karachi was born from a simple belief: every citizen deserves a clean, healthy environment. 
                We've built a platform that turns complaints into action and frustration into solutions.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <span className="text-lg">15,000+ issues resolved</span>
                </div>
                <div className="flex items-center gap-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <span className="text-lg">200+ areas covered</span>
                </div>
                <div className="flex items-center gap-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <span className="text-lg">72% faster resolution</span>
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-3xl p-8 border-2 border-green-200">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-green-800">Our Vision</h3>
                <p className="text-lg text-muted-foreground">
                  A Karachi where every street is clean, every neighborhood takes pride in its environment, 
                  and every citizen has the power to maintain the beauty of our city.
                </p>
                <div className="bg-white rounded-2xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Zap className="h-8 w-8 text-green-600" />
                    <div>
                      <div className="font-bold text-green-800">48 Hours</div>
                      <div className="text-sm text-muted-foreground">Average resolution time</div>
                    </div>
                  </div>
                  <Progress value={75} className="h-2 bg-gray-200" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-green-800">Meet Our Team</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Passionate individuals working tirelessly for a cleaner Karachi
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center hover-lift border-2 border-green-200">
                <CardContent className="p-8">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-6 border-4 border-green-200"
                  />
                  <h3 className="text-2xl font-bold text-green-800 mb-2">{member.name}</h3>
                  <Badge variant="outline" className="text-green-600 border-green-300 mb-4">
                    {member.role}
                  </Badge>
                  <p className="text-muted-foreground leading-relaxed">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-green-800">Our Impact</h2>
            <p className="text-xl text-muted-foreground">Numbers that tell our story</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: "15,000+", label: "Issues Resolved", icon: CheckCircle },
              { number: "200+", label: "Areas Covered", icon: MapPin },
              { number: "50,000+", label: "Active Users", icon: Users },
              { number: "48hrs", label: "Avg. Resolution", icon: Clock }
            ].map((stat, index) => (
              <Card key={index} className="text-center hover-lift">
                <CardContent className="p-8">
                  <stat.icon className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-green-800 mb-2">{stat.number}</div>
                  <p className="text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-green-800">Our Journey</h2>
            <p className="text-xl text-muted-foreground">From idea to impact</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                    {index < milestones.length - 1 && (
                      <div className="w-0.5 h-20 bg-green-300 mt-2"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="flex items-center gap-4 mb-2">
                      <Calendar className="h-5 w-5 text-green-600" />
                      <span className="text-lg font-bold text-green-800">{milestone.year}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-green-800 mb-2">{milestone.event}</h3>
                    <p className="text-muted-foreground">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Get Involved Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-6 mb-12">
              <Badge variant="outline" className="text-green-600 border-green-300 bg-green-100 text-lg px-4 py-2">
                <Users className="w-5 h-5 mr-2" />
                Join the Movement
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold text-green-800">
                Ready to Make a Difference?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Whether you want to report issues, volunteer, or partner with us, we'd love to hear from you.
              </p>
            </div>

            <Card className="border-2 border-green-200 shadow-2xl">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-3xl text-green-800">Get Involved Today</CardTitle>
                <CardDescription className="text-lg">
                  Fill out this form and we'll contact you about opportunities
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-8">
                <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Full Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                        className="h-12 border-2 focus:border-green-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email Address *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                        className="h-12 border-2 focus:border-green-500"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="area" className="text-sm font-medium">
                        Your Area in Karachi *
                      </label>
                      <Input
                        id="area"
                        name="area"
                        value={formData.area}
                        onChange={handleChange}
                        placeholder="e.g., Gulshan, Clifton, North Karachi"
                        required
                        className="h-12 border-2 focus:border-green-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="interest" className="text-sm font-medium">
                        How do you want to help? *
                      </label>
                      <Input
                        id="interest"
                        name="interest"
                        value={formData.interest}
                        onChange={handleChange}
                        placeholder="e.g., Volunteer, Report Issues, Partner"
                        required
                        className="h-12 border-2 focus:border-green-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Your Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your interest in Clean Karachi..."
                      rows={4}
                      className="border-2 focus:border-green-500 resize-none"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-14 text-lg bg-green-600 hover:bg-green-700 hover-glow"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Submit Interest Form
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Additional Involvement Options */}
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              {[
                {
                  icon: MessageCircle,
                  title: "Report Issues",
                  description: "Use our platform to report cleanliness issues in your area",
                  action: "Start Reporting"
                },
                {
                  icon: Users,
                  title: "Volunteer",
                  description: "Join our clean-up drives and community awareness programs",
                  action: "Join as Volunteer"
                },
                {
                  icon: Shield,
                  title: "Partner With Us",
                  description: "Organizations and businesses can partner for larger impact",
                  action: "Become Partner"
                }
              ].map((option, index) => (
                <Card key={index} className="text-center hover-lift border-2 border-green-200">
                  <CardContent className="p-8">
                    <option.icon className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-green-800 mb-3">{option.title}</h3>
                    <p className="text-muted-foreground mb-6">{option.description}</p>
                    <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                      {option.action}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-green-800 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-4">
              <Mail className="h-8 w-8 mx-auto text-green-300" />
              <h3 className="text-xl font-bold">Email Us</h3>
              <p className="text-green-200">contact@cleankarachi.org</p>
            </div>
            <div className="space-y-4">
              <Phone className="h-8 w-8 mx-auto text-green-300" />
              <h3 className="text-xl font-bold">Call Us</h3>
              <p className="text-green-200">+92-300-1234567</p>
            </div>
            <div className="space-y-4">
              <Map className="h-8 w-8 mx-auto text-green-300" />
              <h3 className="text-xl font-bold">Visit Us</h3>
              <p className="text-green-200">Karachi, Pakistan</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}