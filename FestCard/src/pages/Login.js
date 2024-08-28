import React, { useState } from 'react';
import '../Css/Login.css';
import { IonContent, IonInput, IonButton, IonIcon, IonToast } from '@ionic/react';
import { personOutline, lockClosedOutline, logoGoogle } from 'ionicons/icons';
import { auth, googleProvider } from '../data/firebase-config';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { useHistory } from 'react-router-dom';
import { AccountStore } from '../data/AccountStore';
import { Browser } from '@capacitor/browser';

const Login = () => {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      await Browser.open({ url: `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_GOOGLE_REDIRECT_URI}&response_type=token&scope=email` });

      Browser.addListener('browserFinished', async (info) => {
        const url = new URL(info.url);
        const accessToken = url.hash.split('&')[0].split('=')[1];

        const credential = GoogleAuthProvider.credential(null, accessToken);
        const result = await signInWithCredential(auth, credential);

        console.log('User signed in with Google: ', result.user);
        const profile = AccountStore.getRawState().profile;

        if (profile.isUsernameSet) {
          history.push('/home');
        } else {
          history.push('/set-username');
        }
      });
    } catch (error) {
      console.error('Error during Google sign-in:', error);
      setToastMessage('Erro ao fazer login com Google.');
      setShowToast(true);
    }
  };

  const handleEmailLogin = async () => {
    try {
      console.log('Attempting to sign in with email:', email);
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('User signed in with email: ', result.user);
      history.push('/home');
    } catch (error) {
      console.error('Error during email sign-in:', error);
      setToastMessage('Erro ao fazer login. Verifique suas credenciais.');
      setShowToast(true);
    }
  };

  const handleRegister = () => {
    history.push('/Registrar');
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
            <IonIcon icon={lockClosedOutline} slot="start"/>
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
              expand="block" 
              className="confirm"
              onClick={handleGoogleLogin}
            >
              <IonIcon icon={logoGoogle} slot="start" />
              Entrar com Google
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
