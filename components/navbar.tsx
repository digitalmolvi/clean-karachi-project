"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Menu, X, Users, Shield, ChevronDown, Zap, MapPin, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-lg border-b shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 hover-lift">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Trash2 className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-green-700">Clean Karachi</span>
              <span className="text-xs text-muted-foreground -mt-1">Community Action</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/report" className="text-foreground hover:text-green-600 transition-colors font-medium">
              Report Issue
            </Link>
            <Link href="/track" className="text-foreground hover:text-green-600 transition-colors font-medium">
              Track Complaints
            </Link>
            <Link href="/areas" className="text-foreground hover:text-green-600 transition-colors font-medium">
              Areas Covered
            </Link>
            <Link href="/success" className="text-foreground hover:text-green-600 transition-colors font-medium">
              Success Stories
            </Link>

            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50 animate-pulse-glow">
                <Shield className="w-3 h-3 mr-1" />
                Live Tracking
              </Badge>

              <Link href="/about">
                <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                  About Campaign
                </Button>
              </Link>

              <Link href="/report">
                <Button className="bg-green-600 hover:bg-green-700 hover-glow">
                  <MapPin className="w-4 h-4 mr-2" />
                  Report Now
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t bg-card/95 backdrop-blur-lg">
            <div className="px-4 py-6 space-y-4">
              <Link 
                href="/report" 
                className="block py-2 text-foreground hover:text-green-600 transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                Report Issue
              </Link>
              <Link 
                href="/track" 
                className="block py-2 text-foreground hover:text-green-600 transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                Track Complaints
              </Link>
              <Link 
                href="/areas" 
                className="block py-2 text-foreground hover:text-green-600 transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                Areas Covered
              </Link>
              <Link 
                href="/success" 
                className="block py-2 text-foreground hover:text-green-600 transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                Success Stories
              </Link>
              <Link 
                href="/about" 
                className="block py-2 text-foreground hover:text-green-600 transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                About Campaign
              </Link>

              <div className="pt-4 border-t space-y-3">
                <Link href="/track" className="block" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full bg-transparent border-green-600 text-green-600">
                    <Shield className="w-4 h-4 mr-2" />
                    Track Issues
                  </Button>
                </Link>
                <Link href="/report" className="block" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <MapPin className="w-4 h-4 mr-2" />
                    Report Issue
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}