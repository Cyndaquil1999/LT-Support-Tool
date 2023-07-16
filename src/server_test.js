import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';
import cheerio from 'cheerio';
import cors from 'cors';
import WebSocket from 'websocket';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3001;

app.use(cors());

const user_agent = 'Mozilla/5.0';

// WebSocketサーバーの作成
const server = require('http').createServer(app);
const wsServer = new WebSocket.server({
  httpServer: server,
  autoAcceptConnections: false
});

let connections = []; // WebSocket接続の保存用

// 新しいWebSocket接続の処理
wsServer.on('request', function(request) {
  const connection = request.accept(null, request.origin);
  
  // 接続が確立されたらconnectionsに追加
  connections.push(connection);
  
  // 接続がクローズされたらconnectionsから削除
  connection.on('close', function() {
    const index = connections.indexOf(connection);
    if (index !== -1) {
      connections.splice(index, 1);
    }
  });
});

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

app.get('/api/speaker', async (req, res) => {
  const eventUrl = req.query.eventUrl;
  const status = req.query.status;

  try {
    const participants = await GetParticipationName(eventUrl, status);
    res.json(participants);

    // パートナーのコネクションにデータを送信
    const dataToSend = JSON.stringify({ participants });
    connections.forEach(connection => {
      connection.sendUTF(dataToSend);
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch participants' });
  }
});

server.listen(port, () => {
  console.log(`サーバーがポート${port}で起動しました。`);
});
