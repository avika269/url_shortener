const API_URL = "https://url-shortener-1-l4nl.onrender.com";

const urlInput = document.getElementById("urlInput");
const shortenBtn = document.getElementById("shortenBtn");
const resultBox = document.getElementById("resultBox");
const shortUrl = document.getElementById("shortUrl");
const copyBtn = document.getElementById("copyBtn");
const openBtn = document.getElementById("openBtn");
const copyMessage = document.getElementById("copyMessage");
const shortenError = document.getElementById("shortenError");

const shortIdInput = document.getElementById("shortIdInput");
const analyticsBtn = document.getElementById("analyticsBtn");
const analyticsResult = document.getElementById("analyticsResult");
const analyticsError = document.getElementById("analyticsError");
const totalClicks = document.getElementById("totalClicks");
const displayShortId = document.getElementById("displayShortId");
const visitHistory = document.getElementById("visitHistory");

let currentShortId = "";

shortenBtn.addEventListener("click", shortenURL);

urlInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        shortenURL();
    }
});

async function shortenURL() {

    const url = urlInput.value.trim();

    shortenError.textContent = "";
    copyMessage.textContent = "";

    if (!url) {
        shortenError.textContent = "Please enter a URL.";
        return;
    }

    try {

        new URL(url);

    } catch (error) {

        shortenError.textContent = "Please enter a valid URL.";
        return;
    }

    shortenBtn.disabled = true;
    shortenBtn.textContent = "Creating...";

    try {

        const response = await fetch(`${API_URL}/url`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                url: url
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Unable to create short URL.");
        }

        currentShortId = data.id;

        const generatedURL = `${API_URL}/${currentShortId}`;

        shortUrl.value = generatedURL;

        shortIdInput.value = currentShortId;

        resultBox.classList.remove("hidden");

        analyticsResult.classList.add("hidden");

    } catch (error) {

        shortenError.textContent = error.message;

    } finally {

        shortenBtn.disabled = false;
        shortenBtn.textContent = "Shorten URL";
    }
}

copyBtn.addEventListener("click", async function () {

    if (!shortUrl.value) {
        return;
    }

    try {

        await navigator.clipboard.writeText(shortUrl.value);

        copyMessage.textContent = "Short URL copied successfully.";

        setTimeout(function () {
            copyMessage.textContent = "";
        }, 2000);

    } catch (error) {

        shortUrl.select();
        document.execCommand("copy");

        copyMessage.textContent = "Short URL copied.";
    }
});

openBtn.addEventListener("click", function () {

    if (!currentShortId) {
        return;
    }

    window.open(
        `${API_URL}/${currentShortId}`,
        "_blank"
    );
});

analyticsBtn.addEventListener("click", getAnalytics);

shortIdInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        getAnalytics();
    }

});

async function getAnalytics() {

    const shortId = shortIdInput.value.trim();

    analyticsError.textContent = "";
    analyticsResult.classList.add("hidden");

    if (!shortId) {
        analyticsError.textContent = "Please enter a short ID.";
        return;
    }

    analyticsBtn.disabled = true;
    analyticsBtn.textContent = "Loading...";

    try {

        const response = await fetch(
            `${API_URL}/url/analytics/${shortId}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Unable to get analytics.");
        }

        totalClicks.textContent = data.totalClicks;

        displayShortId.textContent = shortId;

        visitHistory.innerHTML = "";

        if (!data.analytics || data.analytics.length === 0) {

            const emptyMessage = document.createElement("div");

            emptyMessage.className = "empty-history";

            emptyMessage.textContent = "No visits yet.";

            visitHistory.appendChild(emptyMessage);

        } else {

            data.analytics.forEach(function (visit, index) {

                const historyItem = document.createElement("div");

                historyItem.className = "history-item";

                const timestamp = visit.timestamp;

                const date = new Date(timestamp);

                historyItem.textContent =
                    `Visit ${index + 1} — ${date.toLocaleString()}`;

                visitHistory.appendChild(historyItem);

            });

        }

        analyticsResult.classList.remove("hidden");

    } catch (error) {

        analyticsError.textContent = error.message;

    } finally {

        analyticsBtn.disabled = false;
        analyticsBtn.textContent = "View Analytics";
    }
}