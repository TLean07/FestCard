import React, { useState, useEffect } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonProgressBar } from '@ionic/react';
import { useParams } from 'react-router-dom';

const Missions = () => {
  const { eventId } = useParams();

  // Progresso da missão e FestCoins
  const [missionProgress, setMissionProgress] = useState({
    mission1: 0.7, // 70% completa
    mission2: 0.3, // 30% completa
  });
  const [festCoinsEarned, setFestCoinsEarned] = useState(0);

  // Simulação de progresso e ganho de FestCoins
  useEffect(() => {
    const interval = setInterval(() => {
      setMissionProgress(prevProgress => {
        const updatedMission1 = Math.min(prevProgress.mission1 + 0.01, 1);
        const updatedMission2 = Math.min(prevProgress.mission2 + 0.01, 1);

        // Ganhar FestCoins ao completar a missão
        if (updatedMission1 === 1 && festCoinsEarned < 50) {
          setFestCoinsEarned(festCoinsEarned + 50); // 50 FestCoins para missão 1
        }
        if (updatedMission2 === 1 && festCoinsEarned < 100) {
          setFestCoinsEarned(festCoinsEarned + 50); // 50 FestCoins para missão 2
        }

        return {
          mission1: updatedMission1,
          mission2: updatedMission2,
        };
      });
    }, 1000); // Atualiza a cada 1 segundo

    return () => clearInterval(interval);
  }, [festCoinsEarned]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Missões para o Evento {eventId}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem>
            <IonLabel>Missão 1 ({(missionProgress.mission1 * 100).toFixed(0)}%)</IonLabel>
            <IonProgressBar value={missionProgress.mission1} color={missionProgress.mission1 === 1 ? 'success' : 'primary'}></IonProgressBar>
          </IonItem>
          <IonItem>
            <IonLabel>Missão 2 ({(missionProgress.mission2 * 100).toFixed(0)}%)</IonLabel>
            <IonProgressBar value={missionProgress.mission2} color={missionProgress.mission2 === 1 ? 'success' : 'primary'}></IonProgressBar>
          </IonItem>
        </IonList>

        <IonItem>
          <IonLabel>FestCoins Obtidas: {festCoinsEarned}</IonLabel>
        </IonItem>
      </IonContent>
    </IonPage>
  );
};

export default Missions;
