import {io} from 'socket.io-client';

export default function sketch(p) {
  // TODO Разобраться с https (SSL)
  const socket = io('http://localhost:5000');

  let canvas;

  let drawWidth = 10;


  p.setup = () => {
    const sketchWidth = document.getElementById("mainCanvas").offsetWidth;
    const sketchHeight = document.getElementById("mainCanvas").offsetHeight;

    canvas = p.createCanvas(sketchWidth, sketchHeight);
    canvas.parent("mainCanvas");
    socket.on('mouseDragged', (data) => {
      p.noStroke();
      p.circle(data.x, data.y, data.size);
    })

  }

  p.draw = () => {

  }

  p.mouseDragged = () => {
    p.noStroke();
    p.circle(p.mouseX, p.mouseY, drawWidth);
    let data = {
      x: p.mouseX,
      y: p.mouseY,
      size: drawWidth
    }
    socket.emit("mouseDragged", data);
  }


  p.myCustomRedrawAccordingToNewPropsHandler =
    /**
     * @param {{drawWidth:number}} newProps
     */
      newProps => {
      // if (canvas) { //Make sure the canvas has been created
      //   p.fill(newProps.color);
      // }
      drawWidth = newProps.drawWidth;
      console.log(drawWidth)
    }
}