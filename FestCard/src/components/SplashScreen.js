import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import '../Css/SplashScreen.css';

const SplashScreen = () => {
  const history = useHistory();

  useEffect(() => {
    const timer = setTimeout(() => {
      history.push('/login');
    }, 3000);

    return () => clearTimeout(timer); 
  }, [history]);

  return (
    <div className="splash-screen">
      <img
        src="/icon.png"
        alt="Logo"
        className="logo"
      />
      <div className='letra' data-text="FESTCARD">
      <p>FESTCARD</p>
      </div>
    </div>
  );
};

export default SplashScreen;
