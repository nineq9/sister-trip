# Sister Trip

3人で使う、旅行前・旅行中・帰国後までつながる高性能な旅のしおり PWA。

## Implemented

- HOME: 次の都市、カウントダウン、都市のストーリー、旅クエスト
- TODAY: LOCKED / FLEX / WISH の予定管理
- Smart Replan: 遅延・疲労・雨でも LOCKED を動かさず候補を組み替えるUI
- MAP: Leaflet + OpenStreetMap、WISHフィルタ、拠点表示
- Offline fallback: Service Worker + 圏外用簡易マップ
- Add Place: 「絶対行きたい / 行けたら」を追加
- TRIP: ホテル・交通・予約を1画面に集約
- Reservation Truth: Gmail > Calendar > 手入力という確認ルール
- STORY: 街全体の背景、現地で見るポイント、端末読み上げ音声
- QUEST: 旅の「伏線」をヒント形式で体験
- AFTER TRIP: 帰国後の旅画像出力を見据えたUI
- Supabase Auth: 3人それぞれのログイン
- Invite link: オーナーが妹2人を招待
- Realtime: WISH / itinerary / quest progress 用の共有基盤
- RLS: 旅行メンバー以外は旅行データを読めない構成

## Data architecture

Supabase に `trips`, `trip_members`, `cities`, `places`, `itinerary_items`, `wishes`, `reservation_checks`, `quests`, `quest_progress`, `trip_invites` を用意済みです。

有料・時間指定の予定は `locked`、組み替え可能な予定は `flex`、候補は `wish` として扱います。

## Privacy

このリポジトリにはホテルの正確な住所、予約番号、暗証番号、QR、Gmail本文などの個人情報をコミットしません。公開可能なUIコードと写真URLだけを置き、実データは認証 + RLS が有効なSupabase側へ保存する設計です。

Supabaseのフロントエンド用 publishable key は公開されることを前提としたキーで、データアクセスはRLSで制御します。

## Run locally

```bash
python3 -m http.server 8000
```

`http://localhost:8000` を開きます。Service Worker は localhost / HTTPS で動きます。

## Remaining production wiring

- Gmail / Google Calendar の本番OAuth取り込み
- 実際の予約情報・ホテル・交通データの非公開インポート
- 各都市の写真・ストーリー・クエスト・音声ガイドの充実
- 旅行後の感想画像ジェネレーター
