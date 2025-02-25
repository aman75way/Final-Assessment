import requests
from bs4 import BeautifulSoup

def scrape_jobs(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")

    jobs = []
    for job_card in soup.find_all("div", class_="job-listing"):
        title = job_card.find("h2").text.strip()
        company = job_card.find("div", class_="company").text.strip()
        location = job_card.find("div", class_="location").text.strip()
        jobs.append({"title": title, "company": company, "location": location})

    return jobs
