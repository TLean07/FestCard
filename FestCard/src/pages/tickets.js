import React, { useState, useEffect } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonSlides, IonSlide } from '@ionic/react';
import { useHistory } from 'react-router-dom';

const Ticket = () => {
  const [pageTitle, setPageTitle] = useState('Shows');
  const [mainColor, setMainColor] = useState('#292929');
  const [buttonTextColor, setButtonTextColor] = useState('#fff');
  const history = useHistory();

  useEffect(() => {
    document.documentElement.style.setProperty('--main-color', mainColor);
    document.documentElement.style.setProperty('--button-text-color', buttonTextColor);
  }, [mainColor, buttonTextColor]);

  const shows = [
    { id: 1, title: 'Rock in Rio', date: '25 de Setembro, 2024' },
    { id: 2, title: 'Lollapalooza', date: '15 de Março, 2024' },
    { id: 3, title: 'Tomorrowland', date: '10 de Julho, 2024' }
  ];

  const sports = [
    { id: 1, title: 'Final da Copa do Mundo', date: '18 de Dezembro, 2024' },
    { id: 2, title: 'Super Bowl', date: '11 de Fevereiro, 2024' },
    { id: 3, title: 'NBA Finals', date: '5 de Junho, 2024' }
  ];

  const festivals = [
    { id: 1, title: 'Oktoberfest', date: '1 de Outubro, 2024' },
    { id: 2, title: 'Carnaval do Rio', date: '20 de Fevereiro, 2024' },
    { id: 3, title: 'Festival de Cannes', date: '14 de Maio, 2024' }
  ];

  const cards = [
    { description: 'Shows', data: shows, color: '#292929', textColor: '#fff' },
    { description: 'Esportes', data: sports, color: '#699dfd', textColor: '#fff' },
    { description: 'Festivais', data: festivals, color: '#7a43df', textColor: '#fff' }
  ];

  const changeSlide = (e) => {
    const swiper = e.target.swiper;
    const swiperIndex = swiper.activeIndex;

    if (cards[swiperIndex].description !== pageTitle) {
      setPageTitle(cards[swiperIndex].description);
      setMainColor(cards[swiperIndex].color);
      setButtonTextColor(cards[swiperIndex].textColor);
    }
  };

  const handlePurchase = (item) => {
    const category = item.title.includes('Rock') ? 'show' : item.title.includes('Copa') ? 'esporte' : 'festival';
    history.push('/payment-choice', { event: { ...item, price: 100, category } });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="custom-toolbar">
          <IonTitle>{pageTitle}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonSlides onIonSlideDidChange={changeSlide} pager={true} options={{ initialSlide: 0, speed: 400 }}>
          {cards.map((category, index) => (
            <IonSlide key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {category.data.map(item => (
                <IonCard key={item.id} id={`slide_${index}_balance`} style={{ width: '90%', marginBottom: '20px' }}>
                  <IonCardHeader>
                    <IonCardTitle>{item.title}</IonCardTitle>
                    <IonCardSubtitle>{item.date}</IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent>
                    Aproveite o melhor deste {category.description.toLowerCase()} e garanta já seu ingresso!
                    <IonButton
                      expand="block"
                      className="custom-button"
                      style={{ marginTop: '10px' }}
                      onClick={() => handlePurchase(item)}
                    >
                      Comprar Ingresso
                    </IonButton>
                  </IonCardContent>
                </IonCard>
              ))}
            </IonSlide>
          ))}
        </IonSlides>
      </IonContent>
    </IonPage>
  );
};

export default Ticket;
