import React, { useState, useEffect } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonProgressBar } from '@ionic/react';
import { useParams } from 'react-router-dom';

const Missions = () => {
  const { eventId } = useParams();

  // Exemplo de progresso para cada missão (valores de 0 a 1)
  const [missionProgress, setMissionProgress] = useState({
    mission1: 0.7, // 70% completa
    mission2: 0.3, // 30% completa
  });

  // Exemplo de atualização de progresso (simulação)
  useEffect(() => {
    const interval = setInterval(() => {
      setMissionProgress(prevProgress => ({
        mission1: Math.min(prevProgress.mission1 + 0.01, 1),
        mission2: Math.min(prevProgress.mission2 + 0.01, 1),
      }));
    }, 1000); // Atualiza a cada 1 segundo

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar
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
          <IonItem>
            <IonLabel>Missão 1 ({(missionProgress.mission1 * 100).toFixed(0)}%)</IonLabel>
            <IonProgressBar value={missionProgress.mission1} color={missionProgress.mission1 === 1 ? 'success' : 'primary'}></IonProgressBar>
          </IonItem>
          <IonItem>
            <IonLabel>Missão 2 ({(missionProgress.mission2 * 100).toFixed(0)}%)</IonLabel>
            <IonProgressBar value={missionProgress.mission2} color={missionProgress.mission2 === 1 ? 'success' : 'primary'}></IonProgressBar>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Missions;
