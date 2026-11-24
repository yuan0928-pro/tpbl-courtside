# TPBL COURTSIDE｜七隊球員名單整合網站版

本版已把 2026–27 七隊球員名單整合到網站的「球員資料庫」頁面。名單顯示背號、球員、球隊、位置、身高、體重，並支援搜尋與球隊篩選。賽季場均數據表獨立保留，尚未取得的數據不會自行填造。

## GitHub + Netlify 更新步驟
1. 下載並解壓縮本 ZIP。
2. 打開裡面的 `tpbl-courtside` 資料夾。
3. 進入 GitHub 的 `tpbl-courtside` Repository，選 Add file → Upload files。
4. **把資料夾裡面的所有檔案和 `data` 資料夾一起上傳**。不要只上傳 ZIP，也不要只上傳 JSON。
5. 確認 GitHub 根目錄直接看到 `index.html`、`app.js`、`styles.css`、`netlify.toml`，並且有 `data/rosters.json`。
6. Commit changes。Netlify 連接 GitHub 時會自動重新部署。
7. 部署完成後到網站的「球員資料庫」頁面；如果仍是舊畫面，按 Ctrl+F5 強制重新整理。

正確檔案結構：
```
index.html
app.js
styles.css
netlify.toml
README.md
data/rosters.json
```

注意：本站是非官方球迷網站。球員名單資料已整合；球員場均數據、排行榜及賽事紀錄仍需另行匯入，不會因名單載入而自動出現。此版本仍沿用原有瀏覽器 localStorage 儲存手動輸入資料。
