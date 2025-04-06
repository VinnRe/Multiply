import { useState, useRef } from 'react';
import ChickenA1 from '../assets/chicken/sounds/Chicken_Ambient1.mp3'
import ChickenA2 from '../assets/chicken/sounds/Chicken_Ambient2.mp3'
import ChickenA3 from '../assets/chicken/sounds/Chicken_Ambient3.mp3'
import ChickenWS from '../assets/chicken/sounds/Chicken_Win.mp3'
import ChickenLS from '../assets/chicken/sounds/Chicken_Lose.mp3'
import ChickenCO from '../assets/chicken/sounds/Chicken_Cash_Out.mp3'
import ChickenW from '../assets/chicken/ChickenW.png'
import ChickenL from '../assets/chicken/ChickenL.png'
import ChickenLogo from '../assets/chicken/ChickenCross.png'
import ChickenRoad from '../assets/chicken/ChickenRoad.png'
import ChickenBG from '../assets/chicken/ChickenBG.png'
import BackButton from '../assets/back-arrow.svg'
import { useNavigate } from 'react-router-dom';

const TOTAL_COLUMNS = 10;

const Chicken = () => {
  const [currentPos, setCurrentPos] = useState(0);
  const [trapIndex, setTrapIndex] = useState(Math.floor(Math.random() * TOTAL_COLUMNS));
  const [gameOver, setGameOver] = useState(false);
  const [roundActive, setRoundActive] = useState(false);
  const [won, setWon] = useState(false);
  const currentMoneyRef = useRef(1000);
  const [money, setMoney] = useState(currentMoneyRef.current);
  const [bet, setBet] = useState<number>(0);
  const multipliers = [0, 1.1, 1.25, 1.4, 1.66, 1.95, 2.3, 2.42, 2.75, 3.1];

  const playSound = () => {
    const randomNum = Math.floor(Math.random() * 3);
    let audioSrc;
  
    switch (randomNum) {
      case 0:
        audioSrc = ChickenA1;
        break;
      case 1:
        audioSrc = ChickenA2;
        break;
      case 2:
        audioSrc = ChickenA3;
        break;
      default:
        console.error("Unexpected random number:", randomNum);
        return;
    }
  
    const moveSound = new Audio(audioSrc);
    moveSound.volume = 0.4;
    moveSound.play().catch((err) => console.error("Audio play error:", err));
  };

  const handleMove = () => {
    if (!roundActive) {
      if (bet < 20) return;
      setRoundActive(true); // Lock in the bet
      currentMoneyRef.current -= bet;
      setMoney(parseFloat(currentMoneyRef.current.toFixed(2)));
    }
  
    const nextPos = currentPos + 1;
    const winSound = new Audio(ChickenWS);
    const loseSound = new Audio(ChickenLS);
    const multi = multipliers[currentPos];
  
    if (nextPos === trapIndex) {
      setCurrentPos(nextPos);
      setGameOver(true);
      loseSound.volume = 0.4;
      loseSound.play().catch((err) => console.error("Audio play error:", err));
    } else if (nextPos >= TOTAL_COLUMNS - 1) {
      const winnings = multi * bet;
      currentMoneyRef.current += winnings;
      setMoney(parseFloat(currentMoneyRef.current.toFixed(2)))
      setCurrentPos(nextPos);
      setWon(true);
      winSound.volume = 0.4;
      winSound.play().catch((err) => console.error("Audio play error:", err));
    } else {
      setCurrentPos(nextPos);
      playSound()
    }
  };

  const handleCashOut = () => {
    const nextPos = currentPos + 1;
    const multi = multipliers[nextPos];
    const winnings = multi * bet;
    const cashOutSound = new Audio(ChickenCO);
    cashOutSound.volume = 0.4;
    cashOutSound.play().catch((err) => console.error("Audio play error: ", err))
    currentMoneyRef.current += winnings;
    setMoney(parseFloat(currentMoneyRef.current.toFixed(2)));
    resetGame();
  };  

  const resetGame = () => {
    setCurrentPos(0);
    setTrapIndex(Math.floor(Math.random() * TOTAL_COLUMNS));
    setGameOver(false);
    setWon(false);
    setRoundActive(false);
  };

  const navigate = useNavigate();

  const homeButton = () => {
    navigate("/Home")
  }
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary bg-cover bg-no-repeat bg-center font-bold" style={{ backgroundImage: `url(${ChickenBG})` }}>
      <img src={BackButton} alt="home_button" className="absolute top-4 left-4 w-15 h-15 transition-transform duration-200 hover:scale-110 drop-shadow-[0_0_5px_white] cursor-pointer" onClick={homeButton} />
      <img src={ChickenLogo} alt="chickencross_logo" className='w-150 h-50'/>
      
      {gameOver && <p className="mb-3 text-red-500 font-semibold text-3xl absolute bg-bgText p-4 rounded-2xl">💥 You hit a car! 💥</p>}
      {won && <p className="mb-3 text-green-400 font-semibold text-3xl absolute bg-bgText p-4 rounded-2xl">🎉 You crossed safely! 🎉</p>}

      <div className="grid grid-cols-10 gap-2 mb-2 bg-shadowLow p-4 mx-2 rounded-2xl">
        {Array.from({ length: TOTAL_COLUMNS }, (_, i) => (
          <div
            key={i}
            className='flex items-center justify-center'
          >
            <h1 className='text-yellowText text-2xl absolute'>{multipliers[i]}</h1>
            <img src={ChickenRoad} alt="road" className='rounded-2xl'/>
            {i === currentPos && !gameOver && (
              <img
                src={ChickenW}
                alt="Chicken"
                className="w-30 h-30 absolute"
              />
            )}
            {i === currentPos && gameOver && (
              <img
                src={ChickenL}
                alt="Chicken"
                className="w-30 h-30 absolute"
              />
            )}
          </div>
        ))}
      </div>

      <h1 className="text-white text-2xl bg-primary p-3 rounded-t-2xl">DOLLAHS: ${money}</h1>
      <div className='flex flex-row items-center bg-primary p-5 rounded-2xl gap-2'>
        <div className="flex flex-row items-center">
            <label htmlFor="betAmount" className="mr-2 text-white text-xl">Amount:</label>
            <input
              id="betAmount"
              type="number"
              value={bet}
              onChange={(e) => setBet(Math.max(0, Number(e.target.value)))}
              min="0"
              disabled={roundActive}
              className={`w-50 h-15 text-xl px-2 py-1 border-1 rounded text-white bg-primary ${roundActive ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
        </div>

        {!gameOver && !won && (
          <>
            <button
              onClick={handleMove}
              disabled={bet < 20}
              className={`px-4 py-2 text-2xl text-white rounded-md transition-all ${
                bet < 20
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-greenbtn hover:bg-greenbtnHover'
              }`}
            >
              Move Forward
            </button>
            <button
              onClick={handleCashOut}
              disabled={bet < 20 || currentPos < 1}
              className={`px-4 py-2 text-2xl text-white rounded-md transition-all ${
                bet < 20 || currentPos < 1
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-greenbtn hover:bg-greenbtnHover'
              }`}
            >
              Cash Out
            </button>
          </>
        )}

        {(gameOver || won) && (
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-redbtn hover:bg-redbtnHover text-2xl text-white rounded-md"
          >
            Restart Game
          </button>
        )}
      </div>
    </div>
  );
}

export default Chicken;