import React, { useState, useEffect } from 'react';
import { IonContent, IonInput, IonButton, IonText } from '@ionic/react';
import { useHistory } from 'react-router-dom'; 
import { updateProfileName, AccountStore } from '../data/AccountStore';
import '../Css/SetUsername.css';

const SetUsername = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const history = useHistory(); 

  useEffect(() => {
    const profile = AccountStore.getRawState().profile;
    if (profile.isUsernameSet) {
      history.push('/home');
    }
  }, [history]);

  const handleSetUsername = () => {
    if (username.trim() === '') {
      setError('O nome de usuário não pode estar vazio.');
      return;
    }
    
    const nameParts = username.split(" ");
    const firstname = nameParts[0];
    const surname = nameParts.slice(1).join(" ");
    updateProfileName(firstname, surname);

    history.push('/home');
  };

  return (
    <IonContent className="set-username-content">
      <div className='set-username-page'>
        <img src="/icon.png" alt="Logo" className="set-username-logo" />
        <h1 className="set-username-title">Defina Seu Nome de Usuário</h1>
        <div className="set-username-container">
          <IonInput
            type="text"
            placeholder="Nome de Usuário"
            className="senha-ion-input-custom"
            clearInput
            value={username}
            onIonInput={(e) => setUsername(e.target.value)}
          />
          {error && <IonText color="danger">{error}</IonText>}
          <IonButton 
            expand="block" 
            className="confirm"
            style={{ '--background': '#EE1F79', '--color': '#fff' }}
            onClick={handleSetUsername}
          >
            Confirmar
          </IonButton>
        </div>
      </div>
    </IonContent>
  );
};

export default SetUsername;
