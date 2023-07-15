import cheerio from "cheerio";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const GROUP_ID = process.env.GROUP_ID;
const STATUS = process.env.PARTICIPANTS_STATUS;

const URL = `https://connpass.com/api/v1/event/?series_id=${GROUP_ID}`;

const user_agent = "Mozilla/5.0";

async function GetEventUrl() {
  let res = await fetch(URL, {
    method: "GET",
    headers: {
      "User-Agent": user_agent,
    },
  });
  res = await res.json();
  const latest_event = res.events[0];

  let event_url = latest_event.event_url;
  event_url += "participation/#participants";

  return GetParticipationName(event_url);
}

async function GetParticipationName(event_url) {
  let data = await fetch(event_url, {
    method: "GET",
    headers: {
      "User-Agent": user_agent,
    },
  });
  data = await data.text();

  const $ = cheerio.load(data);
  let participants = [];

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
  let participants = await GetEventUrl();
  console.log(participants);
})();
