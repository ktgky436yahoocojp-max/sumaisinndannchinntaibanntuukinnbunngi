import { useState } from "react";

const LINE_URL = "https://line.me/R/ti/p/@148cciyn";
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;700;800&family=Yomogi&display=swap');* { box-sizing:border-box; margin:0; padding:0; }`;

// ============================================================
// 5カテゴリ×6問＝30問
// ============================================================
const CONFIG = {
  titleEmoji:"🏠",
  title:"賃貸\n住まう力診断",
  subtitle:"5分野30問で「このまま住み続けられるか」\nを診断します",
  accent:"#7c3aed",
  accentDark:"#5b21b6",
  accentBg:"#f5f3ff",
  accentBorder:"#c4b5fd",
  grad:"linear-gradient(135deg,#7c3aed,#db2777)",
  wrapBg:"linear-gradient(160deg,#f5f3ff 0%,#fdf2f8 100%)",
  categoryList:[
    ["💴","家賃・家計の持続力","6問"],
    ["📋","契約・権利の安定性","6問"],
    ["🏠","物件・設備の状態","6問"],
    ["🧑","住み続ける力","6問"],
    ["🏘️","地域・住み替え力","6問"],
  ],
  categoryComments:{
    "家賃・家計の持続力":{
      high:"家賃・家計の持続力は高い状態です。引き続き計画的な管理を続けましょう。",
      middle:"家賃・家計に一部懸念があります。収支の見直しと備えの強化をおすすめします。",
      low:"家賃・家計の持続に深刻なリスクがあります。早急に家計改善と住み替えを検討してください。",
    },
    "契約・権利の安定性":{
      high:"契約・権利の状況は安定しています。",
      middle:"契約内容に一部不安があります。更新条件や立退きリスクの確認をおすすめします。",
      low:"契約・権利に深刻なリスクがあります。専門家（弁護士・相談窓口）への相談を検討してください。",
    },
    "物件・設備の状態":{
      high:"物件・設備の状態は良好です。",
      middle:"物件・設備に一部老朽化が見られます。大家への修繕依頼を検討しましょう。",
      low:"物件・設備に深刻な問題があります。住み替えも含めた対策を早急に検討してください。",
    },
    "住み続ける力":{
      high:"住み続ける力は高い状態です。",
      middle:"住み続ける力に一部不安があります。早めに支援体制を検討しましょう。",
      low:"住み続ける力に深刻なリスクがあります。地域包括支援センターや福祉サービスへの相談をおすすめします。",
    },
    "地域・住み替え力":{
      high:"地域環境・住み替え力は良好です。",
      middle:"地域環境や住み替えに一部懸念があります。転居先の選択肢を広げておきましょう。",
      low:"地域環境・住み替えに深刻なリスクがあります。専門家とともに住み替え計画を立てることをおすすめします。",
    },
  },
  getRisk:(s,m)=>{
    const pct = m>0?(s/m)*100:0;
    const levels = [
      {min:75,label:"持続力：高い",color:"#16a34a",bg:"#f0fdf4",border:"#86efac",emoji:"🟢",desc:"現時点では大きなリスクは見当たりません。引き続き定期的な確認を続けましょう。"},
      {min:50,label:"持続力：普通",color:"#d97706",bg:"#fefce8",border:"#fcd34d",emoji:"🟡",desc:"いくつか気になる点があります。早めに対策を検討しましょう。"},
      {min:25,label:"持続力：要改善",color:"#ea580c",bg:"#fff7ed",border:"#fdba74",emoji:"🟠",desc:"複数のリスク要因があります。早めに点検・対策を検討してください。"},
      {min:0, label:"持続力：危険", color:"#dc2626",bg:"#fef2f2",border:"#fca5a5",emoji:"🔴",desc:"深刻なリスクの可能性があります。専門家への相談を早急に受けることをおすすめします。"},
    ];
    return levels.find(l=>pct>=l.min);
  },
  questions:[
    // ── 家賃・家計の持続力
    {id:1,category:"家賃・家計の持続力",emoji:"💴",
      text:"家賃は手取り月収の何割ですか？",
      hint:"家賃は手取りの25〜30%以内が安全ライン。30%超は家計を圧迫します。",
      options:[{label:"25%未満",score:2},{label:"25〜35%",score:1},{label:"35%超・わからない",score:0}]},
    {id:2,category:"家賃・家計の持続力",emoji:"📉",
      text:"収入が減少・不安定になった場合でも家賃を払い続けられますか？",
      hint:"収入減少時のシミュレーションは重要なリスク管理です。",
      options:[{label:"余裕がある",score:2},{label:"なんとかなると思う",score:1},{label:"厳しくなる可能性が高い",score:0}]},
    {id:3,category:"家賃・家計の持続力",emoji:"🏦",
      text:"半年分以上の生活費を緊急予備資金として確保していますか？",
      hint:"緊急予備資金がないと、収入減や突発的な出費で家賃が払えなくなるリスクがあります。",
      options:[{label:"6ヶ月分以上確保している",score:2},{label:"3〜6ヶ月分程度",score:1},{label:"3ヶ月未満・ほぼない",score:0}]},
    {id:4,category:"家賃・家計の持続力",emoji:"👴",
      text:"年金収入だけになった場合、今の家賃を払い続けられますか？",
      hint:"老後は収入が大幅に減ります。年金額と家賃のバランスを試算しておくことが重要です。",
      options:[{label:"試算済み・払える見通し",score:2},{label:"漠然と大丈夫だと思う",score:1},{label:"払えなくなる可能性が高い",score:0}]},
    {id:5,category:"家賃・家計の持続力",emoji:"💡",
      text:"固定費（家賃・光熱費・通信費など）の総額を把握していますか？",
      hint:"固定費の把握は家計管理の基本。見直しで毎月数千円〜数万円の節約につながることも。",
      options:[{label:"すべて把握・管理している",score:2},{label:"おおよそ把握している",score:1},{label:"把握していない",score:0}]},
    {id:6,category:"家賃・家計の持続力",emoji:"🔄",
      text:"家賃の値上げや更新料が発生した場合、対応できますか？",
      hint:"更新料・礼金・引越し費用など、賃貸には定期的な出費が発生します。",
      options:[{label:"余裕がある",score:2},{label:"なんとかなる",score:1},{label:"厳しい・備えていない",score:0}]},

    // ── 契約・権利の安定性
    {id:7,category:"契約・権利の安定性",emoji:"📋",
      text:"現在の賃貸契約の種類を把握していますか？",
      hint:"普通借家契約と定期借家契約では更新・立退きのリスクが大きく異なります。",
      options:[{label:"普通借家契約（把握済み）",score:2},{label:"定期借家契約（把握済み）",score:1},{label:"わからない",score:0}]},
    {id:8,category:"契約・権利の安定性",emoji:"📅",
      text:"次の契約更新まで何年ありますか？",
      hint:"更新時に条件変更・立退き要求が起こる場合があります。早めの準備が重要です。",
      options:[{label:"2年以上",score:2},{label:"1〜2年",score:1},{label:"1年以内・わからない",score:0}]},
    {id:9,category:"契約・権利の安定性",emoji:"🏢",
      text:"建物の老朽化による建替え・取り壊しのリスクを感じますか？",
      hint:"築古物件は建替えを理由とした立退き要求のリスクがあります。",
      options:[{label:"まったく感じない",score:2},{label:"少し気になる",score:1},{label:"明らかにリスクがある",score:0}]},
    {id:10,category:"契約・権利の安定性",emoji:"👤",
      text:"大家や管理会社との関係は良好ですか？",
      hint:"良好な関係は更新時の交渉や修繕依頼をスムーズにします。",
      options:[{label:"良好",score:2},{label:"普通・接点が少ない",score:1},{label:"トラブルがある",score:0}]},
    {id:11,category:"契約・権利の安定性",emoji:"📜",
      text:"賃貸借契約書の内容（禁止事項・特約など）を把握していますか？",
      hint:"ペット・楽器・DIY禁止など特約の見落としがトラブルの原因になります。",
      options:[{label:"内容を把握している",score:2},{label:"おおよそ把握している",score:1},{label:"ほとんど把握していない",score:0}]},
    {id:12,category:"契約・権利の安定性",emoji:"🔑",
      text:"連帯保証人・家賃保証会社の状況は問題ありませんか？",
      hint:"高齢になると保証人が見つかりにくく、保証会社の審査も厳しくなる場合があります。",
      options:[{label:"問題ない",score:2},{label:"一部不安がある",score:1},{label:"保証人がいない・審査が不安",score:0}]},

    // ── 物件・設備の状態
    {id:13,category:"物件・設備の状態",emoji:"🏠",
      text:"建物の築年数はどのくらいですか？",
      hint:"築古物件は設備の老朽化・耐震性・建替えリスクが高まります。",
      options:[{label:"築20年未満",score:2},{label:"築20〜35年",score:1},{label:"築35年以上・わからない",score:0}]},
    {id:14,category:"物件・設備の状態",emoji:"🚿",
      text:"給排水設備（水回り）に問題はありますか？",
      hint:"水漏れ・錆・詰まりなどは大家への修繕請求が可能です。放置は健康リスクにもなります。",
      options:[{label:"問題ない",score:2},{label:"少し気になる点がある",score:1},{label:"明らかな問題がある",score:0}]},
    {id:15,category:"物件・設備の状態",emoji:"❄️",
      text:"エアコン・給湯器などの設備は正常に動いていますか？",
      hint:"設備の故障は大家負担で修繕を依頼できます。不具合は早めに報告を。",
      options:[{label:"すべて正常",score:2},{label:"一部不具合がある",score:1},{label:"故障・修繕されていない",score:0}]},
    {id:16,category:"物件・設備の状態",emoji:"🪟",
      text:"断熱性・防音性は生活に支障がない水準ですか？",
      hint:"断熱・防音が不十分だと光熱費の増加・健康リスク・ストレスにつながります。",
      options:[{label:"問題ない",score:2},{label:"やや不満がある",score:1},{label:"生活に支障がある",score:0}]},
    {id:17,category:"物件・設備の状態",emoji:"🪜",
      text:"段差・手すり・エレベーターなどのバリアフリー状況はどうですか？",
      hint:"高齢化・身体機能低下に伴い、バリアフリーでない住まいは住み続けるリスクになります。",
      options:[{label:"バリアフリー対応・問題なし",score:2},{label:"一部不安がある",score:1},{label:"段差が多い・エレベーターなし",score:0}]},
    {id:18,category:"物件・設備の状態",emoji:"🔒",
      text:"防犯設備（鍵・オートロック・防犯カメラなど）は十分ですか？",
      hint:"防犯設備は安全な住環境の基本。不十分な場合は大家への改善要請も可能です。",
      options:[{label:"十分に整っている",score:2},{label:"やや不安がある",score:1},{label:"防犯上の問題がある",score:0}]},

    // ── 住み続ける力
    {id:19,category:"住み続ける力",emoji:"🚶",
      text:"日常生活の動作（階段・買い物・通院など）を一人でできていますか？",
      hint:"身体機能の低下は住み続けるための重要なリスク因子です。",
      options:[{label:"一人で問題なくできる",score:2},{label:"やや不安がある",score:1},{label:"介助が必要な場面がある",score:0}]},
    {id:20,category:"住み続ける力",emoji:"🧠",
      text:"金銭管理・手続き（家賃振込・更新手続きなど）を自分でできていますか？",
      hint:"認知機能の低下は家賃滞納・契約更新の失敗などにつながるリスクがあります。",
      options:[{label:"問題なくできている",score:2},{label:"少し不安がある",score:1},{label:"管理が難しくなってきた",score:0}]},
    {id:21,category:"住み続ける力",emoji:"👥",
      text:"緊急時に頼れる家族・知人が近くにいますか？",
      hint:"賃貸では高齢者の孤独死・孤立が深刻なリスクです。緊急時の連絡体制が重要です。",
      options:[{label:"複数いる",score:2},{label:"1人はいる",score:1},{label:"いない・遠方",score:0}]},
    {id:22,category:"住み続ける力",emoji:"📋",
      text:"高齢・障害があっても住み続けられる環境を整えていますか？",
      hint:"バリアフリー・見守りサービス・ヘルパーなど、早めの準備が将来の選択肢を広げます。",
      options:[{label:"整えている・検討済み",score:2},{label:"これから考えたい",score:1},{label:"まったく考えていない",score:0}]},
    {id:23,category:"住み続ける力",emoji:"🏥",
      text:"かかりつけ医・介護サービスとの関係を作っていますか？",
      hint:"定期受診・介護サービスのネットワークは、高齢期の住み続ける力を支えます。",
      options:[{label:"かかりつけ医がいる・定期受診している",score:2},{label:"病院はあるが定期的でない",score:1},{label:"かかりつけ医がいない",score:0}]},
    {id:24,category:"住み続ける力",emoji:"🔑",
      text:"将来、賃貸審査が通らなくなるリスクを考えていますか？",
      hint:"高齢・無職・保証人なしになると賃貸審査が厳しくなります。早めの対策が重要です。",
      options:[{label:"考えており対策している",score:2},{label:"なんとかなると思っている",score:1},{label:"考えていない",score:0}]},

    // ── 地域・住み替え力
    {id:25,category:"地域・住み替え力",emoji:"🛒",
      text:"徒歩圏内にスーパー・病院はありますか？",
      hint:"車なし生活・高齢化後も歩いて生活できる環境かどうかを確認しましょう。",
      options:[{label:"徒歩10分以内にある",score:2},{label:"車で5〜10分程度",score:1},{label:"車で15分以上・ない",score:0}]},
    {id:26,category:"地域・住み替え力",emoji:"🚌",
      text:"公共交通機関（バス・電車）は利用しやすいですか？",
      hint:"免許返納後も生活できる交通環境かどうかを今のうちに確認しておくことが重要です。",
      options:[{label:"徒歩圏内・本数も十分",score:2},{label:"あるが本数が少ない",score:1},{label:"ない・廃線・廃バスになった",score:0}]},
    {id:27,category:"地域・住み替え力",emoji:"📉",
      text:"地域の人口・商店は維持されていますか？",
      hint:"地域が衰退すると生活の質が低下し、やむを得ない住み替えを迫られる場合があります。",
      options:[{label:"維持・発展している",score:2},{label:"やや減少している",score:1},{label:"明らかに衰退している",score:0}]},
    {id:28,category:"地域・住み替え力",emoji:"🏠",
      text:"もし引越しが必要になった場合、次の住まいを確保できる見通しがありますか？",
      hint:"高齢・障害・低収入の場合、賃貸審査が通りにくくなります。URや公営住宅も選択肢に。",
      options:[{label:"見通しがある・準備している",score:2},{label:"なんとかなると思う",score:1},{label:"見通しが立たない",score:0}]},
    {id:29,category:"地域・住み替え力",emoji:"🏛️",
      text:"地域の高齢者向け住宅（サービス付き高齢者向け住宅・公営住宅など）を把握していますか？",
      hint:"将来の住み替え先として、サ高住・公営住宅・URを知っておくと選択肢が広がります。",
      options:[{label:"把握している・検討している",score:2},{label:"名前は知っている",score:1},{label:"まったく知らない",score:0}]},
    {id:30,category:"地域・住み替え力",emoji:"🤝",
      text:"住み替えの相談ができる専門家・窓口を知っていますか？",
      hint:"不動産会社・地域包括支援センター・居住支援法人など、相談窓口を知っておくと安心です。",
      options:[{label:"知っている・相談したことがある",score:2},{label:"なんとなく知っている",score:1},{label:"まったく知らない",score:0}]},

  // ── 通勤・立地の利便性（現役世代用）
  {id:31,category:"通勤・立地の利便性",emoji:"🚃",text:"職場までの通勤時間はどのくらいですか？",hint:"通勤時間が長いと生活の質・疲労・コストに影響します。片道45分以内が目安。",options:[{label:"片道30分以内",score:2},{label:"片道30〜60分",score:1},{label:"片道60分以上",score:0}]},
  {id:32,category:"通勤・立地の利便性",emoji:"💴",text:"通勤交通費は会社から全額支給されていますか？",hint:"自腹の交通費は家計を圧迫します。月1〜3万円の差になることも。",options:[{label:"全額支給",score:2},{label:"一部支給",score:1},{label:"自腹・支給なし",score:0}]},
  {id:33,category:"通勤・立地の利便性",emoji:"🏠",text:"転勤や異動の可能性はありますか？",hint:"転勤リスクが高い場合、長期の賃貸契約や家賃の高い物件は避けた方が安全です。",options:[{label:"転勤なし・可能性低い",score:2},{label:"数年に一度の可能性がある",score:1},{label:"転勤が多い・頻繁に異動がある",score:0}]},
  {id:34,category:"通勤・立地の利便性",emoji:"🚌",text:"最寄り駅・バス停まで徒歩何分ですか？",hint:"徒歩10分以内の物件は利便性・資産価値（住み替え時の競争力）が高い傾向があります。",options:[{label:"徒歩5分以内",score:2},{label:"徒歩5〜15分",score:1},{label:"徒歩15分以上・車が必要",score:0}]},
  {id:35,category:"通勤・立地の利便性",emoji:"⏰",text:"残業・早出が多い場合でも通勤できる環境ですか？",hint:"深夜帰宅や早朝出勤が多い場合、終電・始発の時刻と物件の距離を確認することが重要です。",options:[{label:"問題ない",score:2},{label:"やや不便を感じる",score:1},{label:"終電・始発が課題になっている",score:0}]},
  {id:36,category:"通勤・立地の利便性",emoji:"📍",text:"今の住まいは職場との距離感として満足していますか？",hint:"通勤ストレスは仕事のパフォーマンスや生活満足度に大きく影響します。",options:[{label:"満足している",score:2},{label:"やや不満がある",score:1},{label:"通勤が大きな負担になっている",score:0}]},
  ],
};

function getSubType(worstCat) {
  const MAP = {
    "家賃・家計の持続力": {emoji:"💸", name:"家賃圧迫型"},
    "契約・権利の安定性": {emoji:"📜", name:"契約不安定型"},
    "物件・設備の状態":   {emoji:"🏚️", name:"物件老朽型"},
    "住み続ける力":       {emoji:"🪜", name:"生活継続困難型"},
    "地域・住み替え力":   {emoji:"🚨", name:"住み替え困難型"},
    "通勤・立地の利便性": {emoji:"🚃", name:"通勤負担型"},
  };
  return MAP[worstCat] || {emoji:"⚠️", name:"複合リスク型"};
}

function getLineType(score, totalMax) {
  const pct = totalMax>0?(score/totalMax)*100:0;
  if (pct>=75) return "Aタイプ";
  if (pct>=50) return "Bタイプ";
  if (pct>=25) return "Cタイプ";
  return "Dタイプ";
}

function getPercentile(score, totalMax) {
  const pct = totalMax>0?(score/totalMax)*100:0;
  if (pct>=75) return "上位20%";
  if (pct>=50) return "上位50%";
  if (pct>=25) return "上位75%";
  return "下位25%";
}

function calcSumaiAge(score, totalMax) {
  const pct = totalMax>0?score/totalMax:0;
  return Math.round(85-pct*65);
}

function ScoreBar({pct}) {
  const color = pct>=75?"#4ade80":pct>=50?"#facc15":pct>=25?"#fb923c":"#f87171";
  return <div style={{height:10,background:"#e5e7eb",borderRadius:99,overflow:"hidden",marginTop:6}}><div style={{height:"100%",width:`${pct}%`,background:color,borderRadius:99,transition:"width 0.8s"}}/></div>;
}

function ProgressBar({cur,total,grad}) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12,width:"100%",maxWidth:540}}>
      <div style={{flex:1,height:8,background:"#e5e7eb",borderRadius:99,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${(cur/total)*100}%`,background:grad,borderRadius:99,transition:"width 0.4s"}}/>
      </div>
      <span style={{fontSize:13,color:"#6b7280",whiteSpace:"nowrap",fontFamily:"'M PLUS Rounded 1c',sans-serif"}}>{cur} / {total}</span>
    </div>
  );
}

export default function App() {
  const {questions,accent,accentDark,accentBg,accentBorder,grad,wrapBg,titleEmoji,title,subtitle,categoryList} = CONFIG;
  const TOTAL_MAX = activeQuestions.reduce((acc,q)=>acc+Math.max(...q.options.map(o=>o.score)),0);
  const CATEGORIES = [...new Set(activeQuestions.map(q=>q.category))];

  const [generation, setGeneration] = useState(null); // "worker" or "pension"
  const [screen,setScreen] = useState("gen"); // 最初は世代選択
  const [cur,setCur] = useState(0);
  const [answers,setAnswers] = useState({});
  const [flash,setFlash] = useState(null);
  const [hint,setHint] = useState(false);

  // 世代に応じて質問セットを切り替え
  const activeQuestions = generation === "worker"
    ? CONFIG.questions  // 全36問（通勤含む）
    : CONFIG.questions.filter(q => q.category !== "通勤・立地の利便性"); // 30問（通勤除外）

  const q = activeQuestions[cur];
  const totalScore = Object.values(answers).reduce((a,b)=>a+b,0);
  const risk = CONFIG.getRisk(totalScore,TOTAL_MAX);

  function handleSelect(idx,score) {
    if (flash!==null) return;
    setFlash(idx);
    setTimeout(()=>{
      const newAns={...answers,[q.id]:score};
      setAnswers(newAns);
      setFlash(null);
      setHint(false);
      if (cur+1<activeQuestions.length) setCur(cur+1);
      else setScreen("result");
    },380);
  }

  function restart(){setScreen("gen");setGeneration(null);setCur(0);setAnswers({});setFlash(null);setHint(false);window.scrollTo({top:0});}

  const wrap={minHeight:"100vh",background:wrapBg,fontFamily:"'M PLUS Rounded 1c',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",padding:"20px 16px 60px"};
  const card={width:"100%",maxWidth:540,background:"#fff",borderRadius:24,border:`2.5px solid ${accentBorder}`,boxShadow:`4px 6px 0px ${accentBorder}`,padding:"28px 24px"};

  // ── TOP
  // ── 世代選択画面
  if (screen==="gen") return (
    <div style={{...wrap}}><style>{FONTS}</style>
      <div style={{width:"100%",maxWidth:540}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{display:"inline-block",position:"relative",marginBottom:18}}>
            <div style={{background:"#fff",border:`2.5px solid ${accentBorder}`,borderRadius:20,padding:"6px 22px",fontSize:20,fontWeight:900,color:accent,fontFamily:"'Yomogi',cursive",boxShadow:"2px 3px 0px #ddd6fe"}}>ここに</div>
            <div style={{position:"absolute",bottom:-12,left:"50%",transform:"translateX(-50%)",width:0,height:0,borderLeft:"10px solid transparent",borderRight:"10px solid transparent",borderTop:`12px solid ${accent}`}}/>
          </div>
          <div style={{fontSize:52,marginTop:14,marginBottom:8}}>🏠</div>
          <h1 style={{fontFamily:"'Yomogi',cursive",fontSize:24,color:accent,lineHeight:1.4,marginBottom:4}}>賃貸住まう力診断</h1>
          <div style={{textAlign:"right",marginBottom:8}}><span style={{fontSize:10,color:"#9ca3af"}}>マンション管理士監修</span></div>
          <p style={{fontSize:14,color:"#9ca3af",lineHeight:1.7,marginBottom:16}}>まず、あなたの状況を教えてください</p>
        </div>
        <div style={card}>
          <div style={{fontSize:14,fontWeight:700,color:"#374151",textAlign:"center",marginBottom:16}}>現在の生活スタイルは？</div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <button onClick={()=>{setGeneration("worker");setScreen("top");}}
              style={{display:"flex",alignItems:"center",gap:14,padding:"18px 16px",background:accentBg,border:`2.5px solid ${accentBorder}`,borderRadius:16,cursor:"pointer",textAlign:"left"}}>
              <span style={{fontSize:32}}>💼</span>
              <div>
                <div style={{fontSize:16,fontWeight:800,color:"#374151"}}>現役世代（働いている）</div>
                <div style={{fontSize:12,color:"#9ca3af"}}>通勤・転勤リスクを含む36問で診断</div>
              </div>
              <span style={{marginLeft:"auto",fontSize:18,color:accent}}>›</span>
            </button>
            <button onClick={()=>{setGeneration("pension");setScreen("top");}}
              style={{display:"flex",alignItems:"center",gap:14,padding:"18px 16px",background:"#f0fdf4",border:"2.5px solid #a7f3d0",borderRadius:16,cursor:"pointer",textAlign:"left"}}>
              <span style={{fontSize:32}}>🏠</span>
              <div>
                <div style={{fontSize:16,fontWeight:800,color:"#374151"}}>年金・退職後</div>
                <div style={{fontSize:12,color:"#9ca3af"}}>通勤を除く30問で診断・老後リスクを重点確認</div>
              </div>
              <span style={{marginLeft:"auto",fontSize:18,color:"#10b981"}}>›</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (screen==="top") return (
    <div style={wrap}><style>{FONTS}</style>
      <div style={{width:"100%",maxWidth:540}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{display:"inline-block",position:"relative",marginBottom:18}}>
            <div style={{background:"#fff",border:`2.5px solid ${accent}`,borderRadius:20,padding:"6px 22px",fontSize:20,fontWeight:900,color:accent,fontFamily:"'Yomogi',cursive",boxShadow:"2px 3px 0px #ddd6fe"}}>ここに</div>
            <div style={{position:"absolute",bottom:-12,left:"50%",transform:"translateX(-50%)",width:0,height:0,borderLeft:"10px solid transparent",borderRight:"10px solid transparent",borderTop:`12px solid ${accent}`}}/>
          </div>
          <div style={{fontSize:52,marginTop:14,marginBottom:8}}>{titleEmoji}</div>
          <h1 style={{fontFamily:"'Yomogi',cursive",fontSize:26,color:accent,lineHeight:1.4,marginBottom:4,whiteSpace:"pre-wrap"}}>{title}</h1>
          <div style={{textAlign:"right",marginBottom:8}}><span style={{fontSize:10,color:"#9ca3af"}}>マンション管理士監修</span></div>
          <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:10}}>
            <span style={{background:"#fef9c3",border:"1.5px solid #fde047",borderRadius:20,padding:"4px 12px",fontSize:13,color:"#854d0e",fontWeight:800}}>🆓 完全無料</span>
            <span style={{background:"#f0fdf4",border:"1.5px solid #86efac",borderRadius:20,padding:"4px 12px",fontSize:13,color:"#15803d",fontWeight:800}}>登録不要</span>
          </div>
          <p style={{fontSize:14,color:"#9ca3af",lineHeight:1.7,whiteSpace:"pre-wrap"}}>{subtitle}</p>
        </div>
        <div style={card}>
          <button onClick={()=>setScreen("quiz")} style={{width:"100%",padding:"16px",background:grad,color:"#fff",borderRadius:16,border:"none",fontSize:17,fontWeight:800,fontFamily:"'M PLUS Rounded 1c',sans-serif",boxShadow:`0 4px 0 ${accentDark}`,cursor:"pointer",marginBottom:20,display:"block"}}>🚀 診断スタート</button>
          <div style={{background:accentBg,borderRadius:12,padding:"12px 14px",marginBottom:16,fontSize:13,color:accentDark,lineHeight:1.7}}>💡 所要時間は約<b>{generation==="worker"?"8〜12分":"5〜8分"}</b>。タップするだけで自動で次へ進みます！</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {categoryList.map(([em,lb,ct])=>(
              <div key={lb} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:accentBg,borderRadius:12,border:`1.5px dashed ${accentBorder}`,padding:"9px 14px"}}>
                <span style={{fontSize:13,color:"#374151"}}>{em} {lb}</span>
                <span style={{fontSize:12,color:accent,fontWeight:700}}>{ct}</span>
              </div>
            ))}
          </div>
        </div>
        <p style={{textAlign:"center",fontSize:12,color:"#d1d5db",marginTop:20}}>※ この診断は簡易的な目安です。正確な診断は専門家にご相談ください。</p>
      </div>
    </div>
  );

  // ── QUIZ
  if (screen==="quiz") return (
    <div style={wrap}><style>{FONTS}</style>
      <ProgressBar cur={cur+1} total={activeQuestions.length} grad={grad}/>
      <div style={card}>
        <div style={{display:"inline-flex",alignItems:"center",gap:6,background:accentBg,border:`2px dashed ${accentBorder}`,borderRadius:20,padding:"4px 14px",fontSize:13,color:accent,fontWeight:700,marginBottom:16}}>{q.emoji} {q.category}</div>
        <p style={{fontSize:17,fontWeight:700,color:"#1f2937",lineHeight:1.6,marginBottom:20}}>Q{q.id}. {q.text}</p>
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
          {q.options.map((opt,i)=>{const isFlash=flash===i; return (
            <button key={i} onClick={()=>handleSelect(i,opt.score)} disabled={flash!==null}
              style={{width:"100%",padding:"13px 16px",background:isFlash?accentBg:"#f9fafb",border:isFlash?`2.5px solid ${accent}`:"2px solid #e5e7eb",borderRadius:12,textAlign:"left",fontSize:14,color:isFlash?accent:"#374151",fontWeight:isFlash?700:400,fontFamily:"'M PLUS Rounded 1c',sans-serif",cursor:flash!==null?"default":"pointer",transition:"all 0.15s",display:"flex",alignItems:"center",gap:10,transform:isFlash?"scale(0.98)":"scale(1)"}}>
              <span style={{width:22,height:22,borderRadius:"50%",flexShrink:0,border:isFlash?`2.5px solid ${accent}`:"2px solid #d1d5db",background:isFlash?accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>
                {isFlash&&<span style={{width:8,height:8,background:"#fff",borderRadius:"50%",display:"block"}}/>}
              </span>
              {opt.label}
            </button>
          );})}
        </div>
        <div>
          <button onClick={()=>setHint(!hint)} style={{background:"none",border:"none",color:accent,fontSize:13,fontWeight:700,fontFamily:"'M PLUS Rounded 1c',sans-serif",cursor:"pointer"}}>{hint?"▲ ヒントを閉じる":"💡 ヒントを見る"}</button>
          {hint&&<div style={{marginTop:8,background:accentBg,border:`1.5px dashed ${accentBorder}`,borderRadius:10,padding:"10px 12px",fontSize:13,color:accentDark,lineHeight:1.7}}>{q.hint}</div>}
        </div>
      </div>
    </div>
  );

  // ── RESULT
  const getCatScore=(cat)=>{
    const qs=activeQuestions.filter(q=>q.category===cat);
    const earned=qs.reduce((a,q)=>a+(answers[q.id]??0),0);
    const max=qs.reduce((a,q)=>a+Math.max(...q.options.map(o=>o.score)),0);
    return {earned,max,pct:max>0?Math.round((earned/max)*100):0};
  };

  const weakPoints=activeQuestions
    .map(q=>({q,score:answers[q.id]??0,max:Math.max(...q.options.map(o=>o.score))}))
    .filter(item=>item.score<item.max)
    .sort((a,b)=>(a.score/a.max)-(b.score/b.max))
    .slice(0,3);

  const catRatios={};
  activeQuestions.forEach(q=>{
    const ans=answers[q.id]??0;
    const max=Math.max(...q.options.map(o=>o.score));
    if (!catRatios[q.category]) catRatios[q.category]={total:0,max:0};
    catRatios[q.category].total+=ans;
    catRatios[q.category].max+=max;
  });
  const worstCat=Object.entries(catRatios)
    .map(([cat,v])=>({cat,ratio:v.max>0?v.total/v.max:1}))
    .sort((a,b)=>a.ratio-b.ratio)[0]?.cat||"";
  const subType=getSubType(worstCat);

  const getCatComment=(cat,pct)=>{
    const c=CONFIG.categoryComments[cat];
    if (!c) return null;
    if (pct>=70) return c.high;
    if (pct>=40) return c.middle;
    return c.low;
  };

  const lineType=getLineType(totalScore,TOTAL_MAX);
  const sendText=subType?subType.name:lineType;
  const lineUrl=LINE_URL+"?oatext="+encodeURIComponent(sendText);

  return (
    <div style={wrap}><style>{FONTS}</style>
      <div style={{width:"100%",maxWidth:540}}>

        {/* 総合スコアカード */}
        <div style={{width:"100%",maxWidth:540,background:risk.bg,border:`2.5px solid ${risk.border}`,boxShadow:`4px 6px 0px ${risk.border}`,borderRadius:24,padding:"28px 24px",textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:48,marginBottom:8}}>{risk.emoji}</div>

          {/* サブ型 */}
          <div style={{marginBottom:10}}>
            <div style={{fontSize:13,color:"#6b7280",fontFamily:"'M PLUS Rounded 1c',sans-serif",marginBottom:4}}>あなたの危機の正体</div>
            <div style={{fontSize:32,fontWeight:900,fontFamily:"'Yomogi',cursive",lineHeight:1.1,color:risk.color}}>
              {subType.emoji} {subType.name}
            </div>
          </div>

          {/* 住まう年齢 */}
          <div style={{background:"rgba(255,255,255,0.7)",borderRadius:16,padding:"10px 20px",marginBottom:10,display:"inline-block"}}>
            <div style={{fontSize:11,color:"#6b7280",fontFamily:"'M PLUS Rounded 1c',sans-serif",marginBottom:2}}>🏠 住まう年齢</div>
            <div style={{fontSize:36,fontWeight:800,color:risk.color,fontFamily:"'Yomogi',cursive",lineHeight:1}}>{calcSumaiAge(totalScore,TOTAL_MAX)}<span style={{fontSize:18}}>歳</span></div>
          </div>

          {/* 診断ランク */}
          <div style={{marginBottom:8}}>
            <div style={{fontSize:13,color:"#6b7280",fontFamily:"'M PLUS Rounded 1c',sans-serif",marginBottom:4}}>診断ランク</div>
            <div style={{display:"flex",alignItems:"baseline",justifyContent:"center",gap:8}}>
              <div style={{fontSize:44,fontWeight:900,color:risk.color,fontFamily:"'Yomogi',cursive",lineHeight:1}}>{lineType}</div>
              <div style={{background:risk.color,color:"#fff",fontSize:13,fontWeight:800,fontFamily:"'M PLUS Rounded 1c',sans-serif",borderRadius:20,padding:"3px 12px"}}>{getPercentile(totalScore,TOTAL_MAX)}</div>
            </div>
          </div>

          <div style={{fontSize:18,fontWeight:800,color:risk.color,fontFamily:"'Yomogi',cursive",marginBottom:6}}>{risk.label}</div>
          <div style={{fontSize:13,color:"#6b7280",marginBottom:8,fontFamily:"'M PLUS Rounded 1c',sans-serif"}}>{totalScore} / {TOTAL_MAX}点</div>
          <p style={{fontSize:14,color:"#374151",lineHeight:1.7}}>{risk.desc}</p>
        </div>

        {/* LINE導線 */}
        <a href={lineUrl} target="_blank" rel="noopener noreferrer"
          style={{display:"block",width:"100%",maxWidth:540,background:"linear-gradient(135deg,#06c755,#00a040)",border:"2px solid #04a844",boxShadow:"4px 6px 0px #027a30",borderRadius:20,padding:"20px 22px",marginBottom:20,textDecoration:"none"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
            <span style={{fontSize:24}}>📮</span>
            <div>
              <div style={{fontSize:11,color:"#d1fae5",fontWeight:700,fontFamily:"'M PLUS Rounded 1c',sans-serif"}}>あなた専用</div>
              <div style={{fontSize:17,fontWeight:800,color:"#fff",fontFamily:"'M PLUS Rounded 1c',sans-serif",lineHeight:1.3}}>この結果の解説を見る（無料）</div>
            </div>
          </div>
          <div style={{background:"#fff",borderRadius:14,padding:"16px",textAlign:"center"}}>
            {["なぜこの結果になったのか","20年後の危険箇所","今やるべき改善策"].map((t,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:6,fontSize:13,color:"#374151",fontFamily:"'M PLUS Rounded 1c',sans-serif",fontWeight:700,marginBottom:6,justifyContent:"center"}}>
                <span style={{color:"#06c755"}}>✓</span> {t}
              </div>
            ))}
            <div style={{height:1,background:"#e5e7eb",margin:"12px 0"}}/>
            <div style={{fontSize:15,fontWeight:800,color:"#06c755",fontFamily:"'M PLUS Rounded 1c',sans-serif"}}>🆓 LINEで無料配布中</div>
            <div style={{fontSize:11,color:"#9ca3af",marginTop:2,fontFamily:"'M PLUS Rounded 1c',sans-serif"}}>お友だち追加だけ・料金一切なし</div>
            <div style={{height:1,background:"#e5e7eb",margin:"12px 0"}}/>
            <div style={{background:"#f0fdf4",borderRadius:10,padding:"10px 14px"}}>
              <div style={{fontSize:12,color:"#15803d",fontFamily:"'M PLUS Rounded 1c',sans-serif",marginBottom:4}}>追加後にLINEへこのキーワードを送ってください</div>
              <div style={{fontSize:20,fontWeight:900,color:"#15803d",fontFamily:"'Yomogi',cursive",lineHeight:1.3}}>{subType.emoji} {subType.name}</div>
            </div>
          </div>
        </a>

        {/* 弱点TOP3 */}
        {weakPoints.length>0&&(
          <div style={{...card,marginBottom:20,border:"2.5px solid #fcd34d",boxShadow:"4px 6px 0px #fcd34d",background:"#fefce8"}}>
            <h3 style={{fontFamily:"'Yomogi',cursive",fontSize:17,color:"#92400e",marginBottom:14}}>⚠️ 優先確認事項</h3>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {weakPoints.map((item,i)=>(
                <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,background:"#fff",borderRadius:12,padding:"10px 14px",border:"1.5px solid #fde68a"}}>
                  <span style={{fontSize:15,fontWeight:800,color:"#d97706",minWidth:22,fontFamily:"'M PLUS Rounded 1c',sans-serif"}}>{"①②③"[i]}</span>
                  <div>
                    <div style={{fontSize:13,fontWeight:700,color:"#1f2937",fontFamily:"'M PLUS Rounded 1c',sans-serif"}}>{item.q.text}</div>
                    <div style={{fontSize:11,color:"#9ca3af",marginTop:2,fontFamily:"'M PLUS Rounded 1c',sans-serif"}}>{item.q.category}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* カテゴリ別スコア */}
        <div style={{...card,marginBottom:20}}>
          <h3 style={{fontFamily:"'Yomogi',cursive",fontSize:18,color:accent,marginBottom:16}}>📊 カテゴリ別の結果</h3>
          <div style={{display:"flex",flexDirection:"column",gap:18}}>
            {CATEGORIES.map(cat=>{
              const {earned,max,pct}=getCatScore(cat);
              const q0=activeQuestions.find(q=>q.category===cat);
              const comment=getCatComment(cat,pct);
              return (
                <div key={cat}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:13,color:"#374151",fontWeight:700}}>{q0?.emoji} {cat}</span>
                    <span style={{fontSize:13,color:"#6b7280"}}>{earned}/{max}点</span>
                  </div>
                  <ScoreBar pct={pct}/>
                  {comment&&(
                    <div style={{marginTop:8,fontSize:12,color:pct>=70?"#15803d":pct>=40?"#92400e":"#dc2626",background:pct>=70?"#f0fdf4":pct>=40?"#fefce8":"#fef2f2",borderRadius:8,padding:"7px 10px",lineHeight:1.6,fontFamily:"'M PLUS Rounded 1c',sans-serif"}}>
                      {pct>=70?"✅ ":pct>=40?"💡 ":"⚠️ "}{comment}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 代行診断CTA */}
        <div style={{width:"100%",maxWidth:540,background:"linear-gradient(135deg,#1f2937,#374151)",border:"2.5px solid #4b5563",boxShadow:"4px 6px 0px #111827",borderRadius:24,padding:"28px 24px",marginBottom:20}}>
          <div style={{textAlign:"center",marginBottom:16}}>
            <div style={{fontSize:36,marginBottom:8}}>🔎</div>
            <h3 style={{fontFamily:"'Yomogi',cursive",fontSize:19,color:"#fff",marginBottom:8}}>自分で調べるのが面倒なら…</h3>
            <p style={{fontSize:13,color:"#d1d5db",lineHeight:1.7}}>書類確認・現地確認・詳細レポートまで<br/><b style={{color:"#fbbf24"}}>マンション管理士が代わりに診断</b>します。</p>
          </div>
          <div style={{background:"rgba(255,255,255,0.08)",borderRadius:12,padding:"12px 16px",marginBottom:16}}>
            <div style={{fontSize:12,color:"#9ca3af",fontFamily:"'M PLUS Rounded 1c',sans-serif",marginBottom:8}}>この診断ではわからない</div>
            {["20年後のリスク","今やるべき優先対策","住み続けるか、住み替えるかの判断"].map((t,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:6,fontSize:13,color:"#fff",fontFamily:"'M PLUS Rounded 1c',sans-serif",fontWeight:700,marginBottom:i<2?6:0}}>
                <span style={{color:"#fbbf24"}}>✅</span> {t}
              </div>
            ))}
            <div style={{marginTop:10,fontSize:12,color:"#d1d5db",fontFamily:"'M PLUS Rounded 1c',sans-serif",lineHeight:1.7}}>を詳しく分析します。</div>
          </div>
          <a href={LINE_URL} target="_blank" rel="noopener noreferrer"
            style={{display:"block",width:"100%",padding:"15px 15px 12px",background:"linear-gradient(135deg,#f59e0b,#ef4444)",borderRadius:14,boxShadow:"0 3px 0 #92400e",cursor:"pointer",textDecoration:"none",textAlign:"center"}}>
            <div style={{color:"#fff",fontSize:16,fontWeight:800,fontFamily:"'M PLUS Rounded 1c',sans-serif",marginBottom:8}}>🔎 プロ代行診断の内容を見てみる</div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,background:"rgba(255,255,255,0.9)",borderRadius:10,padding:"8px 12px"}}>
              <span style={{fontSize:16}}>💬</span>
              <span style={{fontSize:13,color:"#374151",fontWeight:700,fontFamily:"'M PLUS Rounded 1c',sans-serif"}}>LINEお友だちから <span style={{background:"#fef9c3",padding:"1px 6px",borderRadius:4}}>「代行」</span> と送ってください</span>
            </div>
          </a>
        </div>

        <button onClick={restart} style={{width:"100%",maxWidth:540,padding:"12px",background:"#fff",color:accent,borderRadius:14,border:`2px solid ${accentBorder}`,fontSize:14,fontWeight:700,fontFamily:"'M PLUS Rounded 1c',sans-serif",cursor:"pointer"}}>🔄 もう一度診断する</button>
      </div>
    </div>
  );
}
