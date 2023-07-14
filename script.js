const cheerio = require("cheerio");
require('dotenv').config();

// 環境変数からの呼び出し
const GROUP_ID = process.env.GROUP_ID;
const STATUS = process.env.PARTICIPANTS_STATUS;

// 所属団体のイベント一覧を取得できる
const URL = `https://connpass.com/api/v1/event/?series_id=${GROUP_ID}`;

//ここデフォルト値では403返されます
const user_agent = "Mozilla/5.0";

// 直近のイベントリンクを取得する関数
async function GetEventUrl() {
    let res = await fetch(URL, {
        method: "GET",
        headers: {
            "User-Agent": user_agent,
        }
    });
    res = await res.json();
    const latest_event = res.events[0];

    // 直近イベントのリンクを取得
    let event_url = latest_event.event_url;
    event_url += "participation/#participants";

    GetParticipationName(event_url);
}

// 発表する人の名前を取得する関数
async function GetParticipationName(event_url) {
    let data = await fetch(event_url, {
        method: "GET",
        headers: {
            "User-Agent": user_agent
        }
    });
    data = await data.text();

    const $ = cheerio.load(data);
    // htmlタグからユーザー情報のデータを取得
    $(".user", data).each(function() {
        const user_status = $(this).find(".label_ptype_name").text();
        //　登壇者を挿すステータスでフィルタ
        if (user_status == STATUS) {
            let user = $(this).find(".display_name").children("a").text();
            participants[participants.length] = user;
        }
    });
    console.log(participants);
}

let participants = [];
GetEventUrl();