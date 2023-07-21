import express from 'https://esm.sh/express?target=denonext';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';
import cheerio from 'cheerio';
import cors from 'cors';
import httpProxy from 'http-proxy';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());

const user_agent = 'Mozilla/5.0'


// 登壇者情報をスクレイピング
async function GetParticipationName(event_url, STATUS) {
  event_url += 'participation/#participants';
  let data = await fetch(event_url, {
    method: "GET",
    headers: {
      "User-Agent": user_agent,
    },
  });
  data = await data.text();

  const $ = cheerio.load(data);
  let participants = [];

  // 登壇者情報を抽出
  $(".user", data).each(function () {
    const user_status = $(this).find(".label_ptype_name").text();

    if (user_status === STATUS) {
      let user = $(this).find(".display_name").children("a").text();
      participants.push(user);
    }
  });

  return participants;
}


// 静的ファイルの配信
app.use(express.static(path.join(__dirname, '')));

/*
// プロキシサーバの設定
const proxyTarget = 'https://lt-host-assistant.deno.dev/'; // プロキシ先のエンドポイントURLに置き換えてください
const proxy = httpProxy.createProxyServer({
  target: proxyTarget,
  headers: {
    'User-Agent': user_agent,
  },
  secure: false
  });


// エラーハンドリング
proxy.on('error', (err, req, res) => {
  console.error('プロキシエラー:', err);
  res.writeHead(500, { 'Content-Type': 'text/plain' });
  res.end('プロキシエラーが発生しました');
});


// /api/speaker へのリクエストをプロキシサーバに中継させる
app.use('/api/speaker', (req, res) => {
  proxy.web(req, res);
});

*/

app.get('/api/speaker', async (req, res) => {
  const eventUrl = req.query.eventUrl;
  const status = req.query.status;


  try {
    const participants = await GetParticipationName(eventUrl, status);
    res.json(participants);
  } catch (error) {
    
    res.status(500).json({ error: 'Failed to fetch participants' });
}
});

app.listen(port, () => {
  console.log(`サーバーがポート${port}で起動しました。`);
});
