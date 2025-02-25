from scraper import scrape_jobs
from database import save_jobs_to_db

if __name__ == "__main__":
    jobs = scrape_jobs("http://localhost:5173")
    save_jobs_to_db(jobs)
