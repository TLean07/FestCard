import { useRef, useState, useEffect } from 'react';
import { IonButton, IonButtons, IonContent, IonGrid, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar, useIonViewDidEnter } from '@ionic/react';
import styles from "./Home.module.css";
import { AccountStore } from '../data/AccountStore';
import CardSlide from '../components/CardSlide';
import { searchOutline, settingsOutline } from 'ionicons/icons';
import './Home.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.scss';

const Home = () => {
    const cards = AccountStore.useState(s => s.cards);
    const profile = AccountStore.useState(s => s.profile);

    const [pageTitle, setPageTitle] = useState('');
    const [mainColor, setMainColor] = useState('');
    const [slideSpace, setSlideSpace] = useState(10);
    const [darkMode, setDarkMode] = useState(false); 

    const slidesRef = useRef();

    useIonViewDidEnter(() => {
        setSlideSpace(0);
    });

    useEffect(() => {
        const checkDarkMode = () => {
            const isDarkMode = document.body.classList.contains('dark');
            setDarkMode(isDarkMode);
        };

        checkDarkMode();

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', checkDarkMode);

        return () => {
            window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', checkDarkMode);
        };
    }, []);

    const changeSlide = async e => {
        const swiper = e;
        const swiperIndex = swiper.activeIndex;

        setPageTitle(cards[swiperIndex].description);
        setMainColor(cards[swiperIndex].color);

        document.getElementById(`slide_${swiperIndex}_balance`).classList.add("animate__headShake");

        setTimeout(() => {
            document.getElementById(`slide_${swiperIndex}_balance`).classList.remove("animate__headShake");
        }, 1000);
    };

    const manageTouch = async (touched, e) => {
        const swiper = e;
        const swiperIndex = swiper.activeIndex;

        if (touched) {
            document.getElementById(`slide_${swiperIndex}_transactions`).classList.add("animate__fadeOut");
        } else {
            document.getElementById(`slide_${swiperIndex}_transactions`).classList.remove("animate__fadeOut");
            document.getElementById(`slide_${swiperIndex}_transactions`).classList.add("animate__fadeIn");
        }
    };

    return (
        <IonPage className={styles.homePage}>
            <IonHeader>
                <IonToolbar>

                    <IonButtons slot="start">
                        <IonButton routerLink="/account" className={styles.toolbarAvatar}>
                            <img alt="toolbar avatar" className={styles.toolbarAvatarImage} src={profile.avatar} />
                        </IonButton>
                    </IonButtons>

                    <IonTitle>{pageTitle}</IonTitle>

                    <IonButtons slot="end">
                        <IonButton routerLink="/settings">
                            <IonIcon icon={settingsOutline} />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                <IonGrid>
                    <Swiper spaceBetween={slideSpace} ref={slidesRef} slidesPerView={1} className={styles.cardsContainer} onTouchStart={e => manageTouch(true, e)} onTouchEnd={e => manageTouch(false, e)} onSlideChange={e => changeSlide(e)}>
                        {cards.map((card, index) => (
                            <SwiperSlide key={`slide_${index}`} id={`slide_${index}`} className={styles.customSlide}>
                                <CardSlide key={index} card={card} profile={profile} index={index} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </IonGrid>
            </IonContent>
           
        </IonPage>
    );
};

export default Home;
