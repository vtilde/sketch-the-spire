import json
import random
import datetime
import boto3

#370 cards

aws = boto3.client("dynamodb")
# table = aws.get_item(TableName="SketchTheSpire-DailyCard")
# aws.put_item(TableName="SketchTheSpire-DailyCard", Item={
#     "Date": {"S": "2026-04-01"},
#     "CardName": {"S": "Green-Strike"}
# })

schedule = {}
cards = list(json.load(open("data/cardData.json", "r")).keys())
random.shuffle(cards)
print(len(cards))

today = datetime.date.today()
for i in range(370*4):
    card_date = (today + datetime.timedelta(days=i)).strftime("%Y-%m-%d")
    # print(card_date + " " + cards[i%370])
    aws.put_item(TableName="SketchTheSpire-DailyCard", Item={
        "Date": {"S": card_date},
        "CardName": {"S": cards[i%370]}
    })

