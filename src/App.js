import React from 'react';
import './App.scss';
import ConverterUI from './ConverterUI';

function App() {

const text = '';

  return (
    <div className="App">
      <header className="App-header">
          Скопируйте текст с таблицы iNaturalist и вставьте в левое поле ввода.
        </header>
      <main>
        <ConverterUI text={text} />
      </main>
    </div>
  );
}

export default App;
