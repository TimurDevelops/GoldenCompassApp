import image from '../../../img/cursor.png'
import {TOOLS} from '../../../utils/types'

export default function sketch(p) {
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

  p.setup = () => {
    cursorImg = p.loadImage(image);

    const sketchWidth = document.getElementById("mainCanvas").offsetWidth;
    const sketchHeight = document.getElementById("mainCanvas").offsetHeight;

    canvas = p.createCanvas(sketchWidth, sketchHeight);
    drawingCanvas = p.createGraphics(sketchWidth, sketchHeight);
    cursorCanvas = p.createGraphics(sketchWidth, sketchHeight);
    canvas.parent("mainCanvas");

    if(!socket){
      return
    }
    socket.on('serverPencilDraw', (data) => {
      pencilDraw(data);
    })

    socket.on('serverEraser', (data) => {
      eraser(data);
    })

    socket.on('serverCursor', (data) => {
      cursor(data);
    })
  }

  p.draw = () => {
    p.clear();
    p.image(drawingCanvas, 0, 0);
    p.image(cursorCanvas, 0, 0);

    if (activeTool === TOOLS.CURSOR) {

      p.noCursor();

      let data = {
        x: p.mouseX,
        y: p.mouseY,
      }
      socket.emit("clientCursor", {room, data});

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
        x: p.mouseX,
        y: p.mouseY,
        pMouseX: p.pmouseX,
        pMouseY: p.pmouseY,
        size: drawWidth,
        color: drawColor
      }
      socket.emit("clientPencilDraw", {room, data});
    } else if (activeTool === TOOLS.ERASER) {
      let data = {
        x: p.mouseX,
        y: p.mouseY,
      }
      socket.emit("clientEraser", {room, data});
    }
  }

  p.mouseClicked = () => {
    if (activeTool === TOOLS.ERASER) {
      let data = {
        x: p.mouseX,
        y: p.mouseY,
      }
      socket.emit("clientEraser", {room, data});
    }
  }

  const pencilDraw = ({x, y, pMouseX, pMouseY, size, color}) => {

    let c = drawingCanvas.color(color);
    drawingCanvas.stroke(c)
    drawingCanvas.strokeWeight(size);
    drawingCanvas.line(x, y, pMouseX, pMouseY, size);
  }

  const eraser = ({x, y}) => {
    drawingCanvas.erase();
    drawingCanvas.circle(x, y, 30);
    drawingCanvas.noErase();
  }

  const cursor = ({x, y}) => {
    cursorCanvas.clear();

    cursorCanvas.image(cursorImg, x, y, cursorImg.width / 50, cursorImg.height / 50)

    p.image(cursorCanvas, 0, 0);
  }

  const eraserCursor = ({x, y}) => {
    cursorCanvas.clear();
    cursorCanvas.fill(0, 255, 0, 100);
    cursorCanvas.circle(x, y, 30);
    p.image(cursorCanvas, 0, 0);
  }

  p.myCustomRedrawAccordingToNewPropsHandler = newProps => {
    socket = newProps.socket;
    room = newProps.room;

    active = newProps.active;
    activeTool = newProps.activeTool;
    drawWidth = newProps.drawWidth;
    drawColor = newProps.drawColor;
  }
}