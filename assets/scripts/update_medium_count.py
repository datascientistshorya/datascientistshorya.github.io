import json
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path


MEDIUM_FEED = "https://medium.com/feed/@its.shoryabisht"

STATS_FILE = Path("medium-stats.json")


def fetch_medium_feed():
    request = urllib.request.Request(
        MEDIUM_FEED,
        headers={
            "User-Agent": "Mozilla/5.0"
        }
    )

    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read()


def extract_article_ids(xml_data):
    root = ET.fromstring(xml_data)

    article_ids = []

    for item in root.findall(".//item"):
        guid = item.find("guid")
        link = item.find("link")

        if guid is not None and guid.text:
            article_id = guid.text.strip()
        elif link is not None and link.text:
            article_id = link.text.strip()
        else:
            continue

        article_ids.append(article_id)

    return article_ids


def main():
    if not STATS_FILE.exists():
        raise FileNotFoundError("medium-stats.json was not found.")

    with STATS_FILE.open("r", encoding="utf-8") as file:
        stats = json.load(file)

    current_count = int(stats.get("count", 156))
    seen = set(stats.get("seen", []))

    xml_data = fetch_medium_feed()
    current_articles = extract_article_ids(xml_data)

    # First run:
    # Store the currently visible RSS articles without changing
    # the verified Medium lifetime count of 156.
    if not seen:
        stats["seen"] = current_articles
        stats["count"] = current_count

        with STATS_FILE.open("w", encoding="utf-8") as file:
            json.dump(stats, file, indent=2)
            file.write("\n")

        print(
            f"Initialised Medium tracking at {current_count} articles."
        )
        print(
            f"Recorded {len(current_articles)} current RSS articles."
        )
        return

    new_articles = [
        article_id
        for article_id in current_articles
        if article_id not in seen
    ]

    if new_articles:
        current_count += len(new_articles)

        print(
            f"Detected {len(new_articles)} new Medium article(s)."
        )
    else:
        print("No new Medium articles detected.")

    updated_seen = list(dict.fromkeys(
        list(seen) + current_articles
    ))

    # Keep the tracking file reasonably small.
    updated_seen = updated_seen[-5000:]

    stats["count"] = current_count
    stats["seen"] = updated_seen

    with STATS_FILE.open("w", encoding="utf-8") as file:
        json.dump(stats, file, indent=2)
        file.write("\n")

    print(f"Medium article count: {current_count}")


if __name__ == "__main__":
    main()
