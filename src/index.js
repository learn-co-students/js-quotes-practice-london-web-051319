// get quote from the json

// render cards with the json
// add like button to card
// delete button on the cards deletes that from the json file

const quoteContainer = document.querySelector('#quote-list');
const newQuoteInput = document.querySelector('#new-quote');
const newQuoteAuthor = document.querySelector('#author');
const newQuoteForm = document.querySelector('#new-quote-form');

const BASE_URL = 'http://localhost:3000/quotes?_embed=likes';
const LIKE_URL = 'http://localhost:3000/likes';

  getQuotes()
  .then(quotesData => {
    quotesData.forEach(quote => {
      renderQuote(quote);
    });
  });

function getQuotes() {
  return fetch(BASE_URL)
    .then(res => res.json());
}

function renderQuote(quoteData) {
  const li = document.createElement('li');
  const br = document.createElement('br');
  const blockq = document.createElement('blockquote');
  const footer = document.createElement('footer');
  const p = document.createElement('p');
  const likeBtn = document.createElement('button');
  const deleteBtn = document.createElement('button');

  let likesNum = getLikes(quoteData);

  // adding classes
  li.className = 'quote-card';
  blockq.className = 'blockquote';
  p.className = 'mb-0';
  footer.className = 'blockquote-footer';
  likeBtn.className = 'btn-success';
  deleteBtn.className = 'btn-danger';

  // event listeners
  likeBtn.addEventListener('click', (event) => {
    createLike(event, quoteData);

    getQuotes()
      .then(quotes => {
        let quote = quotes.find(quote => quote.id === quoteData.id);
        event.target.textContent = "";
        event.target.innerHTML = `Likes: ${quote.likes.length + 1}`;
      });
  });

  deleteBtn.addEventListener('click', (event) => {
    deleteQuote(event, quoteData)
  });

  // adding text values
  p.textContent = quoteData.quote;
  footer.textContent = quoteData.author;
  likeBtn.innerHTML =  `Likes:${likesNum}`;
  deleteBtn.textContent = 'Delete';

  blockq.append(p, footer, br, likeBtn, deleteBtn);
  li.appendChild(blockq);
  quoteContainer.appendChild(li);
}

function getLikes(quoteData) {
  let likesArr = quoteData.likes.filter(like => like.quoteId === quoteData.id);
  return likesArr.length;
}

function createLike(event, quoteData) {
  let quoteId = quoteData.id;
  let date = new Date().new;

  return fetch(LIKE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      quoteId: quoteId
    })
    })
    .then(res => res.json())
    .then(res => res);
}

function deleteQuote(event, quoteData) {
  fetch(`http://localhost:3000/quotes/${quoteData.id}`, {
    method: 'DELETE'
  }).then(res => res.json())
    .then(res => console.log(res));

  event.target.parentElement.parentNode.style.display = 'none';
}

function setUpForm() {

  newQuoteForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let quote = newQuoteInput.value;
    let author = newQuoteAuthor.value;

    fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        quote: quote,
        author: author,
        likes: []
      }),
    }).then(res => res.json())
      .then(newQuote => {
        renderQuote(newQuote);
      });
  });

}

setUpForm();


// add functionality to create new quote with given form
