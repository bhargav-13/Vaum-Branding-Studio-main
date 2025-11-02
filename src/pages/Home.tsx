import React, { useEffect, useState, useRef } from 'react'
import './Home.css'

const Home: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(1)
  const totalTestimonials = 3
  const [animatedPercentages, setAnimatedPercentages] = useState({
    figma: 0,
    canva: 0,
    photoshop: 0,
    invision: 0,
    sketch: 0
  })
  
  // Swipe/Drag state
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const dragRef = useRef({ isDragging: false, startX: 0, dragOffset: 0 })
  
  // Update refs when state changes
  useEffect(() => {
    dragRef.current.isDragging = isDragging
    dragRef.current.startX = startX
    dragRef.current.dragOffset = dragOffset
  }, [isDragging, startX, dragOffset])

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % totalTestimonials)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + totalTestimonials) % totalTestimonials)
  }

  // Swipe/Drag handlers
  const handleStart = (clientX: number) => {
    setIsDragging(true)
    setStartX(clientX)
    setDragOffset(0)
  }

  const handleMove = (clientX: number) => {
    if (!isDragging) return
    const offset = clientX - startX
    setDragOffset(offset)
  }

  const handleEnd = () => {
    if (!isDragging) return
    
    const swipeThreshold = 50 // Minimum distance to trigger swipe
    
    if (Math.abs(dragOffset) > swipeThreshold) {
      if (dragOffset > 0) {
        // Swipe right - previous
        prevTestimonial()
      } else {
        // Swipe left - next
        nextTestimonial()
      }
    }
    
    setIsDragging(false)
    setDragOffset(0)
  }

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      handleMove(e.touches[0].clientX)
    }
  }

  const handleTouchEnd = () => {
    handleEnd()
  }

  // Mouse event handlers (for desktop drag)
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    handleStart(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX)
    }
  }

  const handleMouseUp = () => {
    handleEnd()
  }

  const handleMouseLeave = () => {
    if (isDragging) {
      handleEnd()
    }
  }

  // Global mouse events for smooth dragging
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (dragRef.current.isDragging) {
        const offset = e.clientX - dragRef.current.startX
        setDragOffset(offset)
      }
    }

    const handleGlobalMouseUp = () => {
      if (dragRef.current.isDragging) {
        const swipeThreshold = 50
        const offset = dragRef.current.dragOffset
        
        if (Math.abs(offset) > swipeThreshold) {
          if (offset > 0) {
            prevTestimonial()
          } else {
            nextTestimonial()
          }
        }
        
        setIsDragging(false)
        setDragOffset(0)
      }
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove)
      document.addEventListener('mouseup', handleGlobalMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove)
      document.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [isDragging])

  // Animate tool percentages when section comes into view
  useEffect(() => {
    const section = document.querySelector('.tools-section')
    if (!section) return

    let hasAnimated = false

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            hasAnimated = true
            
            const animatePercentages = () => {
              const targets = { figma: 99, canva: 50, photoshop: 30, invision: 20, sketch: 40 }
              const duration = 2000 // 2 seconds
              const steps = 60 // 60 steps for smooth animation
              const stepDuration = duration / steps
              
              let currentStep = 0
              
              const timer = setInterval(() => {
                currentStep++
                const progress = currentStep / steps
                
                // Use easing function for smooth animation
                const easeOutQuart = 1 - Math.pow(1 - progress, 4)
                
                setAnimatedPercentages({
                  figma: Math.round(targets.figma * easeOutQuart),
                  canva: Math.round(targets.canva * easeOutQuart),
                  photoshop: Math.round(targets.photoshop * easeOutQuart),
                  invision: Math.round(targets.invision * easeOutQuart),
                  sketch: Math.round(targets.sketch * easeOutQuart)
                })
                
                if (currentStep >= steps) {
                  clearInterval(timer)
                }
              }, stepDuration)
            }

            // Start animation with slight delay
            setTimeout(animatePercentages, 300)
          }
        })
      },
      { threshold: 0.3 }
    )

    observer.observe(section)

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    const section = document.querySelector('.about-section')
    const counters = Array.from(document.querySelectorAll<HTMLElement>('.about-stat .count-up'))
    if (!section || counters.length === 0) return

    let hasRun = false
    const animate = () => {
      if (hasRun) return
      hasRun = true

      // Wait for section animation to start, then begin counting
      setTimeout(() => {
        counters.forEach((el, index) => {
          const target = parseInt(el.dataset.target || '0', 10)
          const durationMs = 3500 // Slower duration for clearly visible animation
          const startTime = performance.now()
          
          // Stagger each counter slightly for sequential animation
          const delay = index * 200

          setTimeout(() => {
            // Smooth easing function - easeOutExpo for very smooth animation
            const easeOutExpo = (t: number) => {
              return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
            }
            
            const step = (now: number) => {
              const elapsed = now - startTime
              const progress = Math.min(elapsed / durationMs, 1)
              
              // Ultra-smooth easing: easeOutExpo
              const eased = easeOutExpo(progress)
              
              // Use more precise calculation for smoother increments
              const current = Math.round(eased * target)
              
              // Only update if number actually changed (reduces repaints)
              if (el.textContent !== String(current)) {
                el.textContent = String(current)
              }
              
              // Ensure visibility
              if (el.style.opacity !== '1') {
                el.style.opacity = '1'
                el.style.transform = 'scale(1)'
              }
              
              if (progress < 1) {
                requestAnimationFrame(step)
              } else {
                // Ensure final number is exact
                el.textContent = String(target)
                el.style.opacity = '1'
                el.style.transform = 'scale(1)'
              }
            }
            requestAnimationFrame(step)
          }, delay)
        })
      }, 500) // Delay to sync with section animation
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate()
          io.disconnect()
        }
      })
    }, { 
      threshold: 0.15, // Trigger when section is clearly visible
      rootMargin: '0px 0px -80px 0px'
    })

    io.observe(section)
    return () => io.disconnect()
  }, [])

  // Badge animation trigger when about section comes into view
  useEffect(() => {
    const section = document.querySelector('.about-section')
    const badges = Array.from(document.querySelectorAll<HTMLElement>('.about-badge'))
    if (!section || badges.length === 0) return

    // Ensure badges start in paused state
    badges.forEach((badge) => {
      badge.style.animationPlayState = 'paused'
    })

    let hasAnimated = false
    const triggerBadgeAnimation = () => {
      if (hasAnimated) return
      hasAnimated = true

      // Start all badge animations
      badges.forEach((badge) => {
        badge.style.animationPlayState = 'running'
      })
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          triggerBadgeAnimation()
          io.disconnect()
        }
      })
    }, { threshold: 0.3 })

    io.observe(section)
    return () => io.disconnect()
  }, [])

  // Hero section animations on page load
  useEffect(() => {
    const heroElements = [
      { selector: '.hero .greeting-box', delay: 200 },
      { selector: '.hero .hero-title', delay: 400 },
      { selector: '.hero .hero-description', delay: 600 },
      { selector: '.hero .hero-buttons', delay: 800 }
    ]

    heroElements.forEach(({ selector, delay }) => {
      const element = document.querySelector<HTMLElement>(selector)
      if (element) {
        setTimeout(() => {
          element.classList.add('hero-animate-in')
        }, delay)
      }
    })
  }, [])

  // Scroll-triggered animations for all sections with enhanced staggered child animations
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('.scroll-animate')
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const section = entry.target as HTMLElement
            section.classList.add('animate-in')
            
            // Animate child elements with intelligent stagger effect
            const childrenToAnimate = section.querySelectorAll<HTMLElement>('.animate-child')
            
            childrenToAnimate.forEach((child, index) => {
              // Different delays based on element type for more natural flow
              let delay = index * 120 // Base delay of 120ms
              
              // Service cards get slightly faster stagger
              if (child.classList.contains('service-card')) {
                delay = index * 100
              }
              
              // Tool cards get medium stagger
              if (child.classList.contains('tool-card')) {
                delay = index * 110
              }
              
              // Form fields get fast stagger to match service cards
              if (child.classList.contains('form-field')) {
                delay = index * 80
              }
              
              // Headers animate immediately
              if (child.classList.contains('services-cards-header') || 
                  child.classList.contains('tools-header')) {
                delay = 50
              }
              
              // Contact description and list animate quickly
              if (child.classList.contains('contact-cta-desc') || 
                  child.classList.contains('contact-cta-list')) {
                delay = 100
              }
              
              setTimeout(() => {
                child.classList.add('child-animate-in')
              }, delay)
            })
          }
        })
      },
      { 
        threshold: 0.1, // Trigger when 10% of section is visible (earlier trigger)
        rootMargin: '0px 0px -80px 0px' // Start animation earlier
      }
    )

    sections.forEach((section) => {
      observer.observe(section)
    })

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section)
      })
    }
  }, [])
  return (
    <>
      <div className="home">
        <section className="hero">
          <div className="hero-container">
            {/* Left Side - Text Content */}
            <div className="hero-left">
              <div className="greeting-box hero-text-animate">
                <span>Hello There!</span>
              </div>
              <h1 className="hero-title hero-text-animate">
                I'm <i><span className="underlined">Vachika Bhanderi</span></i>,
                Graphic Designer.
              </h1>
              <p className="hero-description hero-text-animate">
                Passionate Graphic Designer with expertise in branding, logo identity, and creative strategy. 
                Helping businesses and startups build strong visual identities through impactful design.
              </p>
              <div className="hero-buttons hero-text-animate">
                <button className="btn-portfolio">
                  <span>View My Portfolio</span>
                  <div className="play-icon">
                    <img src="/play (1).gif" alt="Play" />
                  </div>
                </button>
                <button className="btn-hire">
                  Hire Me
                </button>
              </div>
            </div>

            {/* Right Side - Image */}
            <div className="hero-right">
              <div className="image-container">
                <img src="/Group 1171275258.jpg" alt="Vachika Bhanderi" className="hero-image" />
                <div className="hero-badge hero-badge-left">
                  <span className="hero-badge-text">Wireframe Design</span>
                </div>
                <div className="hero-badge hero-badge-right">
                  <span className="hero-badge-text">website Design</span>
                </div>
                
                {/* Rotating HIRE ME Circle */}
                <div className="hire-circle">
                  <svg className="hire-svg" viewBox="0 0 100 100">
                    <defs>
                      <path id="circle-path" d="M 50,50 m -35,0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" />
                    </defs>
                    <text className="hire-text-curved">
                      <textPath href="#circle-path" startOffset="0%">HIRE ME <tspan className="bullet-large">•</tspan></textPath>
                    </text>
                    <text className="hire-text-curved">
                      <textPath href="#circle-path" startOffset="25%">HIRE ME <tspan className="bullet-large">•</tspan></textPath>
                    </text>
                    <text className="hire-text-curved">
                      <textPath href="#circle-path" startOffset="50%">HIRE ME <tspan className="bullet-large">•</tspan></textPath>
                    </text>
                    <text className="hire-text-curved">
                      <textPath href="#circle-path" startOffset="75%">HIRE ME <tspan className="bullet-large">•</tspan></textPath>
                    </text>
                  </svg>
                  <div className="hire-center"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Services Section - Full Width Animated */}
      <section className="services-section">
        <div className="services-container">
          <div className="services-bar">
            {/* First set */}
            <div className="service-item">
              <span className="star-icon">
                <img src="/octicon_north-star-24.svg" alt="" width="32" height="32" style={{ display: 'block' }} />
              </span>
              <span className="service-text">Website Design</span>
            </div>
            <div className="service-item">
              <span className="star-icon">
                <img src="/octicon_north-star-24.svg" alt="" width="32" height="32" style={{ display: 'block' }} />
              </span>
              <span className="service-text">Application Design</span>
            </div>
            <div className="service-item">
              <span className="star-icon">
                <img src="/octicon_north-star-24.svg" alt="" width="32" height="32" style={{ display: 'block' }} />
              </span>
              <span className="service-text">Logo Design</span>
            </div>
            <div className="service-item">
              <span className="star-icon">
                <img src="/octicon_north-star-24.svg" alt="" width="32" height="32" style={{ display: 'block' }} />
              </span>
              <span className="service-text">Brochure Design</span>
            </div>
            {/* Second set for seamless loop */}
            <div className="service-item">
              <span className="star-icon">
                <img src="/octicon_north-star-24.svg" alt="" width="32" height="32" style={{ display: 'block' }} />
              </span>
              <span className="service-text">Website Design</span>
            </div>
            <div className="service-item">
              <span className="star-icon">
                <img src="/octicon_north-star-24.svg" alt="" width="32" height="32" style={{ display: 'block' }} />
              </span>
              <span className="service-text">Application Design</span>
            </div>
            <div className="service-item">
              <span className="star-icon">
                <img src="/octicon_north-star-24.svg" alt="" width="32" height="32" style={{ display: 'block' }} />
              </span>
              <span className="service-text">Logo Design</span>
            </div>
            <div className="service-item">
              <span className="star-icon">
                <img src="/octicon_north-star-24.svg" alt="" width="32" height="32" style={{ display: 'block' }} />
              </span>
              <span className="service-text">Brochure Design</span>
            </div>
            {/* Third set for continuous flow */}
            <div className="service-item">
              <span className="star-icon">
                <img src="/octicon_north-star-24.svg" alt="" width="32" height="32" style={{ display: 'block' }} />
              </span>
              <span className="service-text">Website Design</span>
            </div>
            <div className="service-item">
              <span className="star-icon">
                <img src="/octicon_north-star-24.svg" alt="" width="32" height="32" style={{ display: 'block' }} />
              </span>
              <span className="service-text">Application Design</span>
            </div>
            <div className="service-item">
              <span className="star-icon">
                <img src="/octicon_north-star-24.svg" alt="" width="32" height="32" style={{ display: 'block' }} />
              </span>
              <span className="service-text">Logo Design</span>
            </div>
            <div className="service-item">
              <span className="star-icon">
                <img src="/octicon_north-star-24.svg" alt="" width="32" height="32" style={{ display: 'block' }} />
              </span>
              <span className="service-text">Brochure Design</span>
            </div>
            {/* Fourth set for perfect loop */}
            <div className="service-item">
              <span className="star-icon">
                <img src="/octicon_north-star-24.svg" alt="" width="32" height="32" style={{ display: 'block' }} />
              </span>
              <span className="service-text">Website Design</span>
            </div>
            <div className="service-item">
              <span className="star-icon">
                <img src="/octicon_north-star-24.svg" alt="" width="32" height="32" style={{ display: 'block' }} />
              </span>
              <span className="service-text">Application Design</span>
            </div>
            <div className="service-item">
              <span className="star-icon">
                <img src="/octicon_north-star-24.svg" alt="" width="32" height="32" style={{ display: 'block' }} />
              </span>
              <span className="service-text">Logo Design</span>
            </div>
            <div className="service-item">
              <span className="star-icon">
                <img src="/octicon_north-star-24.svg" alt="" width="32" height="32" style={{ display: 'block' }} />
              </span>
              <span className="service-text">Brochure Design</span>
            </div>
            {/* Fifth set for seamless continuity */}
            <div className="service-item">
              <span className="star-icon">
                <img src="/octicon_north-star-24.svg" alt="" width="32" height="32" style={{ display: 'block' }} />
              </span>
              <span className="service-text">Website Design</span>
            </div>
            <div className="service-item">
              <span className="star-icon">
                <img src="/octicon_north-star-24.svg" alt="" width="32" height="32" style={{ display: 'block' }} />
              </span>
              <span className="service-text">Application Design</span>
            </div>
            <div className="service-item">
              <span className="star-icon">
                <img src="/octicon_north-star-24.svg" alt="" width="32" height="32" style={{ display: 'block' }} />
              </span>
              <span className="service-text">Logo Design</span>
            </div>
            <div className="service-item">
              <span className="star-icon">
                <img src="/octicon_north-star-24.svg" alt="" width="32" height="32" style={{ display: 'block' }} />
              </span>
              <span className="service-text">Brochure Design</span>
            </div>
            {/* Sixth set for perfect continuity */}
            <div className="service-item">
              <span className="star-icon">
                <img src="/octicon_north-star-24.svg" alt="" width="32" height="32" style={{ display: 'block' }} />
              </span>
              <span className="service-text">Website Design</span>
            </div>
            <div className="service-item">
              <span className="star-icon">
                <img src="/octicon_north-star-24.svg" alt="" width="32" height="32" style={{ display: 'block' }} />
              </span>
              <span className="service-text">Application Design</span>
            </div>
            <div className="service-item">
              <span className="star-icon">
                <img src="/octicon_north-star-24.svg" alt="" width="32" height="32" style={{ display: 'block' }} />
              </span>
              <span className="service-text">Logo Design</span>
            </div>
            <div className="service-item">
              <span className="star-icon">
                <img src="/octicon_north-star-24.svg" alt="" width="32" height="32" style={{ display: 'block' }} />
              </span>
              <span className="service-text">Brochure Design</span>
            </div>
            {/* Seventh set for infinite loop */}
            <div className="service-item">
              <span className="star-icon">
                <img src="/octicon_north-star-24.svg" alt="" width="32" height="32" style={{ display: 'block' }} />
              </span>
              <span className="service-text">Website Design</span>
            </div>
            <div className="service-item">
              <span className="star-icon">
                <img src="/octicon_north-star-24.svg" alt="" width="32" height="32" style={{ display: 'block' }} />
              </span>
              <span className="service-text">Application Design</span>
            </div>
            <div className="service-item">
              <span className="star-icon">
                <img src="/octicon_north-star-24.svg" alt="" width="32" height="32" style={{ display: 'block' }} />
              </span>
              <span className="service-text">Logo Design</span>
            </div>
            <div className="service-item">
              <span className="star-icon">
                <img src="/octicon_north-star-24.svg" alt="" width="32" height="32" style={{ display: 'block' }} />
              </span>
              <span className="service-text">Brochure Design</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Cards Section */}
      <section className="services-cards-section scroll-animate">
        <div className="services-cards-container">
          <div className="services-cards-header animate-child">
            <div className="services-cards-title-group">
              <div className="services-subtitle">
                <div className="subtitle-line"></div>
                <span>Services</span>
              </div>
              <h2 className="services-cards-title"><i>Services</i> I Provide</h2>
            </div>
            <button className="btn-view-all">
              <span>View All Services</span>
              <div className="btn-view-all-icon">
                <img src="/bullet-point.gif" alt="View All" className="btn-bullet-icon" />
              </div>
            </button>
          </div>
          
          <div className="services-cards-grid">
            <div className="service-card animate-child">
              <div className="service-card-icon">
                <div className="icon-circle">
                  <img src="/computer (1).gif" alt="Computer" />
                </div>
              </div>
              <h3 className="service-card-title">UI/UX Design</h3>
              <p className="service-card-description">
                Creating user-friendly and visually appealing digital experiences that ...
              </p>
              <a href="#" className="service-card-link">
                Learn more <span className="arrow-icon" aria-hidden="true"></span>
              </a>
            </div>
            
            <div className="service-card animate-child">
              <div className="service-card-icon">
                <div className="icon-circle">
                  <img src="/vector (1).gif" alt="Vector" />
                </div>
              </div>
              <h3 className="service-card-title">Application Design</h3>
              <p className="service-card-description">
                Designing intuitive and efficient mobile and desktop applications ...
              </p>
              <a href="#" className="service-card-link">
                Learn more <span className="arrow-icon" aria-hidden="true"></span>
              </a>
            </div>
            
            <div className="service-card animate-child">
              <div className="service-card-icon">
                <div className="icon-circle">
                  <img src="/web-design (1).gif" alt="Web Design" />
                </div>
              </div>
              <h3 className="service-card-title">Website Design</h3>
              <p className="service-card-description">
                Crafting modern, responsive, and impactful websites that ...
              </p>
              <a href="#" className="service-card-link">
                Learn more <span className="arrow-icon" aria-hidden="true"></span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section scroll-animate">
        <div className="about-container">
            <div className="about-circle animate-child">
              <img src="/Mask group.svg" alt="Vachika profile" />
              
              {/* Design Badges */}
              <div className="about-badge about-badge-1">Website Design</div>
              <div className="about-badge about-badge-2">Application Design</div>
              <div className="about-badge about-badge-3">UI/UX Design</div>
              <div className="about-badge about-badge-4">Brochure Design</div>
              <div className="about-badge about-badge-5">Prototype</div>
              <div className="about-badge about-badge-6">Logo Design</div>
              <div className="about-badge about-badge-7">Wireframe Design</div>
            </div>
          <div className="about-right">
            <div className="about-subtitle animate-child">
              <span className="subtitle-line"></span>
              <span>About Me</span>
            </div>
            <h2 className="about-title animate-child"><span className="about-title-lead">Who is</span> <i>Vachika Bhanderi</i> ?</h2>
            <p className="about-desc">
              At Vaum Branding studio, we craft unique and impactful brand identities that help businesses stand out.
              From logo design and brand strategy to digital creatives, we blend creativity with strategy to deliver
              designs that inspire and connect with your audience.
            </p>
            <div className="about-stats">
              <div className="about-stat animate-child">
                <div className="stat-number"><span className="count-up" data-target="20">0</span>+</div>
                <div className="stat-label">Project Completed</div>
              </div>
              <div className="about-stat animate-child">
                <div className="stat-number"><span className="count-up" data-target="5">0</span>+</div>
                <div className="stat-label">Industry Covered</div>
              </div>
              <div className="about-stat animate-child">
                <div className="stat-number"><span className="count-up" data-target="2">0</span>+</div>
                <div className="stat-label">Years of Experience</div>
              </div>
            </div>
            <div className="about-cta">
              <button className="btn-about-services">
                <span>View All Services</span>
                <div className="btn-about-icon">
                  <img src="/bullet-point.gif" alt="View All" className="btn-about-bullet" />
                </div>
              </button>
              <span className="about-signature">Vachika Bhanderi</span>
            </div>
          </div>
        </div>
      </section>

      {/* Favorite Tools Section */}
      <section className="tools-section scroll-animate">
        <div className="tools-container">
          <div className="tools-header animate-child">
            <div className="tools-subtitle">
              <span className="subtitle-line" />
              <span>My Favorite Tools</span>
            </div>
            <h2 className="tools-title">
              <i>Exploring the Tools</i>
              <br />
              Behind My Design
            </h2>
          </div>

          <div className="tools-grid">
            {/* Figma */}
            <div className="tool-card animate-child">
              <div className="tool-oval">
                <div className="tool-logo-circle">
                  <img src="/devicon_figma.jpg" alt="Figma" />
                </div>
                <div className="tool-percentage">{animatedPercentages.figma}%</div>
              </div>
              <div className="tool-name">Figma</div>
            </div>
            {/* Canva */}
            <div className="tool-card animate-child">
              <div className="tool-oval">
                <div className="tool-logo-circle">
                  <img src="/devicon_canva.jpg" alt="Canva" />
                </div>
                <div className="tool-percentage">{animatedPercentages.canva}%</div>
              </div>
              <div className="tool-name">Canva</div>
            </div>
            {/* Photoshop */}
            <div className="tool-card animate-child">
              <div className="tool-oval">
                <div className="tool-logo-circle">
                  <img src="/photoshop.jpg" alt="Photoshop" />
                </div>
                <div className="tool-percentage">{animatedPercentages.photoshop}%</div>
              </div>
              <div className="tool-name">Photoshop</div>
            </div>
            {/* InVision */}
            <div className="tool-card animate-child">
              <div className="tool-oval">
                <div className="tool-logo-circle">
                  <img src="/logos_invision-icon.jpg" alt="InVision" />
                </div>
                <div className="tool-percentage">{animatedPercentages.invision}%</div>
              </div>
              <div className="tool-name">InVision</div>
            </div>
            {/* Sketch */}
            <div className="tool-card animate-child">
              <div className="tool-oval">
                <div className="tool-logo-circle">
                  <img src="/devicon_sketch.jpg" alt="Sketch" />
                </div>
                <div className="tool-percentage">{animatedPercentages.sketch}%</div>
              </div>
              <div className="tool-name">Sketch</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-cta-section scroll-animate">
        <div className="contact-cta-container">
          <div className="contact-cta-left">
            <div className="contact-cta-subtitle animate-child">
              <span className="subtitle-line"></span>
              <span>Contact Us</span>
            </div>
            <h2 className="contact-cta-title animate-child">
              Let's talk For <i>Your</i><br />
              <i>Next Projects</i>
            </h2>
            <p className="contact-cta-desc animate-child">
              At Vaum Branding Studio, we love collaborating on ideas that inspire. Whether you need branding, a website, or digital design — let's create something unique together!
            </p>

            <ul className="contact-cta-list animate-child">
              <li>
                <span className="contact-cta-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                    <rect x="3" y="5" width="18" height="14" rx="2" ry="2"></rect>
                    <polyline points="3,7 12,13 21,7"></polyline>
                  </svg>
                </span>
                <a href="mailto:vaum.branding@gmail.com">vaum.branding@gmail.com</a>
              </li>
              <li>
                <span className="contact-cta-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                </span>
                <a href="https://www.vaum.studio" rel="noreferrer">www.vaum.studio</a>
              </li>
              <li>
                <span className="contact-cta-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
                    <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm0 2h10c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3zm5 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm6.5-.75a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0z" />
                  </svg>
                </span>
                <a href="https://instagram.com/vaum.studio" target="_blank" rel="noreferrer">vaum.studio</a>
              </li>
            </ul>
          </div>

          <div className="contact-cta-right">
            <form className="contact-cta-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-grid-two">
                <div className="form-field animate-child">
                  <label>Your Name*</label>
                  <input type="text" placeholder="Ex. Darshil Patel" required />
                </div>
                <div className="form-field animate-child">
                  <label>Email*</label>
                  <input type="email" placeholder="Example@gmail.com" required />
                </div>
                <div className="form-field animate-child">
                  <label>Phone*</label>
                  <input type="tel" placeholder="Enter Phone Number" required />
                </div>
                <div className="form-field animate-child">
                  <label>I'm Interested in*</label>
                  <select defaultValue="">
                    <option value="" disabled>Select</option>
                    <option>Branding</option>
                    <option>Website Design</option>
                    <option>Application Design</option>
                    <option>Logo Design</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="form-field animate-child">
                  <label>Budget Range*</label>
                  <select defaultValue="">
                    <option value="" disabled>Select Range</option>
                    <option>$200 - $500</option>
                    <option>$500 - $1000</option>
                    <option>$1000 - $2500</option>
                    <option>$2500+</option>
                  </select>
                </div>
                <div className="form-field animate-child">
                  <label>Country*</label>
                  <select defaultValue="">
                    <option value="" disabled>Select Country</option>
                    <option>India</option>
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>Canada</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="form-field form-field-full animate-child">
                <label>Your Message*</label>
                <textarea placeholder="Enter here..." required></textarea>
              </div>
            </form>
          </div>
          <div className="contact-cta-actions">
            <button className="btn-submit-contact animate-child" type="button">
              <span>Submit</span>
              <div className="btn-submit-icon">
                <img src="/bullet-point.gif" alt="Submit" className="btn-submit-bullet" />
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section scroll-animate">
        <div className="testimonials-container">
          <div className="testimonials-subtitle animate-child">
            <span className="subtitle-line"></span>
            <span>Clients Testimonials</span>
          </div>
          <h2 className="testimonials-title animate-child">
            The Impact of My Work: <span className="testimonials-title-highlight">Client Testimonials</span>
          </h2>
          
          <div className="testimonials-carousel">
            <div 
              className="testimonials-track"
              style={{ 
                transform: window.innerWidth <= 480 
                  ? `translateX(calc(50% - 140px - ${currentTestimonial * (280 + 16)}px + ${dragOffset}px))` 
                  : `translateX(calc(${(1 - currentTestimonial) * (670 + 32)}px + ${dragOffset}px))`,
                transition: isDragging ? 'none' : 'transform 0.5s ease-in-out',
                cursor: isDragging ? 'grabbing' : 'grab',
                userSelect: 'none'
              }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
            >
              <div className={`testimonial-card ${currentTestimonial === 0 ? 'active' : ''}`}>
                <div className="testimonial-rating">
                  <div className="stars">★★★★★</div>
                  <span className="rating-number">5.0</span>
                </div>
                <div className="testimonial-content">
                  <div className="quote-mark">"</div>
                  <p>Working with Vaum Studio was honestly the best decision we made for our brand. We had so many ideas but no clear direction, and they just got it. The team really listened, brought fresh ideas, and turned everything into something that felt so us. We’re absolutely obsessed with the final result.</p>
                </div>
                <div className="testimonial-author">
                  <div className="author-name">Harsh Vora</div>
                  <div className="author-title">Founder, Delight Autoforge</div>
                </div>
              </div>

              <div className={`testimonial-card ${currentTestimonial === 1 ? 'active' : ''}`}>
                <div className="testimonial-rating">
                  <div className="stars">★★★★★</div>
                  <span className="rating-number">5.0</span>
                </div>
                <div className="testimonial-content">
                  <div className="quote-mark">"</div>
                  <p>Vaum Studio totally nailed it. They didn't just make our brand look good—they gave it personality. The whole process felt super smooth, and the team was always open, creative, and on point. Since launching our new look, we've seen a huge boost in how people connect with our brand.</p>
                </div>
                <div className="testimonial-author">
                  <div className="author-name">Manas Vadodaria</div>
                  <div className="author-title">CEO, Codelix It Solutions</div>
                </div>
              </div>

              <div className={`testimonial-card ${currentTestimonial === 2 ? 'active' : ''}`}>
                <div className="testimonial-rating">
                  <div className="stars">★★★★★</div>
                  <span className="rating-number">5.0</span>
                </div>
                <div className="testimonial-content">
                  <div className="quote-mark">"</div>
                  <p>The team at Vaum Studio just gets it. They turned our ideas into something beautiful and meaningful. We feel much more confident showing off our brand now, and it's been a total game-changer for our business. Can't recommend them enough!</p>
                </div>
                <div className="testimonial-author">
                  <div className="author-name">Yash Sabhaya</div>
                  <div className="author-title">CTO, Sabhaya Solutions</div>
                </div>
              </div>
            </div>
          </div>

          <div className="testimonials-navigation">
            <button 
              className="nav-btn nav-prev" 
              aria-label="Previous testimonial"
              onClick={prevTestimonial}
            >
              <img src="/bullet-point.gif" alt="Previous" className="nav-bullet" />
            </button>
            <button 
              className="nav-btn nav-next" 
              aria-label="Next testimonial"
              onClick={nextTestimonial}
            >
              <img src="/bullet-point.gif" alt="Next" className="nav-bullet" />
            </button>
          </div>
        </div>
      </section>

      {/* Second Animated Services Section */}
      <section className="services-section-2">
        <div className="services-container-2">
          <div className="services-bar-2">
            {/* First set */}
            <div className="service-item-2">
              <span className="star-icon-2">
                <img src="/octicon_north-star-24.svg" alt="" width="38" height="38" style={{ display: 'block' }} />
              </span>
              <span className="service-text-2">Website Design</span>
            </div>
            <div className="service-item-2">
              <span className="star-icon-2">
                <img src="/octicon_north-star-24.svg" alt="" width="38" height="38" style={{ display: 'block' }} />
              </span>
              <span className="service-text-2">Application Design</span>
            </div>
            <div className="service-item-2">
              <span className="star-icon-2">
                <img src="/octicon_north-star-24.svg" alt="" width="38" height="38" style={{ display: 'block' }} />
              </span>
              <span className="service-text-2">Logo Design</span>
            </div>
            <div className="service-item-2">
              <span className="star-icon-2">
                <img src="/octicon_north-star-24.svg" alt="" width="38" height="38" style={{ display: 'block' }} />
              </span>
              <span className="service-text-2">Brochure Design</span>
            </div>
            {/* Second set for seamless loop */}
            <div className="service-item-2">
              <span className="star-icon-2">
                <img src="/octicon_north-star-24.svg" alt="" width="38" height="38" style={{ display: 'block' }} />
              </span>
              <span className="service-text-2">Website Design</span>
            </div>
            <div className="service-item-2">
              <span className="star-icon-2">
                <img src="/octicon_north-star-24.svg" alt="" width="38" height="38" style={{ display: 'block' }} />
              </span>
              <span className="service-text-2">Application Design</span>
            </div>
            <div className="service-item-2">
              <span className="star-icon-2">
                <img src="/octicon_north-star-24.svg" alt="" width="38" height="38" style={{ display: 'block' }} />
              </span>
              <span className="service-text-2">Logo Design</span>
            </div>
            <div className="service-item-2">
              <span className="star-icon-2">
                <img src="/octicon_north-star-24.svg" alt="" width="38" height="38" style={{ display: 'block' }} />
              </span>
              <span className="service-text-2">Brochure Design</span>
            </div>
            {/* Third set for continuous flow */}
            <div className="service-item-2">
              <span className="star-icon-2">
                <img src="/octicon_north-star-24.svg" alt="" width="38" height="38" style={{ display: 'block' }} />
              </span>
              <span className="service-text-2">Website Design</span>
            </div>
            <div className="service-item-2">
              <span className="star-icon-2">
                <img src="/octicon_north-star-24.svg" alt="" width="38" height="38" style={{ display: 'block' }} />
              </span>
              <span className="service-text-2">Application Design</span>
            </div>
            <div className="service-item-2">
              <span className="star-icon-2">
                <img src="/octicon_north-star-24.svg" alt="" width="38" height="38" style={{ display: 'block' }} />
              </span>
              <span className="service-text-2">Logo Design</span>
            </div>
            <div className="service-item-2">
              <span className="star-icon-2">
                <img src="/octicon_north-star-24.svg" alt="" width="38" height="38" style={{ display: 'block' }} />
              </span>
              <span className="service-text-2">Brochure Design</span>
            </div>
            {/* Fourth set for perfect loop */}
            <div className="service-item-2">
              <span className="star-icon-2">
                <img src="/octicon_north-star-24.svg" alt="" width="38" height="38" style={{ display: 'block' }} />
              </span>
              <span className="service-text-2">Website Design</span>
            </div>
            <div className="service-item-2">
              <span className="star-icon-2">
                <img src="/octicon_north-star-24.svg" alt="" width="38" height="38" style={{ display: 'block' }} />
              </span>
              <span className="service-text-2">Application Design</span>
            </div>
            <div className="service-item-2">
              <span className="star-icon-2">
                <img src="/octicon_north-star-24.svg" alt="" width="38" height="38" style={{ display: 'block' }} />
              </span>
              <span className="service-text-2">Logo Design</span>
            </div>
            <div className="service-item-2">
              <span className="star-icon-2">
                <img src="/octicon_north-star-24.svg" alt="" width="38" height="38" style={{ display: 'block' }} />
              </span>
              <span className="service-text-2">Brochure Design</span>
            </div>
            {/* Fifth set for seamless continuity */}
            <div className="service-item-2">
              <span className="star-icon-2">
                <img src="/octicon_north-star-24.svg" alt="" width="38" height="38" style={{ display: 'block' }} />
              </span>
              <span className="service-text-2">Website Design</span>
            </div>
            <div className="service-item-2">
              <span className="star-icon-2">
                <img src="/octicon_north-star-24.svg" alt="" width="38" height="38" style={{ display: 'block' }} />
              </span>
              <span className="service-text-2">Application Design</span>
            </div>
            <div className="service-item-2">
              <span className="star-icon-2">
                <img src="/octicon_north-star-24.svg" alt="" width="38" height="38" style={{ display: 'block' }} />
              </span>
              <span className="service-text-2">Logo Design</span>
            </div>
            <div className="service-item-2">
              <span className="star-icon-2">
                <img src="/octicon_north-star-24.svg" alt="" width="38" height="38" style={{ display: 'block' }} />
              </span>
              <span className="service-text-2">Brochure Design</span>
            </div>
            {/* Sixth set for perfect continuity */}
            <div className="service-item-2">
              <span className="star-icon-2">
                <img src="/octicon_north-star-24.svg" alt="" width="38" height="38" style={{ display: 'block' }} />
              </span>
              <span className="service-text-2">Website Design</span>
            </div>
            <div className="service-item-2">
              <span className="star-icon-2">
                <img src="/octicon_north-star-24.svg" alt="" width="38" height="38" style={{ display: 'block' }} />
              </span>
              <span className="service-text-2">Application Design</span>
            </div>
            <div className="service-item-2">
              <span className="star-icon-2">
                <img src="/octicon_north-star-24.svg" alt="" width="38" height="38" style={{ display: 'block' }} />
              </span>
              <span className="service-text-2">Logo Design</span>
            </div>
            <div className="service-item-2">
              <span className="star-icon-2">
                <img src="/octicon_north-star-24.svg" alt="" width="38" height="38" style={{ display: 'block' }} />
              </span>
              <span className="service-text-2">Brochure Design</span>
            </div>
            {/* Seventh set for infinite loop */}
            <div className="service-item-2">
              <span className="star-icon-2">
                <img src="/octicon_north-star-24.svg" alt="" width="38" height="38" style={{ display: 'block' }} />
              </span>
              <span className="service-text-2">Website Design</span>
            </div>
            <div className="service-item-2">
              <span className="star-icon-2">
                <img src="/octicon_north-star-24.svg" alt="" width="38" height="38" style={{ display: 'block' }} />
              </span>
              <span className="service-text-2">Application Design</span>
            </div>
            <div className="service-item-2">
              <span className="star-icon-2">
                <img src="/octicon_north-star-24.svg" alt="" width="38" height="38" style={{ display: 'block' }} />
              </span>
              <span className="service-text-2">Logo Design</span>
            </div>
            <div className="service-item-2">
              <span className="star-icon-2">
                <img src="/octicon_north-star-24.svg" alt="" width="38" height="38" style={{ display: 'block' }} />
              </span>
              <span className="service-text-2">Brochure Design</span>
            </div>
          </div>
        </div>
      </section>

    </>
  )
}

export default Home
