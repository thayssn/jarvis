const memoryCanvas = document.querySelector('#memoryCanvas');
const memoryCanvasContext = memoryCanvas.getContext('2d');
const cpuCanvas = document.querySelector('#cpuCanvas');
const cpuCanvasContext = cpuCanvas.getContext('2d');

memoryCanvas.width = 300;
memoryCanvas.height = 300;

cpuCanvas.width = 300;
cpuCanvas.height = 300;

const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66'];

// Objects
class Particle {
  constructor(canvas, radius, color ) {
    this.x = canvas.width / 2;
    this.y = canvas.width / 2;
    this.radius = radius;
    this.color = color;
    this.radians = Math.random() * Math.PI * 2;
    this.velocity = 0.07;
    this.distanceFromCenter = {
        x: randomIntFromRange(15, 100),
        y: randomIntFromRange(15, 100)
    }
    this.opacity = 1;
    this.context = canvas.getContext('2d');
  }

  update(currentColor) {
    this.radians += this.velocity;

    this.x = 150 + Math.cos(this.radians) * this.distanceFromCenter.x;

    this.y = 150 + Math.sin(this.radians) * this.distanceFromCenter.y;
    
    this.draw(currentColor)
  }

  draw(currentColor) {
    this.context.beginPath()
    this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    this.context.fillStyle = currentColor || this.color;
    this.context.fill();
    this.context.shadowColor =  currentColor || this.color;
    this.context.shadowOffsetX = 0;
    this.context.shadowOffsetY = 0;
    this.context.shadowBlur = 25;
    this.context.closePath();
  }
}

// Implementation
let memoryParticles = [];
let cpuParticles = [];

function init(){
    memoryParticles.push(new Particle(memoryCanvas, 3, '#03dbfc'))
  
    cpuParticles.push(new Particle(cpuCanvas, 3, '#03fc84'))
}

function initMemory(qtyMemory) {
  if(qtyMemory <= memoryParticles.length){
    memoryParticles.splice(0, memoryParticles.length - qtyMemory);
  }else{
    for (let i = 0; i < qtyMemory -  memoryParticles.length; i++) {
      memoryParticles.push(new Particle(memoryCanvas, 3, '#03dbfc'))
    }
  }
}

function initCpu(qtyCpu = 100) {
  if(qtyCpu <= cpuParticles.length){
    cpuParticles.splice(0, cpuParticles.length - qtyCpu);
  }else{
    for (let i = 0; i < qtyCpu - cpuParticles.length; i++) {
      cpuParticles.push(new Particle(cpuCanvas, 3, '#03fc84'))
    }
  }
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate)
  
  memoryCanvasContext.clearRect(0, 0, memoryCanvas.width, memoryCanvas.height)
  const currentMemoryColor = cpuParticles.length < 30 ? 'white' : memoryParticles.length < 80 ? null : memoryParticles.length > 120 ? 'red' : 'orange';

  memoryParticles.forEach(particle => {
    particle.update(currentMemoryColor)
  })

  cpuCanvasContext.clearRect(0, 0, cpuCanvas.width, cpuCanvas.height)
  
  const currentCpuColor = cpuParticles.length < 60 ? 'white' : cpuParticles.length < 120 ? null : cpuParticles.length > 160 ? 'red' : 'orange';
  cpuParticles.forEach(particle => {
    particle.update(currentCpuColor)
  })
}
