import React from 'react';
import Crossword from '@jaredreisinger/react-crossword';

const MiniCrossword = () => {
  const data = {
    across: {
      1: {
        clue: "Cat's warning sound",
        answer: "HISS",
        row: 0,
        col: 0,
      },
      3: {
        clue: "Digital timepiece",
        answer: "CLOCK",
        row: 2,
        col: 0,
      },
    },
    down: {
      1: {
        clue: "Quick sleep",
        answer: "NAP",
        row: 0,
        col: 0,
      },
      2: {
        clue: "Ocean movement",
        answer: "TIDE",
        row: 0,
        col: 3,
      },
    },
  };

  const onCrosswordComplete = (correct) => {
    if (correct) {
      alert("Congratulations! You've completed the crossword!");
    }
  };

  return (
    <div style={{ width: '400px', margin: '0 auto' }}>
      <h2>Mini Crossword</h2>
      <Crossword 
        data={data}
        onCrosswordComplete={onCrosswordComplete}
        theme={{
          gridBackground: '#ffffff',
          cellBackground: '#ffffff',
          cellBorder: '#000000',
          textColor: '#000000',
          numberColor: '#999999',
        }}
      />
    </div>
  );
};

export default MiniCrossword;
