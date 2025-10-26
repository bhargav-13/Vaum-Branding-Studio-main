// Common type definitions for the application

export interface User {
  id: string
  name: string
  email: string
}

export interface Project {
  id: string
  title: string
  description: string
  image: string
  technologies: string[]
  liveUrl?: string
  githubUrl?: string
}

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export interface NavItem {
  label: string
  path: string
  icon?: string
}
