(function () {
  const topcnv = document.querySelector('#topcnv');

  const topctx = topcnv.getContext('2d');

  let cw , ch, cx, cy;

  function resizeCanvas() {
    cw = document.getElementById('topcnv').clientWidth;
    ch = document.getElementById('topcnv').clientHeight;
    cx = cw / 2;
    cy = ch / 2.6;
  }

  resizeCanvas();

  const cfg = {
    hue        :0,
    bgfillColor: 'rgba(50, 50, 50, 0.05)',
    dirsCount  : 23,
    stepsToTurn: 1,
    dotSize    : 4,
    dotsCount  : 300,
    dotVelocity: 2,
    distance   : 70,
    colorAnim  : 'rgba(128, 106, 81, 1)',
  }

  function drawRect(color, x, y, w, h, shadowColor, shadowBlur) {
    topctx.shadowColor = shadowColor || 'black';
    topctx.shadowBlur = shadowBlur || 1;
    topctx.fillStyle = color;
    topctx.fillRect(x, y, w, h);
  }

  class Dot {
    constructor() {
      this.pos  = {x: cx, y: cy};
      this.dir  = (Math.random() * 3 | 0) * 2;
      this.step = 0;
    }

    redrawDot() {
      let color = cfg.colorAnim;
      let size = cfg.dotSize;
      let x = this.pos.x - size / 2;
      let y = this.pos.y - size / 2;

      drawRect(color, x, y, size, size)
    }

    moveDot() {
      this.step++;
      this.pos.x += dirslist[this.dir].x * cfg.dotVelocity;
      this.pos.y += dirslist[this.dir].y * cfg.dotVelocity;
    }

    changeDir() {
      if (this.step % cfg.stepsToTurn === 0) {
        this.dir = Math.random() > .5 ? (this.dir + 1) % cfg.dirsCount : (this.dir + cfg.dirsCount -1) % cfg.dirsCount;
      }
    }

    killDot(id) {
      let percent = Math.exp(5 * this.step / cfg.distance);
      if (percent > 100) {
        dotsList.splice(id, 1);
      }
    }
  }

  let dirslist = [];

  function createDirs() {
    for (let i = 0; i < 360; i += 360 / cfg.dirsCount) {
      let x = Math.cos(i * Math.PI / 180);
      let y = Math.sin(i * Math.PI / 180);
      dirslist.push({x: x, y: y});
    }
  }

  createDirs();

  let dotsList = [];
  function addDot() {
    if (dotsList.length < cfg.dotsCount && Math.random() > .8) {
      dotsList.push(new Dot());
      cfg.hue = (cfg.hue + 1) % 360;
    }
  }

  function refreshDots() {
    dotsList.forEach((i, id) => {
      i.moveDot();
      i.redrawDot();
      i.changeDir();
      i.killDot(id);
    })
  }

  let dot = new Dot();
  dot.redrawDot()

  function loop() {
    drawRect(cfg.bgfillColor, 0, 0, cw, ch);
    addDot();
    refreshDots();
    requestAnimationFrame(loop);
  }

  loop();
}())
