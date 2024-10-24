import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonSelect, IonSelectOption, IonToggle, IonButtons, IonButton, IonIcon } from '@ionic/react';
import { useState, useEffect } from 'react';
import { arrowBackOutline } from 'ionicons/icons';
import './Home.module.css';
import '../Css/Settings.css';

const Settings = () => {
  const [language, setLanguage] = useState('en');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton routerLink="/home">
              <IonIcon icon={arrowBackOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>Configurações</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem>
          <IonLabel>Modo Escuro</IonLabel>
          <IonToggle checked={darkMode} onIonChange={e => setDarkMode(e.detail.checked)} />
        </IonItem>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
