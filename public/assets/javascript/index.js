$(document).ready(function () {
    // Setting a reference to the article-container div, house dynamic content
    // add listener to any dynamially generated "save article"
    // scrape new article buttons
    var articleContainer = $(".article-container");
    $(document).on("click", ".btn.save", handleArticleScrape);
    $(document).on("click", ".scrape-new", handleArticleScrape);

    // Once page is ready
    initPage();

    function initPage() {
        //Empty the article container, run an AJAX request for any unsaved headlines
        articleContainer.empty();
        $.get("/api/headlines?saved=false")
            .then(function (data) {
                // if we have headlines, render to page
                if (data && data.length) {
                    renderArticles(data);
                }
                else {
                    renderEmpty();
                }
            });
    }
    function renderArticles(articles) {
        //Append HTML containing article data to the page
        //Json passed with available articles in database
        var articlePanels = [];
        // each article JSON is passed to the createPanel
        //panel with article data inside
        for (var i = 0; i < articles.length; i++) {
            articlePanels.push(createPanel(articles[i]));
        }

        articleContainer.append(articlePanels);
    }
    function createPanel(article) {
        var panel =
            $(["<div class='panel panel-defualt'>",
                "<div class='panel-heading'>",
                "<h3>",
                article.headline,
                "<a class= 'btn btn-success save'>",
                "Save Article",
                "</a>",
                "</h3>",
                "</div>",
                "<div class='panel-body'>",
                article.summary,
                "</div>",
                "</div>",
            ].join(""));
        panel.data("_id", article._id);
        return panel;
    }

    function renderEmpty() {
        var emptyAlert =
            $(["<div class='alert alert-warning text-center'>",
                "<h4> Yikes, no articles at this time.</h4>",
                "</div>",
                "<div class='panel panel-default'>",
                "<div class='panel-heading text-center'>",
                "<h3>What would like to do?</h3>",
                "</div>",
                "<div class='panel-body text-center'>",
                "<h4><a class='scrape-new'> Try Scraping New Articles Yikes</a></h4>",
                "</div>",
                "</div>"
            ].join(""));
        articleContainer.append(emptyAlert);
    }

    function handleArticleSave() {
        //runs when user opt to save article
        //article is tagged with headline id from earlier
        var articleToSave = $(this).parents(".panel").data();
        articleToSave.saved = true;

        $.ajax({
            method: "PATCH",
            url: "/api/headlines",
            data: articleToSave
        })
            .then(function (data) {
                if (data.ok) {
                    initPage();
                }
            });
    }
    function handleArticleScrape() {
        // handles click of "scrape new article button"
        $.get("/api/fetch")
            .then(function (data) {
            //check for uniquness of article
            initPage();
            bootbox.alert("<h3 class= 'text-center m-top-80'>" + data.message + "</h3>");
        });
    }
});