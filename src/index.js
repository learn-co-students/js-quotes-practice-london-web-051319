// import { blockStatement } from "babel-types";

// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 

const BASE_URL = "http://localhost:3000/quotes?_embed=likes"

document.addEventListener("DOMContentLoaded", function () {
    fetchQuotes()
    newQuoteCapture()
    editFormDiv()
    sortFormButton()
});

function fetchQuotes() {
    fetch(BASE_URL)
        .then(quotesData => quotesData.json())
        .then(quotes => displayQuotes(quotes))
};

function displayQuotes(quotes) {
    quotes.map(quote => {
        addQuote(quote)
    })
};

function addQuote(quote) {
    const quotesList = document.querySelector("#quote-list")
    const li = createQuotes(quote)
    quotesList.appendChild(li)
};

function createQuotes(quote) {
    const li = document.createElement("li")
    li.className = "quote-card"

    const blockquote = document.createElement("blockquote")
    blockquote.className = "blockqoute"
    
    const p = document.createElement("p")
    p.className = "mb-0"
    p.innerText = quote.quote

    const footer = document.createElement("footer")
    footer.className = "blockquote-footer"
    footer.innerText = quote.author

    const br = document.createElement("br")

    const likeButton = document.createElement("button")
    likeButton.className = "btn-success"
    likeButton.innerText = "Likes:"
    likeButton.addEventListener("click", event => increaseLikes(quote))

    const span = document.createElement("span")
    span.innerText = ` ${quote.likes.length}`

    likeButton.appendChild(span)

    const deleteButton = document.createElement("button")
    deleteButton.className = "btn-danger"
    deleteButton.innerText = "Delete"
    deleteButton.id = quote.id
    deleteButton.addEventListener("click", event => deleteQuote(quote))

    const editButton = document.createElement("button")
    editButton.className = "btn-info"
    editButton.innerText = "Edit"
    editButton.id = quote.id
    editButton.addEventListener("click", event => editQuote(quote))

    blockquote.append(p, footer, br, likeButton, editButton, deleteButton)

    li.appendChild(blockquote)

    return li
};

function updateDatabase() {
    const quoteEdit = document.querySelector(".btn.btn-info").parentElement[0]
    const quoteAuthor = document.querySelector(".btn.btn-info").parentElement[1]

    const editQuote = {
        "quote": quoteEdit.value,
        "author": quoteAuthor.value
    };

    return fetch(`${"http://localhost:3000/quotes"}/${event.target.id}`, {
        method: "PATCH",
        body: JSON.stringify(editQuote),
        headers: {
          "Content-Type": "application/json"
        }
      }).then(quote => quote.json())
};

function deleteQuote(quote) {
    event.preventDefault();
    fetch(`${"http://localhost:3000/quotes"}/${event.target.id}`, {
        method: "DELETE"
      }).then(response => response.json())
};

function removeQuotes(quotes, addSort) {
    const div = document.querySelector("#quote-list")
    div.innerHTML = " "
    displaySortedQuotes(quotes, addSort)
};

function sortQuotes(addSort) {
    fetch(BASE_URL)
        .then(quotesData => quotesData.json())
        .then(quotes => removeQuotes(quotes, addSort))
};

function displaySortedQuotes(quotes, addSort) {
    if (addSort.value === "false"){
        addSort.value = "true"
        addSort.innerText = "Sort Quotes by Author's name"
        displayQuotes(quotes)
    } else {
        quotes.sort( (quoteOne, quoteTwo) => {
            if(quoteOne.author < quoteTwo.author) { return -1; }
            if(quoteOne.author > quoteTwo.author) { return 1; }
            return 0;
        })
        addSort.value = "false"
        addSort.innerText = "Sort Quotes by order of creation"
        displayQuotes(quotes)
    }
};

function editFormDiv() {
    const container = document.querySelector(".container.center")

    const editDiv = document.createElement("div")
    editDiv.className = "edit-div"

    container.appendChild(editDiv)
};

function sortFormButton() {
    const container = document.querySelector(".container.center")

    const br = document.createElement("br")

    let addSort = document.createElement("button")
    addSort.className = "btn btn-info"
    addSort.innerText = "Sort Quotes by Author's name"
    addSort.value = "false"
    container.append(br, addSort)

    addSort.addEventListener("click", event => sortQuotes(addSort))
};

function editQuote(quote) {
    event.preventDefault();
    const editDiv = document.querySelector(".edit-div")
    editDiv.innerHTML = " "
    createEditForm(quote)
    captureEditButton()
};

function captureEditButton() {
    const submitEdit = document.querySelector(".btn.btn-info")
    submitEdit.addEventListener("click", event => updateDatabase())
};

function createEditForm(quote) {
    const div = document.querySelector(".edit-div")

    const br = document.createElement("br")

    const hr = document.createElement("hr")

    const form = document.createElement("form")
    form.className = "edit-quote-form"

    const divQuote = document.createElement("div")
    divQuote.className = "form-group"

    const quoteLabel = document.createElement("label")
    quoteLabel.textContent = "Edit Quote"

    const quoteInput = document.createElement("input")
    quoteInput.className = "form-control"
    quoteInput.value = quote.quote
    quoteInput.autofocus = true

    divQuote.append(quoteLabel, quoteInput)

    const divAuthor = document.createElement("div")
    divAuthor.className = "form-group"

    const authorLabel = document.createElement("label")
    authorLabel.textContent = "Edit Author"

    const authorInput = document.createElement("input")
    authorInput.className = "form-control"
    authorInput.value = quote.author

    divAuthor.append(authorLabel , authorInput)

    const editButton = document.createElement("button")
    editButton.className = "btn btn-info"
    editButton.innerText = "Edit Quote"
    editButton.id = quote.id

    form.append(divQuote, divAuthor, editButton)
    div.append(br, hr, form)
};

function increaseLikes(quote) {
    event.preventDefault();
    return fetch("http://localhost:3000/likes", {
        method: "POST",
        body: JSON.stringify({
            "quoteId": quote.id,
            "createdAt": Date.now()
        }),
        headers: {
          "Content-Type": "application/json"
        }
      }).then(quote => quote.json());

};

function newQuoteCapture() {
    const submitNew = document.querySelector(".btn.btn-primary")
    submitNew.addEventListener("click", event => newQuoteInfo())
};

function newQuoteInfo() {
    const quote = document.querySelector("#new-quote")
    const author = document.querySelector("#author")
    const newQuote = {
        "quote": quote.value,
        "author": author.value
    }
    newQuotePost(newQuote)
};

function newQuotePost(newQuote) {
    return fetch(BASE_URL, {
        method: "POST",
        body: JSON.stringify(newQuote),
        headers: {
          "Content-Type": "application/json"
        }
      }).then(quote => quote.json()).then(quote => addQuote(quote));
};


