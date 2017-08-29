((ctx, undefined, w, h) => {  
	const lineAmount = 400;
	const radius = 0;
	const inverted = true;
	const random = (min, max) => ~~(Math.random() * (max - min)) + min;
	let lines = [];
	let explosion = null;
	let orbs = [];
  let tick = 0;
	let timeout = null;
  
  function Main() {
		canvas.width = w;
		canvas.height = h;
    this.init();
  }
  
  Main.prototype = {
    init: function() {
			while(lines.length <= lineAmount) 
				lines.push(new Line(360 / lineAmount * lines.length));
			
      window.addEventListener('resize', () => this.resize());
      this.request = requestAnimationFrame(() => this.draw());
    },
    draw: function() {
      tick++;
			ctx.fillStyle = '#000';
			ctx.fillRect(0, 0, w, h);
			ctx.globalCompositeOperation = 'lighter';
			lines.forEach((line, i) => line.draw(i));
			ctx.globalCompositeOperation = 'source-over';
			
			let gradient = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, 500);
			if(inverted) {
				gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
			} else {
				gradient.addColorStop(1, '#abaea3');
			}
			
			gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
			ctx.fillStyle = gradient;
			ctx.fillRect(0, 0, w, h);
			
			/*
			orbs.forEach((orb, i) => {
				orb.draw();
				if(orb.radius < 0) orbs.splice(i, 1);
			});
			
			if(tick % 15 == 0) orbs.push(new Orb);
			*/
			
      this.request = requestAnimationFrame(() => this.draw());
    },
    reset: function() {
      cancelAnimationFrame(this.request);
      ctx.clearRect(0, 0, w, h);
      this.init();
    },
    resize: function() {
			window.clearTimeout(timeout);
			
			timeout = setTimeout(() => {
				this.reset();
				h = window.innerHeight;
				w = window.innerWidth;
				canvas.height = h;
				canvas.width = w;
			}, 500);
    }
  }
	
	function Line(angle) {
		this.angle = angle;
		this.width = random(1, 10);
		this.centerOffset = radius;
		this.length = random(75,250);
		this.initialNoise = random(5,20);
		this.noise = random(this.length / 2, this.length);
	}
	
	Line.prototype = {
		draw: function(i) {
			let angle = this.angle + tick / 10;
			let startX = w / 2 + this.centerOffset * Math.cos(angle * Math.PI / 180);
			let startY = h / 2 + this.centerOffset * Math.sin(angle * Math.PI / 180);
			let endX = startX + (this.length + (Math.sin((tick / 10 + this.noise) / 2) * this.noise)) * Math.cos(angle * Math.PI / 180);
			let endY = startY + (this.length + (Math.sin((tick / 10 + this.noise) / 2) * this.noise)) * Math.sin(angle * Math.PI / 180);
			
			ctx.fillStyle = 'hsl(' + i / 2 * Math.sin(tick / 100) + ',50%,50%)';
			ctx.beginPath();
			ctx.moveTo(startX, startY);
			ctx.lineTo(startX + this.width / 2 * Math.cos((angle + 90) * Math.PI / 180), startY + this.width / 2 * Math.sin((angle + 90) * Math.PI / 180));
			ctx.lineTo(endX, endY);
			ctx.lineTo(startX + this.width / 2 * Math.cos((angle - 90) * Math.PI / 180), startY + this.width / 2 * Math.sin((angle - 90) * Math.PI / 180));
			ctx.closePath();
			ctx.fill();
		}
	}
	
	/*function Orb(radius) {
		this.speed = random(5,10);
		this.radius = 20;
		this.distance = 500;
		this.angle = random(110, 150);
		this.t = new Date().getTime();
	}
	
	Orb.prototype = {
		draw: function() {
			let elapsedTime = new Date().getTime() - this.t;
			let radius = this.radius - elapsedTime / (200 / this.speed);
			let distance = this.distance - elapsedTime / (9 / this.speed);
			let cx = w / 2 + distance * Math.cos(this.angle * Math.PI / 180);
			let cy = h / 2 + distance * Math.sin(this.angle * Math.PI / 180);
			
			if(radius < 0) {
				return;
			}
			
			ctx.strokeStyle = (inverted) ? '#abaea3' : '#000';
			ctx.lineJoin = 'round';
			ctx.lineWidth = 5;
			ctx.beginPath();
			ctx.moveTo(cx, cy);
			
			// scribble!
			for(var i = 0; i < 12; i++) {
				let angle = random(0, 359);
				ctx.lineTo(cx + radius * Math.cos(angle * Math.PI / 180), cy + radius * Math.sin(angle * Math.PI / 180));
			}
			
			ctx.stroke();
			ctx.closePath();
		}
	}*/
  
  const main = new Main();
})(canvas.getContext('2d'), void 0, window.innerWidth, window.innerHeight);