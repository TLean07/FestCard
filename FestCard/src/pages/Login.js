import React, { useState, useEffect } from 'react';
import { IonContent, IonInput, IonButton, IonIcon, IonToast } from '@ionic/react';
import { personOutline, lockClosedOutline, logoGoogle } from 'ionicons/icons';
import { getAuth, signInWithPopup, signInWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { useHistory } from 'react-router-dom';
import { loadUserData } from '../data/AccountStore';
import '../Css/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const history = useHistory();
  const auth = getAuth();
  const googleProvider = new GoogleAuthProvider();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        loadUserData(); 
        history.push('/home');
      }
    });

    return () => unsubscribe(); 
  }, [auth, history]);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error during Google sign-in:', error);
      setToastMessage('Erro ao fazer login com Google.');
      setShowToast(true);
    }
  };

  const handleEmailLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error during email sign-in:', error);
      setToastMessage('Erro ao fazer login. Verifique suas credenciais.');
      setShowToast(true);
    }
  };

  const handleRegister = () => {
    history.push('/registrar');
  };

  return (
    <IonContent className="login-content">
      <div className="login-page">
        <img src="/icon.png" alt="Logo" className="login-logo" />
        <h1 className="login-title">Login</h1>
        <div className="login-container">
          <IonInput
            type="email"
            placeholder="Email"
            className="senha-ion-input-custom"
            clearInput
            autocomplete="username"
            value={email}
            onIonInput={(e) => setEmail(e.target.value)}
          >
            <IonIcon icon={personOutline} slot="start" />
          </IonInput>
          <IonInput
            type="password"
            placeholder="Senha"
            className="senha-ion-input-custom"
            clearInput
            autocomplete="current-password"
            value={password}
            onIonInput={(e) => setPassword(e.target.value)}
          >
            <IonIcon icon={lockClosedOutline} slot="start" />
          </IonInput>
          <div className="button-ion-input-custom">
            <IonButton
              expand="block"
              className="confirm"
              onClick={handleEmailLogin}
            >
              Confirmar
            </IonButton>
            <IonButton 
              size="small" 
              fill="clear" 
              className="register-button"
              onClick={handleRegister}
            >
            Não tem uma conta? Registrar
            </IonButton>
          </div>
        </div>
      </div>
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={3000}
      />
    </IonContent>
  );
};

export default Login;