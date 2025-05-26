import styles from './RecommandationSection.module.css';
import question from '../assets/images/question.png';
import frustration from '../assets/images/frustration.png';
import culture from '../assets/images/culture.png';
import afraid from '../assets/images/afraid.png';

export default function RecommandationSection(props){
return ( 
            <div className={styles.layout}>
                <div className={styles.content}>
                    <div style={{ height: 'clamp(100px, 5vh, 100px)' }}></div>
                    <div className={styles.title}>
                        こんな悩みの方におススメ！
                    </div>
                    <div className={styles.substance}>
                        <div className={styles.item}>
                            <div className={styles.itemText}>
                                <div className={styles.itemTitle}>
                                勉強の方法が分からない
                                </div>
                                <div className={styles.itemDescription}>
                                いざ勉強を始めたくても、どうやってスタートしたらいいか、より高率な方法はないかを考える生徒さんのレベルに合わせて、確実に答えられます。また、いずれ一人でも着実に勉強できるように習慣を学ばせることができます。
                                </div>
                            </div>
                            <div className={styles.itemImage}>
                            <img src={question} alt='question' className={styles.question}/>
                            </div>                        
                        </div>
                        <div className={styles.item}>
                            <div className={styles.itemImage2}>
                            <img src={frustration} alt='frustration' className={styles.frustration}/>
                            </div>  
                            <div className={styles.itemText}>
                                <div className={styles.itemTitle}>
                                勉強した内容なのに全く聞き取れない
                                </div>
                                <div className={styles.itemDescription}>
                                頑張って学習した内容なのにも関わらず実際メディアや韓国人の話が全然聞き取れてなく、挫折感を持ってしまう生徒さんにその理由を理解させ、解決策を提示します。
                                </div>
                            </div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.itemText}>
                                <div className={styles.itemTitle}>
                                勉強だけはつまらない！楽しみたい！
                                </div>
                                <div className={styles.itemDescription}>
                                単純に固い授業だけではなく、生徒さんの興味に合わせた韓国の生活や文化、トレンド等を紹介し、韓国語勉強へのモチベーションを引き上げ、いつまでも楽しく持続可能な韓国語の勉強環境を創造します。また、韓国への留学、面接など悩みの相談も是非お任せください！
                                </div>
                            </div>                        
                            <div className={styles.itemImage3}>
                            <img src={culture} alt='culture' className={styles.culture}/>
                            </div>  
                        </div>   
                        <div className={styles.item}>
                            <div className={styles.itemImage4}>
                            <img src={afraid} alt='afraid' className={styles.afraid}/>
                            </div>  
                            <div className={styles.itemText}>
                                <div className={styles.itemTitle}>
                                ネイティブと話が通じないか不安になる
                                </div>
                                <div className={styles.itemDescription}>
                                生徒さんに必要なのは不安ではなく楽しみとワクワクだけ！韓国人のネイティブ先生との授業とは言え、日本語でのコミュニケーションも全く問題ありませんので気軽くネイティブ先生との会話を楽しんでください。
                                </div>
                            </div>
                        </div>  
                    </div>               
                </div>
            </div>
)};            