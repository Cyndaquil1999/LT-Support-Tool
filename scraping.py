import requests, os
from bs4 import BeautifulSoup
from dotenv import load_dotenv

# 環境変数からの呼び出し
load_dotenv()
GROUP_ID = os.environ["GROUP_ID"]
STATUS = os.environ['PARTICIPANTS_STATUS']

# 所属団体のイベント一覧を取得できる
URL = f'https://connpass.com/api/v1/event/?series_id={GROUP_ID}'

# ここデフォルト値では403返されます
user_agent = "Mozilla/5.0"

res = requests.get(URL, headers={"User-Agent": user_agent})
res = res.json()


latest_event = res['events'][0]

# 直近イベントのリンクを取得
event_url = latest_event['event_url']
event_url += 'participation/#participants'

data = requests.get(event_url, headers={"User-Agent": user_agent})
data = data.text

soup = BeautifulSoup(data, 'html.parser')

# htmlタグからユーザ情報がある辺りを抽出
users = soup.find_all(class_='user')
participants = []
for user in users:
    span = user.find('span', class_='label_ptype_name')
    
    # 登壇者を指すステータスでフィルタ
    if span and span.text == STATUS:
        account_name = user.find('img')['alt']
        participants.append(account_name)
        
# TODO: 標準出力に渡す処理から、アプリに渡す処理に変更
print(participants)