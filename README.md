# TPBL COURTSIDE

台灣職業籃球數據網站的靜態網站專案。使用 HTML、CSS、JavaScript，不需要安裝套件或建置工具。

## 專案檔案
- `index.html`：網站頁面結構
- `styles.css`：網站樣式與手機版排版
- `app.js`：示範資料、排行榜、比賽紀錄、資料輸入與 JSON 備份
- `netlify.toml`：Netlify 部署設定

## 本機預覽
直接用瀏覽器開啟 `index.html` 即可。若瀏覽器限制本機檔案功能，可使用 VS Code 的 Live Server 擴充套件。

## Netlify 免費部署
1. 解壓縮 ZIP。
2. 前往 https://app.netlify.com/ 註冊或登入。
3. 開啟 https://app.netlify.com/drop 。
4. 將包含 `index.html`、`styles.css`、`app.js` 的專案資料夾拖進頁面。
5. 等待部署完成，Netlify 會提供一個 `*.netlify.app` 網址。
6. 可在 Netlify 網站設定中修改免費子網域名稱（若名稱可用）。

## GitHub + Netlify 自動更新
1. 在 https://github.com/ 建立新的 Repository，例如 `tpbl-courtside`。
2. 將本專案中的所有檔案上傳至 Repository 根目錄，確認 `index.html` 位於根目錄。
3. 在 Netlify 選擇 **Add new site → Import an existing project**。
4. 選擇 GitHub 並授權，挑選 `tpbl-courtside` Repository。
5. Build command 留空，Publish directory 填 `.`（或留空，依介面提示）。
6. 按 Deploy。之後推送 GitHub 更新，Netlify 會自動重新部署。

## 重要資料說明
- 目前球員、比分及戰績為虛構示範資料，不代表 TPBL 官方數據。
- 此版本尚未串接 TPBL 官方 API、即時比分或雲端資料庫。
- 新增資料會儲存在使用者目前瀏覽器的 `localStorage`。不同裝置或瀏覽器不會自動同步；清除網站資料也可能遺失。請定期使用「匯出 JSON 備份」。
- 公開網站的訪客各自有自己的瀏覽器資料；你在自己電腦新增的資料不會自動出現在其他訪客的畫面。
- 若要多人共用同一份資料、帳號登入、官方即時數據，需要後續串接雲端資料庫（例如 Supabase）及合法可用的數據來源。
- 本專案為非官方球迷自製作品，與 TPBL 無隸屬或背書關係。使用球隊標誌、照片、球員肖像或聯盟資料前，請確認相關授權與使用條款。
