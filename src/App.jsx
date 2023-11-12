import {Routes, Route} from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreatePage from './pages/CreatePage';

const App = () => {
  return (
    <div>
      <Routes>
        <Route index element={<HomePage/>}></Route>
        <Route path="/create" element={<CreatePage/>}></Route>
      </Routes>
    </div>
  );
};

export default App;