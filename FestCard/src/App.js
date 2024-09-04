import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, IonIcon, IonLabel } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { homeOutline, personOutline, settingsOutline, ticketOutline } from 'ionicons/icons'; 

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
        <Route path="/" exact={true}>
          <Redirect to="/splash" />
        </Route>
        <Route path="/home" exact={true}>
          <Tabs />
        </Route>
        <Route path="/account" exact={true}>
          <Tabs />
        </Route>
        <Route path="/ticket" exact={true}>
          <Tabs />
        </Route>
        <Route path="/settings" exact={true}>
          <Tabs />
        </Route>
        <Route path="/account/add-card" exact={true}>
          <AddCard />
        </Route>
        <Route path="/add-transaction/:card_id" exact={true}>
          <AddTransaction />
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
        <Route path="/set-username" exact={true}>
          <SetUsername />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

const Tabs = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="/home" exact={true}>
          <Home />
        </Route>
        <Route path="/account" exact={true}>
          <Account />
        </Route>
        <Route path="/ticket" exact={true}>
          <Ticket />
        </Route>
        <Route path="/settings" exact={true}>
          <Settings />
        </Route>
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/home">
          <IonIcon icon={homeOutline} />
          <IonLabel>Home</IonLabel>
        </IonTabButton>
        <IonTabButton tab="ticket" href="/ticket">
          <IonIcon icon={ticketOutline} />
          <IonLabel>Ticket</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default App;
