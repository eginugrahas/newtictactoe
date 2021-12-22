import React from 'react';
import './App.css'
import Game from './component/Game';

export default function App() {
  return (
    <div className="game-container">
      <h1>Tic Tac Toe</h1>
        <Game />
      <a className='igeegi' href="https://igeegi.my.id" target='_blank'>igeegi</a>
    </div>
  );
}
