# 家庭闖關村（PWA）

把考卷變成短任務小遊戲，兩個孩子一起蓋村莊。名詞定義見上一層的 `../CONTEXT.md`。

## 開發

```bash
npm install
npm run dev      # http://localhost:5173，同一個 Wi-Fi 的平板可用 http://<電腦IP>:5173 試玩
npm run build    # 輸出到 dist/
```

在區網用 `http://` 試玩時，平板可以玩，但**不能離線、也不能正式安裝**；要安裝到主畫面並離線使用，必須放到 HTTPS 網址。

## 結構

| 位置 | 內容 |
|---|---|
| `src/data/g4u1.ts`、`g1u1.ts` | 題庫：四上「一億以內的數」、一上「10 以內的數」。`paper` 開頭的 id 是單元卷原題 |
| `src/data/types.ts` | 10 種題型的資料格式 |
| `src/games/` | 每種題型對應的小遊戲元件 |
| `src/screens/Play.tsx` | 答題流程：引導重試、魔王關交卷檢討與訂正 |
| `src/data/village.ts` | 村莊建築與獎勵數量 |
| `src/lib/store.ts` | 進度與村莊，存在平板本機（localStorage），不跨裝置同步 |

## 新增一個單元

1. 仿照 `g4u1.ts` 建一個新檔，題目分成 4～6 個短任務，`boss` 放整份單元卷。
2. 加進 `src/data/units.ts` 的 `units` 陣列。
