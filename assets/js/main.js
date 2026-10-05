/* =========================================
   MOBILE NAVIGATION
   ========================================= */

const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector("nav");

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");

    menuButton.setAttribute("aria-expanded", isOpen);
    menuButton.textContent = isOpen ? "×" : "☰";
  });
}


/* =========================================
   GOOGLE ANALYTICS EVENT TRACKING
   ========================================= */

function track(eventName) {
  if (typeof gtag === "function") {
    gtag("event", eventName);
  }
}


/* =========================================
   GITHUB REPOSITORY COUNT
   ========================================= */

async function loadGitHubRepositoryCount() {
  const counter = document.getElementById("githubRepoCount");

  if (!counter) {
    return;
  }

  try {
    const response = await fetch(
      "https://api.github.com/users/datascientistshorya"
    );

    if (!response.ok) {
      throw new Error("GitHub API request failed");
    }

    const data = await response.json();

    const repositoryCount = Number(data.public_repos);

    if (!Number.isFinite(repositoryCount)) {
      throw new Error("Invalid GitHub repository count");
    }

    counter.textContent =
      repositoryCount +
      (repositoryCount === 1 ? " repo" : " repos");

  } catch (error) {
    console.error(
      "Unable to load GitHub repository count:",
      error
    );

    counter.textContent = "";
  }
}


/* =========================================
   MEDIUM ARTICLE COUNT
   ========================================= */

async function loadMediumArticleCount() {
  const counter = document.getElementById("mediumArticleCount");

  if (!counter) {
    return;
  }

  try {
    const response = await fetch(
      "medium-stats.json?cache=" + Date.now()
    );

    if (!response.ok) {
      throw new Error("Medium stats request failed");
    }

    const data = await response.json();

    const articleCount = Number(data.count);

    if (!Number.isFinite(articleCount)) {
      throw new Error("Invalid Medium article count");
    }

    counter.textContent =
      articleCount + (articleCount === 1 ? " article" : " articles");

  } catch (error) {
    console.error("Unable to load Medium article count:", error);

    // Keep the verified current count visible
    counter.textContent = "156 articles";
  }
}

/* =========================================
   LOAD LIVE SOCIAL COUNTS
   ========================================= */

loadGitHubRepositoryCount();
loadMediumArticleCount();
