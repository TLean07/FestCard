import React, { useState } from 'react';
import { IonContent, IonInput, IonButton, IonText, IonIcon } from '@ionic/react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../data/firebase-config';
import { useHistory } from 'react-router-dom'; 
import { personOutline, lockClosedOutline } from 'ionicons/icons';
import '../Css/Registrar.css';

const Registrar = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory(); 

  const handleRegister = async () => {
    try {
      if (password.length < 8) {
        setError('A senha deve ter no mínimo 8 caracteres.');
        return;
      }
      if (password !== confirmPassword) {
        setError('As senhas não coincidem.');
        return;
      }
      
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Usuário registrado:', credential.user);
      history.push('/login');
    } catch (error) {
      console.error('Erro ao registrar:', error.message);
      setError(error.message);
    }
  };

  return (
    <IonContent className="register-content">
      <div className="register-container">
        <IonInput
          type="text"
          placeholder="Usuário"
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
          style={{ '--background': '#fafafa', '--color': '#131313' }}
          onClick={handleRegister}
        >
          Registrar
        </IonButton>
      </div>
    </IonContent>
  );
};

export default Registrar;
