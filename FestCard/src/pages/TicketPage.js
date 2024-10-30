import React, { useEffect, useRef } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/react';
import { useLocation } from 'react-router-dom';
import JsBarcode from 'jsbarcode';
import '../Css/TicketPage.css';
import { AccountStore } from '../data/AccountStore';

const TicketPage = () => {
  const location = useLocation();
  const { event } = location.state || {};
  const barcodeRef = useRef(null);
  const profile = AccountStore.useState(s => s.profile);

  useEffect(() => {
    if (barcodeRef.current && event) {
      // Gerar o código de barras com barras brancas e fundo #EE1F79
      const barcodeData = `${event.title}-${event.date}-${profile.id}`;
      JsBarcode(barcodeRef.current, barcodeData, {
        format: 'CODE128',
        lineColor: '#FFFFFF',  // Barras brancas
        background: '#EE1F79', // Fundo rosa para o contorno
        width: 3.5,            // Largura das barras para melhor legibilidade
        height: 100,           // Aumenta a altura das barras
        displayValue: false,
      });
    }
  }, [event, profile.id]);

  return (
    <IonPage className="ticket-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle className="ticket-header">Ingresso do Evento</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {event ? (
          <div className="ticket-card">
            <h2 className="ticket-date">{event.date}</h2>
            <div className="ticket-info">
              <div className="ticket-location">
                <p>Evento</p>
                <h3>{event.title}</h3>
                <p>Horário</p>
                <span>{event.startTime || "20:00"}</span>
              </div>
              <div className="ticket-location">
                <p>Local</p>
                <h3>{event.location || "São Paulo, Brasil"}</h3>
                <p>Chegada</p>
                <span>{event.endTime || "23:00"}</span>
              </div>
            </div>
            <div className="ticket-passenger">
              <p>Comprador:</p>
              <span>{`${profile.firstname} ${profile.surname}`}</span>
            </div>
            <div className="ticket-gate-seat">
              <div>
                <p>Setor</p>
                <span>{event.sector || "Pista Premium"}</span>
              </div>
              <div>
                <p>Assento</p>
                <span>{event.seat || "32B"}</span>
              </div>
            </div>
            <div className="ticket-barcode">
              <svg ref={barcodeRef}></svg>
            </div>
          </div>
        ) : (
          <p>Detalhes do evento não disponíveis.</p>
        )}
      </IonContent>
    </IonPage>
  );
};

export default TicketPage;
