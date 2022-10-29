import pymongo
import scrapfunction
import datetime

client = pymongo.MongoClient("mongodb://localhost:27017")
mydb = client['Jobs']
colection = mydb['alljobs']

newJobs = scrapfunction.loopFunction()
for index,item in enumerate(newJobs[::-1]):
    item["datetime"] = datetime.datetime.now()
    colection.insert_one(item)