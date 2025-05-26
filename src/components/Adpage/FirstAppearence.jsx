import styles from './FirstAppearence.module.css';
import ingang from '../assets/images/ingang.png';


export default function MainHeader(props){
return (
<div className={styles.layout}>
    <div className={styles.content}>
        <div className={styles.substance}>
            <img src={ingang} alt="introimage" className={styles.ingang}/>
            <div className={styles.textcontent}>
                <div className={styles.lefttext}>
                    <div className={styles.redhighlight}>あ</div>
                    なたの
                </div>
                <div className={styles.righttext}>
                    <div className={styles.redhighlight}>楽</div>
                    しみに
                </div>
                <div className={styles.lefttext}>
                    <div className={styles.redhighlight}>更</div>
                    なる進化を
                </div>
            </div>
        </div>
    </div>
</div>

)};