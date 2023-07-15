import cheerio from "cheerio";
import fetch from "node-fetch";

// const GROUP_ID = process.env.GROUP_ID;
// ここは環境変数にせず、ユーザ入力にしてもらう
// 登壇者のステータス
const STATUS = '発表する人';


// ここもユーザ入力に切り替える
let URL = `https://kstm.connpass.com/event/289504/`;
URL += "participation/#participants"

const user_agent = "Mozilla/5.0";

/*
async function GetEventUrl() {
  let res = await fetch(URL, {
    method: "GET",
    headers: {
      "User-Agent": user_agent,
    },
  });
  res = await res.json();
  // const latest_event = res.events[0];

  let event_url = latest_event.event_url;
  event_url += "participation/#participants";

  return GetParticipationName(event_url);
}
*/

// 登壇者情報をスクレイピング
async function GetParticipationName(event_url) {
  let data = await fetch(URL, {
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

(async function () {
  let participants = await GetParticipationName();
  console.log(participants);
})();
