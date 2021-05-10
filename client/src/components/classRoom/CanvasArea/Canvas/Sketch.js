import {io} from 'socket.io-client';


export default function sketch(p) {
  // TODO Разобраться с https (SSL)
  // TODO подставлять адресс
  const socket = io('http://localhost:5000');

  let canvas;

  let drawWidth = 10;
  let drawColor = 'white';
  let login = '';
  let teacher = '';
  let usertype = '';



  p.setup = () => {
    const sketchWidth = document.getElementById("mainCanvas").offsetWidth;
    const sketchHeight = document.getElementById("mainCanvas").offsetHeight;

    canvas = p.createCanvas(sketchWidth, sketchHeight);
    canvas.parent("mainCanvas");
    socket.on('mouseDragged', (data) => {
      pencilDraw(data);
    })
    console.log(login, teacher, usertype)
    socket.emit('joinClassRoom', {login, teacher, usertype});
  }

  const pencilDraw = ({x, y, pMouseX, pMouseY, size, color}) => {
    let c = p.color(color);
    p.fill(c)
    p.line(x, y, pMouseX, pMouseY, size);
  }

  p.draw = () => {

  }

  p.mouseDragged = () => {
    let data = {
      x: p.mouseX,
      y: p.mouseY,
      pMouseX: p.pmouseX,
      pMouseY: p.pmouseY,
      size: drawWidth,
      color: drawColor
    }
    socket.emit("mouseDragged", {teacher, data});
  }


  p.myCustomRedrawAccordingToNewPropsHandler = newProps => {
    drawWidth = newProps.drawWidth;
    drawColor = newProps.drawColor;
    login = newProps.login;
    teacher = newProps.teacherLogin;
    usertype = newProps.usertype;
  }
}