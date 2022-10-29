from bs4 import BeautifulSoup
import requests
import re
import checkfunction

newJobs = []
stop_scraping = False

def scrap(page_no=1):
    page_link = requests.get(f"https://www.timesjobs.com/candidate/job-search.html?from=submit&searchType=Home_Search&luceneResultSize=25&postWeek=60&cboPresFuncArea=35&pDate=Y&sequence={page_no}&startPage=1").text
    soup = BeautifulSoup(page_link , 'lxml')
    job_list = soup.find_all('li' , class_="clearfix job-bx wht-shd-bx")

    for job in job_list:
        job_name = job_provider = details = experience_required = job_salary = job_location = job_skills = job_link = None


        if(job.header):
            if(job.header.h2.a.text):
                job_name = job.header.h2.a.text.strip()

            if(job.header.h3.text):
                job_provider = job.header.h3.text.strip()
                if(job.header.h3.span):
                    job_provider = re.sub(job.header.h3.span.text.strip() , "" , job_provider)
                    job_provider = job_provider[:-9]


        if(job.find('ul' , class_="top-jd-dtl clearfix")):
            details = job.find('ul' , class_="top-jd-dtl clearfix")
            details = details.find_all('li')
            if(details):
                for detail in details:
                    # print(detail)
                    if("card_travel" in detail.i.text):
                        experience_required = detail.text[11:].strip()
                    if("location_on" in detail.i.text):
                        job_location = detail.text[12:].strip()
                    if("rupee" in detail.i['class']):
                        job_salary = detail.text[1:].strip()


        if(job.find('ul' , class_="list-job-dtl clearfix")):
            details = job.find('ul' , class_="list-job-dtl clearfix")
            details = details.find_all('li')
            if(details):
                for detail in details:
                    if("Job Description" in detail.label.text):
                        if(detail.a):
                            job_link = detail.a['href']
                    if("KeySkills" in detail.label.text):
                        if(detail.span) :
                            skills = detail.span.text.strip()
                            skills = skills.split(",")   
                            job_skills = []    
                            for index,skill in enumerate(skills):
                                if(index==0):
                                    skill = skill[:-1]
                                elif(index==len(skills)-1):
                                    skill = skill[1:]
                                else:
                                    skill = skill[1:-1]           
                                job_skills.append(skill)


        dic = {"job_name": job_name, "job_provider": job_provider,"experience_required": experience_required,"job_location": job_location,"job_salary": job_salary,"job_link": job_link,"job_skills": job_skills}
        if(checkfunction.checkTop(dic)):
            global stop_scraping
            stop_scraping = True
            break
        newJobs.append(dic)


def loopFunction():
    page_no = 1
    while(not stop_scraping):
        scrap(page_no)
        page_no += 1
        if(page_no>40):
            break
    return newJobs    
         