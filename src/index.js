// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 

// document.addEventListener("DOMContentLoaded", )

const quoteLikeURL = "http://localhost:3000/quotes?_embed=likes"
const quoteURL = "http://localhost:3000/quotes"
const likeURL = "http://localhost:3000/likes"
const quoteShow = document.querySelector("#quote-list")

fetch(quoteLikeURL)
    .then(response => response.json())
    .then(data => {
        data.forEach(quote => {
            showQuote(quote)
    })
})

function showQuote(quote){

    const theQuote = document.createElement('p')
    theQuote.innerText = quote.quote

    const quoteAuthor = document.createElement('h4')
    quoteAuthor.innerText = quote.author

    const quoteLikes = document.createElement('p')
    quoteLikes.innerText = `Likes: ${quote.likes.length}`

    const quoteLikeButton = document.createElement("button")
    quoteLikeButton.innerText = "Like Quote"
    quoteLikeButton.classList.add('like-button')
    quoteLikeButton.dataset.id = quote.id

    const quoteDelete = document.createElement("button")
    quoteDelete.innerText = "Delete Quote"
    quoteDelete.dataset.id = quote.id

    const space = document.createElement('br')

    addDeleteFunction(quote, quoteDelete)

    addLikeFunction(quote, quoteLikeButton)

    quoteShow.append(quoteAuthor, theQuote, quoteLikes, quoteLikeButton, quoteDelete, space)
}

function addDeleteFunction(quote, button) {
    button.addEventListener('click', event => {
        DeleteQuote(quote)
    })
}

function DeleteQuote(quote) {
    fetch (`http://localhost:3000/quotes/${quote.id}/?_embed=likes`, {
        method: 'DELETE'
    })
}

function addANewQuote(quote) {
    fetch (quoteLikeURL, {
        method: 'POST',
        body: JSON.stringify(quote),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => showQuote(data))
}

const quoteForm = document.querySelector('#new-quote-form')
const newQuoteQuote = document.querySelector('#new-quote')
quoteForm.addEventListener('submit', event => {
    event.preventDefault()
    const quote = newQuoteQuote.value
    const author = event.target.elements.author.value
    addANewQuote({ quote, author})
})

function addLikeFunction(quote, button) {
    const quoteId = quote.id
    button.addEventListener('click', event => {
        addLiker({quoteId})
    })
}

function addLiker(quoteId) {

    console.log(quoteId)
    fetch (likeURL, {
        method: 'POST',
        body: JSON.stringify(quoteId),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
