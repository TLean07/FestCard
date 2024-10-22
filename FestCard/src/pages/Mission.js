import React, { useState, useEffect } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonProgressBar } from '@ionic/react';
import { useParams } from 'react-router-dom';
import { AccountStore } from '../data/AccountStore';
import '../Css/Mission.css';

const Missions = () => {
  const { eventId } = useParams();

  const [missionProgress, setMissionProgress] = useState({
    mission1: 0.0,
    mission2: 0.0,
    mission3: 0.0,
  });

  const festCoins = AccountStore.useState(s => s.festCoins);

  useEffect(() => {
    const interval = setInterval(() => {
      setMissionProgress(prevProgress => {
        const updatedMission1 = Math.min(prevProgress.mission1 + 0.01, 1);
        const updatedMission2 = Math.min(prevProgress.mission2 + 0.01, 1);
        const updatedMission3 = Math.min(prevProgress.mission3 + 0.01, 1);

        if (updatedMission1 === 1 && prevProgress.mission1 < 1) {
          AccountStore.update(s => { s.festCoins += 5; });
        }
        if (updatedMission2 === 1 && prevProgress.mission2 < 1) {
          AccountStore.update(s => { s.festCoins += 5; });
        }
        if (updatedMission3 === 1 && prevProgress.mission3 < 1) {
          AccountStore.update(s => { s.festCoins += 5; });
        }

        return {
          mission1: updatedMission1,
          mission2: updatedMission2,
          mission3: updatedMission3,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Missões para o Evento {eventId}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem lines="none">
            <IonLabel><strong>Missão 1: Comprar 5 garrafas de água</strong></IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>{(missionProgress.mission1 * 100).toFixed(0)}%</IonLabel>
            <IonProgressBar value={missionProgress.mission1} color={missionProgress.mission1 === 1 ? 'success' : 'primary'}></IonProgressBar>
          </IonItem>

          <IonItem lines="none">
            <IonLabel><strong>Missão 2: Comprar 5 doces</strong></IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>{(missionProgress.mission2 * 100).toFixed(0)}%</IonLabel>
            <IonProgressBar value={missionProgress.mission2} color={missionProgress.mission2 === 1 ? 'success' : 'primary'}></IonProgressBar>
          </IonItem>

          <IonItem lines="none">
            <IonLabel><strong>Missão 3: Comprar 5 lanches naturais</strong></IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>{(missionProgress.mission3 * 100).toFixed(0)}%</IonLabel>
            <IonProgressBar value={missionProgress.mission3} color={missionProgress.mission3 === 1 ? 'success' : 'primary'}></IonProgressBar>
          </IonItem>
        </IonList>

        <IonItem>
          <IonLabel><strong>Total FestCoins:</strong> {festCoins}</IonLabel>
        </IonItem>
      </IonContent>
    </IonPage>
  );
};

export default Missions;