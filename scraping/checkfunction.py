import pymongo 
client = pymongo.MongoClient("mongodb://localhost:27017")
mydb = client.Jobs
col = mydb["alljobs"]
top = col.find().sort("datetime" , pymongo.DESCENDING)


def checkTop(dictionary):
    if(top):
        if(dictionary["job_name"] == top[0]["job_name"] and dictionary["job_provider"] == top[0]["job_provider"] and dictionary["experience_required"] == top[0]["experience_required"] and dictionary["job_location"] == top[0]["job_location"] and dictionary["job_salary"] == top[0]["job_salary"] and dictionary["job_link"] == top[0]["job_link"] and dictionary["job_skills"] == top[0]["job_skills"]):
            return True
    return False    