import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonSelect, IonSelectOption, IonToggle, IonButtons, IonButton, IonIcon } from '@ionic/react';
import { useState, useEffect } from 'react';
import { arrowBackOutline } from 'ionicons/icons';
import './Home.module.css';

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
          <IonLabel>Idioma</IonLabel>
          <IonSelect value={language} onIonChange={e => setLanguage(e.detail.value)}>
            <IonSelectOption value="en">Inglês</IonSelectOption>
            <IonSelectOption value="pt">Português</IonSelectOption>
          </IonSelect>
        </IonItem>
        <IonItem>
          <IonLabel>Modo Escuro</IonLabel>
          <IonToggle checked={darkMode} onIonChange={e => setDarkMode(e.detail.checked)} />
        </IonItem>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
