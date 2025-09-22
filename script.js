import { inject } from '@vercel/analytics';
inject();
// Firebase Imports
// REMOVED: This is no longer needed since we are using Appwrite
// import { databases } from "./appwrite-config.js";
// import { Query } from 'appwrite';

// The following line is from your original code. Let's assume this is the correct Appwrite setup.
import { databases } from "./appwrite-config.js";
import { Query } from 'appwrite';

const DATABASE_ID = '68beb6a800314061b0de';
const EVENTS_COLLECTION_ID = 'events';
const GALLERY_COLLECTION_ID = 'gallery';
const TEAM_COLLECTION_ID = 'team';
const SPONSORS_COLLECTION_ID = 'sponsors';
 
// Particle Animation System
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.particles = [];
    this.animationId = null;
    this.boundResize = this.resizeCanvas.bind(this);
    this.grid = [];
    this.cellSize = 120; // Should be same as connection distance

    this.resizeCanvas();
    this.animate();

    window.addEventListener("resize", this.boundResize);
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.gridWidth = Math.ceil(this.canvas.width / this.cellSize);
    this.gridHeight = Math.ceil(this.canvas.height / this.cellSize);
    this.createParticles();
  }

  createParticles() {
    // A list of characters and symbols related to data science, AI, and programming
    const elements = ['{}', '[]', '()', 'Σ', 'λ', 'π', 'μ', 'AI', 'ML', 'DS', 'Py', '01', '=>', '</>', 'db', 'SQL', 'tf', 'pt', 'viz', 'API', 'git', 'data'];
    
    // Make the background less dense for better readability of text
    const particleCount = Math.floor(
      (this.canvas.width * this.canvas.height) / 25000 // Further reduced density for performance
    );
    this.particles = [];

    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        // Use size to control font size later
        size: Math.random() * 1.5 + 0.5, 
        // Assign a random text element to each particle
        text: elements[Math.floor(Math.random() * elements.length)], 
        speedX: (Math.random() - 0.5) * 0.5, // Slower movement
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        pulse: Math.random() * Math.PI * 2,
      });
    }
  }

  updateAndGridParticles() {
    // Clear and prepare the grid for the new frame
    this.grid = Array.from({ length: this.gridHeight }, () => 
        Array.from({ length: this.gridWidth }, () => [])
    );

    this.particles.forEach((particle) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      particle.pulse += 0.02;

      // Wrap around edges
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.y > this.canvas.height) particle.y = 0;
      if (particle.y < 0) particle.y = this.canvas.height;

      // Pulsing effect
      particle.currentOpacity =
        particle.opacity + Math.sin(particle.pulse) * 0.2;

      // Add particle to the spatial grid
      const gridX = Math.floor(particle.x / this.cellSize);
      const gridY = Math.floor(particle.y / this.cellSize);
      if (gridX >= 0 && gridX < this.gridWidth && gridY >= 0 && gridY < this.gridHeight) {
        this.grid[gridY][gridX].push(particle);
      }
    });
  }

  drawParticles() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Set shadow properties once for all particles for better performance
    this.ctx.shadowBlur = 10;
    this.ctx.shadowColor = "rgba(255, 102, 0, 0.5)";

    // Draw particles
    this.particles.forEach((particle) => {
      this.ctx.font = `${particle.size * 12}px 'Orbitron', monospace`;
      this.ctx.fillStyle = `rgba(255, 102, 0, ${particle.currentOpacity})`;
      this.ctx.fillText(particle.text, particle.x, particle.y);
    });

    // Reset shadow properties
    this.ctx.shadowBlur = 0;
    // FIX: Add this line to correctly reset the shadow color
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0)';

    // Draw connections
    this.drawConnections();
  }

  drawConnections() {
    this.ctx.lineWidth = 1;
    // Iterate through each cell of the grid
    for (let y = 0; y < this.gridHeight; y++) {
      for (let x = 0; x < this.gridWidth; x++) {
        const cellParticles = this.grid[y][x];
        
        // For each particle in the cell...
        for (let i = 0; i < cellParticles.length; i++) {
          const p1 = cellParticles[i];

          // Check against other particles in the SAME cell
          for (let j = i + 1; j < cellParticles.length; j++) {
            this.tryConnect(p1, cellParticles[j]);
          }

          // Check against particles in neighboring cells (in specific directions to avoid duplicates)
          // Neighbor right
          if (x + 1 < this.gridWidth) this.grid[y][x + 1].forEach(p2 => this.tryConnect(p1, p2));
          // Neighbor bottom-left
          if (y + 1 < this.gridHeight && x - 1 >= 0) this.grid[y + 1][x - 1].forEach(p2 => this.tryConnect(p1, p2));
          // Neighbor bottom
          if (y + 1 < this.gridHeight) this.grid[y + 1][x].forEach(p2 => this.tryConnect(p1, p2));
          // Neighbor bottom-right
          if (y + 1 < this.gridHeight && x + 1 < this.gridWidth) this.grid[y + 1][x + 1].forEach(p2 => this.tryConnect(p1, p2));
        }
      }
    }
  }

  tryConnect(p1, p2) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.cellSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(p1.x, p1.y);
      this.ctx.lineTo(p2.x, p2.y);
      this.ctx.strokeStyle = `rgba(255, 102, 0, ${0.15 * (1 - distance / this.cellSize)})`;
      this.ctx.stroke();
    }
  }

  animate() {
    this.updateAndGridParticles();
    this.drawParticles();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    window.removeEventListener("resize", this.boundResize);
  }
}

// Navigation functionality
class Navigation {
  constructor() {
    this.navbar = document.getElementById("navbar");
    this.navToggle = document.getElementById("nav-toggle");
    this.navMenu = document.getElementById("nav-menu");

    this.initializeNavigation();
    this.setActiveLink();
  }

  initializeNavigation() {
    // Handle scroll effect
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        this.navbar.classList.add("scrolled");
      } else {
        this.navbar.classList.remove("scrolled");
      }
    });

    // Handle mobile menu toggle
    this.navToggle.addEventListener("click", () => {
      this.navMenu.classList.toggle("active");
      this.navToggle.classList.toggle("active");
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
      if (
        !this.navToggle.contains(e.target) &&
        !this.navMenu.contains(e.target)
      ) {
        this.navMenu.classList.remove("active");
        this.navToggle.classList.remove("active");
      }
    });
  }
  
  setActiveLink() {
    const path = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach(link => {
      if (link.getAttribute('href') === path || (path === '' && link.getAttribute('href') === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

// Scroll Animation System
class ScrollAnimations {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    this.initializeObserver();
  }

  initializeObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in");
        }
      });
    }, this.observerOptions);

    // Observe elements for fade-in effect
    const fadeElements = document.querySelectorAll(
      ".event-card, .team-member, .sponsor-card, .visual-card, .stat-item, .contact-item, .gallery-item"
    );

    fadeElements.forEach((element, index) => {
      element.classList.add("loading");
      setTimeout(() => {
        observer.observe(element);
      }, index * 50);
    });
  }
}

// Contact Form Handler
class ContactForm {
  constructor() {
    this.form = document.getElementById("contact-form");
    if (this.form) {
      this.initializeForm();
    }
  }

  initializeForm() {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  }

  handleSubmit() {
    const formData = new FormData(this.form);
    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    // Validate form
    if (!this.validateForm(data)) {
      return;
    }

    // Simulate form submission
    const submitBtn = this.form.querySelector(".submit-btn");
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = "<span>Sending...</span>";
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = "<span>Message Sent!</span>";
      this.form.reset();

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 2000);
    }, 1500);
  }

  validateForm(data) {
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "subject",
      "message",
    ];

    for (let field of requiredFields) {
      if (!data[field] || data[field].trim() === "") {
        this.showError(
          `Please fill in the ${field
            .replace(/([A-Z])/g, " $1")
            .toLowerCase()} field.`
        );
        return false;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      this.showError("Please enter a valid email address.");
      return false;
    }

    return true;
  }

  showError(message) {
    // Create or update error message
    let errorDiv = this.form.querySelector(".error-message");
    if (!errorDiv) {
      errorDiv = document.createElement("div");
      errorDiv.className = "error-message";
      errorDiv.style.cssText = `
                color: #ff4444;
                background: rgba(255, 68, 68, 0.1);
                border: 1px solid rgba(255, 68, 68, 0.3);
                padding: 10px 15px;
                border-radius: 8px;
                margin-bottom: 20px;
                font-size: 0.9rem;
            `;
      this.form.insertBefore(errorDiv, this.form.firstChild);
    }

    errorDiv.textContent = message;

    // Remove error after 5 seconds
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.remove();
      }
    }, 5000);
  }
}

// Hero Button Handlers
class HeroHandlers {
  constructor() {
    this.joinBtn = document.getElementById("join-btn");
    this.learnMoreBtn = document.getElementById("learn-more-btn");
    if (this.joinBtn && this.learnMoreBtn) {
      this.initializeButtons();
    }
  }

  initializeButtons() {
    this.joinBtn.addEventListener("click", (e) => {
      window.location.href = "contact.html";
    });

    this.learnMoreBtn.addEventListener("click", (e) => {
      window.location.href = "about.html";
    });
  }
}

// Interactive Effects
class InteractiveEffects {
  constructor() {
    this.initializeHoverEffects();
  }

  initializeHoverEffects() {
    // Add glow effect to cards on hover
    const cards = document.querySelectorAll(
      ".event-card, .team-member, .sponsor-card"
    );

    cards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        card.style.transition = "all 0.3s ease";
      });

      card.addEventListener("mouseleave", () => {
        card.style.transition = "all 0.3s ease";
      });
    });

    // Add ripple effect to buttons
    const buttons = document.querySelectorAll(
      ".cta-button, .event-btn, .submit-btn"
    );

    buttons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const ripple = document.createElement("span");
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;

        button.style.position = "relative";
        button.appendChild(ripple);

        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });

    // Add CSS for ripple animation
    const style = document.createElement("style");
    style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
    document.head.appendChild(style);
  }
}

// Typing Animation
class TypingAnimation {
  constructor() {
    this.initializeTyping();
  }

  initializeTyping() {
    const tagline = document.querySelector(".hero-tagline");
    if (!tagline) return;
    const originalText = tagline.textContent;

    setTimeout(() => {
      this.typeWriter(tagline, originalText, 80);
    }, 1000);
  }

  typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = "";

    function type() {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }

    type();
  }
}

// Statistics Counter Animation
class StatsCounter {
  constructor() {
    this.initializeCounters();
  }

  initializeCounters() {
    const statNumbers = document.querySelectorAll(".stat-number");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    statNumbers.forEach((stat) => {
      observer.observe(stat);
    });
  }

  animateCounter(element) {
    const target = parseInt(element.textContent.replace(/\D/g, ""));
    const suffix = element.textContent.replace(/\d/g, "");
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target + suffix;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current) + suffix;
      }
    }, 40);
  }
}

// Event Card Interactions
class EventInteractions {
  constructor() {
    this.initializeEventCards();
  }

  initializeEventCards() {
    const eventButtons = document.querySelectorAll(".event-btn");

    eventButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const eventCard = e.target.closest(".event-card");
        const eventTitle = eventCard.querySelector("h3").textContent;

        // Simulate event registration/info
        this.handleEventAction(button, eventTitle);
      });
    });
  }

  handleEventAction(button, eventTitle) {
    const originalText = button.textContent;
    button.textContent = "Processing...";
    button.disabled = true;

    setTimeout(() => {
      if (originalText.includes("Register")) {
        button.textContent = "Registered!";
  button.style.background = "#28a745";
        button.style.borderColor = "#28a745";
      } else {
        button.textContent = "Info Sent!";
      }

      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        button.style.background = "";
        button.style.borderColor = "";
      }, 2000);
    }, 1000);
  }
}

// Team Member Interactions
class TeamInteractions {
  constructor() {
    this.initializeTeamCards();
  }

  initializeTeamCards() {
    const teamMembers = document.querySelectorAll(".team-member");

    teamMembers.forEach((member) => {
      member.addEventListener("mouseenter", () => {
        member.classList.add("glow-animation");
      });

      member.addEventListener("mouseleave", () => {
        member.classList.remove("glow-animation");
      });
    });
  }
}

// Smooth Scroll Enhancement (now just for the indicator)
class SmoothScrollEnhancement {
  constructor() {
    this.initializeScrollEffects();
  }

  initializeScrollEffects() {
    // Add scroll progress indicator
    this.createScrollProgress();
  }

  createScrollProgress() {
    const progressBar = document.createElement("div");
    progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #ff6600, #ff8533);
            z-index: 9999;
            transition: width 0.1s ease;
            box-shadow: 0 0 10px rgba(255, 102, 0, 0.5);
        `;
    document.body.appendChild(progressBar);

    window.addEventListener("scroll", () => {
      const scrollPercent =
      scrollY /
          ((document.documentElement.scrollHeight - window.innerHeight))*100;
      progressBar.style.width = scrollPercent + "%";
    });
  }
}

// Loading Animation
class LoadingAnimation {
  constructor() {
    this.initializeLoading();
  }

  initializeLoading() {
    const preloader = document.getElementById("preloader");

    window.addEventListener("load", () => {
      if (preloader) {
      setTimeout(() => {
          preloader.classList.add("hidden");
        }, 500);
      }

      // Trigger loading animations for elements with '.loading' class on all pages
      const loadingElements = document.querySelectorAll(".loading");
      // Wait for preloader to start hiding before animating content in
      const initialDelay = 800;
      loadingElements.forEach((element, index) => {
        setTimeout(() => {
          element.classList.add("loaded");
        }, initialDelay + index * 100);
      });
    });
  }
}

// Mouse Cursor Effects
class CursorEffects {
  constructor() {
    this.initializeCursorEffects();
  }

  initializeCursorEffects() {
    // Create custom cursor
    const cursor = document.createElement("div");
    cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: rgba(255, 102, 0, 0.3);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
            mix-blend-mode: difference;
        `;
    document.body.appendChild(cursor);

    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX - 10 + "px";
      cursor.style.top = mouseY - 10 + "px";
    });

    // Scale cursor on hover over interactive elements
    const interactiveElements = document.querySelectorAll(
      "button, .nav-link, .social-link, .event-card, .team-member, .sponsor-card, .gallery-item"
    );

    interactiveElements.forEach((element) => {
      element.addEventListener("mouseenter", () => {
        cursor.style.transform = "scale(2)";
        cursor.style.background = "rgba(255, 102, 0, 0.5)";
      });

      element.addEventListener("mouseleave", () => {
        cursor.style.transform = "scale(1)";
        cursor.style.background = "rgba(255, 102, 0, 0.3)";
      });
    });
  }
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Always initialize these classes on all pages
  new Navigation();
  new InteractiveEffects();
  new LoadingAnimation();
  new CursorEffects();
  new SmoothScrollEnhancement();
  
  const canvas = document.getElementById("particles-canvas");
  if (canvas) {
    new ParticleSystem(canvas);
  }

  const path = window.location.pathname.split('/').pop();

  if (path === '' || path === 'index.html') {
    new TypingAnimation();
    loadEventBanner();
  }
  
  if (path === 'about.html') {
    new StatsCounter();
    new ScrollAnimations();
  }
  
  if (path === 'events.html') {
    loadEvents();
    new ScrollAnimations();
  }
  
  if (path === 'team.html') {
    loadTeamPage();
    new ScrollAnimations();
  }
  
  if (path === 'sponsors.html') {
    loadSponsorsPage();
    new ScrollAnimations();
  }
  
  if (path === 'gallery.html') {
    loadGalleryPage();
    new ScrollAnimations();
  }
  
  if (path === 'contact.html') {
    new ContactForm();
    new ScrollAnimations();
  }
});

// Performance optimization for scroll events
let scrollTicking = false;

function optimizedScrollHandler() {
  if (!scrollTicking) {
    requestAnimationFrame(() => {
      // Additional scroll-based animations can be added here
      scrollTicking = false;
    });
    scrollTicking = true;
  }
}

window.addEventListener("scroll", optimizedScrollHandler);

// Keyboard navigation support
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    // Close mobile menu if open
    const navMenu = document.getElementById("nav-menu");
    const navToggle = document.getElementById("nav-toggle");

    if (navMenu.classList.contains("active")) {
      navMenu.classList.remove("active");
      navToggle.classList.remove("active");
    }
  }
});

// Add focus management for accessibility
document.addEventListener("DOMContentLoaded", () => {
  const focusableElements = document.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  focusableElements.forEach((element) => {
    element.addEventListener("focus", () => {
      element.style.outline = "2px solid #ff6600";
      element.style.outlineOffset = "2px";
    });

    element.addEventListener("blur", () => {
      element.style.outline = "";
      element.style.outlineOffset = "";
    });
  });
});

async function loadEventBanner() {
    const eventBanner = document.getElementById('event-banner');
    const mainEventPoster = document.getElementById('main-event-poster');

    if (!eventBanner || !mainEventPoster) return;

    try {
        const response = await databases.listDocuments(DATABASE_ID, EVENTS_COLLECTION_ID, [Query.orderDesc("date"), Query.limit(1)]);

        if (response.documents.length === 0) {
            eventBanner.style.display = 'none';
            mainEventPoster.style.display = 'none';
            return;
        }

        const event = response.documents[0];
        const eventDate = new Date(event.date);
        const month = eventDate.toLocaleString('default', { month: 'short' }).toUpperCase();
        const day = eventDate.getDate();

        // Populate main-event-poster with the image if available
        if (event.imageUrl) {
            mainEventPoster.innerHTML = `<img src="${event.imageUrl}" alt="${event.title} Poster" class="main-event-poster-image">`;
            mainEventPoster.style.display = 'block'; // Ensure it's visible
        } else {
            mainEventPoster.style.display = 'none';
        }

        // Populate event-banner with event details
        const html = `
            <div class="container">
                <div class="event-banner-content">
                    <div class="event-banner-date">
                        <span class="month">${month}</span>
                        <span class="day">${day}</span>
                    </div>
                    <div class="event-banner-info">
                        <h3>${event.title}</h3>
                        <p>${event.description}</p>
                    </div>
                    <div class="event-banner-action">
                        <a href="https://engg.dypvp.edu.in/VortexHackathon2025.aspx" class="cta-button primary">Register Now</a>
                    </div>
                </div>
            </div>
        `;
        eventBanner.innerHTML = html;
        eventBanner.style.display = 'block'; // Ensure it's visible

    } catch (err) {
        console.error("Error loading event banner:", err);
        eventBanner.style.display = 'none';
        mainEventPoster.style.display = 'none';
    }
}

async function loadEvents() {
  const eventsGrid = document.querySelector('.events-grid');
  if (!eventsGrid) return;

  eventsGrid.innerHTML = '<div style="color:#999;text-align:center;grid-column: 1 / -1;">Loading events...</div>';

  try {
    // FIX: Use the Appwrite API consistently
    const response = await databases.listDocuments(DATABASE_ID, EVENTS_COLLECTION_ID, [Query.orderDesc("date")]);

    if (response.documents.length === 0) {
      eventsGrid.innerHTML = '<div style="color:#666;text-align:center;grid-column: 1 / -1;">No events found.</div>';
      return;
    }

    eventsGrid.innerHTML = '';
    response.documents.forEach(event => {
      const eventDate = new Date(event.date);
      const month = eventDate.toLocaleString('default', { month: 'short' }).toUpperCase();
      const day = eventDate.getDate();

      const html = `
        <div class="event-card loading">
          <div class="event-date">
            <span class="month">${month}</span>
            <span class="day">${day}</span>
          </div>
          <div class="event-content">
            <h3>${event.title}</h3>
            <p>${event.description}</p>
            
                                            <a href="https://engg.dypvp.edu.in/VortexHackathon2025.aspx" class="event-btn">Register</a>
          </div>
        </div>
      `;
      eventsGrid.insertAdjacentHTML('beforeend', html);
    });
      // Re-initialize scroll animations to observe the new event cards
      new ScrollAnimations();
      new EventInteractions();
  } catch (err) {
    console.error("Error loading events:", err);
    eventsGrid.innerHTML = '<div class="error" style="grid-column: 1 / -1;">Error loading events. Please try again later.</div>';
  }
}

async function loadGalleryPage() {
    const galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid) return;

    galleryGrid.innerHTML = '<div style="color:#999;text-align:center;grid-column: 1 / -1;">Loading gallery...</div>';

    try {
        // FIX: Use the Appwrite API consistently
        const response = await databases.listDocuments(DATABASE_ID, GALLERY_COLLECTION_ID, [Query.orderDesc("$createdAt")]);

        if (response.documents.length === 0) {
            galleryGrid.innerHTML = '<div style="color:#666;text-align:center;grid-column: 1 / -1;">No images found.</div>';
            return;
        }

        galleryGrid.innerHTML = '';
        response.documents.forEach(item => {
            const html = `
                <div class="gallery-item loading">
                   <img src="${item.imageUrl}" alt="${item.caption}">
                    <div class="gallery-item-overlay">
                        <h4>${item.caption}</h4>
                    </div>
                </div>
            `;
            galleryGrid.insertAdjacentHTML('beforeend', html);
        });
        // Re-initialize scroll animations to observe the new gallery items
        new ScrollAnimations();
    } catch (err) {
        console.error("Error loading gallery:", err);
        galleryGrid.innerHTML = '<div class="error" style="grid-column: 1 / -1;">Error loading gallery. Please try again later.</div>';
    }
}

async function loadTeamPage() {
    const teamGrid = document.querySelector('#team-members-grid');
    if (!teamGrid) return;

    teamGrid.innerHTML = '<div style="color:#999;text-align:center;grid-column: 1 / -1;">Loading team...</div>';

    try {
        // FIX: Use the Appwrite API consistently
        const response = await databases.listDocuments(DATABASE_ID, TEAM_COLLECTION_ID, [Query.orderDesc("$createdAt")]);

        if (response.documents.length === 0) {
            teamGrid.innerHTML = '<div style="color:#666;text-align:center;grid-column: 1 / -1;">No team members found.</div>';
            return;
        }

        teamGrid.innerHTML = '';
        response.documents.forEach(item => {
            const html = `
                <div class="team-member loading">
                    <div class="member-photo">
                        <img src="${item.image}" alt="${item.Name}">
                        <div class="member-overlay">
                            
                        </div>
                    </div>
                    <div class="member-info">
                        <h4>${item.Name}</h4>
                        <p>${item.Role}</p>
                    </div>
                </div>
            `;
            teamGrid.insertAdjacentHTML('beforeend', html);
        });
        // Re-initialize scroll animations to observe the new team members
        new ScrollAnimations();
        new TeamInteractions();
    } catch (err) {
        console.error("Error loading team:", err);
        teamGrid.innerHTML = '<div class="error" style="grid-column: 1 / -1;">Error loading team. Please try again later.</div>';
    }
}

async function loadSponsorsPage() {
    const sponsorsGrid = document.querySelector('.sponsors-grid');
    if (!sponsorsGrid) return;

    sponsorsGrid.innerHTML = '<div style="color:#999;text-align:center;grid-column: 1 / -1;">Loading sponsors...</div>';

    try {
        // FIX: Use the Appwrite API consistently
        const response = await databases.listDocuments(DATABASE_ID, SPONSORS_COLLECTION_ID, [Query.orderDesc("$createdAt")]);

        if (response.documents.length === 0) {
            sponsorsGrid.innerHTML = '<div style="color:#666;text-align:center;grid-column: 1 / -1;">No sponsors found.</div>';
            return;
        }

        sponsorsGrid.innerHTML = '';
        response.documents.forEach(item => {
            const html = `
                <div class="sponsor-card loading">
                    <img src="${item.image}" alt="${item.Name}">
                    <h3>${item.Name}</h3>
                </div>
            `;
            sponsorsGrid.insertAdjacentHTML('beforeend', html);
        });
        // Re-initialize scroll animations to observe the new sponsors
        new ScrollAnimations();
    } catch (err) {
        console.error("Error loading sponsors:", err);
        sponsorsGrid.innerHTML = '<div class="error" style="grid-column: 1 / -1;">Error loading sponsors. Please try again later.</div>';
    }
}