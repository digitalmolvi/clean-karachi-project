"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import { MapPin, Users, CheckCircle2, Clock3, AlertTriangle, TrendingUp, BarChart3 } from "lucide-react"

type AreaStats = {
  name: string
  na_code: string
  ps_code: string
  total_complaints: number
  resolved: number
  in_progress: number
  avg_resolution_hours: number
  cleanliness_score: number
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://127.0.0.1:8000"

export default function AreasPage() {
  const [areas, setAreas] = useState<AreaStats[]>([])
  const [loading, setLoading] = useState(true)

  // Mock data for demonstration - replace with actual API call
  useEffect(() => {
    const fetchAreas = async () => {
      setLoading(true)
      // In a real app, you'd fetch from /complaints and aggregate by area
      setTimeout(() => {
        setAreas([
          {
            name: "Karachi South (Clifton-DHA)",
            na_code: "NA-247",
            ps_code: "PS-110",
            total_complaints: 3420,
            resolved: 2980,
            in_progress: 320,
            avg_resolution_hours: 36,
            cleanliness_score: 88
          },
          {
            name: "Karachi East (Gulshan)",
            na_code: "NA-242",
            ps_code: "PS-102",
            total_complaints: 2870,
            resolved: 2450,
            in_progress: 290,
            avg_resolution_hours: 42,
            cleanliness_score: 85
          },
          {
            name: "Karachi Central",
            na_code: "NA-244",
            ps_code: "PS-115",
            total_complaints: 4120,
            resolved: 3520,
            in_progress: 480,
            avg_resolution_hours: 54,
            cleanliness_score: 78
          },
          {
            name: "Karachi West",
            na_code: "NA-241",
            ps_code: "PS-108",
            total_complaints: 2980,
            resolved: 2340,
            in_progress: 520,
            avg_resolution_hours: 62,
            cleanliness_score: 72
          },
          {
            name: "Malir District",
            na_code: "NA-239",
            ps_code: "PS-98",
            total_complaints: 1870,
            resolved: 1420,
            in_progress: 380,
            avg_resolution_hours: 68,
            cleanliness_score: 68
          },
          {
            name: "Korangi District",
            na_code: "NA-254",
            ps_code: "PS-129",
            total_complaints: 3250,
            resolved: 2680,
            in_progress: 450,
            avg_resolution_hours: 58,
            cleanliness_score: 75
          }
        ])
        setLoading(false)
      }, 1000)
    }

    fetchAreas()
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBg = (score: number) => {
    if (score >= 85) return "bg-green-100 text-green-800"
    if (score >= 70) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navbar />

      <div className="pt-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600/10 to-blue-600/10 border-b border-green-200">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-green-800">Areas Covered</h1>
                <p className="text-muted-foreground mt-2">
                  Track cleanliness progress across different areas of Karachi
                </p>
              </div>
              <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50">
                <MapPin className="w-4 h-4 mr-2" />
                {areas.length} Areas Monitored
              </Badge>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Summary Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="glass-effect border-2 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <MapPin className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Areas Covered</p>
                    <p className="text-2xl font-bold text-green-700">{areas.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-2 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {areas.reduce((sum, area) => sum + area.total_complaints, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-2 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                    <p className="text-2xl font-bold text-green-700">
                      {areas.reduce((sum, area) => sum + area.resolved, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-2 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg. Score</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {areas.length > 0 
                        ? Math.round(areas.reduce((sum, area) => sum + area.cleanliness_score, 0) / areas.length)
                        : 0
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Areas Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-muted-foreground mt-4">Loading area data...</p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {areas.map((area, index) => (
                <Card key={index} className="glass-effect border-2 border-green-200 hover-lift">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg text-green-800">{area.name}</CardTitle>
                        <CardDescription className="flex gap-2 mt-2">
                          <Badge variant="outline" className="border-green-300 text-green-700">
                            {area.na_code}
                          </Badge>
                          <Badge variant="outline" className="border-blue-300 text-blue-700">
                            {area.ps_code}
                          </Badge>
                        </CardDescription>
                      </div>
                      <Badge className={`${getScoreBg(area.cleanliness_score)} border-0`}>
                        Score: {area.cleanliness_score}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-700">{area.total_complaints.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Total Reports</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-700">{area.resolved.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Resolved</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Resolution Rate</span>
                        <span className="font-medium">
                          {((area.resolved / area.total_complaints) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${(area.resolved / area.total_complaints) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock3 className="h-4 w-4" />
                        Avg: {area.avg_resolution_hours}h
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getScoreColor(area.cleanliness_score)}`} />
                        <span className="text-sm font-medium">
                          {area.cleanliness_score >= 85 ? "Excellent" : 
                           area.cleanliness_score >= 70 ? "Good" : "Needs Attention"}
                        </span>
                      </div>
                    </div>

                    {area.in_progress > 0 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-yellow-800">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="text-sm font-medium">{area.in_progress} issues in progress</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Call to Action */}
          <Card className="glass-effect border-2 border-green-200 mt-8">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold text-green-800 mb-2">Don't See Your Area?</h3>
              <p className="text-muted-foreground mb-4">
                Help us expand coverage by reporting issues in your neighborhood
              </p>
              <Button className="bg-green-600 hover:bg-green-700">
                <MapPin className="w-4 h-4 mr-2" />
                Report an Issue
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}