# TPBL COURTSIDE — Phase 1

2026–27 TPBL 七隊數據平台（非官方球迷自製網站）。

## 第一階段已完成
- 七支 TPBL 球隊官方名稱與英文名稱目錄。
- 球員資料庫：搜尋、球隊篩選、場均數據排序。
- 球隊頁面：七隊資料卡；依本站已登錄賽果計算戰績。
- 賽事中心：登錄比賽日期、隊伍、比分與來源。
- 數據排行榜：得分、籃板、助攻、抄截、阻攻。
- 資料管理：新增球員/比賽時必填來源資訊；可匯出/匯入 JSON。
- 不再載入舊版虛構 DEMO 球員與比分；v2 使用空白資料庫，避免誤當官方數據。

## 官方參考入口
- TPBL 官網：https://tpbl.basketball/
- 球隊/聯盟介紹：https://tpbl.basketball/about
- 賽程：https://tpbl.basketball/schedule
- 球員數據：https://tpbl.basketball/stats/players
- 球隊數據：https://tpbl.basketball/stats/teams

七隊名稱依 TPBL 官方「關於聯盟」頁面列示：臺北台新戰神、新北中信特攻、新北國王、桃園台啤永豐雲豹、新竹御嵿攻城獅、福爾摩沙夢想家、高雄全家海神。

## 重要限制與資料品質
- 目前尚未串接 TPBL 官方 API；官方入口以外的資料需人工核對後登錄。
- 網站不會自動抓取或保證即時更新。官方資料未能確認時，請保留空白，不要猜測。
- 新增球員/比賽時請標示「TPBL 官方資料」或「人工補充」，並填寫來源網址/說明與資料日期。
- 本版本使用瀏覽器 localStorage，資料只存在輸入者目前的瀏覽器；其他訪客、其他裝置不會同步。
- 清除瀏覽器資料前請先匯出 JSON 備份。匯入備份會取代目前資料。
- 若要所有訪客共用資料、帳號權限及跨裝置同步，下一階段需加入 Supabase 等雲端資料庫與安全的管理權限設計。
- TPBL、球隊名稱/標誌、球員肖像及相關素材可能受商標或著作權規範；本專案不宣稱官方身分或背書。

## 更新到既有 Netlify 網站
1. 解壓縮本專案 ZIP。
2. 打開 GitHub 的 `tpbl-courtside` Repository。
3. 進入 Repository 根目錄，選擇 Add file → Upload files。
4. 上傳本資料夾內的 `index.html`、`styles.css`、`app.js`、`README.md`、`netlify.toml`，允許覆蓋同名檔案。
5. Commit changes。
6. Netlify 若已連接此 Repository，會自動開始部署；完成後重新整理網站。

## 本機預覽
直接用瀏覽器開啟 `index.html`。
