import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import './Home.css';

const Home: React.FC = () => {

  return (
    <>
      <button className='btn'><Link to="/voice">声网</Link></button>
      <button className='btn'><Link to="/map">距离</Link></button>
      <button className='btn'><Link to="/reco">文字识别</Link></button>
    </>
  )
}

export default Home;