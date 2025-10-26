import React from 'react'
import './About.css'

const About: React.FC = () => {
  return (
    <div className="about">
      <section className="about-hero">
        <div className="container">
          <h1>About VAUM Studio</h1>
          <p className="about-subtitle">
            We are passionate creators dedicated to building exceptional digital experiences.
          </p>
        </div>
      </section>

      <section className="about-content">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <h2>Our Story</h2>
              <p>
                Founded with a vision to bridge the gap between creativity and technology, 
                VAUM Studio has been at the forefront of digital innovation. We believe 
                that great design and robust development go hand in hand to create 
                meaningful user experiences.
              </p>
              <p>
                Our team combines years of experience in web development, user experience 
                design, and digital strategy to deliver solutions that not only meet 
                your requirements but exceed your expectations.
              </p>
            </div>
            <div className="about-stats">
              <div className="stat-item">
                <div className="stat-number">50+</div>
                <div className="stat-label">Projects Completed</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">5+</div>
                <div className="stat-label">Years Experience</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">100%</div>
                <div className="stat-label">Client Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="team">
        <div className="container">
          <h2>Our Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-avatar">👨‍💻</div>
              <h3>John Doe</h3>
              <p>Lead Developer</p>
            </div>
            <div className="team-member">
              <div className="member-avatar">👩‍🎨</div>
              <h3>Jane Smith</h3>
              <p>UI/UX Designer</p>
            </div>
            <div className="team-member">
              <div className="member-avatar">👨‍💼</div>
              <h3>Mike Johnson</h3>
              <p>Project Manager</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
