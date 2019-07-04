// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 

// DOM content loaded event listener
document.addEventListener("DOMContentLoaded", e => {
  getQuote()
});

const QUOTE_URL = "http://localhost:3000/quotes?_embed=likes"
const LIKES_URL = "http://localhost:3000/likes"

// get all quotes
function getAllQuotes() {
  return fetch(QUOTE_URL)
  .then(resp => resp.json())
}
// for one quote
function getQuote() {
  getAllQuotes()
  .then(quotesArray => {
    quotesArray.forEach(quote => {
      makeQuoteCard(quote)
    });
  })
}
// make quote card
function makeQuoteCard(quote) {
  let quoteListUL = document.getElementById("quote-list")

  li = document.createElement("li");
  li.className = "quote-card"
  blockquote = document.createElement("blockquote");
  blockquote.className = "blockquote"

  p = document.createElement("p");
  p.className = "mb-0"

  footer = document.createElement("footer");
  footer.className = "blockquote-footer";

  br = document.createElement("br");

  likeButton = document.createElement("button");
  likeButton.className = 'btn-success';
  likeButton.id = quote.id;
  likeButton.addEventListener("click", e => {
    createLikeForQuote(e, quote)
  })
  
  deleteButton = document.createElement("button");
  deleteButton.className = 'btn-danger';
  deleteButton.setAttribute("data-set", quote.id);
  deleteButton.addEventListener("click", e => {
    updateDOMAfterDeleting(e, quote)
  })

  populateQuoteCard(quote)

  blockquote.append(p, footer, br, likeButton, deleteButton)

  li.append(blockquote);
  quoteListUL.append(li);
}
// populate quote card
function populateQuoteCard(quote) {
  p.innerText = quote.quote
  footer.innerText = quote.author
  populateLikeButton(quote)
  deleteButton.innerText = "Delete" 
}

function populateLikeButton(quote) {
  likeButton.innerHTML = "";
  likeButton.innerText = "Likes: " 
  span = document.createElement("span");
  likeButton.append(span);
  span.innerText = quote.likes.length;
}

// event listener for like button
// post request to likes url
function createLikeForQuote(event, quote) {
  // const quoteID = parseInt(event.target.id)
  return fetch(LIKES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({quoteId: quote.id})
  })
  .then(resp => resp.json())
  .then(likeObj => quote.likes.push(likeObj))
  .then(updateDOMAfterLiking(quote, event));
  // make sure its an integer
  
}

// update DOM
function updateDOMAfterLiking(quote, event) {
  newLikes = quote.likes
    event.target.firstElementChild.innerText = newLikes.length 
}

// event listener for delete button
// delete request for quote
function deleteSelectedQuote(event) {
  let quoteID = parseInt(event.target.attributes[1].value);
  return fetch(`http://localhost:3000/quotes/${quoteID}`, {
    method: "DELETE"
  })
  .then(resp => resp.json())
  .then(updateDOMAfterDeleting(event))
}
// update DOM
function updateDOMAfterDeleting(event) {
  let deleteButton = event.target;
  deleteButton.parentNode.parentNode.remove();
}

// create new quote from form
const newQuoteForm = document.querySelector('#new-quote-form');
newQuoteForm.addEventListener("submit", event => handleSubmission(event))

// event listener on the submit button
function handleSubmission(event) {
  event.preventDefault();
  let newQuote = event.target[0].value
  let newAuthor = event.target[1].value
  let newQuoteObj = {
    quote: newQuote,
    author: newAuthor,
    likes: []
  }
  console.log(newQuoteObj)
  UpdateDBWithNewQuote(newQuoteObj).then(resp => resp.json()).then(
  makeQuoteCard(newQuoteObj))
}

// post request to create new quote
function UpdateDBWithNewQuote(newQuoteObj) {
  return fetch(QUOTE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(newQuoteObj)
  })
}
// update DOM with new quote