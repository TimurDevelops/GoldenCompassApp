import React, {useState} from 'react';
import './App.css';
import useToken from "./utils/useToken";
import Login from "./components/Login";
import Header from "./layout/Header";
import Canvas from "./layout/Canvas";
import TeachersList from "./layout/TeachersList";

function App() {

  const { token, setToken, unsetToken } = useToken();
  const [user, setUser] = useState();


  const logout = () => {
    unsetToken();
  }

  if(!token) {
    return <Login setToken={setToken} setUser={setUser}/>
  }
  console.log(user)
  return (
    <div>
      <Header logout={logout}/>
      <Canvas/>
      {
        user.type === 'teacher' ?
        <div>Учитель вошел</div> :
        user.type === 'student' ?
        <TeachersList/> :
        <div>Неизвестный тип пользователя</div>
      }
    </div>
  );
}

export default App;