import React, { useState } from 'react';
import { IonContent, IonInput, IonButton, IonText, IonIcon } from '@ionic/react';
import { createUserWithEmailAndPassword, signOut, fetchSignInMethodsForEmail } from 'firebase/auth';
import { auth } from '../data/firebase-config';
import { useHistory } from 'react-router-dom'; 
import { personOutline, lockClosedOutline, arrowBackOutline } from 'ionicons/icons';
import '../Css/Registrar.css';
import { updateProfileName } from '../data/AccountStore';

const Registrar = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory(); 

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    try {
      if (!isValidEmail(email)) {
        setError('Formato de e-mail inválido.');
        return;
      }

      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length > 0) {
        setError('Este e-mail já está registrado. Por favor, faça login.');
        return;
      }

      if (password.length < 8) {
        setError('A senha deve ter no mínimo 8 caracteres.');
        return;
      }

      if (password !== confirmPassword) {
        setError('As senhas não coincidem.');
        return;
      }

      const nameParts = username.trim().split(" ");
      if (nameParts.length < 2) {
        setError('Por favor, insira o nome e o sobrenome.');
        return;
      }

      const firstname = nameParts[0];
      const surname = nameParts.slice(1).join(" ");

      const credential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Usuário registrado:', credential.user);

      updateProfileName(firstname, surname);

      await signOut(auth);

      history.push('/login');
    } catch (error) {
      console.error('Erro ao registrar:', error.message);
      setError(error.message);
    }
  };

  return (
    <IonContent className="register-content">
      <div className='register-page'>
        <div className="return-to-login">
          <IonButton fill="clear" onClick={() => history.push('/login')}>
            <IonIcon icon={arrowBackOutline} slot="start" />
            Voltar para Login
          </IonButton>
        </div>
        <img src="/icon.png" alt="Logo" className="register-logo" />
        <h1 className="register-title">Registrar</h1>
        <div className="register-container">
          <IonInput
            type="text"
            placeholder="Nome Completo"
            className="senha-ion-input-custom"
            clearInput
            value={username}
            onIonInput={(e) => setUsername(e.target.value)}
          >
            <IonIcon icon={personOutline} slot="start" />
          </IonInput>
          <IonInput
            type="email"
            placeholder="Email"
            className="senha-ion-input-custom"
            clearInput
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
            value={password}
            onIonInput={(e) => setPassword(e.target.value)}
          >
            <IonIcon icon={lockClosedOutline} slot="start" />
          </IonInput>
          <IonInput
            type="password"
            placeholder="Confirmar Senha"
            className="senha-ion-input-custom"
            clearInput
            value={confirmPassword}
            onIonInput={(e) => setConfirmPassword(e.target.value)}
          >
            <IonIcon icon={lockClosedOutline} slot="start" />
          </IonInput>
          {error && <IonText color="danger">{error}</IonText>}
          <IonButton 
            expand="block" 
            className="confirm"
            onClick={handleRegister}
          >
            Registrar
          </IonButton>
        </div>
      </div>
    </IonContent>
  );
};

export default Registrar;