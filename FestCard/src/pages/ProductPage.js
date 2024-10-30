import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonItem, IonLabel, IonButton } from '@ionic/react';
import '../Css/ProductPage.css';

const ProductPage = () => {
  const products = [
    { name: 'Garrafa de água', price: 4 },
    { name: 'Refrigerante', price: 6 },
    { name: 'Cerveja', price: 6 },
    { name: 'Vodka', price: 7 },
    { name: 'Whisky', price: 8 },
  ];

  const calculateFestCoins = (priceInReais) => (priceInReais / 0.35).toFixed(0);

  return (
    <IonPage className="product-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle className="product-header">Produtos do Evento</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">  

        <IonCard className="product-list-card">
          <IonCardHeader>
            <IonCardTitle>PRODUTOS</IonCardTitle>
          </IonCardHeader>
          {products.map((product, index) => (
            <IonItem key={index} className="product-item">
              <IonLabel className="product-name">{product.name}</IonLabel>
              <IonLabel className="product-price">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span>R$ {product.price}</span>
                  <span>F$ {calculateFestCoins(product.price)}</span>
                </div>
              </IonLabel>
              <div className="purchase-buttons">
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <IonButton size="small" className="purchase-button-card">
                    Cartão
                  </IonButton>
                  <IonButton size="small" className="purchase-button-festcoin">
                    FestCoins
                  </IonButton>
                </div>
              </div>
            </IonItem>
          ))}
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default ProductPage;
