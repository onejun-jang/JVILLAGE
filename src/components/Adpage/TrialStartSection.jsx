import styles from './TrialStartSection.module.css';

export default function TrialStartSection({onLoginClick}){
return (
         <div className={styles.layout}>
            <div className={styles.content}>
                <div className={styles.substance}>
                    <div className={styles.item}>
                        <div className={styles.itemText}>小さな勇気で更なる世界に!会員登録時初回レッスン無料！</div>
                        <button className={styles.TrialStartBtn} onClick={onLoginClick}>新規体験へ</button>                 
                    </div>
                </div>               
            </div>
        </div>
)};    