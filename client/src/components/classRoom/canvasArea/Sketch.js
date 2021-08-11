import io from 'socket.io-client';
import image from '../../../img/cursor.png'
import {TOOLS} from '../../../utils/types'
import {serverUrl} from '../../../config.json';

export default function sketch(p) {
  // TODO Разобраться с https (SSL)
  const socket = io(serverUrl, {transports: ['websocket'], upgrade: false});

  let canvas;
  let drawingCanvas;
  let cursorCanvas;

  let cursorImg;

  let activeTool = TOOLS.DEFAULT;
  let allowStudentToDraw = false;

  let drawWidth = 10;
  let drawColor = 'white';

  let login = '';
  let teacher = '';
  let usertype = '';

  let allowedStudent = '';

  let setAlert;
  let disallowToClassRoom;
  let setWaitingScreen;


  p.setup = () => {
    cursorImg = p.loadImage(image);

    const sketchWidth = document.getElementById("mainCanvas").offsetWidth;
    const sketchHeight = document.getElementById("mainCanvas").offsetHeight;

    canvas = p.createCanvas(sketchWidth, sketchHeight);
    drawingCanvas = p.createGraphics(sketchWidth, sketchHeight);
    cursorCanvas = p.createGraphics(sketchWidth, sketchHeight);
    canvas.parent("mainCanvas");

    socket.on('serverPencilDraw', (data) => {
      pencilDraw(data);
    })

    socket.on('serverEraser', (data) => {
      eraser(data);
    })

    socket.on('serverCursor', (data) => {
      cursor(data);
    })

    socket.on('teacherNotPresent', (data) => {
      disallowToClassRoom()
      setAlert(`Учитель ${data.name} отсутствует на рабочем месте`, 'danger')
    })

    socket.on('studentDisallowed', (data) => {
      setWaitingScreen(true);
      setAlert(`Отправлен запрос на вход в классную комнату учителю ${data.name}`, 'light')
    })

    socket.on('studentRequestsEntrance', (data) => {
      if (usertype === 'teacher') {
        setAlert(`Ученик ${data.name} отправил запрос на вход в класную комнату`, 'primary')
      }
    })

    socket.on('joinedClassRoom', () => {
      setWaitingScreen(false);
    })

    socket.on('studentAllowed', () => {
      console.log('studentAllowed')
      socket.emit('joinClassRoom', {login, teacher, usertype});
    })
  }

  p.draw = () => {
    p.clear();
    p.image(drawingCanvas, 0, 0);
    p.image(cursorCanvas,0,0);

    if (activeTool === TOOLS.CURSOR) {

      p.noCursor();

      let data = {
        x: p.mouseX,
        y: p.mouseY,
      }
      socket.emit("clientCursor", {teacher, data});

    } else {

      p.cursor();

      if (activeTool === TOOLS.ERASER) {
        eraserCursor({x: p.mouseX, y: p.mouseY});
      }

    }
  }

  p.mouseDragged = () => {
    if (activeTool === TOOLS.PENCIL) {
      let data = {
        x: p.mouseX,
        y: p.mouseY,
        pMouseX: p.pmouseX,
        pMouseY: p.pmouseY,
        size: drawWidth,
        color: drawColor
      }
      socket.emit("clientPencilDraw", {teacher, data});
    } else if (activeTool === TOOLS.ERASER) {
      let data = {
        x: p.mouseX,
        y: p.mouseY,
      }
      socket.emit("clientEraser", {teacher, data});
    }
  }

  p.mouseClicked = () => {
    if (activeTool === TOOLS.ERASER) {
      let data = {
        x: p.mouseX,
        y: p.mouseY,
      }
      socket.emit("clientEraser", {teacher, data});
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

    cursorCanvas.image(cursorImg, x, y, cursorImg.width/50, cursorImg.height/50)

    p.image(cursorCanvas, 0, 0);
  }

  const eraserCursor = ({x, y}) => {
    cursorCanvas.clear();
    cursorCanvas.fill(0, 255, 0, 100);
    cursorCanvas.circle(x, y, 30);
    p.image(cursorCanvas, 0, 0);
  }

  p.myCustomRedrawAccordingToNewPropsHandler = newProps => {
    drawWidth = newProps.drawWidth;
    drawColor = newProps.drawColor;

    setAlert = newProps.setAlert;
    disallowToClassRoom = newProps.disallowToClassRoom;
    setWaitingScreen = newProps.setWaitingScreen;

    activeTool = newProps.activeTool;

    let newUserJoined = false;

    if (login !== newProps.login) {
      login = newProps.login;
      newUserJoined = true;
    }

    if (teacher !== newProps.teacherLogin) {
      teacher = newProps.teacherLogin;
      newUserJoined = true;
    }
    if (usertype !== newProps.usertype) {
      usertype = newProps.usertype;
      newUserJoined = true;
    }

    if (newUserJoined) {
      socket.emit('joinClassRoom', {login, teacher, usertype});
    }

    if (allowStudentToDraw !== newProps.allowStudentToDraw) {
      allowStudentToDraw = newProps.allowStudentToDraw;
      socket.emit("allowStudentToDraw", {allowStudentToDraw});
    }

    if (allowedStudent !== newProps.allowedStudent && newProps.allowedStudent) {
      allowedStudent = newProps.allowedStudent;

      socket.emit("allowStudent", {teacherLogin: teacher, studentLogin: allowedStudent});
    }
  }
}