import React, { useEffect, useRef } from 'react';
import { IonBackButton, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import styles from "./Account.module.css";
import { AccountStore, loadUserData, saveUserData } from '../data/AccountStore'; 
import { addOutline, logOutOutline } from 'ionicons/icons';
import { formatBalance } from '../data/Utils';
import { useHistory } from 'react-router-dom';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';

const Account = () => {
  const fileInputRef = useRef(null);
  const history = useHistory();
  const cards = AccountStore.useState(s => s.cards);
  const profile = AccountStore.useState(s => s.profile);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        loadUserData();
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleAvatarClick = () => {
    fileInputRef.current.click(); 
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newAvatarUrl = e.target.result;
        AccountStore.update(s => {
          s.profile.avatar = newAvatarUrl; 
        });
      };
      reader.readAsDataURL(file); 
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      history.push('/login');
      window.location.reload(); 
    } catch (error) {
      console.error('Erro ao deslogar:', error);
    }
  };

  const handleSaveChanges = async () => {
    try {
      await saveUserData(); 
      alert('Alterações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
      alert('Erro ao salvar alterações.');
    }
  };

  return (
    <IonPage className={styles.accountPage}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton color="dark" />
          </IonButtons>
          <IonTitle>Conta</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleLogout}>
              <IonIcon color="dark" icon={logOutOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen>
        <IonGrid>
          <IonRow className="ion-text-center ion-justify-content-center">
            <IonCol size="4" className="animate__animated animate__fadeInTopLeft animate__faster">
              <img 
                src={profile.avatar} 
                className={styles.avatar} 
                alt="account avatar" 
                onClick={handleAvatarClick} 
                style={{ cursor: 'pointer' }} 
              />
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                onChange={handleFileChange} 
                accept="image/*" 
              />
            </IonCol>
          </IonRow>

          <IonRow className={`ion-no-margin ion-text-center ion-justify-content-center ${styles.profileDetails}`}>
            <IonCol size="12">
              <h5>{`${profile.firstname} ${profile.surname}`}</h5>
              <h6>{cards.length} Cartões Atuais</h6>
            </IonCol>
          </IonRow>

          <IonRow className="ion-text-center">
            <IonCol size="12">
              <IonButton color="primary" routerLink="/account/add-card" routerDirection="forward">
                <IonIcon icon={addOutline} />Adicionar Cartão
              </IonButton>
            </IonCol>
          </IonRow>

          <div className="ion-margin-top">
            {cards.map((card, index) => (
              <IonRow key={`smallCard_${index}`} className="animate__animated animate__fadeInLeft animate__faster">
                <IonCol size="12">
                  <IonItem className={styles.cardItem} detail={false} lines="none">
                    <div className={styles.smallCard} style={{ backgroundColor: card.color }}></div>

                    <IonLabel className={`ion-text-left ${styles.cardDescription}`}>
                      <h4>{card.description}</h4>
                    </IonLabel>

                    <IonLabel className="ion-text-right">
                      <h4>{formatBalance(card.balance)}</h4>
                    </IonLabel>
                  </IonItem>
                </IonCol>
              </IonRow>
            ))}
          </div>

          <IonRow className="ion-text-center ion-margin-top">
            <IonCol size="12">
              <IonButton color="success" onClick={handleSaveChanges}>
                Salvar Alterações
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Account;
