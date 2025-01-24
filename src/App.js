import logo from './logo.svg';
import './App.css';
import React, {useRef, useEffect} from 'react';


// --- Global Variables ---
let horizontal = true;
let maxscore = 100;
let currentCellX = 0;
let currentCellY = 1;
let currentHintIndex = 0;
let directionMap = {};
let startTime;
let timerInterval;
let isPaused = false;
let pausedTime = 0;
let lastClickedCellId = null;

let dailyPuzzleIndex = 0;
const puzzles = [

  {
       correctSolution: [
            ["", "C", "C", "T", "V"],
             ["M", "A", "R", "I", "A"],
             ["A", "R", "E", "N", "T"],
            ["M", "O", "P", "E", "S"],
              ["A", "L", "E", "S", ""]
           ],
           acrossHints: [
           "Surveillance system (closed-circuit television)",
            "Lead character in “West Side Story”",
              "Contraction of 'are not'",
              "(Plural) Informal expression for a people in mildly depressed states",
                "Somewhat bitter brews, often served in pints",

           ],
            downHints: [
              "Mother, affectionately",
                "Festive song sung at Christmas",
                 "Thin pancake, often French-style",
              "Prongs on a fork or rake",
               "Video Assisted Thoracoscopic Surgery"
           ],
        cellsWithNumber : {     "i0_1": "1",
                "i0_2": "2",
                  "i0_3": "3",
               "i0_4": "4",
              "i1_0": "5",
             "i2_0": "6",
             "i3_0": "7",
              "i4_0": "8"
          }

   },
{
         correctSolution: [
            ["", "S", "L", "A", "B"],
            ["C", "H", "I", "C", "O"],
            ["L", "I", "E", "T", "O"],
            ["I", "N", "G", "O", "T"],
            ["P", "E", "E", "R", ""]
          ],
            acrossHints: [
            "Flat piece of stone or concrete, often used for paving",
            "'Boy' in Spanish",
             "Italian for 'happy'",
           "A block of metal (In minecraft: what iron ore becomes when you smelt it)",
           "Someone at the same level (At school: someone in your year)",
         ],
           downHints: [
             "Fasten securely, or a short video snippet",
            "Polish to a gleaming finish, or radiate brightness",
          "Middle ages term for my Lord or My King",
            "Performer in film, theater, or television",
            "Footwear for rugged tasks, muddy terrain or rainy days",
         ]

       ,   cellsWithNumber : {
            "i0_1": "1",
              "i0_2": "2",
                "i0_3": "3",
               "i0_4": "4",
              "i1_0": "5",
                "i2_0": "6",
                "i3_0": "7",
                "i4_0": "8"
            }
    },
      {
       correctSolution: [
            ["", "V", "I", "C", "E"],
            ["D", "E", "B", "R", "A"],
            ["O", "N", "S", "E", "T"],
            ["I", "T", "E", "M", "S"],
            ["N", "I", "N", "E", ""]
        ],
         acrossHints: [
          "Joe Biden, ____ president to Obama",
         "First name of actress Messing from 'Will & Grace'",
         "The beginning of something, often unpleasant",
           "Things on a checklist or shopping list",
           "Number of lives a cat is said to have"
         ],
           downHints: [
            "Slangy contraction of “doing,” often in casual speech",
               "Starbucks size that means “twenty” in Italian",
              "Norwegian playwright behind 'A Doll’s House'",
              "Rich dessert topping, often paired with brûlée",
            "Slang for food; Uber service",
           ],
        cellsWithNumber : {
              "i0_1": "1",
                "i0_2": "2",
                  "i0_3": "3",
               "i0_4": "4",
              "i1_0": "5",
             "i2_0": "6",
             "i3_0": "7",
              "i4_0": "8"
         }
    },

];

// --- Helper Functions ---

function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}


function showModal(modalId) {
    document.getElementById(modalId).style.display = "block";
}

function animTutorial() {
    const animState = document.getElementById("anim1").style.backgroundColor === "lightblue";
    const cells = ["anim1", "anim2", "anim3", "anim4"];

    cells.forEach(id => {
        document.getElementById(id).style.backgroundColor = animState ? "white" : "lightblue";
    });

    document.getElementById("anim5").style.backgroundColor = animState ? "lightblue" : "white";
    document.getElementById("anim6").style.backgroundColor = animState ? "lightgray" : "lightblue";
    document.getElementById("anim7").style.backgroundColor = animState ? "lightblue" : "lightgray";
}


function updateHintText() {
  const hintTextElement = document.getElementById("hint-text");

     if (horizontal) {
          hintTextElement.textContent = puzzles[dailyPuzzleIndex].acrossHints[currentCellX] || "";
      } else {
        hintTextElement.textContent = puzzles[dailyPuzzleIndex].downHints[currentCellY] || "";
      }
 }

function colorSquares() {
    //Reset colours
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            let cell = document.getElementById(`i${i}_${j}`);
             // Determine if the cell should be black based on the position
             cell.style.backgroundColor = (i === 0 && j === 0) || (i === 4 && j === 4)  ? "black" : "white";;
          }
     }

      // Highlight Current word cells and Current Selected cell
    let start, end;
     if (horizontal) {
            start = 0;
            end = 5;
          for (let i = start; i < end; i++) {
                  let cell = document.getElementById(`i${currentCellX}_${i}`);
                     if (cell && !cell.classList.contains('black-cell')) {
                       cell.style.backgroundColor = "#99DAFF";
                 }
              }
      } else {
           start = 0;
            end = 5;
                for (let i = start; i < end; i++) {
                     let cell = document.getElementById(`i${i}_${currentCellY}`);
                  if (cell && !cell.classList.contains('black-cell')) {
                 cell.style.backgroundColor = "#99DAFF";
                  }
                }
    }
            if (document.getElementById(`i${currentCellX}_${currentCellY}`) && !document.getElementById(`i${currentCellX}_${currentCellY}`).classList.contains('black-cell')) {
         document.getElementById(`i${currentCellX}_${currentCellY}`).style.backgroundColor = "#FFD800";
          }

 }

function initializeGame() {
    const table = document.getElementById("table");
    let tableHTML = "";
        for (let i = 0; i < 5; i++) {
            tableHTML += "<tr>";
             for (let j = 0; j < 5; j++) {
                    const cellId = `i${i}_${j}`;
             const isBlackCell = (i === 0 && j === 0) || (i === 4 && j === 4);

            tableHTML += `<td><div style="position:relative;">
             <input
                   autocomplete='off'
              readonly
                 onkeyup='handleKeyUp(event, ${i}, ${j})'
                onfocus='handleFocus(${i}, ${j})'
            onclick='handleCellClick(${i}, ${j})'
                    class='cell ${isBlackCell ? 'black-cell' : ''}'
                    id='${cellId}'
                 ${isBlackCell ? "disabled" : ""}
                     >
                    <span class="cell-number">${puzzles[dailyPuzzleIndex].cellsWithNumber[cellId] ? puzzles[dailyPuzzleIndex].cellsWithNumber[cellId] : ""}</span>
           </div></td>`;
       }
       tableHTML += "</tr>";
   }
   table.innerHTML = tableHTML;


    // Initial setup
    currentCellX = 0;
    currentCellY = 1;
    document.getElementById(`i${currentCellX}_${currentCellY}`).focus();
     colorSquares();
     updateHintText();
    adjustSizes();
}


function isWordFilled(direction, startX, startY) {
    if (direction === 'across') {
        for (let j = 0; j < 5; j++) {
            const cell = document.getElementById(`i${startX}_${j}`);
                if (!cell || cell.disabled || cell.value === "") return false;
            }
    } else {
        for (let i = 0; i < 5; i++) {
            const cell = document.getElementById(`i${i}_${startY}`);
            if (!cell || cell.disabled || cell.value === "") return false;
            }
      }
        return true;
  }

// --- Event Handlers ---

function handleKeyUp(event, i, j) {
    const currentCell = document.getElementById(`i${i}_${j}`);
  
     if (event.key.length === 1 && event.key.match(/[a-zA-Z]/)) {
        currentCell.value = event.key.toUpperCase();
            moveFocusToNextCell(i, j);
         } else if (event.key === "Backspace") {
          if (currentCell.value === "") {
                 moveFocusToPreviousCell(i, j);
         }
            currentCell.value = "";
           currentCell.style.color = "black";
       }else if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
                moveFocusWithArrowKeys(event.key, i, j);
     }
      colorSquares();
    updateHintText();
    if (isPuzzleFilled()) {
            checkSolution();
          }

}

function handleFocus(i, j) {
   currentCellX = i;
     currentCellY = j;
     colorSquares();
    updateHintText();
}



function handleCellClick(clickedX, clickedY) {
    const cellId = `i${clickedX}_${clickedY}`;
        const cell = document.getElementById(cellId);
    
      if (cell.disabled) return;


 if (lastClickedCellId && lastClickedCellId !== cellId) {
        const lastCell = document.getElementById(lastClickedCellId);
          if (lastCell) {
                lastCell.dataset.clickCount = "0";
                 delete directionMap[lastClickedCellId];
                }
      }

 let clickCount = parseInt(cell.dataset.clickCount) || 0;
    let cellHorizontal = directionMap[cellId] === "across";

    // First click logic
      if (clickCount === 0) {
      clickCount = 1;
         if (clickedX === 0) {
              cellHorizontal = isWordFilled('down', clickedX, clickedY);
        } else if (clickedY === 0) {
             cellHorizontal = !isWordFilled('across', clickedX, clickedY);
          } else {
            cellHorizontal = true;
        }
     } else {

            if ((clickedX === 0 || clickedY === 0) && clickCount === 1) {
                cellHorizontal = !cellHorizontal;
                   clickCount = 0;
           } else {
                  cellHorizontal = !cellHorizontal;
         }
         clickCount++;
     }


  directionMap[cellId] = cellHorizontal ? "across" : "down";
      cell.dataset.clickCount = clickCount;
          horizontal = cellHorizontal;
      lastClickedCellId = cellId;
       currentCellX = clickedX;
       currentCellY = clickedY;
      cell.focus();
    updateHintText();
     colorSquares();
 }
function insertChar(char) {
      const currentCell = document.getElementById(`i${currentCellX}_${currentCellY}`);
   if (!currentCell.disabled) {
           currentCell.value = char;
        moveFocusToNextCell(currentCellX, currentCellY);
            colorSquares();
       updateHintText();

      if (isPuzzleFilled()) {
       checkSolution();
       }

    }
 }


function deleteChar() {
    const currentCell = document.getElementById(`i${currentCellX}_${currentCellY}`);
      if (!currentCell.disabled) {
         if (currentCell.value === "") {
            moveFocusToPreviousCell(currentCellX, currentCellY);
              }
         currentCell.value = "";
           currentCell.style.color = "black";
            colorSquares();
            updateHintText();
         }
  }


function scrollHint(direction) {
        currentHintIndex = horizontal ? currentCellX : currentCellY + 5;
        currentHintIndex += direction;
    
        if (currentHintIndex < 0) {
           currentHintIndex = 9;
               horizontal = false;
       } else if (currentHintIndex > 9) {
           currentHintIndex = 0;
               horizontal = true;
     }
     if (currentHintIndex >= 5 && currentHintIndex <= 9) {
               horizontal = false;
       } else {
            horizontal = true;
      }


    if (horizontal) {
          currentCellX = currentHintIndex;
              currentCellY = 0;
          } else {
       currentCellX = 0;
          currentCellY = currentHintIndex - 5;
        }


 if (horizontal) {
           for (let tempY = 0; tempY < 5; tempY++) {
                 if (!document.getElementById(`i${currentCellX}_${tempY}`).disabled) {
                     currentCellY = tempY;
                break;
                }
        }
   } else {
     for (let tempX = 0; tempX < 5; tempX++) {
         if (!document.getElementById(`i${tempX}_${currentCellY}`).disabled) {
                currentCellX = tempX;
                    break;
              }
           }
        }

     while (document.getElementById(`i${currentCellX}_${currentCellY}`).disabled) {
           if (horizontal) {
            currentCellY++;
              if (currentCellY > 4) {
             currentCellY = 0;
             currentCellX++;
              }
           } else {
                  currentCellX++;
            if (currentCellX > 4) {
           currentCellX = 0;
            currentCellY++;
          }
           }
           if (currentCellX > 4 || currentCellY > 4) {
        currentCellX = 0;
           currentCellY = 0;
            }
      }
       colorSquares();
        updateHintText();
    document.getElementById(`i${currentCellX}_${currentCellY}`).focus();
  }



 // --- Navigation Functions ---
    function moveFocusToNextCell(i, j) {
        let nextCellFound = false;
          if (horizontal) {
               for (let newY = j + 1; newY < 5 && !nextCellFound; newY++) {
                   if (!document.getElementById(`i${i}_${newY}`).disabled) {
                currentCellX = i;
             currentCellY = newY;
            nextCellFound = true;
                   }
              }
       if (!nextCellFound) {
                   for (let newX = i + 1; newX < 5 && !nextCellFound; newX++) {
              for (let newY = 0; newY < 5 && !nextCellFound; newY++) {
                          if (!document.getElementById(`i${newX}_${newY}`).disabled) {
                      currentCellX = newX;
                      currentCellY = newY;
                    nextCellFound = true;
                  horizontal = true;
                               }
                         }
                    }
         }
   } else {
          for (let newX = i + 1; newX < 5 && !nextCellFound; newX++) {
           if (!document.getElementById(`i${newX}_${j}`).disabled) {
                     currentCellX = newX;
                  currentCellY = j;
                      nextCellFound = true;
                  }
               }
       if (!nextCellFound) {
                    for (let newY = j + 1; newY < 5 && !nextCellFound; newY++) {
                 for (let newX = 0; newX < 5 && !nextCellFound; newX++) {
                             if (!document.getElementById(`i${newX}_${newY}`).disabled) {
                          currentCellX = newX;
                           currentCellY= newY;
                  nextCellFound = true;
                    horizontal = false;
                           }
                         }
                 }
         }
       }


        if (nextCellFound) {
                document.getElementById(`i${currentCellX}_${currentCellY}`).focus();
       }
     }

function moveFocusToPreviousCell(i, j) {
        let prevCellFound = false;
            if (horizontal) {
              for (let newY = j - 1; newY >= 0 && !prevCellFound; newY--) {
                  if (!document.getElementById(`i${i}_${newY}`).disabled) {
                       currentCellX = i;
                currentCellY = newY;
                    prevCellFound = true;
                   }
                }
         } else {
          for (let newX = i - 1; newX >= 0 && !prevCellFound; newX--) {
            if (!document.getElementById(`i${newX}_${j}`).disabled) {
                      currentCellX= newX;
                  currentCellY= j;
                      prevCellFound = true;
                   }
                 }
             }


     if (prevCellFound) {
       document.getElementById(`i${currentCellX}_${currentCellY}`).focus();
       }
   }

function moveFocusWithArrowKeys(key, i, j) {
          if (key === "ArrowLeft" && currentCellY > 0) {
           currentCellY--;
        } else if (key === "ArrowRight" && currentCellY< 4) {
           currentCellY++;
         } else if (key === "ArrowUp" && currentCellX> 0) {
             currentCellX--;
        } else if (key === "ArrowDown" && currentCellX< 4) {
              currentCellX++;
           }
        while (document.getElementById(`i${currentCellX}_${currentCellY}`).disabled) {
               if (key === "ArrowLeft" && currentCellY > 0) {
                currentCellY--;
                 } else if (key === "ArrowRight" && currentCellY< 4) {
                 currentCellY++;
               } else if (key === "ArrowUp" && currentCellX> 0) {
                   currentCellX--;
                } else if (key === "ArrowDown" && currentCellX< 4) {
                currentCellX++;
            }
        }


     document.getElementById(`i${currentCellX}_${currentCellY}`).focus();
}


// --- Game Logic Functions ---

function isPuzzleFilled() {
  for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                    const cell = document.getElementById(`i${i}_${j}`);
                if (!cell.disabled && cell.value === "") {
                   return false;
            }
        }
   }
   return true;

}
function checkSolution() {
        let isCorrect = true;
      for (let i = 0; i < 5; i++) {
         for (let j = 0; j < 5; j++) {
           const cell = document.getElementById(`i${i}_${j}`);
                  if (!cell.disabled) {
                   if (cell.value !== puzzles[dailyPuzzleIndex].correctSolution[i][j]) {
                 isCorrect = false;
                   break;
                     }
                }
          }
       if (!isCorrect) break;
        }


      if (isCorrect) {
           showCongratsPopup();
             startConfetti();
              playWinSound();
           } else {
            showTryAgainPopup();
            stopConfetti();
           }
    }

    function playWinSound() {
    const winSound = document.getElementById("winSound");
     winSound.play();
}



// function handlePuzzleCompletion(isCorrect) {}


 function showCongratsPopup() {
      const completionTime = document.getElementById("timerDisplay").textContent;
          document.getElementById("completionMessage").textContent = `You have successfully completed the crossword in ${completionTime}`;
         document.getElementById("modalOverlay").style.display = "block";
             document.getElementById("congratsModal").style.display = "block";
           clearInterval(timerInterval);


           const playerName = document.getElementById("userNameDisplay").textContent;
    }


function showTryAgainPopup() {
    document.getElementById("modalOverlay").style.display = "block";
        document.getElementById("tryAgainModal").style.display = "block";
 }


function hideTryAgainPopup() {
       document.getElementById("modalOverlay").style.display = "none";
      document.getElementById("tryAgainModal").style.display = "none";

  }


//  function gotoLeaderboard() {
//     window.location.href = "leaderboard.html";
//    }


//    // --- Timer Functions ---
//     function togglePause() {
//        isPaused = !isPaused;
//       if (isPaused) {
//             clearInterval(timerInterval);
//                 pausedTime = new Date() - startTime;
//               document.getElementById("pauseModal").style.display = "flex";
//         } else {
//           resumeGame();
//      }
//   }


//  function resumeGame() {
//       document.getElementById("pauseModal").style.display = "none";
//       document.getElementById("modalOverlay").style.display = "none";
//      document.getElementById("congratsModal").style.display = "none";

//      if (isPaused) {
//              startTime = new Date() - pausedTime;
//           updateTimerDisplay();
//               timerInterval = setInterval(updateTimerDisplay, 1000);
//            isPaused = false;
//               pausedTime = 0;
//       }
//     }


 function updateTimerDisplay() {
        const currentTime = new Date();
      const elapsedTime = Math.floor((currentTime - startTime) / 1000);
      const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, "0");
          const seconds = (elapsedTime % 60).toString().padStart(2, "0");
       document.getElementById("timerDisplay").textContent = `${minutes}:${seconds}`;
    }


function startTimer() {
        startTime = isPaused ? new Date() - pausedTime : new Date();
       updateTimerDisplay();
        timerInterval = setInterval(updateTimerDisplay, 1000);
    }
function startGame() {
        const name = document.getElementById("nameInput").value;
        document.getElementById("userNameDisplay").textContent = name;
        document.getElementById("overlay").style.display = "none";
        startTimer();
    }


    function adjustSizes() {
       const windowWidth = window.innerWidth;
         const windowHeight = window.innerHeight;

     const containerWidth = Math.min(390, windowWidth * 0.9);
     const cellSize = containerWidth / 5;
     const table = document.getElementById("table");
          table.style.width = `${containerWidth}px`;
           table.style.height = `${containerWidth}px`;

       const cells = document.querySelectorAll("#table .cell");
           cells.forEach((cell) => {
            cell.style.width = `${cellSize}px`;
                cell.style.height = `${cellSize}px`;
         });
     document.getElementById("hint-container").style.width = `${containerWidth}px`;
    }

    // --- Confetti Functions ---
function startConfetti() {
    const confettiContainer = document.getElementById('confetti-container');
    const numberOfConfetti = 150;

    for (let i = 0; i < numberOfConfetti; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.animationDelay = `${Math.random() * 2}s`;
        confettiContainer.appendChild(confetti);
        const hue = Math.random() * 360;
        confetti.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
    }
}

function stopConfetti() {
    const confettiContainer = document.getElementById('confetti-container');
    confettiContainer.innerHTML = '';
}

const congratsModal = document.getElementById('congratsModal');
 const closeButton = document.getElementById('closeButton');
 const expandButton = document.getElementById('expandButton');
     const minimizedCongrats = document.getElementById('minimizedCongrats');


     closeButton.addEventListener('click', () => {
     congratsModal.style.display = 'none';
     minimizedCongrats.style.display = 'block';
     });


    expandButton.addEventListener('click', () => {
       congratsModal.style.display = 'block';
         minimizedCongrats.style.display = 'none';
  });

 function setDailyPuzzle() {
        const now = new Date();
     const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const diffInDays = Math.floor((now - startOfDay) / (1000 * 60 * 60 * 24));
    dailyPuzzleIndex = diffInDays % puzzles.length;
     }
 // --- Initialization ---
    window.onload = function () {
        setDailyPuzzle();
        setInterval(animTutorial, 2000);
         initializeGame();
         adjustSizes();
         window.addEventListener("resize", adjustSizes);
      };
   document.addEventListener("scroll", () => {
     window.scrollTo(0, 0);
  }, { passive: false });


   // --- Prevent Zooming and Scrolling ---

(function () {
 const disableZoom = () => {
        document.addEventListener("gesturestart", (e) => e.preventDefault());
    document.addEventListener("gesturechange", (e) => e.preventDefault());
   document.addEventListener("gestureend", (e) => e.preventDefault());
     document.addEventListener("keydown", (e) => {
              if ((e.ctrlKey || e.metaKey) && ["+", "-", "0"].includes(e.key)) {
                 e.preventDefault();
           }
          });
         document.addEventListener('dblclick', (e) => e.preventDefault());

        let viewportMetaTag = document.querySelector("meta[name='viewport']");
           if (!viewportMetaTag) {
             viewportMetaTag = document.createElement('meta');
             viewportMetaTag.name = 'viewport';
           document.head.appendChild(viewportMetaTag);
           }
      viewportMetaTag.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
       };


       const disableScrolling = () => {
           const preventDefault = (e) => e.preventDefault();
               window.addEventListener('wheel', preventDefault, { passive: false });
           window.addEventListener('touchmove', preventDefault, { passive: false });
     window.addEventListener('keydown', (e) => {
            const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', 'Home', 'End', ' '];
                   if (keys.includes(e.key)) {
                 e.preventDefault();
             }
           });


       document.documentElement.style.position = 'fixed';
     document.documentElement.style.overflow = 'hidden';
           document.documentElement.style.width = '100%';
          document.documentElement.style.height = '100%';


          document.body.style.position = 'fixed';
          document.body.style.overflow = 'hidden';
         document.body.style.width = '100%';
          document.body.style.height = '100%';
      document.body.style.margin = '0';
     };


        disableZoom();
          disableScrolling();
     })();


function App() {
  useEffect(() => {
    setDailyPuzzle();
    initializeGame();
    adjustSizes();
    window.addEventListener("resize", adjustSizes);
    setInterval(animTutorial, 2000);

    return () => {
      window.removeEventListener("resize", adjustSizes);
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
              //<p id="crosswordDate" style={{marginTop: '5px', marginBottom: '35px', color: 'grey', fontSize: '16px', textAlign: 'center'}}></p>
              <label style={{fontWeight: 'normal', marginBottom: '10px'}} htmlFor="nameInput">Enter your name:</label>
              <input style={{marginBottom: '10px'}} type="text" id="nameInput" /><br />
              <button onClick={startGame()} style={{fontWeight: 'bold', marginBottom: '25px'}}>Start Crossword</button>
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

          {/* <div style="float: right; margin-right: 22px;">   // Pause Button
              //<button id="pauseButton" style="all: unset; cursor: pointer;" onclick="togglePause()">
              //  <img src="icons/4141_pause-button.png" width="13px" style="opacity:0.5;"></img>
              // </button>
          </div> */}
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

                 {/* <button onclick="resumeGame()" style="padding: 10px 20px; font-size: 18px; font-weight: bold;
            color: black;
            background-color: rgb(153, 218, 255);
              border: medium; border-radius: 5px;
              cursor: pointer;
                 transition: background-color 0.3s;" onmouseover="this.style.backgroundColor='#FFD800'" onmouseout="this.style.backgroundColor='#99DAFF'">RESUME</button> */}
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
