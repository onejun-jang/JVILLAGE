import styles from './PriceSection.module.css';


export default function PriceSection(props){
return (
            <div className={styles.layout}>
                <div className={styles.content}>
                    <div style={{ height: 'clamp(100px, 5vh, 100px)' }}></div>
                    <div className={styles.title}>
                        料金プラン
                    </div>
                    <div className={styles.substance}>
                        <div className={styles.subtitle}>
                            激安なのに高品質！
                        </div>
                        <div className={styles.catchphrase}>
                            最低継続期間・月会費は0円
                        </div>
                        <div className={styles.item}>
                            <div className={styles.itemLeft}>
                                50分 <span className={styles.redhighlight}>X 2回券 <br/>
                                6,000円</span>
                                <span className={styles.smallred}>(税込み)</span>
                            </div>
                            <div className={styles.itemRight}>
                                50分 <span className={styles.redhighlight}>X 4回券 <br/>
                                12,000円</span>
                                <span className={styles.smallred}>(税込み)</span>
                            </div>
                        </div>
                        <div className={styles.comment}>
                             * 回数券の有効期限はご購入後2ヶ月です。<br/>
                             * 有効期限以内に使用されていない回数券は消失いたします。
                        </div>
                    </div> 
                </div>
            </div>

)};            