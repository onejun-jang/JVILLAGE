import styles from './MainHeader.module.css';

export default function MainHeader({
  onScrollToAdvantage,
  onScrollToPrice,
  onScrollToLessonFlow,
  onLoginClick
}){
return (
    <div className={styles.layout}>
        <div className={styles.content}>
            <div className={styles.substance}>
                <div> 
                    <span style={{ color: 'red', fontSize: '50px', fontWeight: 700, fontStyle: 'italic' }}>J   </span>
                    <span style={{ color: 'black', fontSize: '35px' }}>Village</span>
                </div>
                <nav className={styles.navselector}>
                    <button className={styles.navbtn} onClick={onScrollToAdvantage}>紹介</button>
                    <span className={styles.slash}>/</span>
                    <button className={styles.navbtn} onClick={onScrollToPrice}>料金</button>
                    <span className={styles.slash}>/</span>
                    <button className={styles.navbtn} onClick={onScrollToLessonFlow}>レッスンの流れ </button>
                </nav>
                <button className={styles.navlogin} onClick={onLoginClick}>ログイン</button>
            </div>    
        </div>
    </div>
)};