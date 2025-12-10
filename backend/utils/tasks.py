{"id":"58363","variant":"standard"}
import os
import requests
from celery import shared_task
from backend.extensions import db
from backend.models.lead import Lead

HUNTER_API_KEY = os.getenv("HUNTER_API_KEY")

# Industry → companies mapping
INDUSTRY_COMPANIES = {
    "software": ["zoom.us", "microsoft.com", "google.com"],
    "finance": ["stripe.com", "paypal.com", "squareup.com"],
    "retail": ["amazon.com", "walmart.com", "target.com"],
    "healthcare": ["pfizer.com", "mckesson.com", "cvshealth.com"],
    "education": ["udemy.com", "byjus.com", "coursera.org"]
}


def fetch_emails_from_domain(domain):
    """Use Hunter.io to collect emails for a domain."""
    url = "https://api.hunter.io/v2/domain-search"

    params = {
        "domain": domain,
        "api_key": HUNTER_API_KEY
    }

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        emails = data.get("data", {}).get("emails", [])
        return emails
    except Exception as e:
        print(f"Hunter.io error for domain {domain}: {e}")
        return []


@shared_task
def fetch_leads_task(industry):
    """Main asynchronous Hunter.io task."""
    if industry not in INDUSTRY_COMPANIES:
        print(f"Industry not supported: {industry}")
        return 0

    companies = INDUSTRY_COMPANIES[industry]
    total_saved = 0

    for domain in companies:
        leads = fetch_emails_from_domain(domain)

        for e in leads:
            email = e.get("value")
            job_title = e.get("position")
            linkedin_url = e.get("linkedin")

            # Skip entries without email
            if not email:
                continue

            data = {
                "name": None,
                "email": email,
                "company": domain,
                "job_title": job_title,
                "linkedin_url": linkedin_url,
                "phone": None,
                "location": None,
                "industry": industry,
                "source": "Hunter.io",
                "apollo_id": None
            }

            try:
                Lead.create(**data)
                total_saved += 1
            except Exception:
                db.session.rollback()
                continue

    print(f"Finished Hunter.io task. Saved {total_saved} leads.")
    return total_saved
