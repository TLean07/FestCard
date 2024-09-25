import { useEffect, useState } from "react";
import styles from "./DebitCard.module.css";

const DebitCard = (props) => {
  const { type, number, profile, expiry, secret, color } = props;
  const [lastFourCardNumbers, setLastFourCardNumbers] = useState("****");

  const cardClass = `card_${color}`;

  const cardTypeLogo = type === "Visa" ? "/visa.png" : type === "Mastercard" ? "/mastercard.png" : "/icon.png";

  useEffect(() => {
    const lastFourNumbers = number ? number.substr(number.length - 4) : "1234";
    setLastFourCardNumbers(lastFourNumbers);
  }, [number]);

  return (
    <div className={styles.card}>
      <div className={`${styles.card__front} ${styles.card__part} ${styles[cardClass]}`}>
        <img className={`${styles.card__front_chip} ${styles.card__square}`} src="/chip.png" alt="Chip" />
        <img className={`${styles.card__front_square} ${styles.card__square}`} src="/icon3.png" alt="Logo" />
        <img className={`${styles.card__front_logo} ${styles.card__logo}`} src={cardTypeLogo} alt="Card Type Logo" />
        <p className={styles.card_number}>**** **** **** {lastFourCardNumbers}</p>

        <div className={styles.card__space_75}>
          <span className={styles.card__label}>Titular do Cartão</span>
          <p className={styles.card__info}>
            {profile && profile.firstname ? profile.firstname : "Nome"}{" "}
            {profile && profile.surname ? profile.surname : "Sobrenome"}
          </p>
        </div>

        <div className={styles.card__space_25}>
          <span className={styles.card__label}>Expirar</span>
          <p className={styles.card__info}>{expiry}</p>
        </div>
      </div>

      <div className={`${styles.card__back} ${styles.card__part} ${styles[cardClass]}`}>
        <div className={styles.card__black_line}></div>
        <div className={styles.card__back_content}>
          <div className={styles.card__secret}>
            <span className={styles.card__label}>CVV</span>
            <p className={styles.card__secret__last}>{secret}</p>
          </div>

          <img className={`${styles.card__back_square} ${styles.card__square}`} src="/icon3.png" alt="Logo" />
          
          <img className={`${styles.card__back_logo} ${styles.card__logo}`} src={cardTypeLogo} alt="Card Type Logo" />
        </div>
      </div>
    </div>
  );
};

export default DebitCard;
