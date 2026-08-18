/* Sister Trip v4 — city stories, budget discovery seeds and safe reservation summaries. */
(() => {
  const cityStories = {
    paris: {
      kicker:'PARIS · REVOLUTION / EMPIRE',
      title:'王の街を壊したのに、なぜ王の痕跡がこんなに残っている？',
      body:'パリは王権の舞台として形づくられ、革命でその秩序を壊しました。それでも宮殿・教会・広場・記念碑は消えず、次の時代が意味を書き換えながら使い続けました。街を「時代が上書きされた地図」として歩きます。',
      listen:'パリは王の街として作られ、その後の革命で王政を壊しました。でも街は全部を消しませんでした。宮殿、教会、広場、記念碑には、それぞれ違う時代の価値観が重なっています。目の前の建物が誰のために作られ、次の時代にどう使い直されたのかを探してみましょう。',
      facts:['コンシェルジュリーは王宮の一部から牢獄へ役割が変わった。','アンヴァリッドは軍事・国家の記憶を演出する巨大な舞台でもある。','エッフェル塔は完成前から強い反対運動を受けた。'],
      quest:'「前の時代を消さず、別の意味で使い直した場所」を1つ見つける。'
    },
    zurich: {
      kicker:'ZÜRICH · REFORMATION / MONEY',
      title:'小さな湖畔都市は、なぜ世界級の金融都市になった？',
      body:'チューリッヒは宗教改革、商業、工業、金融が何層にも重なった都市です。旧市街の教会と銀行街を別々に見ず、「信仰・規律・商売・信用」がどう結びついたかを見ると街の性格が立体的になります。',
      listen:'チューリッヒでは、教会の宗教改革と近代の金融都市が遠い話ではありません。信用、規律、教育、商業の積み重ねが、湖畔の都市を国際都市へ変えていきました。高台から地形を見てから旧市街へ降りると、街のサイズ感がつかみやすくなります。',
      facts:['グロスミュンスターはスイス宗教改革と強く結びつく。','リマト川と湖は都市の交通・交易の骨格になった。','旧市街と近代的な商業地区が非常に近い。'],
      quest:'高台から「古い街」と「新しい街」の境目を探す。'
    },
    luzern: {
      kicker:'LUZERN · ALPS / CONFEDERATION',
      title:'湖と山に囲まれた街が、なぜ「スイスらしさ」の象徴になった？',
      body:'ルツェルンはアルプス観光の玄関口であるだけでなく、中世都市、連邦の記憶、19世紀の観光産業が重なる場所です。山を見る日でも、橋・城壁・湖岸を見ると街の成り立ちがつながります。',
      listen:'ルツェルンでは自然と歴史を分けずに見ます。湖と峠が人の移動を決め、その場所に街と橋と城壁が生まれました。さらに近代になると、その景観そのものが世界中の旅行者を呼ぶ資源になります。',
      facts:['カペル橋は都市防衛と移動の一部として発展した。','ムーゼック城壁は中世都市の輪郭を今も感じられる。','19世紀以降、アルプス観光の発展で街の国際性が高まった。'],
      quest:'「自然の景色」がそのまま都市の機能になっている場所を1つ見つける。'
    },
    milano: {
      kicker:'MILANO · POWER / DESIGN',
      title:'教会・商業・工業・ファッションは、どうして同じ街に集まった？',
      body:'ミラノは宗教都市であり、北イタリアの経済都市であり、工業・デザイン・ファッションの中心でもあります。ドゥオーモとガレリアを並べて見るだけでも、「権威」と「消費」が隣り合う都市構造が見えます。',
      listen:'ミラノは古いものを保存するだけの街ではありません。大聖堂のような長い時間をかけた建築と、商業、工業、デザインの新しさが同時に存在します。中心部では建物そのものより、何が隣り合っているかを見てください。',
      facts:['ミラノ大聖堂は建設が数世紀にわたった。','ガレリアは近代的な商業空間の象徴の一つ。','レオナルド・ダ・ヴィンチはミラノ宮廷で長く活動した。'],
      quest:'「昔の権威」と「現代の消費」が隣り合う場所を写真に残す。'
    },
    venezia: {
      kicker:'VENEZIA · TRADE / LAGOON',
      title:'なぜ人は、わざわざ水の上に巨大な都市を作った？',
      body:'ヴェネツィアは「ロマンチックな水の街」になる前に、海上交易で生きる共和国でした。水は不便である一方、防御・交易・物流のインフラでもあります。橋と路地と広場を、交通システムとして見てみます。',
      listen:'ヴェネツィアの水路は飾りではありません。道路の代わりであり、物流路であり、都市を守る地形でもありました。サン・マルコからリアルトへ歩くと、政治と商売がどれほど近くに置かれていたかが分かります。',
      facts:['共和国の政治の中心と交易の中心が徒歩圏に集中している。','リアルト周辺は長く商業の中心だった。','島の都市では徒歩と船の動線が街の形を決める。'],
      quest:'「道路の代わりに水が機能している」と実感できる場面を1つ探す。'
    },
    firenze: {
      kicker:'FIRENZE · MEDICI / RENAISSANCE',
      title:'ルネサンスは「天才が突然現れた時代」ではなかった？',
      body:'フィレンツェの芸術は、富・銀行・宗教・政治的競争と切り離せません。美しい作品の裏側に「誰がお金を出したか」「誰に見せたかったか」を置くと、ルネサンスが都市の仕組みとして見えてきます。',
      listen:'フィレンツェでは作品の作者だけでなく、注文した人にも注目してください。商人や銀行家、宗教組織、政治家の競争が、建築と絵画と彫刻を街中に増やしました。美しさと権力は別々ではありません。',
      facts:['メディチ家は銀行と政治だけでなく芸術支援でも大きな影響を与えた。','大聖堂のドームは当時の技術的挑戦でもあった。','ヴェッキオ橋には商業と都市生活が橋の上に残る。'],
      quest:'「芸術作品」ではなく「スポンサーの存在」を感じる場所を1つ見つける。'
    },
    roma: {
      kicker:'ROMA · EMPIRE / CHURCH',
      title:'2000年前の首都の上に、どうやって今の街がそのまま暮らしている？',
      body:'ローマの面白さは、遺跡が別区画に保存されていることではなく、古代・中世・教皇都市・近代都市が同じ場所に重なっていることです。用途が変わり続けた建物を探すと、街全体が巨大なタイムラインに見えます。',
      listen:'ローマでは新しい街が古い街を完全に消しませんでした。古代の建物を教会にしたり、石材を別の建物に使ったり、道路の下に古い層が残ったりします。今日は何年前のものを見ているのかを時々考えてみてください。',
      facts:['パンテオンは古代建築が用途を変えながら長く使われてきた代表例。','フォロ・ロマーノは政治・宗教・商業が集中した場所。','バチカン周辺では帝国の首都とキリスト教世界の中心という別の時代が接続する。'],
      quest:'1枚の写真の中に「違う時代」を2つ以上入れる。'
    }
  };

  const recommendations = [
    {id:'paris-chartier',city:'paris',name:'Bouillon Chartier Grands Boulevards',category:'eat',label:'安うま',price:'€',lat:48.8723,lng:2.3427,minutes:45,why:'昔ながらのブイヨン系。パリ中心部でフランス料理を比較的予算を抑えて食べる候補。',tip:'行列が長ければ無理に並ばず、ルート上にある時だけ。',checked:'2026-08'},
    {id:'paris-carnavalet',city:'paris',name:'Musée Carnavalet 周辺',category:'history',label:'無料・歴史',price:'FREE*',lat:48.8572,lng:2.3622,minutes:35,why:'パリそのものの歴史を扱う場所。中心部の観光とつなげやすい。',tip:'常設展示の条件・開館日は直前に再確認。',checked:'2026-08'},
    {id:'paris-monoprix',city:'paris',name:'大型スーパーでお土産チェック',category:'buy',label:'日本より買い',price:'€',lat:48.8739,lng:2.3317,minutes:20,why:'チョコ・ビスケット・マスタード・バター系など、専門店より日常価格を見やすい。',tip:'「日本で買う価格」と比較して本当に得なものだけ。',checked:'2026-08'},
    {id:'zurich-migros',city:'zurich',name:'Migros Restaurant Zürich City',category:'eat',label:'安うま',price:'CHF 10–20',lat:47.3766,lng:8.5378,minutes:35,why:'物価の高いチューリッヒで、中心部の食費を抑えやすい候補。',tip:'営業時間は当日に確認。',checked:'2026-08'},
    {id:'zurich-poly',city:'zurich',name:'Polyterrasse',category:'view',label:'無料絶景',price:'FREE',lat:47.3764,lng:8.5485,minutes:20,why:'旧市街を高い位置から見て、街の地形を短時間で把握できる。',tip:'Uetlibergまで行く時間がない時の短時間候補。',checked:'2026-08'},
    {id:'zurich-choco',city:'zurich',name:'Migros / Coop のチョコ棚',category:'buy',label:'現地で買い',price:'CHF',lat:47.3747,lng:8.5386,minutes:15,why:'観光施設だけでなく、スーパー価格でスイス菓子を比較できる。',tip:'Lindtは工場系施設とスーパーで価格・限定品を見比べる。',checked:'2026-08'},
    {id:'luzern-manora',city:'luzern',name:'Manora Restaurant Luzern',category:'eat',label:'安うま',price:'CHF 10–20',lat:47.0522,lng:8.3068,minutes:35,why:'旧市街中心で、スイスの外食費を比較的抑えやすいセルフサービス系候補。',tip:'山の日は無理に街へ戻らず、ルートに合う時だけ。',checked:'2026-08'},
    {id:'luzern-musegg',city:'luzern',name:'Musegg Wall',category:'history',label:'穴場・歴史',price:'FREE*',lat:47.0544,lng:8.3031,minutes:30,why:'中世都市の輪郭と街の高低差が一緒に分かる。',tip:'塔の公開時間・季節運用は当日確認。',checked:'2026-08'},
    {id:'luzern-lake',city:'luzern',name:'湖畔でスーパー朝食 / ピクニック',category:'eat',label:'節約',price:'CHF',lat:47.0502,lng:8.3108,minutes:25,why:'景色にお金をかけず、食費も抑えられる。',tip:'天気が良い日の優先度が高い。',checked:'2026-08'},
    {id:'milan-luini',city:'milano',name:'Luini',category:'eat',label:'安うま・名物',price:'€',lat:45.4654,lng:9.1918,minutes:25,why:'ドゥオーモすぐ近くでパンズェロッティを短時間で食べられる定番候補。',tip:'行列が長ければスキップ。',checked:'2026-08'},
    {id:'milan-ossa',city:'milano',name:'San Bernardino alle Ossa',category:'history',label:'隠れた満足',price:'FREE*',lat:45.4628,lng:9.1956,minutes:20,why:'中心部から近いのに、通常の大聖堂とは全く違う空間体験ができる。',tip:'礼拝中は観光を優先しない。',checked:'2026-08'},
    {id:'milan-super',city:'milano',name:'スーパーでピスタチオ・チーズ比較',category:'buy',label:'日本より買い',price:'€',lat:45.4650,lng:9.1876,minutes:20,why:'ピスタチオ製品、チーズ、パスタなどは日本の輸入価格と差が出やすい。',tip:'重い瓶物は旅の後半まで買いすぎない。',checked:'2026-08'},
    {id:'venice-lele',city:'venezia',name:'Bacareto da Lele',category:'eat',label:'安うま・名物',price:'€',lat:45.4371,lng:12.3210,minutes:25,why:'小さなチケッティと飲み物で、ヴェネツィアらしい軽食体験をしやすい。',tip:'席の快適さより、短時間の立ち寄り向け。',checked:'2026-08'},
    {id:'venice-acqua',city:'venezia',name:'Libreria Acqua Alta',category:'hidden',label:'隠れた満足',price:'FREE',lat:45.4379,lng:12.3420,minutes:20,why:'水と暮らす都市らしさを、本屋の空間から感じられる。',tip:'混雑時は写真だけに時間を使いすぎない。',checked:'2026-08'},
    {id:'venice-market',city:'venezia',name:'スーパー / 市場で軽食を確保',category:'buy',label:'節約',price:'€',lat:45.4381,lng:12.3358,minutes:20,why:'観光中心部で毎食レストランにすると高くなりやすいので、1食を軽くする逃げ道。',tip:'水・果物・パンを早めに確保。',checked:'2026-08'},
    {id:'florence-fratellini',city:'firenze',name:'I Fratellini',category:'eat',label:'安うま・名物',price:'€',lat:43.7710,lng:11.2558,minutes:20,why:'歴史地区でトスカーナ系具材のパニーノを短時間で食べる候補。',tip:'座って休みたい時は別候補にする。',checked:'2026-08'},
    {id:'florence-nerbone',city:'firenze',name:'Da Nerbone',category:'eat',label:'安うま・ローカル',price:'€',lat:43.7760,lng:11.2537,minutes:30,why:'中央市場でフィレンツェらしい食事を試しやすい。',tip:'昼営業中心なので時間を合わせる。',checked:'2026-08'},
    {id:'florence-michelangelo',city:'firenze',name:'Piazzale Michelangelo',category:'view',label:'無料絶景',price:'FREE',lat:43.7629,lng:11.2650,minutes:40,why:'街全体とドゥオーモを一度に見られ、ルネサンス都市のサイズ感がつかめる。',tip:'夕方は混みやすい。',checked:'2026-08'},
    {id:'rome-guerra',city:'roma',name:'Pastificio Guerra',category:'eat',label:'安うま',price:'€',lat:41.9055,lng:12.4813,minutes:25,why:'スペイン広場周辺で食費を抑える候補として使いやすい。',tip:'営業時間・当日のメニューは直前確認。',checked:'2026-08'},
    {id:'rome-trapizzino',city:'roma',name:'Trapizzino',category:'eat',label:'名物・手軽',price:'€',lat:41.8997,lng:12.5016,minutes:25,why:'ローマ料理の煮込み系の味を、歩き旅でも食べやすい形で試せる。',tip:'店舗が複数あるのでルートに近い店を選ぶ。',checked:'2026-08'},
    {id:'rome-aventine',city:'roma',name:'Aventine Keyhole / Orange Garden',category:'hidden',label:'無料・穴場',price:'FREE',lat:41.8830,lng:12.4785,minutes:35,why:'有名遺跡とは違う角度でローマの地形とサン・ピエトロ方向を楽しめる。',tip:'コロッセオ周辺から南へ動く日に相性がよい。',checked:'2026-08'}
  ];

  const placeDetails = {
    'saint-sulpice':{stay:'20–35分',look:'ドラクロワの壁画、巨大な身廊、子午線の装置。',note:'無料で入れる時間帯が多いが礼拝優先。'},
    'saint-etienne':{stay:'20–30分',look:'石造りの内陣仕切り（ジュベ）と螺旋階段。',note:'パンテオンのすぐ近く。'},
    'petit-palais':{stay:'35–60分',look:'入口の大階段、中庭、建物そのものの装飾。',note:'次の予定が押していれば建築だけ見る短縮も可。'},
    'alexandre':{stay:'15–25分',look:'金色の彫像、アンヴァリッド方向の軸、セーヌの夕景。',note:'写真目的なら日没前後が主役。'},
    'eiffel':{stay:'20–45分',look:'鉄骨の構造、シャン・ド・マルス側とトロカデロ側の見え方の差。',note:'夜景は予定の余白を確保。'},
    'aura':{stay:'約50分',look:'ドーム建築と音・光の演出がどう重なるか。',note:'予約確定前なのでLOCKEDにはしない。'},
    'montmartre':{stay:'60–90分',look:'丘の高低差、サクレ・クール前からの都市全景。',note:'夕方は混雑を見込む。'},
    'galeries':{stay:'20–35分',look:'ドーム天井と屋上からのパリの軸。',note:'買い物をしなくても景色目的で使える。'},
    'opera':{stay:'35–60分',look:'大階段、金色の装飾、劇場が社交場でもあったこと。',note:'入場条件は当日確認。'},
    'palais-royal':{stay:'20–35分',look:'回廊、中庭、ビュレンの円柱と古い宮殿空間の対比。',note:'ルーヴル周辺のすき間時間に入れやすい。'},
    'notre-dame':{stay:'30–50分',look:'西正面、バラ窓、再建された部分と古い部分。',note:'入場列を見て滞在時間を調整。'},
    'orsay':{stay:'90–150分',look:'大時計、元駅舎の構造、印象派の代表作。',note:'見たい作品を3つ決めると疲れにくい。'},
    'invalides':{stay:'45–80分',look:'黄金のドーム、ナポレオンの墓を囲む視線設計。',note:'AURAと同日なら移動が少ない。'},
    'rodin':{stay:'35–60分',look:'考える人、地獄の門、庭園と彫刻の距離感。',note:'時間が押したら短縮しやすいWISH。'},
    'versailles':{stay:'4–6時間',look:'鏡の間、庭園の軸、王の寝室までの導線。',note:'移動時間込みで半日以上を確保。'},
    'louvre':{stay:'2–3時間',look:'作品を全部追わず「王宮→美術館」の建物変化も見る。',note:'3つの見たい作品を先に決める。'},
    'arc':{stay:'30–50分',look:'放射状道路、シャンゼリゼから続く都市軸。',note:'夜景向き。'},
    'sainte-chapelle':{stay:'30–45分',look:'上階のステンドグラスを「壁より光が多い空間」として見る。',note:'時間指定があるなら遅れない。'},
    'conciergerie':{stay:'25–45分',look:'王宮から牢獄へ用途が変わった痕跡。',note:'サント・シャペルとセットで効率的。'}
  };

  const reservationDetails = [
    {match:'BEG → CDG',ticketKey:'airserbia-beg-cdg',bullets:['9/11 06:35 ベオグラード BEG T2 発 → 09:15 パリ CDG T2B 着','Air Serbia JU240・エコノミー・A220-300','運航：airBaltic for Air Serbia','軽食あり','身の回り品 1個・最大4kg','機内持込 1個・最大8kg・40×23×55cm以内','無料の受託手荷物枠なし','有効なパスポート/身分証をチェックイン時に持参']},
    {match:'Paris → Zürich',ticketKey:'flix-paris-zurich',bullets:['9/17 22:00 Paris Bercy Seine 発','9/18 07:35 Zürich Bus Station 着','FlixBus 夜行便','有効なID/パスポートを持参','チケットPDFとQRはメール添付あり']},
    {match:'Viadukt Apartments',bullets:['9/18 チェックイン → 9/19 チェックアウト','3名','15:00から部屋利用可','通常レセプション 10:00–15:00','時間外はセルフチェックイン対応','チェックアウトは11:00まで','遅いチェックアウトは事前相談で可否確認']},
    {match:'Luzern Youth Hostel',bullets:['9/19 チェックイン → 9/20 チェックアウト','チェックイン 16:00–21:00','ドミトリーは21:00以降の遅着不可','市税は1名1泊 CHF 2.40 の案内あり','到着日に荷物対応可能との返信あり','全員分のパスポート確認が必要']},
    {match:'Luzern → Milano',ticketKey:'flix-luzern-milan',bullets:['9/21 01:30 Luzern (Landenberg) 発','04:50 Milan (Lampugnano) 着','FlixBus','有効なID/パスポートを持参','チケットPDFとQRはメール添付あり']},
    {match:'Star Hostel',bullets:['9/21 チェックイン → 9/23 チェックアウト','チェックイン開始 14:00・深夜0:00まで','チェックイン前/チェックアウト後の荷物預かりなし','非EU旅行者は原本パスポートが必要','到着時に残額支払いの案内あり','Lampugnanoから地下鉄M1→M5＋徒歩/バスの案内あり']},
    {match:'Milano → Venezia',ticketKey:'flix-milan-venice',bullets:['9/23 08:00 Milan Lampugnano 発','11:30 Venice Mestre (Stazione FS) 着','FlixBus','有効なID/パスポートを持参','チケットPDFとQRはメール添付あり']},
    {match:'S Marco Apartments',bullets:['9/23 チェックイン → 9/24 チェックアウト','チェックイン 11:00–22:00・事前に到着時刻を連絡','早い荷物預けは前日までにメッセージが必要','22:00以降の遅着は追加料金あり','チェックアウトは10:00まで','チェックアウト時は鍵を指定場所に残す方式']},
    {match:'hu Firenze',bullets:['9/24 チェックイン 15:00–00:00','9/25 チェックアウト 06:00–10:00','3名・デラックスバンガロー 1泊','9/20 23:59まではキャンセル無料','市税 €3.50 / 人 / 泊（計 €10.50）','朝食は €12 / 人 / 泊','鍵は現地フロントで受取','9/21 0:00以降のキャンセルは宿泊料金100%の案内']}
  ];

  window.SisterTripV4Data = {cityStories,recommendations,placeDetails,reservationDetails};
})();
