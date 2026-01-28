import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { USER_DATA } from './data/user-data';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterViewInit {
  userData = USER_DATA;
  isDarkMode = false; // Default to Light Mode
  mail = "hchaudhary1792000@gmail.com";

  private scrollY = 0;
  private mouseX = 0;
  private mouseY = 0;

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

  updateBackground() {
    const orbs = document.querySelectorAll('.orb');
    orbs.forEach((orb, index) => {
      // Combined scroll parallax and subtle mouse movement
      const scrollSpeed = (index + 1) * 0.1;
      const mouseFactor = (index + 1) * 0.05; // Increased from 0.02

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
      const xGrid = (this.mouseX - window.innerWidth / 2) * 0.03; // Increased sensitivity
      const yGrid = (this.mouseY - window.innerHeight / 2) * 0.03; // Increased sensitivity
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
  }
}
