export default function sketch(p) {
  class Particle {
    constructor(x, y) {

      // Position
      if (x === undefined && y === undefined) {
        this.pos = p.createVector(p.random(p.width), p.random(p.height))
      } else {
        this.pos = p.createVector(x, y)
      }
      // Size
      this.size = 10;
      // Velocity
      this.vel = p.createVector(p.random(-2, 2), p.random(-2, 2))
    }

    update() {
      this.edges();
      this.pos.add(this.vel);
    }

    draw() {
      // No Border
      p.noStroke();
      p.fill('rgba(255, 255, 255, .5)');
      p.circle(this.pos.x, this.pos.y, this.size);
    }

    edges() {
      if (this.pos.y < 5 || this.pos.y > p.height - 5) {
        this.vel.y = -this.vel.y;
      }
      if (this.pos.x < 5 || this.pos.x > p.width - 5) {
        this.vel.x = -this.vel.x;
      }
    }

    checkParticles(particles) {
      particles.forEach(particle => {
        const d = p.dist(this.pos.x, this.pos.y, particle.pos.x, particle.pos.y);
        if (d < p.width/10) {
          p.stroke('rgba(255,255,255,0.1)')
          p.line(this.pos.x, this.pos.y, particle.pos.x, particle.pos.y)
        }
      })

    }
  }

  let particles = [];

  let canvas;

  p.setup = () => {
    const sketchWidth = document.getElementById("mainCanvas").offsetWidth;
    const sketchHeight = document.getElementById("mainCanvas").offsetHeight;

    canvas = p.createCanvas(sketchWidth, sketchHeight);
    canvas.parent("mainCanvas");

    const particlesLength = Math.floor(sketchWidth / 10);
    for (let i = 0; i < particlesLength; i++) {
      particles.push(new Particle());
    }
  }

  p.draw = () => {
    p.background(55, 100, 144)
    particles.forEach((particle, index) => {
      particle.draw();
      particle.update();
      particle.checkParticles(particles.slice(index));
    })
    if (p.mouseIsPressed) {
      particles.push(new Particle(p.mouseX, p.mouseY));
    }
  }

  p.myCustomRedrawAccordingToNewPropsHandler = (newProps) => {
    // if (canvas) { //Make sure the canvas has been created
    //   p.fill(newProps.color);
    // }
    console.log(newProps)
  }
}