$(document).ready(function () {
    var articleContainer = $(".article-container");
    //event listeners fo dynamically create buttons for deleting articles
    //pulling, saving, and deleting article notes
    $(document).on("click", ".btn.delete", handleArticleDelete);
    $(document).on("click", ".btn.notes", handleArticleNotes);
    $(document).on("click", ".btn.save", handleNoteSave);
    $(document).on("click", ".btn.note-delete", handleNoteDelete);

    // Once page is ready
    initPage();

    function initPage() {
        //Empty the article container, run an AJAX request for any unsaved headlines
        articleContainer.empty();
        $.get("/api/headlines?saved=true")
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
                "<a class= 'btn btn-danger delete'>",
                "Delete From Saved",
                "</a>",
                "<a class='btn btn-info notes'>Article Notes</a>",
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
                "<h4><a href='/'> Browse Articles </a></h4>",
                "</div>",
                "</div>"
            ].join(""));
        articleContainer.append(emptyAlert);
    }

    function renderNotesList(data) {
        var notesToRender = [];
        var currentNote;
        if (!data.notes.length) {
            currentNote = [
                "<li class='list-group-item'>",
                "No notes for this article as of yet.",
                "</li>"
            ].join("");
            notesToRender.push(currentNote);
        }
        else {
            for (var i = 0; i < data.notes.length; i++) {
                currentNote = $([
                    "li class='list-group-item note'>",
                    data.notes[i].noteText,
                    "<button class='btn btn-danger note-delete'>x</button>",
                    "</li>"
                ].join(""));
                currentNote.children("button").data("_id", data.notes[i]._id);
                notesToRender.push(currentNote);
            }
        }
        $(".note-container).append(notesToRender");
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

    function handleArticleNotes() {
        var currentArticle = $(this).parents(".panel").data();
        $.get("/api/notes/" + currentArticle._id).then(function (data) {

            var modalText = [
                "<div class= 'container-fluid text-center'>",
                "<h4>Notes For Article: ",
                currentArticle._id,
                "</h4>",
                "<hr />",
                "<ul class='list-group note-container'>",
                "</ul>",
                "<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
                "<button class='btn btn-success save'>Save Note</button>",
                "</div>"
            ].join("");

            bootbox.dialog({
                message: modalText,
                closeButton: true
            });
            var noteData = {
                _id: currentArticle._id,
                notes: data || []
            };
            $(".btn.save").data("article", noteData);
            renderNotesList(noteData);
        });
    }
    function handleNoteSave() {
        var noteData
        var newNote = $(".bootbox-body textarea").val.trim();
        if (newNote) {
            noteData = {
                _id: $(this).data("article")._id,
                noteText: newNote
            };
            $.post("api/notes", noteData).then(function () {

                bootbox.hideAll();
            });
        }
    }

    function handleNoteDelete() {
        var noteToDelete = $(this).data("_id");
        $.ajax({
            url: "api/notes" + noteToDelete,
            method: "DELETE"
        }).then(function () {
            bootbox.hideAll();
        });
    }
});    