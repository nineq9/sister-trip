# Sister Trip

3人で使う、旅行前・旅行中・帰国後までつながる高性能な旅のしおり PWA。

## v1 implemented

- HOME: 次の都市、カウントダウン、都市のストーリー、旅クエスト
- TODAY: LOCKED / FLEX / WISH の予定管理
- Smart Replan: 遅延・疲労・雨でも LOCKED を動かさず候補を組み替えるUI
- MAP: Leaflet + OpenStreetMap のスポット地図、WISHフィルタ、拠点表示
- Offline fallback: Service Worker とオフライン簡易マップ
- Add place: 3人それぞれが「絶対行きたい / 行けたら」を保存（現状は端末 localStorage）
- TRIP: ホテル・交通・予約を1画面に集約
- Reservation Truth: Gmail > Calendar > 手入力 の優先ルールをUI化
- STORY: 街全体の背景、現地で見るポイント、端末の読み上げ音声
- QUEST: 旅の「伏線」をヒント形式で体験
- AFTER TRIP: 帰国後の旅画像出力を見据えた画面

## Privacy note

このリポジトリが **Public の間は、ホテル住所、予約番号、QR、氏名、実際のGoogle連携情報をコミットしない** 方針です。
現在のデータはUI検証用に個人情報を除いたサンプルです。

本番の3人共有を有効化する前に、このリポジトリを Private にしてから、Supabase/Auth と Google OAuth を接続します。

## Run

ビルド不要の静的PWAです。

```bash
python3 -m http.server 8000
```

ブラウザで `http://localhost:8000` を開きます。
Service Worker は localhost / HTTPS で動きます。

## Next production wiring

1. Repository を Private に変更
2. Supabase project を作成し、3人のAuth / Realtime / Storageを接続
3. Google OAuth で Calendar + Gmail 予約情報の読み取りを接続
4. 本番のホテル・交通・予約データを投入
5. iPhone Safari の「ホーム画面に追加」で3人が利用
