"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Navbar from "@/components/navbar"
import {
  Activity,
  Shield,
  ThumbsUp,
  ThumbsDown,
  MapPin,
  RefreshCcw,
  Plus,
  AlertCircle,
  Users,
  CheckCircle2,
  Clock3,
  Rocket,
  Trash2,
  AlertTriangle,
  TrendingUp,
} from "lucide-react"

type ComplaintStatus = "new" | "assigned" | "in_progress" | "resolved" | "rejected"

type RepresentativeRead = {
  id: number
  role: "MNA" | "MPA"
  code: string
  name: string
  phone?: string | null
  email?: string | null
  district?: string | null
}

type ComplaintRead = {
  id: number
  title: string
  description?: string | null
  lat: number
  lng: number
  address?: string | null
  area_code_na?: string | null
  area_code_ps?: string | null
  status: ComplaintStatus
  created_at: string
  updated_at: string
  resolved_at?: string | null
}

type ComplaintSummary = ComplaintRead & {
  mna?: RepresentativeRead | null
  mpa?: RepresentativeRead | null
  votes_total: number
  votes_up: number
  votes_down: number
}

type ImpactStats = {
  issues_resolved: number
  areas_covered: number
  active_users: number
  avg_resolution_hours: number
}

// Enhanced API configuration with fallbacks
const getApiBase = () => {
  if (typeof window === 'undefined') return 'http://localhost:8000'
  
  const envBase = process.env.NEXT_PUBLIC_API_BASE
  if (envBase) return envBase
  
  // Try multiple endpoints
  const endpoints = [
    'http://localhost:8000',
    'http://127.0.0.1:8000',
    'http://0.0.0.0:8000'
  ]
  
  return endpoints[0] // Use first endpoint, handle errors gracefully
}

const API_BASE = getApiBase()

// Mock data for development
const MOCK_COMPLAINTS: ComplaintRead[] = [
  {
    id: 1,
    title: "Garbage accumulation in DHA Phase 6",
    description: "Large pile of garbage not collected for 5 days near main market",
    lat: 24.8607,
    lng: 67.0011,
    address: "DHA Phase 6, Karachi",
    area_code_na: "NA-247",
    area_code_ps: "PS-110",
    status: "new",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Sewage overflow in Gulshan",
    description: "Sewage line broken causing overflow on main road",
    lat: 24.9300,
    lng: 67.1300,
    address: "Gulshan-e-Iqbal, Karachi",
    area_code_na: "NA-242",
    area_code_ps: "PS-102",
    status: "in_progress",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  }
]

const MOCK_IMPACT_STATS: ImpactStats = {
  issues_resolved: 15000,
  areas_covered: 200,
  active_users: 50000,
  avg_resolution_hours: 48
}

export default function DashboardPage() {
  const [complaints, setComplaints] = useState<ComplaintRead[]>([])
  const [impactStats, setImpactStats] = useState<ImpactStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<number | null>(null)
  const [seeding, setSeeding] = useState(false)
  const [creating, setCreating] = useState(false)
  const [usingMockData, setUsingMockData] = useState(false)
  const [form, setForm] = useState({
    title: "",
    description: "",
    lat: "24.8607",
    lng: "67.0011",
    address: "",
  })

  // Enhanced fetch with mock data fallback
  async function fetchComplaints() {
    setLoading(true)
    setError(null)
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
      
      const res = await fetch(`${API_BASE}/complaints`, { 
        cache: "no-store",
        signal: controller.signal
      })
      clearTimeout(timeoutId)
      
      if (!res.ok) throw new Error(`Failed to load complaints (${res.status})`)
      
      const data: ComplaintRead[] = await res.json()
      setComplaints(data)
      setUsingMockData(false)
    } catch (e: any) {
      console.warn('Using mock data due to:', e.message)
      setComplaints(MOCK_COMPLAINTS)
      setUsingMockData(true)
      setError("Connected with demo data. Backend server unavailable.")
    } finally {
      setLoading(false)
    }
  }

  async function fetchImpactStats() {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)
      
      const res = await fetch(`${API_BASE}/impact`, {
        signal: controller.signal
      })
      clearTimeout(timeoutId)
      
      if (res.ok) {
        const data: ImpactStats = await res.json()
        setImpactStats(data)
        setUsingMockData(false)
      } else {
        throw new Error(`Impact stats failed: ${res.status}`)
      }
    } catch (e) {
      console.warn('Using mock impact stats due to:', e)
      setImpactStats(MOCK_IMPACT_STATS)
      setUsingMockData(true)
    }
  }

  useEffect(() => {
    fetchComplaints()
    fetchImpactStats()
  }, [])

  async function vote(complaintId: number, value: 1 | -1) {
    if (usingMockData) {
      setError("Voting disabled in demo mode. Start backend server to enable voting.")
      return
    }

    setBusyId(complaintId)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/complaints/${complaintId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voter_id: "web-demo-user", value }),
      })
      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`Vote failed (${res.status}): ${errorText}`)
      }
      await fetchComplaints()
    } catch (e: any) {
      setError(e.message ?? "Vote failed")
    } finally {
      setBusyId(null)
    }
  }

  async function seedExample() {
    if (usingMockData) {
      setError("Seeding disabled in demo mode. Start backend server to enable seeding.")
      return
    }

    setSeeding(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/seed/example`, { method: "POST" })
      if (!res.ok) throw new Error(`Seed failed (${res.status})`)
      await fetchComplaints()
    } catch (e: any) {
      setError(e.message ?? "Seed failed")
    } finally {
      setSeeding(false)
    }
  }

  async function createComplaint() {
    if (usingMockData) {
      setError("Complaint creation disabled in demo mode. Start backend server to submit complaints.")
      return
    }

    setCreating(true)
    setError(null)
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        lat: Number(form.lat),
        lng: Number(form.lng),
        address: form.address.trim() || undefined,
      }
      if (!payload.title || Number.isNaN(payload.lat) || Number.isNaN(payload.lng)) {
        throw new Error("Please provide title, lat, and lng")
      }
      const res = await fetch(`${API_BASE}/complaints`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`Create failed (${res.status}): ${errorText}`)
      }
      setForm({ ...form, title: "", description: "", address: "" })
      await fetchComplaints()
      await fetchImpactStats()
    } catch (e: any) {
      setError(e.message ?? "Create failed")
    } finally {
      setCreating(false)
    }
  }

  const stats = useMemo(() => {
    const total = complaints.length
    const resolved = complaints.filter((c) => c.status === "resolved").length
    const inProgress = complaints.filter((c) => c.status === "in_progress").length
    const newCount = complaints.filter((c) => c.status === "new").length
    return { total, resolved, inProgress, newCount }
  }, [complaints])

  const getStatusColor = (status: ComplaintStatus) => {
    switch (status) {
      case "resolved": return "bg-green-100 text-green-800 border-green-300"
      case "in_progress": return "bg-blue-100 text-blue-800 border-blue-300"
      case "assigned": return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "rejected": return "bg-red-100 text-red-800 border-red-300"
      default: return "bg-gray-100 text-gray-800 border-gray-300"
    }
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
                <h1 className="text-3xl font-bold text-green-800">Clean Karachi — Complaints Dashboard</h1>
                <p className="text-muted-foreground mt-2">Monitor and manage cleanliness issues across Karachi</p>
                {usingMockData && (
                  <div className="mt-2 p-2 bg-yellow-100 border border-yellow-300 rounded-md">
                    <p className="text-yellow-800 text-sm">
                      <strong>Demo Mode:</strong> Using mock data. Start backend server for full functionality.
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50">
                  <Shield className="w-4 h-4 mr-2" />
                  {usingMockData ? "Demo Mode" : "Live Tracking"}
                </Badge>
                <Button 
                  variant="outline" 
                  className="hover-lift bg-transparent border-green-600 text-green-600" 
                  onClick={() => {
                    fetchComplaints()
                    fetchImpactStats()
                  }}
                >
                  <RefreshCcw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Impact Statistics */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="glass-effect border-2 border-green-200 hover-lift">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Issues Resolved
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-700">
                  {impactStats?.issues_resolved?.toLocaleString() ?? "15,000+"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Successfully cleaned</p>
              </CardContent>
            </Card>
            <Card className="glass-effect border-2 border-blue-200 hover-lift">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  Areas Covered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-700">
                  {impactStats?.areas_covered ?? "200+"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Across Karachi</p>
              </CardContent>
            </Card>
            <Card className="glass-effect border-2 border-green-200 hover-lift">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-600" />
                  Active Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-700">
                  {impactStats?.active_users?.toLocaleString() ?? "50,000+"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Community members</p>
              </CardContent>
            </Card>
            <Card className="glass-effect border-2 border-blue-200 hover-lift">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-blue-600" />
                  Avg. Resolution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-700">
                  {impactStats?.avg_resolution_hours 
                    ? `${Math.round(impactStats.avg_resolution_hours)}h` 
                    : "48h"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Time to resolve</p>
              </CardContent>
            </Card>
          </div>

          {/* Create + Seed */}
          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {/* New Complaint */}
            <Card className="glass-effect lg:col-span-2 border-2 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Plus className="h-5 w-5 text-green-600" />
                  Report New Issue
                </CardTitle>
                <CardDescription>Help us keep Karachi clean by reporting cleanliness issues</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Issue Title *</label>
                    <input
                      className="mt-1 w-full rounded-md border border-green-300 px-3 py-2 focus:border-green-500 focus:ring-green-500"
                      placeholder="Garbage not collected, sewage overflow, etc."
                      value={form.title}
                      onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Location/Area *</label>
                    <input
                      className="mt-1 w-full rounded-md border border-green-300 px-3 py-2 focus:border-green-500 focus:ring-green-500"
                      placeholder="DHA Phase 6, Gulshan, etc."
                      value={form.address}
                      onChange={(e) => setForm((s) => ({ ...s, address: e.target.value }))}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea
                      className="mt-1 w-full rounded-md border border-green-300 px-3 py-2 focus:border-green-500 focus:ring-green-500"
                      rows={3}
                      placeholder="Provide details about the issue..."
                      value={form.description}
                      onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-green-600" /> Latitude
                    </label>
                    <input
                      className="mt-1 w-full rounded-md border border-green-300 px-3 py-2 focus:border-green-500 focus:ring-green-500"
                      value={form.lat}
                      onChange={(e) => setForm((s) => ({ ...s, lat: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-green-600" /> Longitude
                    </label>
                    <input
                      className="mt-1 w-full rounded-md border border-green-300 px-3 py-2 focus:border-green-500 focus:ring-green-500"
                      value={form.lng}
                      onChange={(e) => setForm((s) => ({ ...s, lng: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <Button 
                    onClick={createComplaint} 
                    disabled={creating || usingMockData}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {creating ? "Submitting..." : "Submit Complaint"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-transparent border-green-600 text-green-600"
                    onClick={() =>
                      setForm((s) => ({ ...s, lat: "24.83", lng: "67.06", address: "DHA Phase 6" }))
                    }
                  >
                    Use DHA Location
                  </Button>
                </div>
                {usingMockData && (
                  <p className="text-sm text-yellow-600 mt-2">
                    Submit functionality disabled in demo mode
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="glass-effect border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Rocket className="h-5 w-5 text-blue-600" />
                  Quick Setup
                </CardTitle>
                <CardDescription>Initialize demo data for testing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={seedExample} 
                  disabled={seeding || usingMockData} 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {seeding ? "Seeding..." : "Seed Demo Representatives"}
                </Button>
                <div className="text-xs text-muted-foreground space-y-2">
                  <p>• Creates sample representatives for Karachi</p>
                  <p>• Enables automatic complaint assignment</p>
                  <p>• Demo areas: NA-247/PS-110 & NA-242/PS-102</p>
                </div>
                {usingMockData && (
                  <p className="text-sm text-yellow-600">
                    Seeding disabled in demo mode
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-3 rounded-md border bg-red-50 border-red-300 text-red-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          {/* Complaints List */}
          <Card className="glass-effect border-2 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Trash2 className="h-5 w-5 text-green-600" />
                Recent Complaints {usingMockData && "(Demo Data)"}
              </CardTitle>
              <CardDescription>Latest community reports - vote to prioritize urgent issues</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  <p className="text-sm text-muted-foreground mt-2">Loading complaints...</p>
                </div>
              ) : complaints.length === 0 ? (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No complaints yet.</p>
                  <p className="text-sm text-muted-foreground mt-1">Be the first to report an issue!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {complaints.map((c) => (
                    <div key={c.id} className="p-4 border border-green-200 rounded-xl hover:shadow-md transition-shadow bg-white">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-start gap-2">
                            <span className="font-semibold text-green-900">{c.title}</span>
                            <Badge className={`${getStatusColor(c.status)} border`}>
                              {c.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          
                          {c.description && (
                            <p className="text-sm text-muted-foreground">{c.description}</p>
                          )}
                          
                          <div className="flex flex-wrap gap-2">
                            {c.area_code_na && (
                              <Badge variant="outline" className="border-green-300 text-green-700">
                                NA: {c.area_code_na}
                              </Badge>
                            )}
                            {c.area_code_ps && (
                              <Badge variant="outline" className="border-blue-300 text-blue-700">
                                PS: {c.area_code_ps}
                              </Badge>
                            )}
                            {c.address && (
                              <Badge variant="outline" className="border-gray-300">
                                <MapPin className="h-3 w-3 mr-1" />
                                {c.address}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="text-xs text-muted-foreground">
                            Reported: {new Date(c.created_at).toLocaleString()}
                            {c.resolved_at && (
                              <span className="ml-2 text-green-600">
                                • Resolved: {new Date(c.resolved_at).toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
                            onClick={() => vote(c.id, 1)}
                            disabled={busyId === c.id || usingMockData}
                          >
                            <ThumbsUp className="h-4 w-4 mr-1" /> 
                            Support
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-red-50 border-red-300 text-red-700 hover:bg-red-100"
                            onClick={() => vote(c.id, -1)}
                            disabled={busyId === c.id || usingMockData}
                          >
                            <ThumbsDown className="h-4 w-4 mr-1" /> 
                            Urgent
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Campaign Progress */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <Card className="glass-effect border-2 border-green-200 hover-lift">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  City Cleanliness Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-700 mb-2">
                  {complaints.length > 0 
                    ? Math.max(0, 100 - (complaints.filter(c => c.status !== 'resolved').length * 2))
                    : 82
                  }
                </div>
                <Progress 
                  value={complaints.length > 0 
                    ? Math.max(0, 100 - (complaints.filter(c => c.status !== 'resolved').length * 2))
                    : 82
                  } 
                  className="h-3 mb-2 bg-green-100"
                />
                <p className="text-sm text-muted-foreground">
                  Based on active unresolved complaints
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass-effect border-2 border-blue-200 hover-lift">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Activity className="h-5 w-5 text-blue-600" />
                  Response Efficiency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-700 mb-2">
                  {stats.resolved > 0 
                    ? `${Math.round((stats.resolved / stats.total) * 100)}%`
                    : "0%"
                  }
                </div>
                <p className="text-sm text-muted-foreground">
                  {stats.resolved} of {stats.total} issues resolved
                </p>
                <div className="mt-3 flex gap-1">
                  {['new', 'assigned', 'in_progress', 'resolved'].map((status) => (
                    <div
                      key={status}
                      className={`h-2 flex-1 rounded ${
                        status === 'resolved' ? 'bg-green-500' :
                        status === 'in_progress' ? 'bg-blue-500' :
                        status === 'assigned' ? 'bg-yellow-500' : 'bg-gray-300'
                      }`}
                      style={{ 
                        width: `${(complaints.filter(c => c.status === status).length / stats.total) * 100}%` 
                      }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-effect border-2 border-green-200 hover-lift">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Users className="h-5 w-5 text-green-600" />
                  Community Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p className="mb-2">
                  Every report helps us identify problem areas and improve city cleanliness.
                </p>
                <p>
                  <strong>Next:</strong> Real-time mapping integration and automated notifications to local authorities.
                </p>
                {usingMockData && (
                  <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-blue-700 text-xs">
                      <strong>Backend Setup:</strong> Run{' '}
                      <code className="bg-blue-100 px-1 py-0.5 rounded">uvicorn app:app --reload --port 8000</code>{' '}
                      to enable full functionality
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}