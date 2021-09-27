import image from '../../../../img/cursor.png'
import {TOOLS} from '../../../../utils/types'

export default function sketch(p) {
  // TODO Разобраться с https (SSL)
  let socket;
  let room;

  let canvas;
  let drawingCanvas;
  let cursorCanvas;

  let cursorImg;

  let activeTool = TOOLS.DEFAULT;
  let active = true;

  let drawWidth = 10;
  let drawColor = 'white';

  let sketchWidth;
  let sketchHeight;

  p.setup = () => {
    cursorImg = p.loadImage(image);
    const container = document.getElementById("mainCanvas");
    if(!container){
      return
    }
    sketchWidth = container.offsetWidth;
    sketchHeight = container.offsetHeight;

    // TODO можно удалить повторное создание обработчиков события в socket'е
    const canvases = container.getElementsByTagName("canvas");
    for (let i = 0; i < canvases.length; i++){
      if (canvases[i]) canvases[i].parentElement.removeChild(canvases[i])
    }
    canvas = p.createCanvas(sketchWidth, sketchHeight);
    drawingCanvas = p.createGraphics(sketchWidth, sketchHeight);
    cursorCanvas = p.createGraphics(sketchWidth, sketchHeight);
    canvas.parent("mainCanvas");
  }

  p.draw = () => {
    p.clear();
    p.image(drawingCanvas, 0, 0);
    p.image(cursorCanvas, 0, 0);

    if (activeTool === TOOLS.CURSOR) {

      p.noCursor();

      let data = {
        x: p.mouseX/(sketchWidth/100),
        y: p.mouseY/(sketchHeight/100),
      }
      socket.emit("canvas-cursor", {room, data});

    } else {

      p.cursor();

      if (activeTool === TOOLS.ERASER) {
        eraserCursor({x: p.mouseX, y: p.mouseY});
      }

    }
  }

  p.mouseDragged = () => {
    if (!active) return
    if (activeTool === TOOLS.PENCIL) {
      let data = {
        x: p.mouseX/(sketchWidth/100),
        y: p.mouseY/(sketchHeight/100),
        pMouseX: p.pmouseX/(sketchWidth/100),
        pMouseY: p.pmouseY/(sketchHeight/100),
        size: drawWidth,
        color: drawColor
      }
      socket.emit("canvas-pencil", {room, data});
    } else if (activeTool === TOOLS.ERASER) {
      let data = {
        x: p.mouseX/(sketchWidth/100),
        y: p.mouseY/(sketchHeight/100),
      }
      socket.emit("canvas-eraser", {room, data});
    }
  }

  p.mouseClicked = () => {
    if (!active) return
    if (activeTool === TOOLS.ERASER) {
      let data = {
        x: p.mouseX/(sketchWidth/100),
        y: p.mouseY/(sketchHeight/100),
      }
      socket.emit("canvas-eraser", {room, data});
    }
  }

  const resetCanvas = () => {
    drawingCanvas.clear();
  }

  const pencilDraw = ({x, y, pMouseX, pMouseY, size, color}) => {
    let c = drawingCanvas.color(color);
    drawingCanvas.stroke(c)
    drawingCanvas.strokeWeight(size);
    drawingCanvas.line(sketchWidth/100*x, sketchHeight/100*y, sketchWidth/100*pMouseX, sketchHeight/100*pMouseY, size);
  }

  const eraser = ({x, y}) => {
    drawingCanvas.erase();
    drawingCanvas.circle(sketchWidth/100*x, sketchHeight/100*y, 30);
    drawingCanvas.noErase();
  }

  const cursor = ({x, y}) => {
    cursorCanvas.clear();

    cursorCanvas.image(cursorImg, sketchWidth/100*x, sketchHeight/100*y, cursorImg.width / 50, cursorImg.height / 50)

    p.image(cursorCanvas, 0, 0);
  }

  const eraserCursor = ({x, y}) => {
    cursorCanvas.clear();
    cursorCanvas.fill(0, 255, 0, 100);
    cursorCanvas.circle(x, y, 30);
    p.image(cursorCanvas, 0, 0);
  }

  p.myCustomRedrawAccordingToNewPropsHandler = newProps => {
    room = newProps.room;

    active = newProps.active;
    activeTool = newProps.activeTool;
    drawWidth = newProps.drawWidth;
    drawColor = newProps.drawColor;

    if (!newProps.socket) return;
    if (!!socket) return;

    socket = newProps.socket;

    socket.on('draw', (data) => {
      pencilDraw(data);
    })

    socket.on('erase', (data) => {
      eraser(data);
    })

    socket.on('cursor', (data) => {
      cursor(data);
    })

    socket.on('canvas-reset', () => {
      resetCanvas();
    })

    socket.on('loaded-image', () => {
      p.setup()
    })
  }
}