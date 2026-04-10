import json
import random
import datetime
import boto3

#370 cards

# aws = boto3.client("dynamodb")

schedule = {}
cards = list(json.load(open("data/cardData.json", "r")).keys())
random.shuffle(cards)
print(len(cards))

today = datetime.date.today()
for i in range(370*4):
    schedule[(today + datetime.timedelta(days=i)).strftime("%Y-%m-%d")] = cards[i%370]

json.dump(schedule, open("data/schedule.json", "w"))

