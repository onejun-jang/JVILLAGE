import styles from './AdvantageSection.module.css';
import PriceComparisonTable from './PriceComparisonTable.jsx';


export default function AdvantageSection(props){
return (
<div className={styles.layout}>
    <div className={styles.content}>
        <div style={{ height: 'clamp(100px, 5vh, 100px)' }}></div>
        <div className={styles.title}>
                J VILLAGEだけのメリット！
        </div>
        <div className={styles.substance}>
            <ul>
                <li>
                    <h3>実績が語るプロの指導</h3>
                    <p>ネイティブだからといって、教え方が上手いとは限りません。2000コマ以上の授業実績を持つ、韓国語教育のプロが担当します。
                    「わかる・話せる・使える」韓国語を、丁寧に教えます。
                    </p>
                </li>
                <li>
                    <h3>LINEでいつでも質問OK</h3>
                    <p>授業以外の時間でも、LINEでサポート。質問していいのかな…？そんな心配は無用です。
                    「ここ、どういう意味？」そんな小さな疑問も大歓迎です！</p>
                </li>
                <li>
                    <h3>他では真似できない、業界を揺るがす価格</h3>
                </li>
                <PriceComparisonTable />
            </ul>
        </div> 
    </div>
</div>

)};