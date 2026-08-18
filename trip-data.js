/* Sister Trip — public-safe trip dataset.
   Reservation numbers, PINs, access codes, exact private-home details and ticket QR data
   intentionally stay out of the public repository. Verified dates/times below were reconciled
   against Google Calendar + reservation emails on 2026-08-18. */

const CITY_IMAGES = {
  paris: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=86',
  zurich: 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=900&q=86',
  luzern: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=900&q=86',
  milano: 'https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?auto=format&fit=crop&w=900&q=86',
  venezia: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=900&q=86',
  firenze: 'https://images.unsplash.com/photo-1541370976299-4d24ebbc9077?auto=format&fit=crop&w=900&q=86',
  roma: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=900&q=86'
};

const PLACE_IMAGES = {
  paris: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=700&q=84',
  museum: 'https://images.unsplash.com/photo-1565099824688-e93eb20fe622?auto=format&fit=crop&w=700&q=84',
  cafe: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=700&q=84',
  swiss: CITY_IMAGES.zurich,
  luzern: CITY_IMAGES.luzern,
  milan: CITY_IMAGES.milano,
  venice: CITY_IMAGES.venezia,
  florence: CITY_IMAGES.firenze,
  rome: CITY_IMAGES.roma
};

// City order + map centers.
demo.cities = [
  {id:'paris', name:'Paris', country:'France', dates:'11–18 SEP', center:[48.8628,2.3333], zoom:12.4, image:CITY_IMAGES.paris},
  {id:'zurich', name:'Zürich', country:'Switzerland', dates:'18 SEP', center:[47.3739,8.5364], zoom:12.6, image:CITY_IMAGES.zurich},
  {id:'luzern', name:'Luzern', country:'Switzerland', dates:'19–20 SEP', center:[47.0502,8.3093], zoom:12.2, image:CITY_IMAGES.luzern},
  {id:'milano', name:'Milano', country:'Italy', dates:'21–22 SEP', center:[45.4642,9.1900], zoom:12.0, image:CITY_IMAGES.milano},
  {id:'venezia', name:'Venezia', country:'Italy', dates:'23 SEP', center:[45.4408,12.3155], zoom:11.6, image:CITY_IMAGES.venezia},
  {id:'firenze', name:'Firenze', country:'Italy', dates:'24 SEP', center:[43.7696,11.2558], zoom:12.2, image:CITY_IMAGES.firenze},
  {id:'roma', name:'Roma', country:'Italy / Vatican', dates:'25–28 SEP', center:[41.8986,12.4768], zoom:11.8, image:CITY_IMAGES.roma}
];

// Full place map. Hotel/home pins are approximate where the lodging is a private residence.
demo.mapPlaces = [
  // PARIS
  {id:'paris-stay', city:'paris', name:'Paris stay', lat:48.8665, lng:2.4218, tag:'stay', code:'⌂', eyebrow:'BASE · 11–18 SEP', badge:'STAY', meta:'Bagnolet · 7 nights', description:'毎日の出発点と帰着点。個人宅のため公開版では位置を概略表示しています。', image:PLACE_IMAGES.paris, action:'trip'},
  {id:'saint-sulpice', city:'paris', day:'09-12', name:'Saint-Sulpice', lat:48.8508, lng:2.3335, tag:'flex', code:'S', eyebrow:'12 SEP · LEFT BANK', badge:'FLEX', meta:'教会 · 左岸', description:'巨大な教会空間とパリ左岸の空気を感じる最初の一か所。', image:PLACE_IMAGES.paris, action:'today'},
  {id:'saint-etienne', city:'paris', day:'09-12', name:'Saint-Étienne-du-Mont', lat:48.8465, lng:2.3487, tag:'flex', code:'É', eyebrow:'12 SEP · LEFT BANK', badge:'FLEX', meta:'教会 · パンテオン隣', description:'石のレースのような内陣仕切りが残る珍しい教会。', image:PLACE_IMAGES.paris, action:'story'},
  {id:'petit-palais', city:'paris', day:'09-12', name:'Petit Palais', lat:48.8660, lng:2.3130, tag:'flex', code:'P', eyebrow:'12 SEP · WEST', badge:'FLEX', meta:'美術館 · 西側', description:'豪華な建築そのものも見どころ。西側ルートに自然に入れられます。', image:PLACE_IMAGES.museum, action:'today'},
  {id:'champs', city:'paris', day:'09-12', name:'Champs-Élysées', lat:48.8708, lng:2.3049, tag:'wish', code:'C', eyebrow:'12 SEP · WEST', badge:'WISH', meta:'ドラッグストア周辺 · 行けたら', description:'買い物候補。固定予定の間に無理なく入るときだけ寄る場所。', image:PLACE_IMAGES.paris, action:'wish'},
  {id:'invalides', city:'paris', day:'09-15', name:'Invalides', lat:48.8566, lng:2.3126, tag:'flex', code:'I', eyebrow:'15 SEP · FLEX', badge:'17:00', meta:'ナポレオンの物語', description:'黄金のドームの下にある巨大な墓と、帝国が記憶をどう演出したかを見る。', image:PLACE_IMAGES.paris, action:'story'},
  {id:'eiffel', city:'paris', day:'09-12', name:'Eiffel Tower', lat:48.85837, lng:2.29448, tag:'flex', code:'E', eyebrow:'12 SEP · NIGHT', badge:'夜', meta:'夜景 · FLEX', description:'昼と夜でまったく別の場所。街から嫌われた鉄塔が象徴になった逆転の物語。', image:PLACE_IMAGES.paris, action:'story'},
  {id:'alexandre', city:'paris', day:'09-12', name:'Pont Alexandre III', lat:48.8637, lng:2.3136, tag:'wish', code:'A', eyebrow:'12 SEP · SUNSET', badge:'WISH', meta:'夕景候補', description:'アンヴァリッドとセーヌをつなぐ、夕暮れに強い写真スポット。', image:PLACE_IMAGES.paris, action:'wish'},
  {id:'galeries', city:'paris', day:'09-13', name:'Galeries Lafayette Rooftop', lat:48.8738, lng:2.3320, tag:'flex', code:'G', eyebrow:'13 SEP · RIGHT BANK', badge:'FLEX', meta:'屋上テラス', description:'右岸の建物とエッフェル塔を一度に見渡せる無料展望候補。', image:PLACE_IMAGES.paris, action:'today'},
  {id:'opera', city:'paris', day:'09-13', name:'Palais Garnier', lat:48.8720, lng:2.3316, tag:'flex', code:'O', eyebrow:'13 SEP · RIGHT BANK', badge:'FLEX', meta:'オペラ座', description:'帝政期の「見せる都市」の代表。建物の豪華さ自体が政治的メッセージでした。', image:PLACE_IMAGES.paris, action:'story'},
  {id:'madeleine', city:'paris', day:'09-13', name:'Madeleine', lat:48.8700, lng:2.3246, tag:'flex', code:'M', eyebrow:'13 SEP · RIGHT BANK', badge:'FLEX', meta:'教会', description:'普通の教会と違う、古代神殿のような外観が特徴。', image:PLACE_IMAGES.paris, action:'story'},
  {id:'palais-royal', city:'paris', day:'09-13', name:'Palais-Royal Garden', lat:48.8638, lng:2.3371, tag:'flex', code:'R', eyebrow:'13 SEP · CENTER', badge:'FLEX', meta:'庭園', description:'王権、革命、芸術が重なる静かな中庭。', image:PLACE_IMAGES.paris, action:'today'},
  {id:'tuileries', city:'paris', day:'09-13', name:'Tuileries Garden', lat:48.8635, lng:2.3270, tag:'flex', code:'T', eyebrow:'13 SEP · CENTER', badge:'FLEX', meta:'庭園', description:'ルーヴルから西へ伸びる都市の軸を体で理解できる場所。', image:PLACE_IMAGES.paris, action:'today'},
  {id:'montmartre', city:'paris', day:'09-13', name:'Sacré-Cœur / Montmartre', lat:48.8867, lng:2.3431, tag:'flex', code:'M', eyebrow:'13 SEP · SUNSET', badge:'夕暮れ', meta:'モンマルトル', description:'一日の最後は丘の上へ。中心部とは違うパリの地形が一気に分かります。', image:PLACE_IMAGES.paris, action:'story'},
  {id:'disney', city:'paris', day:'09-14', name:'Disneyland Paris', lat:48.8674, lng:2.7836, tag:'locked', code:'D', eyebrow:'14 SEP · FULL DAY', badge:'DAY', meta:'ディズニー', description:'この日はパリ中心部の予定を入れず、丸一日使う前提。', image:PLACE_IMAGES.paris, action:'today'},
  {id:'notre-dame', city:'paris', day:'09-15', name:'Notre-Dame', lat:48.8530, lng:2.3499, tag:'flex', code:'N', eyebrow:'15 SEP · MORNING', badge:'FLEX', meta:'シテ島の朝', description:'街の「ゼロ地点」に近い大聖堂から、一日の歴史ルートを始めます。', image:PLACE_IMAGES.paris, action:'story'},
  {id:'orsay', city:'paris', day:'09-15', name:'Musée d’Orsay', lat:48.8600, lng:2.3266, tag:'locked', code:'O', eyebrow:'15 SEP · TICKET', badge:'LOCKED', meta:'時間指定予定', description:'駅から美術館へ変わった建物。19世紀の都市と絵画を一緒に見る場所。', image:PLACE_IMAGES.museum, action:'today'},
  {id:'rodin', city:'paris', day:'09-15', name:'Rodin Museum', lat:48.8553, lng:2.3158, tag:'wish', code:'R', eyebrow:'15 SEP · WISH', badge:'WISH', meta:'「考える人」中心', description:'時間が押したら最初に短縮・移動できる候補。', image:PLACE_IMAGES.museum, action:'wish'},
  {id:'aura', city:'paris', day:'09-12', name:'AURA Invalides', lat:48.8566, lng:2.3126, tag:'attention', code:'A', eyebrow:'12 SEP · BOOKING', badge:'要確認', meta:'21:35を問い合わせ中', description:'予約サイトのサーバーエラーで購入未完了。8/18の返信では9:30以降に予約窓口へ電話案内。LOCKEDにはまだしません。', image:PLACE_IMAGES.paris, action:'trip'},
  {id:'versailles', city:'paris', day:'09-16', name:'Versailles', lat:48.8049, lng:2.1204, tag:'locked', code:'V', eyebrow:'16 SEP · MORNING', badge:'LOCKED', meta:'09:00–15:30予定', description:'王の権力を空間に変えた場所。午後のルーヴルへ戻る長距離日程。', image:PLACE_IMAGES.paris, action:'story'},
  {id:'louvre', city:'paris', day:'09-16', name:'Louvre', lat:48.8606, lng:2.3376, tag:'locked', code:'L', eyebrow:'16 SEP · EVENING', badge:'LOCKED', meta:'17:00–20:00予定', description:'王宮から公共美術館へ。フランスの制度変化を建物そのもので見る。', image:PLACE_IMAGES.museum, action:'story'},
  {id:'arc', city:'paris', day:'09-16', name:'Arc de Triomphe', lat:48.8738, lng:2.2950, tag:'flex', code:'A', eyebrow:'16 SEP · NIGHT', badge:'FLEX', meta:'20:30頃予定', description:'一日の最後に、ナポレオンが都市の視線をどう支配したかを見る。', image:PLACE_IMAGES.paris, action:'story'},
  {id:'sainte-chapelle', city:'paris', day:'09-17', name:'Sainte-Chapelle', lat:48.8554, lng:2.3450, tag:'locked', code:'S', eyebrow:'17 SEP · MORNING', badge:'予約', meta:'09:00–10:30予定', description:'壁ではなく光で聖書を読むような礼拝堂。旅クエストの重要地点。', image:PLACE_IMAGES.paris, action:'story'},
  {id:'conciergerie', city:'paris', day:'09-17', name:'Conciergerie', lat:48.8559, lng:2.3450, tag:'flex', code:'C', eyebrow:'17 SEP · MORNING', badge:'FLEX', meta:'10:30–11:00予定', description:'マリー・アントワネットが最後の日々を過ごした場所。', image:PLACE_IMAGES.paris, action:'story'},
  {id:'bercy', city:'paris', day:'09-17', name:'Paris Bercy Seine', lat:48.8353, lng:2.3806, tag:'locked', code:'↗', eyebrow:'17 SEP · TRANSPORT', badge:'22:00', meta:'FlixBus → Zürich', description:'夜行バスの出発点。予約確認メールでは22:00発、翌07:35着。', image:PLACE_IMAGES.paris, action:'trip'},

  // ZÜRICH
  {id:'zurich-stay', city:'zurich', day:'09-18', name:'Viadukt Apartments', lat:47.3848, lng:8.5207, tag:'stay', code:'⌂', eyebrow:'18 SEP · STAY', badge:'1 NIGHT', meta:'15:00 check-in · 11:00 check-out', description:'予約確認メールで18日チェックイン、19日チェックアウトを確認済み。', image:PLACE_IMAGES.swiss, action:'trip'},
  {id:'uetliberg', city:'zurich', day:'09-18', name:'Uetliberg', lat:47.3494, lng:8.4912, tag:'flex', code:'U', eyebrow:'18 SEP · 10:00', badge:'FLEX', meta:'街・湖・アルプスを一望', description:'街の地形を最初に俯瞰するための展望ポイント。', image:PLACE_IMAGES.swiss, action:'story'},
  {id:'zurichberg', city:'zurich', day:'09-18', name:'Zürichberg', lat:47.3845, lng:8.5660, tag:'flex', code:'Z', eyebrow:'18 SEP · 11:00', badge:'FLEX', meta:'丘と住宅街', description:'中心部と反対側の高台から、街の広がりをつかむ。', image:PLACE_IMAGES.swiss, action:'today'},
  {id:'lindt', city:'zurich', day:'09-18', name:'Lindt Home of Chocolate', lat:47.3177, lng:8.5515, tag:'locked', code:'L', eyebrow:'18 SEP · TICKET', badge:'15:00', meta:'3名 CHF 51 · 支払済み', description:'予約確認メールで15:00の3名チケットを確認済み。', image:PLACE_IMAGES.swiss, action:'trip'},
  {id:'zurichhorn', city:'zurich', day:'09-18', name:'Zürichhorn', lat:47.3537, lng:8.5514, tag:'flex', code:'S', eyebrow:'18 SEP · SUNSET', badge:'夕景', meta:'19:00頃', description:'湖面と夕暮れを組み合わせる候補。天気次第でLindenhofへ切替。', image:PLACE_IMAGES.swiss, action:'today'},
  {id:'lindenhof', city:'zurich', day:'09-18', name:'Lindenhof', lat:47.3730, lng:8.5405, tag:'wish', code:'L', eyebrow:'18 SEP · SUNSET ALT', badge:'WISH', meta:'旧市街の夕景候補', description:'湖畔が難しいときの代替夕景。旧市街とリマト川を見る。', image:PLACE_IMAGES.swiss, action:'wish'},

  // LUZERN
  {id:'luzern-stay', city:'luzern', day:'09-19', name:'Luzern Youth Hostel', lat:47.0604, lng:8.3007, tag:'stay', code:'⌂', eyebrow:'19 SEP · STAY', badge:'16–21時', meta:'1 night · 朝食付き', description:'予約確認メールで19日チェックイン、20日チェックアウト。ドミトリーは21時以降の遅着不可。', image:PLACE_IMAGES.luzern, action:'trip'},
  {id:'chapel-bridge', city:'luzern', day:'09-19', name:'Chapel Bridge', lat:47.0517, lng:8.3075, tag:'flex', code:'K', eyebrow:'19 SEP · CITY', badge:'FLEX', meta:'旧市街', description:'山へ行く日でも短時間で「ルツェルンらしさ」を回収できる中心地点。', image:PLACE_IMAGES.luzern, action:'story'},
  {id:'lucerne-lake', city:'luzern', day:'09-19', name:'Lake Lucerne', lat:47.0436, lng:8.3215, tag:'wish', code:'L', eyebrow:'19 SEP · NATURE', badge:'WISH', meta:'SBB day passの日', description:'自然の日。天候と交通を見て湖・山の比重を調整する。', image:PLACE_IMAGES.luzern, action:'wish'},
  {id:'pilatus', city:'luzern', day:'09-20', name:'Pilatus', lat:46.9794, lng:8.2545, tag:'flex', code:'P', eyebrow:'20 SEP · MOUNTAIN', badge:'FLEX', meta:'ピラトゥス予定', description:'この日の主役。夜01:30のミラノ行きバスに間に合うよう、夕方にはルツェルンへ戻る。', image:PLACE_IMAGES.luzern, action:'story'},
  {id:'landenbergh', city:'luzern', day:'09-21', name:'Luzern Landenberg', lat:47.0480, lng:8.3040, tag:'locked', code:'↗', eyebrow:'21 SEP · TRANSPORT', badge:'01:30', meta:'FlixBus → Milano', description:'予約確認メールで01:30発、04:50ミラノ着を確認済み。', image:PLACE_IMAGES.luzern, action:'trip'},

  // MILANO + COMO
  {id:'milan-stay', city:'milano', day:'09-21', name:'Star Hostel San Siro Fiera', lat:45.4757, lng:9.1110, tag:'stay', code:'⌂', eyebrow:'21–23 SEP · STAY', badge:'2 NIGHTS', meta:'14:00 check-in · 荷物預かり不可', description:'予約確認メールで21日チェックイン、23日チェックアウト。返金不可。', image:PLACE_IMAGES.milan, action:'trip'},
  {id:'duomo', city:'milano', day:'09-21', name:'Duomo di Milano', lat:45.4642, lng:9.1916, tag:'flex', code:'D', eyebrow:'21 SEP · MILANO', badge:'FLEX', meta:'中心部', description:'到着日の体力次第で入れるミラノ中心の基準点。', image:PLACE_IMAGES.milan, action:'story'},
  {id:'galleria', city:'milano', day:'09-21', name:'Galleria Vittorio Emanuele II', lat:45.4659, lng:9.1900, tag:'wish', code:'G', eyebrow:'21 SEP · MILANO', badge:'WISH', meta:'ドゥオーモ隣', description:'到着日に短時間でも寄りやすい。', image:PLACE_IMAGES.milan, action:'wish'},
  {id:'como', city:'milano', day:'09-22', name:'Lake Como', lat:45.8117, lng:9.0837, tag:'flex', code:'C', eyebrow:'22 SEP · DAY TRIP', badge:'FLEX', meta:'コモ湖', description:'ミラノから日帰り。天気が悪ければミラノ市内へ組み替える日。', image:PLACE_IMAGES.milan, action:'story'},
  {id:'lampugnano', city:'milano', day:'09-23', name:'Lampugnano Bus Station', lat:45.4894, lng:9.1274, tag:'locked', code:'↗', eyebrow:'23 SEP · TRANSPORT', badge:'08:00', meta:'FlixBus → Venezia Mestre', description:'予約確認メールで08:00発、11:30着。', image:PLACE_IMAGES.milan, action:'trip'},

  // VENEZIA
  {id:'venice-stay', city:'venezia', day:'09-23', name:'S Marco Apartments · Mestre', lat:45.4867, lng:12.2384, tag:'stay', code:'⌂', eyebrow:'23 SEP · STAY', badge:'1 NIGHT', meta:'Mestre · 荷物預かりあり', description:'Booking領収書で23日チェックイン、24日チェックアウトを確認済み。', image:PLACE_IMAGES.venice, action:'trip'},
  {id:'san-marco', city:'venezia', day:'09-23', name:'Piazza San Marco', lat:45.4342, lng:12.3387, tag:'flex', code:'S', eyebrow:'23 SEP · VENEZIA', badge:'FLEX', meta:'サン・マルコ広場', description:'海の上に都市を築いたヴェネツィアの「表玄関」。', image:PLACE_IMAGES.venice, action:'story'},
  {id:'rialto', city:'venezia', day:'09-23', name:'Rialto Bridge', lat:45.4380, lng:12.3358, tag:'flex', code:'R', eyebrow:'23 SEP · VENEZIA', badge:'FLEX', meta:'リアルト', description:'交易都市ヴェネツィアの経済の中心だった場所。', image:PLACE_IMAGES.venice, action:'story'},
  {id:'mestre-station', city:'venezia', day:'09-24', name:'Venezia Mestre Station', lat:45.4820, lng:12.2319, tag:'planned', code:'↗', eyebrow:'24 SEP · TRAIN', badge:'未確定', meta:'Firenze 10:25頃案', description:'フィレンツェ行きはまだ予約確定情報がないためLOCKEDにしません。', image:PLACE_IMAGES.venice, action:'trip'},

  // FIRENZE
  {id:'florence-stay', city:'firenze', day:'09-24', name:'hu Firenze Camping in Town', lat:43.7640, lng:11.3153, tag:'stay', code:'⌂', eyebrow:'24 SEP · STAY', badge:'1 NIGHT', meta:'15:00 check-in', description:'予約確認メールで24日チェックイン、25日チェックアウト。9/20 23:59までキャンセル無料。', image:PLACE_IMAGES.florence, action:'trip'},
  {id:'florence-duomo', city:'firenze', day:'09-24', name:'Duomo di Firenze', lat:43.7731, lng:11.2560, tag:'flex', code:'D', eyebrow:'24 SEP · FIRENZE', badge:'FLEX', meta:'旧市街', description:'フィレンツェの富・宗教・技術がひとつの建築に集まった中心。', image:PLACE_IMAGES.florence, action:'story'},
  {id:'uffizi', city:'firenze', day:'09-24', name:'Uffizi', lat:43.7678, lng:11.2553, tag:'wish', code:'U', eyebrow:'24 SEP · ART', badge:'WISH', meta:'美術候補', description:'時間が取れればルネサンスの物語を一気につなげられる場所。', image:PLACE_IMAGES.florence, action:'wish'},
  {id:'ponte-vecchio', city:'firenze', day:'09-24', name:'Ponte Vecchio', lat:43.7680, lng:11.2531, tag:'flex', code:'P', eyebrow:'24 SEP · WALK', badge:'FLEX', meta:'散歩', description:'中世の商業と都市の生活が橋の上に残る。', image:PLACE_IMAGES.florence, action:'story'},

  // ROMA / VATICAN
  {id:'roma-arrival', city:'roma', day:'09-25', name:'Roma · arrival', lat:41.9010, lng:12.5018, tag:'planned', code:'↗', eyebrow:'25 SEP · TRAIN', badge:'未確定', meta:'Firenze → Roma 10:35頃案', description:'列車はまだ予約確定情報がないため、時間変更可能な予定として表示。', image:PLACE_IMAGES.rome, action:'trip'},
  {id:'colosseum', city:'roma', day:'09-26', name:'Colosseum', lat:41.8902, lng:12.4922, tag:'flex', code:'C', eyebrow:'26 SEP · ANCIENT ROME', badge:'FLEX', meta:'古代ローマ', description:'帝国が「大衆に何を見せたか」を考える場所。', image:PLACE_IMAGES.rome, action:'story'},
  {id:'forum', city:'roma', day:'09-26', name:'Roman Forum', lat:41.8925, lng:12.4853, tag:'flex', code:'F', eyebrow:'26 SEP · ANCIENT ROME', badge:'FLEX', meta:'古代ローマ', description:'政治・宗教・商業が同じ場所に重なっていた都市の心臓部。', image:PLACE_IMAGES.rome, action:'story'},
  {id:'trevi', city:'roma', day:'09-26', name:'Trevi Fountain', lat:41.9009, lng:12.4833, tag:'wish', code:'T', eyebrow:'26 SEP · BAROQUE', badge:'WISH', meta:'夕方以降候補', description:'古代の水道とバロックの演出がつながる場所。', image:PLACE_IMAGES.rome, action:'story'},
  {id:'pantheon', city:'roma', day:'09-26', name:'Pantheon', lat:41.8986, lng:12.4769, tag:'flex', code:'P', eyebrow:'26 SEP · LAYERS', badge:'FLEX', meta:'古代→キリスト教', description:'2000年近く用途を変えながら残った「ローマの層」を象徴する建物。', image:PLACE_IMAGES.rome, action:'story'},
  {id:'vatican', city:'roma', day:'09-27', name:'Vatican Museums', lat:41.9065, lng:12.4536, tag:'planned', code:'V', eyebrow:'27 SEP · VATICAN', badge:'要確認', meta:'訪問予定 · 入場条件再確認', description:'無料日を想定した計画ですが、2026年9月27日の運用は旅行前に公式情報で最終確認します。', image:PLACE_IMAGES.rome, action:'trip'},
  {id:'st-peter', city:'roma', day:'09-27', name:"St. Peter's Basilica", lat:41.9022, lng:12.4539, tag:'flex', code:'S', eyebrow:'27 SEP · VATICAN', badge:'FLEX', meta:'バチカン', description:'ローマ帝国の中心からキリスト教世界の中心へ、都市の重心が動いたことを体感する場所。', image:PLACE_IMAGES.rome, action:'story'}
];

// Daily master plan. Items marked locked are paid/timed transport or verified fixed reservations.
demo.dayPlans = {
  '09-11': {date:'11 SEP', dow:'Fri', city:'paris', title:'Parisへ。旅の始まり', theme:'移動は固定。到着後は詰め込みすぎない。', items:[
    {time:'06:35', title:'BEG → CDG · Air Serbia JU240', meta:'09:15着 · 予約確認済み', status:'locked', placeId:null, image:CITY_IMAGES.paris},
    {time:'15:00', title:'Paris stay · check-in', meta:'Bagnolet · 7 nights', status:'locked', placeId:'paris-stay', image:CITY_IMAGES.paris},
    {time:'夕方', title:'近所で軽く散歩・休む', meta:'到着日は余白を残す', status:'flex', placeId:null, image:CITY_IMAGES.paris}
  ]},
  '09-12': {date:'12 SEP', dow:'Sat', city:'paris', title:'左岸・西側と、夜のパリ', theme:'教会から帝国のモニュメントへ。最後は夜景。', items:[
    {time:'午前', title:'Saint-Sulpice', meta:'左岸 · FLEX', status:'flex', placeId:'saint-sulpice', image:CITY_IMAGES.paris},
    {time:'午前', title:'Saint-Étienne-du-Mont', meta:'左岸 · FLEX', status:'flex', placeId:'saint-etienne', image:CITY_IMAGES.paris},
    {time:'午後', title:'Petit Palais → Champs-Élysées', meta:'西側 · FLEX / WISH', status:'flex', placeId:'petit-palais', image:CITY_IMAGES.paris},
    {time:'夕方', title:'Invalides / Pont Alexandre III', meta:'夕景へつなぐ', status:'flex', placeId:'alexandre', image:CITY_IMAGES.paris},
    {time:'夜', title:'Eiffel Tower', meta:'夜景 · FLEX', status:'flex', placeId:'eiffel', image:CITY_IMAGES.paris},
    {time:'21:35', title:'AURA Invalides', meta:'購入未完了・問い合わせ中', status:'wish', placeId:'aura', image:CITY_IMAGES.paris}
  ]},
  '09-13': {date:'13 SEP', dow:'Sun', city:'paris', title:'右岸からモンマルトルへ', theme:'「華やかなパリ」がどう作られたかを歩く。', items:[
    {time:'昼', title:'Montmartre lunch', meta:'昼食候補', status:'wish', placeId:'montmartre', image:CITY_IMAGES.paris},
    {time:'午後', title:'Galeries Lafayette rooftop', meta:'展望 · FLEX', status:'flex', placeId:'galeries', image:CITY_IMAGES.paris},
    {time:'午後', title:'Palais Garnier → Madeleine', meta:'右岸 · FLEX', status:'flex', placeId:'opera', image:CITY_IMAGES.paris},
    {time:'午後', title:'Palais-Royal → Tuileries', meta:'中心部 · FLEX', status:'flex', placeId:'palais-royal', image:CITY_IMAGES.paris},
    {time:'夕方', title:'Sacré-Cœur / Montmartre', meta:'サンセット', status:'flex', placeId:'montmartre', image:CITY_IMAGES.paris}
  ]},
  '09-14': {date:'14 SEP', dow:'Mon', city:'paris', title:'Disney day', theme:'今日は一日遊ぶ。ほかの予定は足さない。', items:[
    {time:'終日', title:'Disneyland Paris', meta:'FULL DAY', status:'locked', placeId:'disney', image:CITY_IMAGES.paris}
  ]},
  '09-15': {date:'15 SEP', dow:'Tue', city:'paris', title:'美術と帝国のパリ', theme:'宗教・美術・ナポレオンを一本の流れで見る。', items:[
    {time:'09:00', title:'Notre-Dame', meta:'島の朝 · FLEX', status:'flex', placeId:'notre-dame', image:CITY_IMAGES.paris},
    {time:'10:15', title:'Musée d’Orsay', meta:'時間指定予定 · LOCKED扱い', status:'locked', placeId:'orsay', image:CITY_IMAGES.paris},
    {time:'17:00', title:'Invalides', meta:'ナポレオンの物語 · FLEX', status:'flex', placeId:'invalides', image:CITY_IMAGES.paris},
    {time:'18:00', title:'Rodin Museum', meta:'「考える人」中心 · WISH', status:'wish', placeId:'rodin', image:CITY_IMAGES.paris}
  ]},
  '09-16': {date:'16 SEP', dow:'Wed', city:'paris', title:'王宮から革命後の都市へ', theme:'ヴェルサイユ→ルーヴル→凱旋門で、権力の見せ方を比べる。', items:[
    {time:'09:00', title:'Versailles', meta:'09:00–15:30予定', status:'locked', placeId:'versailles', image:CITY_IMAGES.paris},
    {time:'17:00', title:'Louvre', meta:'17:00–20:00予定', status:'locked', placeId:'louvre', image:CITY_IMAGES.paris},
    {time:'20:30', title:'Arc de Triomphe', meta:'夜景 · FLEX', status:'flex', placeId:'arc', image:CITY_IMAGES.paris}
  ]},
  '09-17': {date:'17 SEP', dow:'Thu', city:'paris', title:'王妃の最後と、パリを離れる夜', theme:'旅クエストの伏線を回収して、夜行バスへ。', items:[
    {time:'09:00', title:'Sainte-Chapelle', meta:'予約予定', status:'locked', placeId:'sainte-chapelle', image:CITY_IMAGES.paris},
    {time:'10:30', title:'Conciergerie', meta:'FLEX', status:'flex', placeId:'conciergerie', image:CITY_IMAGES.paris},
    {time:'22:00', title:'Paris → Zürich · FlixBus', meta:'翌07:35着 · Gmail確認を正として使用', status:'locked', placeId:'bercy', image:CITY_IMAGES.zurich}
  ]},
  '09-18': {date:'18 SEP', dow:'Fri', city:'zurich', title:'Zürichを上から、水辺から', theme:'山・街・チョコレート・湖。地形を一日で理解する。', items:[
    {time:'07:35', title:'Zürich Bus Station 着', meta:'FlixBus', status:'locked', placeId:null, image:CITY_IMAGES.zurich},
    {time:'10:00', title:'Uetliberg', meta:'展望 · FLEX', status:'flex', placeId:'uetliberg', image:CITY_IMAGES.zurich},
    {time:'11:00', title:'Zürichberg', meta:'丘 · FLEX', status:'flex', placeId:'zurichberg', image:CITY_IMAGES.zurich},
    {time:'15:00', title:'Lindt Home of Chocolate', meta:'3名 CHF51 支払済み · LOCKED', status:'locked', placeId:'lindt', image:CITY_IMAGES.zurich},
    {time:'19:00', title:'Zürich sunset', meta:'Zürichhorn / Lindenhof', status:'flex', placeId:'zurichhorn', image:CITY_IMAGES.zurich}
  ]},
  '09-19': {date:'19 SEP', dow:'Sat', city:'luzern', title:'自然の日、Luzernへ', theme:'SBB day passで天候のいい方へ。21時までに宿へ。', items:[
    {time:'日中', title:'Nature day', meta:'SBB day pass · 行き先は天候で調整', status:'flex', placeId:'lucerne-lake', image:CITY_IMAGES.luzern},
    {time:'夕方', title:'Luzern old town', meta:'Chapel Bridge周辺 · FLEX', status:'flex', placeId:'chapel-bridge', image:CITY_IMAGES.luzern},
    {time:'16–21', title:'Luzern Youth Hostel check-in', meta:'21時以降不可 · LOCKED', status:'locked', placeId:'luzern-stay', image:CITY_IMAGES.luzern}
  ]},
  '09-20': {date:'20 SEP', dow:'Sun', city:'luzern', title:'Pilatusとアルプス', theme:'山を楽しみ、深夜バスの前に十分な余白を戻す。', items:[
    {time:'朝〜午後', title:'Pilatus', meta:'主役 · FLEX', status:'flex', placeId:'pilatus', image:CITY_IMAGES.luzern},
    {time:'夕方', title:'Luzernへ戻る', meta:'荷物・食事・休憩', status:'flex', placeId:null, image:CITY_IMAGES.luzern},
    {time:'深夜', title:'Landenbergへ移動', meta:'01:30バスに備える', status:'locked', placeId:'landenbergh', image:CITY_IMAGES.luzern}
  ]},
  '09-21': {date:'21 SEP', dow:'Mon', city:'milano', title:'早朝Milano着', theme:'睡眠不足前提。到着日は予定を軽くする。', items:[
    {time:'01:30', title:'Luzern → Milano · FlixBus', meta:'04:50着 · LOCKED', status:'locked', placeId:'landenbergh', image:CITY_IMAGES.milano},
    {time:'14:00', title:'Star Hostel check-in', meta:'荷物預かり不可', status:'locked', placeId:'milan-stay', image:CITY_IMAGES.milano},
    {time:'夕方', title:'Duomo / Galleria', meta:'体力があれば', status:'flex', placeId:'duomo', image:CITY_IMAGES.milano}
  ]},
  '09-22': {date:'22 SEP', dow:'Tue', city:'milano', title:'Lake Como day', theme:'水辺と山の景色を楽しむ日。悪天候ならMilanoへ戻す。', items:[
    {time:'終日', title:'Lake Como', meta:'日帰り · FLEX', status:'flex', placeId:'como', image:CITY_IMAGES.milano}
  ]},
  '09-23': {date:'23 SEP', dow:'Wed', city:'venezia', title:'MilanoからVeneziaへ', theme:'午前は固定移動。午後は水上都市を歩く。', items:[
    {time:'08:00', title:'Milano → Venezia Mestre · FlixBus', meta:'11:30着 · LOCKED', status:'locked', placeId:'lampugnano', image:CITY_IMAGES.venezia},
    {time:'午後', title:'San Marco → Rialto', meta:'Venezia本島 · FLEX', status:'flex', placeId:'san-marco', image:CITY_IMAGES.venezia},
    {time:'夜', title:'Mestre stay', meta:'1 night', status:'locked', placeId:'venice-stay', image:CITY_IMAGES.venezia}
  ]},
  '09-24': {date:'24 SEP', dow:'Thu', city:'firenze', title:'VeneziaからFirenzeへ', theme:'移動はまだ変更可能。到着後にルネサンスの中心を歩く。', items:[
    {time:'10:25?', title:'Venezia Mestre → Firenze', meta:'列車案 · 未予約', status:'wish', placeId:'mestre-station', image:CITY_IMAGES.firenze},
    {time:'15:00', title:'hu Firenze check-in', meta:'1 night · 予約済み', status:'locked', placeId:'florence-stay', image:CITY_IMAGES.firenze},
    {time:'夕方', title:'Duomo → Ponte Vecchio', meta:'旧市街 · FLEX', status:'flex', placeId:'florence-duomo', image:CITY_IMAGES.firenze}
  ]},
  '09-25': {date:'25 SEP', dow:'Fri', city:'roma', title:'FirenzeからRomaへ', theme:'列車はまだ変更可能。ローマ到着後は軽めに。', items:[
    {time:'10:35?', title:'Firenze → Roma', meta:'列車案 · 未予約', status:'wish', placeId:'roma-arrival', image:CITY_IMAGES.roma},
    {time:'午後', title:'Roma check-in / 散歩', meta:'ホテル情報はまだ未登録', status:'wish', placeId:null, image:CITY_IMAGES.roma}
  ]},
  '09-26': {date:'26 SEP', dow:'Sat', city:'roma', title:'2000年のRomaを歩く', theme:'古代ローマからバロックまで、街の層を重ねて見る。', items:[
    {time:'午前', title:'Colosseum → Roman Forum', meta:'古代ローマ · FLEX', status:'flex', placeId:'colosseum', image:CITY_IMAGES.roma},
    {time:'午後', title:'Pantheon', meta:'時代の層 · FLEX', status:'flex', placeId:'pantheon', image:CITY_IMAGES.roma},
    {time:'夕方', title:'Trevi Fountain', meta:'行けたら', status:'wish', placeId:'trevi', image:CITY_IMAGES.roma}
  ]},
  '09-27': {date:'27 SEP', dow:'Sun', city:'roma', title:'Vatican day', theme:'帝国の首都からキリスト教世界の中心へ。', items:[
    {time:'午前', title:'Vatican Museums', meta:'訪問予定 · 入場条件は最終確認必要', status:'wish', placeId:'vatican', image:CITY_IMAGES.roma},
    {time:'午後', title:"St. Peter's Basilica", meta:'FLEX', status:'flex', placeId:'st-peter', image:CITY_IMAGES.roma}
  ]},
  '09-28': {date:'28 SEP', dow:'Mon', city:'roma', title:'帰宅予定', theme:'移動情報が入ったらLOCKEDにする。', items:[
    {time:'—', title:'Return home', meta:'帰宅便・移動がまだ未登録', status:'wish', placeId:null, image:CITY_IMAGES.roma}
  ]}
};

// Reservation / transport truth. Secret codes intentionally omitted.
demo.tripItems = [
  {type:'move', icon:'✈', title:'BEG → CDG · Air Serbia JU240', meta:'11 Sep · 06:35 → 09:15 · Gmail/Calendar確認', status:'verified'},
  {type:'stay', icon:'⌂', title:'Paris stay', meta:'11 → 18 Sep · 7 nights · check-in 15:00', status:'verified'},
  {type:'move', icon:'↗', title:'Paris → Zürich · FlixBus', meta:'17 Sep 22:00 → 18 Sep 07:35 · ¥20,984支払済み', status:'verified'},
  {type:'stay', icon:'⌂', title:'Viadukt Apartments · Zürich', meta:'18 → 19 Sep · 1 night · Gmail確認', status:'verified'},
  {type:'ticket', icon:'◇', title:'Lindt Home of Chocolate', meta:'18 Sep 15:00 · 3名 CHF51 · 支払済み', status:'verified'},
  {type:'ticket', icon:'!', title:'AURA Invalides', meta:'12 Sep 21:35を問い合わせ中 · 購入未完了', status:'attention'},
  {type:'stay', icon:'⌂', title:'Luzern Youth Hostel', meta:'19 → 20 Sep · 1 night · 朝食付き · 21時までに到着', status:'verified'},
  {type:'ticket', icon:'◇', title:'SBB nature day', meta:'19 Sep · day pass計画 · 支払済みメモあり', status:'planned'},
  {type:'move', icon:'↗', title:'Luzern → Milano · FlixBus', meta:'21 Sep · 01:30 → 04:50 · ¥15,076支払済み', status:'verified'},
  {type:'stay', icon:'⌂', title:'Star Hostel San Siro Fiera', meta:'21 → 23 Sep · 2 nights · 荷物預かり不可', status:'verified'},
  {type:'move', icon:'↗', title:'Milano → Venezia Mestre · FlixBus', meta:'23 Sep · 08:00 → 11:30 · ¥4,066支払済み', status:'verified'},
  {type:'stay', icon:'⌂', title:'S Marco Apartments · Mestre', meta:'23 → 24 Sep · 1 night · Booking領収書確認', status:'verified'},
  {type:'move', icon:'↗', title:'Venezia → Firenze · train', meta:'24 Sep · 10:25頃案 · 未予約', status:'planned'},
  {type:'stay', icon:'⌂', title:'hu Firenze Camping in Town', meta:'24 → 25 Sep · 1 night · 9/20 23:59までキャンセル無料', status:'verified'},
  {type:'move', icon:'↗', title:'Firenze → Roma · train', meta:'25 Sep · 10:35頃案 · 未予約', status:'planned'},
  {type:'stay', icon:'⌂', title:'Roma stay', meta:'25 Sep以降 · 宿泊情報がまだ見つかっていません', status:'attention'},
  {type:'move', icon:'↗', title:'Return home', meta:'28 Sep · 帰宅移動がまだ未登録', status:'attention'}
];

// Map nearby suggestions by city. Later this is replaced by live distance calculation from the 3-person wish list.
demo.nearbyByCity = {
  paris:{name:'Galeries Lafayette rooftop', meta:'無料展望 · FLEXに追加可能', walk:'近くなら提案', wishers:['1','A'], image:CITY_IMAGES.paris},
  zurich:{name:'Lindenhof', meta:'旧市街の夕景 · WISH', walk:'夕景候補', wishers:['2'], image:CITY_IMAGES.zurich},
  luzern:{name:'Chapel Bridge', meta:'旧市街 · FLEX', walk:'短時間で寄れる', wishers:['A','1'], image:CITY_IMAGES.luzern},
  milano:{name:'Galleria Vittorio Emanuele II', meta:'Duomo隣 · WISH', walk:'徒歩圏', wishers:['1'], image:CITY_IMAGES.milano},
  venezia:{name:'Rialto Bridge', meta:'交易都市の中心 · FLEX', walk:'散歩ルート', wishers:['A','2'], image:CITY_IMAGES.venezia},
  firenze:{name:'Ponte Vecchio', meta:'夕方散歩 · FLEX', walk:'旧市街', wishers:['2'], image:CITY_IMAGES.firenze},
  roma:{name:'Trevi Fountain', meta:'夜に寄れたら · WISH', walk:'夕方候補', wishers:['1','2'], image:CITY_IMAGES.roma}
};
demo.nearbyWish = demo.nearbyByCity.paris;

// Full daily itinerary UI.
let selectedTripDayKey = '09-12';

renderTimeline = function renderFullTimeline() {
  const plan = demo.dayPlans[selectedTripDayKey] || demo.dayPlans['09-12'];
  const intro = $('#screen-today .page-intro');
  if (intro) {
    intro.innerHTML = `
      <p class="eyebrow">TODAY / PLAN</p>
      <div class="date-title-row">
        <div><h1>${plan.date} <span>${plan.dow}</span></h1><p>${demo.cities.find(c => c.id === plan.city)?.name || ''} · ${plan.title}</p></div>
        <button class="soft-icon" type="button" id="replanButton" aria-label="予定を組み替える">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 7h-8"/><path d="m17 4 3 3-3 3"/><path d="M4 17h8"/><path d="m7 14-3 3 3 3"/><path d="M7 7h1"/><path d="M16 17h1"/></svg>
        </button>
      </div>`;
  }

  const theme = $('#screen-today .day-theme-card');
  if (theme) theme.querySelector('strong').textContent = plan.theme;

  let rail = $('#tripDayRail');
  if (!rail) {
    rail = document.createElement('div');
    rail.id = 'tripDayRail';
    rail.className = 'trip-day-rail';
    const themeCard = $('#screen-today .day-theme-card');
    themeCard?.insertAdjacentElement('beforebegin', rail);
  }
  rail.innerHTML = Object.entries(demo.dayPlans).map(([key, day]) => `
    <button type="button" class="trip-day-chip ${key === selectedTripDayKey ? 'active' : ''}" data-day-key="${key}">
      <span>${day.date.split(' ')[0]}</span><small>${day.dow}</small>
    </button>`).join('');
  rail.querySelectorAll('[data-day-key]').forEach(btn => btn.addEventListener('click', () => {
    selectedTripDayKey = btn.dataset.dayKey;
    renderTimeline();
    if (typeof setMapCity === 'function') setMapCity(demo.dayPlans[selectedTripDayKey].city, false);
  }));

  $('#timeline').innerHTML = plan.items.map(item => `
    <article class="timeline-item ${item.status}" ${item.placeId ? `data-timeline-place="${item.placeId}"` : ''}>
      <div class="timeline-time">${item.time}</div>
      <div class="timeline-line"><span class="timeline-dot"></span></div>
      <button class="timeline-card" type="button" ${item.placeId ? '' : 'disabled'}>
        <div>
          <h3>${item.title}</h3>
          <p>${item.meta}</p>
          <span class="status-badge ${item.status}">${item.status === 'locked' ? '🔒 LOCKED' : item.status === 'wish' ? '♡ WISH' : '◐ FLEX'}</span>
        </div>
        <img src="${item.image}" alt="" loading="lazy" />
      </button>
    </article>`).join('');
  $$('[data-timeline-place]').forEach(row => row.addEventListener('click', () => {
    const place = demo.mapPlaces.find(p => p.id === row.dataset.timelinePlace);
    if (!place) return;
    if (typeof setMapCity === 'function') setMapCity(place.city, false);
    switchScreen('map');
    setTimeout(() => selectMapPlace(place.id), 120);
  }));

  // Rebind button because the intro is re-rendered.
  const replan = $('#replanButton');
  if (replan) replan.addEventListener('click', () => $('#replanDialog')?.showModal());
};

renderTrip = function renderFullTrip(filter = currentTripFilter) {
  const items = demo.tripItems.filter(x => filter === 'all' || x.type === filter);
  const label = status => status === 'verified' ? '✓ VERIFIED' : status === 'attention' ? '! CHECK' : '◌ PLANNED';
  $('#tripList').innerHTML = items.map(item => `
    <article class="trip-item ${item.status}" data-type="${item.type}">
      <span class="trip-icon">${item.icon}</span>
      <div><h3>${item.title}</h3><p>${item.meta}</p></div>
      <span class="verified ${item.status}">${label(item.status)}</span>
    </article>`).join('');

  const conflict = $('.conflict-card');
  if (conflict) conflict.innerHTML = `
    <div class="conflict-top"><span>!</span><strong>いま確認が必要なのは2つ</strong></div>
    <div class="compare-row correct"><span>Paris → Zürich</span><b>到着 07:35</b></div>
    <p>手入力の07:15ではなく、予約確認メールの07:35を正として表示しています。</p>
    <div class="compare-row"><span>AURA Invalides</span><b>未購入</b></div>
    <p>9/12 21:35を問い合わせ中。先方からは9:30以降に予約窓口へ電話する案内が届いています。</p>
    <div class="compare-row"><span>Roma stay / 帰宅</span><b>未登録</b></div>
    <p>ローマ宿と9/28の帰宅移動は、Gmail / Calendarから確定予約をまだ確認できていません。</p>`;
};

// Hotel all-day calendar events use an exclusive end date. Normalize before comparing
// with checkout dates; this removes the false 1-day “conflict” shown in the earlier prototype.
const truthCard = $('.truth-card');
if (truthCard) truthCard.querySelector('p:last-child').textContent = 'Gmail ＞ Calendar ＞ 手入力。Calendarの終日予定は終了日を正規化してから照合します。';
