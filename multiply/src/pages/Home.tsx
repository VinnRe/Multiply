import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from '../assets/Multiply-Logo.png'
import PlinkoLogo from '../assets/PlinkoLogo.png'
import ChickenLogo from '../assets/ChickenLogo.png'

const Home = () => {
  const navigate = useNavigate();

  const onClickPlinko = () => {
    navigate("/Plinko");
  };
  
  const onClickChicken = () => {
    navigate("/Chicken");
  };

  function PlinkoButton() {
    return (
      <button onClick={onClickPlinko} className="hover:scale-105 transition-transform">
        <img
          src={PlinkoLogo}
          alt="Plinko"
          className="w-75 h75 object-contain rounded-4xl cursor-pointer"
        />
      </button>
    );
  }
  
  function ChickenButton() {
    return (
      <button onClick={onClickChicken} className="hover:scale-105 transition-transform">
        <img
          src={ChickenLogo}
          alt="Plinko"
          className="w-75 h75 object-contain rounded-4xl cursor-pointer"
        />
      </button>
    );
  }
  

  return (
    <main className="bg-primary flex flex-col justify-center items-center min-h-screen">
      <section>
        <div>
          <img src={Logo} alt="multiply_logo" className="w-125 h-50"/>
        </div>
      </section>
      <section className="flex flex-row justify-between gap-10">
        <PlinkoButton />
        <ChickenButton />
      </section>
    </main>
  );
};

export default Home;
