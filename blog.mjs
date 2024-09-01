import { marked } from "./marked.esm.js";

var articles = [];
var currentArticleIndex = 0;

function failureHandler(error) {

}

function updateNavigation() {
    document.getElementById("prev-article").hidden = currentArticleIndex == 0;
    document.getElementById("next-article").hidden = currentArticleIndex == articles.length - 1;
}

function loadArticle(i) {
    currentArticleIndex = i;
    const articleUrl = articles[currentArticleIndex].download_url;
    document.getElementById("article").innerHTML = "<div class='loading'>Articles are loading...</div>";
    Promise.resolve(fetch(articleUrl).then(r => r.text()))
        .then(t => marked.parse(t))
        .then(m => document.getElementById("article").innerHTML = m)
        .then(m => updateNavigation())
        .catch(failureHandler);
}

function prevArticle() {
    loadArticle(currentArticleIndex - 1);
}

function nextArticle() {
    loadArticle(currentArticleIndex + 1);
}

function load(b) {
    // TODO add ability for deep linking with hash path later

    document.getElementById("prev-article").onclick = prevArticle;
    document.getElementById("next-article").onclick = nextArticle;
    const branch = b ? b : "live";
    const contentsUrl = "https://api.github.com/repositories/849627438/contents/articles?ref=" + branch;
    fetch(contentsUrl)
        .then(r => r.json())
        .then(j => j.sort((a, b) => a.name.localeCompare(b.name)))
        .then(j => articles = j)
        .then(j => loadArticle(j.length - 1))
        .catch(failureHandler);
}

export default load;
