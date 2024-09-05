import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { homeOutline, ticketOutline, calendarOutline } from 'ionicons/icons';

import Home from './pages/Home';
import Account from './pages/Account';
import AddCard from './pages/AddCard';
import Login from './pages/Login';
import Registrar from './pages/Registrar';
import SplashScreen from './components/SplashScreen';
import SetUsername from './pages/SetUsername';
import Settings from './pages/Settings';
import AddTransaction from './pages/AddTransaction';
import Ticket from './pages/tickets';
import Event from './pages/event';  
import PurchaseConfirmation from './pages/PurchaseConfirmation'; 
import Missions from './pages/Mission';
import PixDeposit from './pages/PixDeposit';
import PaymentChoice from './pages/PaymentChoice';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

const App = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet id="main">
        {/* Rotas fora do IonTabs */}
        <Route path="/" exact={true}>
          <Redirect to="/splash" />
        </Route>
        <Route path="/login" exact={true}>
          <Login />
        </Route>
        <Route path="/splash" exact={true}>
          <SplashScreen />
        </Route>
        <Route path="/registrar" exact={true}>
          <Registrar />
        </Route>
        <Route path="/settings" exact={true}>
          <Settings />
        </Route>
        <Route path="/account" exact={true}>
          <Account />
        </Route>

        <IonTabs>
          <IonRouterOutlet>
            <Route path="/home" exact={true}>
              <Home />
            </Route>
            <Route path="/ticket" exact={true}>
              <Ticket />
            </Route>
            <Route path="/events" exact={true}>
              <Event />
            </Route>
            <Route path="/purchase-confirmation" exact={true}>
              <PurchaseConfirmation />
            </Route>
            <Route path="/account/add-card" exact={true}>
              <AddCard />
            </Route>
            <Route path="/add-transaction/:card_id" exact={true}>
              <AddTransaction />
            </Route>
            <Route path="/set-username" exact={true}>
              <SetUsername />
            </Route>
            
            <Route path="/missions/:eventId" exact={true}>
              <Missions />
            </Route>

            <Route path="/pix-deposit/:cardId" exact={true}>
              <PixDeposit />
            </Route>

            <Route path="/payment-choice" exact={true}>
              <PaymentChoice />
            </Route>
            
          </IonRouterOutlet>

          <IonTabBar slot="bottom">
            <IonTabButton tab="home" href="/home">
              <IonIcon icon={homeOutline} />
              <IonLabel></IonLabel>
            </IonTabButton>

            <IonTabButton tab="ticket" href="/ticket">
              <IonIcon icon={ticketOutline} />
              <IonLabel></IonLabel>
            </IonTabButton>

            <IonTabButton tab="events" href="/events">
              <IonIcon icon={calendarOutline} />
              <IonLabel></IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;