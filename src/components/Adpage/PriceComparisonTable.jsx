
import styles from './PriceComparisonTable.module.css';
import classNames from 'classnames';

export default function PriceComparisonTable() {
  const data = [
    {
      title: "1コマ料金",
      village: "3,000円",
      A: "5,500円",
      B: "6,600円",
      C: "約7,070円",
    },
    {
      title: ["その他手数料", "(月額)"],
      village: "0円",
      A: "2,200円",
      B: "—",
      C: "—",
    },
    {
      title: "入会費(初月)",
      village: "1,000円",
      A: "3,300円",
      B: "5,000円",
      C: "—",
    },
    {
      title: ["LINEサポート", "(質問など)"],
      village: "◯",
      A: "なし",
      B: "なし",
      C: "◯",
    },
    {
      title: "最低利用期間",
      village: "なし",
      A: "なし",
      B: "なし",
      C: "28コマ買い取り",
    },
  ];

  return (
    <div className={styles.priceTableWrapper}>
      <table className={styles.priceTable}>
        <thead>
          <tr>
            <th className={styles.rowTitle}><div className={styles.heightControll}></div></th>
            <th className={classNames(styles.highlightTitle, styles.jvillageCell)}>J VILLAGE</th>
            <th className={styles.nvillage}><div className={styles.heightControll}>A社</div></th>
            <th className={styles.nvillage}><div className={styles.heightControll}>B社</div></th>
            <th className={styles.nvillage}><div className={styles.heightControll}>C社</div></th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              <td className={styles.rowTitle}>{Array.isArray(row.title)
                ? row.title.map((line, i) => <div key={i}>{line}</div>)
                : row.title}</td>
              <td className={classNames(styles.highlightData, styles.jvillageCell)}>{row.village}</td>
              <td className={styles.nvillage}>{row.A}</td>
              <td className={styles.nvillage}>{row.B}</td>
              <td className={styles.nvillage}>{row.C}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.note}>※料金は税込表示</div>
    </div>
  );
}
