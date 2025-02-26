from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
import json
import time
from webdriver_manager.chrome import ChromeDriverManager


def scrape_jobs():
    # Setup Chrome in headless mode
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)

    try:
        url = "http://localhost:5173"  # Update this if using a different local port
        driver.get(url)

        # Wait for job listings to load
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "job-title"))
        )

        # Get updated page source after JavaScript has executed
        page_source = driver.page_source
        soup = BeautifulSoup(page_source, "html.parser")

        # Find all job cards
        job_elements = soup.find_all("div", class_="MuiBox-root")  # Might need refinement

        print(f"Found {len(job_elements)} job listings.")

        jobs = []
        for job in job_elements:
            try:
                # Extract job ID from a hidden attribute (adjust based on actual HTML structure)
                job_id = job.get("data-id", "").strip() or job.get("id", "").strip()

                title = job.find("h6", class_="job-title").text.strip() if job.find("h6", class_="job-title") else ""
                company = job.find("p", class_="job-company").text.strip() if job.find("p", class_="job-company") else ""
                location_type = job.find("p", class_="job-location").text.strip() if job.find("p", class_="job-location") else ""
                skills = job.find("p", class_="job-skills").text.strip() if job.find("p", class_="job-skills") else ""

                # Split location & type if needed
                location, job_type = location_type.split("|") if "|" in location_type else (location_type, "")

                jobs.append({
                    "job_id": job_id,
                    "title": title,
                    "company": company,
                    "location": location.strip(),
                    "type": job_type.strip(),
                    "skills": skills.split(", ") if skills != "N/A" else []
                })
            except Exception as e:
                print(f"Error parsing job: {e}")

        driver.quit()

        # Save results to JSON
        with open("scraped_jobs.json", "w") as f:
            json.dump(jobs, f, indent=4)

        return jobs

    except Exception as e:
        driver.quit()
        print(f"Error: {e}")
        return []


if __name__ == "__main__":
    job_data = scrape_jobs()
    print(json.dumps(job_data, indent=4))
