import styles from './LessonFlow.module.css';


export default function LessonFlow(props){
return (
<div className={styles.layout}>
    <div className={styles.content}>
        <div style={{ height: 'clamp(100px, 5vh, 100px)' }}></div>
        <div className={styles.title}>
            レッスンの流れ
        </div>
        <div className={styles.substance}>
            <div className={styles.subtitle}>
                まずは無料体験から！
            </div>
            <div className={styles.lessonStep}>
                体験レッスン申請
            </div>
            <div className={styles.arrowDown}></div>
            <div className={styles.lessonStep}>
                体験後、ワクワク感装着！
            </div>
            <div className={styles.arrowDown}></div>
            <div className={styles.coreStep}>
                <div className={styles.lessonStep}>
                    回数券を購入
                </div>
                <div className={styles.arrowDown}></div>
                <div className={styles.lessonStep}>
                    レッスンの日時を指定
                </div>
                <div className={styles.arrowDown}></div>
                <div className={styles.lessonStepHighlight}>
                    レッスン開始！
                </div>
            </div>
            
            <div className={styles.nextStepWrapper}>
                <div className={styles.block}>
                    <div className={styles.arrowDown}></div>
                    <div className={styles.lessonNextStep}>
                    次々との成長へ
                    </div>
                </div>
                <div className={styles.rightUpArrow}>
                    ⤴
                </div> 
            </div>
        </div>
    </div> 
</div>

)};