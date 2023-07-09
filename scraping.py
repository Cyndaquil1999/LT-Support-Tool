import requests, os
from bs4 import BeautifulSoup
from dotenv import load_dotenv

#環境変数からの呼び出し
load_dotenv()
GROUP_ID = os.environ["GROUP_ID"]
STATUS = os.environ['PARTICIPANTS_STATUS']

URL = f'https://connpass.com/api/v1/event/?series_id={GROUP_ID}'

#ここデフォルト値では403返されます
user_agent = "Mozilla/5.0"

res = requests.get(URL, headers={"User-Agent": user_agent})
res = res.json()

latest_event = res['events'][0]

event_url = latest_event['event_url']
event_url += 'participation/#participants'

data = requests.get(event_url, headers={"User-Agent": user_agent})
data = data.text

soup = BeautifulSoup(data, 'html.parser')

users = soup.find_all(class_='user')
participants = []
for user in users:
    span = user.find('span', class_='label_ptype_name')
    
    # ここは登壇者を指すステータスで良い
    if span and span.text == STATUS:
        account_name = user.find('img')['alt']
        participants.append(account_name)
        
print(participants)