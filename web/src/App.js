import './App.css';
import NavBar from './components/NavBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap';
import { Routes, Route, Navigate } from 'react-router-dom';
import RecordIndexView from './views/Record/RecordIndexView';
import PkIndexView from './views/PK/PkIndexView';
import RankIndexView from './views/Rank/RankIndexView';
import NotFound from './views/Error/NotFound';
import UserBotIndexView from './views/User/Bot/UserBotIndexView';

function App() {
  return (
    <div className="App">
      <NavBar/>
      <Routes>
        <Route path='/rank/' element = {<RankIndexView/>}/>
        <Route path='/pk/' element = {<PkIndexView/>}/>
        <Route path='/record/' element = {<RecordIndexView/>}/>
        <Route path='/user/bot/' element = {<UserBotIndexView/>}/>
        <Route path='/' element={<Navigate replace to="/pk/"/>}/>
        <Route path='*' element = {<NotFound/>}/>
      </Routes>
    </div>
  );
}

export default App;
