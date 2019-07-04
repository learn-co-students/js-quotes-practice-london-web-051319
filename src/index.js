// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.

const form = document.querySelector("#new-quote-form");
const quotesUrl = "http://localhost:3000/quotes?_embed=likes";
const likesUrl = "http://localhost:3000/likes/";

const quote_list = document.querySelector("#quote-list");

function renderQuotes() {
  quote_list.innerHTML = "";
  fetch(quotesUrl)
    .then(quotesData => quotesData.json())
    .then(allQuotes => showQuotes(allQuotes));
}

function showQuotes(allQuotes) {
  for (let quote of allQuotes) {
    makeQuoteCard(quote);
  }
}

function makeQuoteCard(quote) {
  let counter = quote.likes.length;

  const li = document.createElement("li");
  li.className = "quote-card";

  const blockquote = document.createElement("blockquote");
  blockquote.className = "blockquote";

  const footer = document.createElement("footer");
  footer.className = "blockquote-footer";

  const p = document.createElement("p");
  p.className = "card";

  const likeBtn = document.createElement("button");
  likeBtn.setAttribute("id", `${quote.id}`);
  likeBtn.className = "btn-success";
  if (quote.likes.length > 1) {
    likeBtn.innerText = `${counter} Likes`;
  } else if (quote.likes.length === 1) {
    likeBtn.innerText = "1 Like";
  } else {
    likeBtn.innerText = "Like";
  }

  const deleteBtn = document.createElement("button");
  deleteBtn.setAttribute("id", `${quote.id}`);
  deleteBtn.className = "btn-danger";
  deleteBtn.innerText = "Delete";

  footer.textContent = quote.author;
  p.textContent = quote.quote;

  blockquote.append(p, footer, likeBtn, deleteBtn);
  li.appendChild(blockquote);
  likeBtn.addEventListener("click", e => likeQuote(e, counter));
  deleteBtn.addEventListener("click", e => deleteQuote(e, li));

  quote_list.append(li);
}

function deleteQuote(e, li) {
  let id = e.target.id;
  return fetch(`http://localhost:3000/quotes/${id}`, {
      method: "DELETE"
    })
    .then(response => response.json())
    .then(quote_list.removeChild(li));
}

function likeQuote(e, counter) {
  let id = parseInt(e.target.id);
  return fetch(likesUrl, {
    method: "POST",
    body: JSON.stringify({
      quoteId: id
    }),
    headers: {
      "Content-Type": "application/json"
    }
  });
}

form.addEventListener("submit", e => handleSubmission(e));

function handleSubmission(e) {
  e.preventDefault();
  const [newQuoteInputNode, authorInputNode] = e.target;
  const quoteObj = {
    quote: newQuoteInputNode.value,
    author: authorInputNode.value,
  };

  createQuote(quoteObj).then(renderQuotes);
}


function createQuote(quoteObj) {
  return fetch(quotesUrl, {
    method: "POST",
    body: JSON.stringify(quoteObj),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(quote => quote.json());
}


document.addEventListener("DOMContentLoaded", function() {
  renderQuotes();
});