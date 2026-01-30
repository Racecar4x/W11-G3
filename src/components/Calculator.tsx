import React, { useState } from 'react';

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');

  const buttons = [
    '%', 'CE', 'C', '⌫',
    '1/x', 'x²', '√x', '÷',
    '7', '8', '9', '×',
    '4', '5', '6', '-',
    '1', '2', '3', '+',
    '+/-', '0', '.', '='
  ];

  return (
    <div className="flex flex-col h-full bg-[#f3f3f3] p-1">
      <div className="flex-1 flex flex-col justify-end items-end p-4">
        <div className="text-4xl font-semibold mb-2">{display}</div>
      </div>
      <div className="grid grid-cols-4 gap-[2px]">
        {buttons.map((btn) => (
          <button
            key={btn}
            className={`
              h-12 flex items-center justify-center rounded transition-colors text-sm
              ${btn === '=' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white hover:bg-gray-100'}
              ${['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '+/-', '.'].includes(btn) ? 'font-semibold' : 'bg-gray-50/50'}
            `}
            onClick={() => {
              if (btn === 'C' || btn === 'CE') setDisplay('0');
              else if (!isNaN(Number(btn))) setDisplay(display === '0' ? btn : display + btn);
            }}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calculator;
