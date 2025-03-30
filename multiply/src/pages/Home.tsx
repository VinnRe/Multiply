import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  
    const navigate = useNavigate()

    const onClickGames = () => {
        navigate("/Games")
    }

  return (
    <div>
      <button className="text-5xl" onClick={onClickGames}>Games</button>
    </div>
  );
};

export default Home;
