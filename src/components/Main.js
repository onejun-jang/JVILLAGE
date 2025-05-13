import styles from './Main.module.css';
import ingang from '../picture/ingang.png';
import question from '../picture/question.png';
import frustration from '../picture/frustration.png';
import culture from '../picture/culture.png';


function Main(props) {
    return (
        <>
       <header>
      {/* 임시 로고고*/}
        <div> 
            <span style={{ color: 'red', fontSize: '50px', fontWeight: 700, fontStyle: 'italic' }}>J   </span>
            <span style={{ color: 'black', fontSize: '35px' }}>Village</span>
        </div>
        <div className={styles.navselector}>
            <button className={styles.navwelcome}>紹介</button>
            <span className={styles.slash}>/</span>
            <button className={styles.navprice}>料金</button>
            <span className={styles.slash}>/</span>
            <button className={styles.navlessonflow}>レッスンの流れ </button>
        </div>
        <button className={styles.navlogin}>ログイン</button>
       </header>



       <div>
            <div className={styles.content1}>
                <img src={ingang} className={styles.ingang}/>
                    <div className={styles.textcontent1}>
                        <div className={styles.lefttext}><a className={styles.redhighlight}>あ</a>なたの</div>
                        <div className={styles.righttext}><a className={styles.redhighlight}>楽</a>しみに</div>
                        <div className={styles.lefttext}><a className={styles.redhighlight}>更</a>なる進化を</div>
                    </div>
            </div>

            <div className={styles.blank}></div>

            <div className={styles.content2}>
                <div className={styles.container2}>
                    <div className={styles.content2title}>
                        <h2>こんな悩みの方におススメ！</h2>
                    </div>
                    <div className={styles.smallcontent21}>
                        <div className={styles.smallcontent21text}>
                            <div className={styles.smallcontent21texttitle}>
                            勉強の方法が分からない
                            </div>
                            <div className={styles.smallcontent21texttext}>
                            いざ勉強を始めたくても、どうやってスタートしたらいいか、より高率な方法はないかを考える生徒さんのレベルに合わせて、確実に答えられます。また、いずれ一人でも着実に勉強できるように習慣を学ばせることができます。
                            </div>
                        </div>
                        <div className={styles.smallcontent21image}>
                          <img src={question} className={styles.question}/>
                        </div>                        
                    </div>
                    <div className={styles.smallcontent22}>
                        <div className={styles.smallcontent22image}>
                          <img src={frustration} className={styles.frustration}/>
                        </div>  
                        <div className={styles.smallcontent22text}>
                            <div className={styles.smallcontent22texttitle}>
                            勉強した内容なのに全く聞き取れない
                            </div>
                            <div className={styles.smallcontent22texttext}>
                            頑張って学習した内容なのにも関わらず実際メディアや韓国人の話が全然聞き取れてなく、挫折感を持ってしまう生徒さんにその理由を理解させ、解決策を提示します。
                            </div>
                        </div>
                    </div>
                    <div className={styles.smallcontent23}>
                        <div className={styles.smallcontent23text}>
                            <div className={styles.smallcontent23texttitle}>
                            勉強だけはつまらない！楽しみたい！
                            </div>
                            <div className={styles.smallcontent23texttext}>
                            単純に固い授業だけではなく、韓国人の生活や文化、トレンド等を共にに紹介し、韓国語勉強へのモチベーションを引き上げ、いつまでも楽しく持続可能な韓国語の勉強環境を創造します。
                            </div>
                        </div>                        
                        <div className={styles.smallcontent23image}>
                          <img src={culture} className={styles.culture}/>
                        </div>  
                    </div>                    
                </div>
            </div>

            <div className={styles.blank}></div>

            <div className={styles.content3}>
                <div className={styles.container3}>
                    <div className={styles.content3title}>
                        <h2>料金プラン</h2>
                    </div>
                    <div className={styles.smallcontent31}>
                        <div className={styles.smallcontent31title}>
                            ネイティブ講師担当
                        </div>
                        <div className={styles.smallcontent31subtitle}>
                            最低継続期間・月会費は0円
                        </div>
                        <div className={styles.smallcontent31body}>
                            <div className={styles.smallcontent31body1}>
                                50分 <span className={styles.redhighlight2}>X 2回券 <br/>
                                6,000円</span>
                                <span className={styles.taxtext}>(税込み)</span>
                            </div>
                            <div className={styles.smallcontent31body2}>
                                50分 <span className={styles.redhighlight2}>X 4回券 <br/>
                                12,000円</span>
                                <span className={styles.taxtext}>(税込み)</span>
                            </div>
                        </div>
                        <div className={styles.smallcontent31comment}>
                             * 回数券の有効期限はご購入後2ヶ月以内です。<br/>
                             * 有効期限以内に使用されていない回数券は消失いたします。
                        </div>
                    </div> 
                </div>
            </div>            

       <button onClick={() => {
            props.setMode("SIGNIN");
       }}>asd</button>
       </div>




       </>

    );      





}

export default Main;