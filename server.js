import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';
import cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

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

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});



app.get('/api/speaker', async (req, res) => {
const eventUrl = 'https://kstm.connpass.com/event/289504/';
const status = '発表する人';


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
