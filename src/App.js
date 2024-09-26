//import logo from './logo.svg';
import { DndProvider } from 'react-dnd';
import './App.css';
import FormDesign from './FormDesign';
import { HTML5Backend } from 'react-dnd-html5-backend';

const App = () => {
  return (
    <div className='App'>
      <DndProvider backend={HTML5Backend}>
        <FormDesign/>
      </DndProvider>       
    </div>
  );
};

export default App;
