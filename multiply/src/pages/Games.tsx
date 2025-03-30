import React from 'react'
import { useNavigate } from 'react-router-dom'

const Games = () => {

    const navigate = useNavigate()

    const switchGames = (gameLink: string) => {
        navigate(`/${gameLink}`)
    }
  return (
    <div>
      <button onClick={() => switchGames("Plinko")}>Plinko</button>
    </div>
  )
}

export default Games
