import logo from './logo.svg';
import './App.css';
import React, {useRef, useEffect} from 'react';


function App() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "nyt-js/script.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <div id = "whole">

        <body style="overflow: hidden; height: 100vh">

        <div className="Intro-prompt">
          {/* Main Parent Container */}
          {/* Overlay Container For Popups */}
          <div id="overlay" style={{display: 'flex', justifyContent: 'center'}}> 
            {/* Popup - Player Welcome Modal */}
            <div id="popup" style={{
              display: 'flex',
              flexDirection: 'column',
              maxWidth: '455px',
              minHeight: '350px',
              padding: '20px',
              backgroundColor: 'white',
              borderRadius: '10px'
            }}>
              <label style={{marginBottom: 0, textAlign: 'center', fontWeight: 'bold', marginTop: '10px'}}>Welcome to today's Crossword!</label>
              <p id="crosswordDate" style={{marginTop: '5px', marginBottom: '35px', color: 'grey', fontSize: '16px', textAlign: 'center'}}></p>
              <label style={{fontWeight: 'normal', marginBottom: '10px'}} htmlFor="nameInput">Enter your name:</label>
              <input style={{marginBottom: '10px'}} type="text" id="nameInput" /><br />
              <button onClick={window.startGame()} style={{fontWeight: 'bold', marginBottom: '25px'}}>Start Crossword</button>
              <p style={{color: 'grey', fontSize: '15px'}}></p>
            </div>
          </div>
        </div>

        <div class="topnav">   // Top Navbar 
           <div style="float: left; margin-left: 15px">
              <b id="userNameDisplay" style="font-weight: 100; font-size: 18px;"></b>
            </div>

        <div style="float: right; margin-right: 12px">
            <b id="timerDisplay" style="font-weight: 100">00:00</b>
        </div>

          <div style="float: right; margin-right: 22px;">   // Pause Button
              <button id="pauseButton" style="all: unset; cursor: pointer;" onclick="togglePause()">
                <img src="icons/4141_pause-button.png" width="13px" style="opacity:0.5;"></img>
              </button>
          </div>
        </div>

        <div id="pauseModal" class="modal" style="display: none; position:fixed; top: 0; left: 0;
               width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5);
        z-index: 1000; border-radius: 10px; overflow: hidden;  ">  // Pause Modal 

           <div class="modal-content" style="position:absolute; bottom:0; width: 100%;  
         max-width:455px;height: 400px;
          background: white; padding:20px; transition: bottom 0.3s;  left: 50%;
             transform: translateX(-50%);
                 text-align: center;">

                <p style="font-size: 18px; font-weight: bold; margin-bottom: 20px;">YOUR GAME IS PAUSED</p>
               <p style="font-size: 17px; margin-bottom: 2px; padding-left: 20px;  padding-right: 20px;">Take a break, and return when you're ready.</p>
                 <p style="font-size: 15px; color: grey; margin-top: 5px; margin-bottom: 25px; padding-left: 20px; padding-right: 20px;">(Don't close the window, you will lose all progress)</p>

                 <button onclick="resumeGame()" style="padding: 10px 20px; font-size: 18px; font-weight: bold;
            color: black;
            background-color: rgb(153, 218, 255);
              border: medium; border-radius: 5px;
              cursor: pointer;
                 transition: background-color 0.3s;" onmouseover="this.style.backgroundColor='#FFD800'" onmouseout="this.style.backgroundColor='#99DAFF'">RESUME</button>
             </div>

        </div>

        <div id="confetti-container"></div>
       <table id="table"></table>  // Crossword Grid 

         <div class="keysize1"> // Keyboard area 

         <div id="bruh">
                 
                  // Hints area 
                    <div id="hint-container" style="display: flex;
                  justify-content: space-between;">

                           <button id="prev-hint" onclick="scrollHint(-1)"> </button>
                                <span id="hint-text" style="font-size: 16px"></span>
                           <button id="next-hint" onclick="scrollHint(1)"> </button>
                    </div>
             <div id="keyboard">
                   // Keyboard 
                <div class="keyboard-row">
                   <button onclick="insertChar('Q')">Q</button>
                <button onclick="insertChar('W')">W</button>
                <button onclick="insertChar('E')">E</button>
                  <button onclick="insertChar('R')">R</button>
                 <button onclick="insertChar('T')">T</button>
                 <button onclick="insertChar('Y')">Y</button>
                <button onclick="insertChar('U')">U</button>
                    <button onclick="insertChar('I')">I</button>
                 <button onclick="insertChar('O')">O</button>
                  <button onclick="insertChar('P')">P</button>
                 </div>

                  <div class="keyboard-row">
                       <button onclick="insertChar('A')">A</button>
                      <button onclick="insertChar('S')">S</button>
                        <button onclick="insertChar('D')">D</button>
                    <button onclick="insertChar('F')">F</button>
                     <button onclick="insertChar('G')">G</button>
                      <button onclick="insertChar('H')">H</button>
                    <button onclick="insertChar('J')">J</button>
                 <button onclick="insertChar('K')">K</button>
                <button onclick="insertChar('L')">L</button>
              </div>
       
              <div class="keyboard-row">
                 <button onclick="insertChar('Z')">Z</button>
                 <button onclick="insertChar('X')">X</button>
                 <button onclick="insertChar('C')">C</button>
                 <button onclick="insertChar('V')">V</button>
                    <button onclick="insertChar('B')">B</button>
                  <button onclick="insertChar('N')">N</button>
               <button onclick="insertChar('M')">M</button>
             
              <button onclick="deleteChar()" style="background-color: lightgray; font-size: 23px;">
                <img src="icons/backspace-icon-2048x1714-fco8gl58.png" width="20px" />
                </button>
                   </div>
                  </div>
              </div>
        </div>
        // Congrats modal
        <div id="congratsModal" class="modal"
           style="display: none;
          position: absolute;
            bottom: 0;
              width: 100%;
               max-width: 495px;
                 height: 500px;
                   background-color: white;
                      border-radius: 10px;
                        text-align: center;
                             z-index: 1001;
                            box-shadow: rgba(0,0,0,0.2);">


      <div style="display: flex; justify-content: flex-end; padding: 10px;">
          <span id="closeButton" style="cursor: pointer; font-size: 20px;">x</span>
        </div>
  
           <div class="modal-content" style="padding: 0px 30px 30px 30px;">
              <h2>Congratulations!</h2>
               <p id="completionMessage">You have successfully completed the crossword.</p>
                <p style="color: grey; font-size: 15px;">Come back for tomorow's crossword!</p>
                 <button onclick="window.open('./leaderboard.html', '_blank');" style="background-color: #99DAFF;
                       color: black;
                 padding: 12px 20px;
                    font-size: 16px;
                border: none;
                   border-radius: 5px;
                     cursor: pointer;
                 transition: background-color 0.3s ease;" onmouseover="this.style.backgroundColor='#FFD800'" onmouseout="this.style.backgroundColor='#99DAFF'">See Leaderboard</button>
            </div>
      </div>

      <div id="minimizedCongrats"
       style="display: none; position: fixed;
                bottom: 0;
             width: 100%;
                  max-width: 475px;
                   text-align: center;
                    background-color: white;
                        padding: 10px;
                  border-top: 1px solid #ccc; z-index: 1001;">

          <span id="expandButton" style="cursor: pointer; font-size: 20px;">^</span>
      </div>

      <div id="tryAgainModal" class="modal"
               style="display: none;
             position: fixed;
            top: 50%;
          left: 50%;
    transform: translate(-50%, -50%);
            width: 100%;
              max-width: 400px;
               background-color: white;
             border-radius: 10px;
            text-align: center;
             z-index: 1001;
                  box-shadow: 0 4px 8px rgba(0,0,0,0.2);">


          <div class="modal-content" style="padding: 30px;">
          <h2>Try Again!</h2>
        <p>Your current answers are not correct. Keep trying!</p>
          <button onclick="hideTryAgainPopup()"
                style="background-color: #99DAFF; color: black;
                 padding: 12px 20px;
               font-size: 16px; border: none;
               border-radius: 5px; cursor: pointer;
                  transition: background-color 0.3s ease;" onmouseover="this.style.backgroundColor='#FFD800'" onmouseout="this.style.backgroundColor='#99DAFF'">Return to Game</button>
          </div>

       </div>
        // Overlay for Popups
        <div id="modalOverlay"
        style="display: none; position: fixed; top: 0;
          left: 0;
              width: 100%;
          height: 100%;
              background-color: rgba(0, 0, 0, 0.5); z-index: 1000;">
        </div>
      
        </body>
        </div>


      </header>
    </div>
  );
}

export default App;
