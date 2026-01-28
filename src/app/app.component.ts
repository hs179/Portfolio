import { Component, OnInit, AfterViewInit, OnDestroy, HostListener, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { USER_DATA } from './data/user-data';

// Declare globals loaded via CDN scripts
declare const VANTA: any;
declare const THREE: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('vantaBackground', { static: true }) vantaRef!: ElementRef;

  userData = USER_DATA;
  isDarkMode = false; // Default to Light Mode
  mail = "hchaudhary1792000@gmail.com";

  private vantaEffect: any = null;
  private scrollY = 0;
  private mouseX = 0;
  private mouseY = 0;
  private resizeTimeout: any = null;

  @HostListener('window:scroll')
  onWindowScroll() {
    this.scrollY = window.scrollY;
    this.updateBackground();
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
    this.updateBackground();
  }

  @HostListener('window:resize')
  onResize() {
    // Debounce resize to prevent performance issues
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    this.resizeTimeout = setTimeout(() => {
      if (this.vantaEffect) {
        this.vantaEffect.resize();
      }
    }, 250);
  }

  updateBackground() {
    const orbs = document.querySelectorAll('.orb');
    orbs.forEach((orb, index) => {
      // Combined scroll parallax and subtle mouse movement
      const scrollSpeed = (index + 1) * 0.1;
      const mouseFactor = (index + 1) * 0.05;

      const yScroll = -(this.scrollY * scrollSpeed);
      const xMouse = (this.mouseX - window.innerWidth / 2) * mouseFactor;
      const yMouse = (this.mouseY - window.innerHeight / 2) * mouseFactor;

      (orb as HTMLElement).style.transform = `translate(${xMouse}px, ${yScroll + yMouse}px)`;
    });

    // Update cursor spotlight
    const spotlight = document.querySelector('.cursor-spotlight') as HTMLElement;
    if (spotlight) {
      spotlight.style.left = `${this.mouseX}px`;
      spotlight.style.top = `${this.mouseY}px`;
    }

    // Update polkadot grid movement
    const grid = document.querySelector('.polkadot-grid') as HTMLElement;
    if (grid) {
      const xGrid = (this.mouseX - window.innerWidth / 2) * 0.03;
      const yGrid = (this.mouseY - window.innerHeight / 2) * 0.03;
      grid.style.backgroundPosition = `${xGrid}px ${yGrid}px`;
    }
  }

  ngOnInit() {
    if (!this.isDarkMode) {
      document.body.classList.add('light-theme');
    }
  }

  ngAfterViewInit() {
    this.initRevealAnimations();
    this.initVantaEffect();
  }

  ngOnDestroy() {
    if (this.vantaEffect) {
      this.vantaEffect.destroy();
    }
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
  }

  initVantaEffect() {
    if (typeof VANTA !== 'undefined' && this.vantaRef?.nativeElement) {
      const isMobile = window.innerWidth < 768;

      this.vantaEffect = VANTA.BIRDS({
        el: this.vantaRef.nativeElement,
        THREE: THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        // Performance optimizations
        birdSize: isMobile ? 0.8 : 1.2,
        wingSpan: isMobile ? 20.00 : 30.00,
        speedLimit: isMobile ? 3.00 : 5.00,
        separation: isMobile ? 30.00 : 20.00,
        alignment: isMobile ? 30.00 : 20.00,
        cohesion: isMobile ? 30.00 : 20.00,
        quantity: isMobile ? 2.00 : 4.00, // Fewer birds on mobile
        // Colors matching the portfolio theme
        backgroundColor: this.isDarkMode ? 0x000000 : 0xffffff,
        color1: 0x3b82f6, // Primary blue
        color2: 0x8b5cf6, // Purple accent
        colorMode: "variance"
      });
    }
  }

  updateVantaColors() {
    if (this.vantaEffect) {
      this.vantaEffect.setOptions({
        backgroundColor: this.isDarkMode ? 0x000000 : 0xffffff
      });
    }
  }

  initRevealAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.on-scroll-reveal').forEach(el => observer.observe(el));
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
    }
    this.updateVantaColors();
  }

  getSkillIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'Frontend': '🎨',
      'Backend': '⚙️',
      'Database': '🗄️',
      'DevOps': '🚀',
      'Tools': '🛠️',
      'Languages': '💻',
      'Frameworks': '📦',
      'Testing': '🧪',
      'Cloud': '☁️',
      'Mobile': '📱',
      'Design': '✨',
      'Other': '📌'
    };
    // Find matching category (case-insensitive partial match)
    const key = Object.keys(icons).find(k =>
      category.toLowerCase().includes(k.toLowerCase())
    );
    return key ? icons[key] : '📌';
  }
}
