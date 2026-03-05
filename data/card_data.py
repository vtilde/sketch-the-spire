import os
import time
import csv
import requests
# import sqlite3
import json

reader = csv.reader(open("data/cards.csv", newline=""))
colours = {
    "Ironclad": "Red",
    "Silent": "Green",
    "Defect": "Blue",
    "Watcher": "Purple",
    "Colorless": "Colorless",
    "Curse": "Colorless",
    "Status": "Colorless"
}

# con = sqlite3.connect("cards.db")
# cur = con.cursor()
# cur.execute("CREATE TABLE IF NOT EXISTS cards (name, type, rarity, colour, cost, description, description_upgraded)")

data = {}

colour = ""
next(reader)
for i in reader:
    if i[0].endswith("Cards"):
        colour = i[0].split(" ")[0]
    else:
#         cur.execute("""INSERT INTO cards VALUES (?,?,?,?,?,?,?)""", (
#             i[0],
#             i[1],
#             i[2],
#             colour,
#             i[3],
#             i[4],
#             i[5]
#         ))
        data[colours[colour] + "-" + i[0]] = {
            "name": i[0],
            "type": i[1],
            "rarity": i[2],
            "colour": colours[colour],
            "cost": i[3],
            "description": i[4],
            "descriptionUpgraded": i[5]
        }

# con.commit()
with open("data/cardData.json", "w") as f:
    json.dump(data, f)

for i in data.values():
    art_string = f"https://slaythespire.wiki.gg/images/{i['colour']}-{i['name'].replace(" ","")}-Art.png"
    filename = f"data/art/{i['colour']}-{i['name']}.png"
    print(filename)
    if not os.path.exists(filename):
        r = requests.get(art_string)
        while r.status_code != 200:
            print(f"Status {str(r.status_code)} for {i['name']}")
            time.sleep(60)
        if r.status_code == 200:
            with open(filename, "wb") as f:
                f.write(r.content)
        else:
            print(r.status_code, i["name"])