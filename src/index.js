// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 

const QUOTE_URL = Object.freeze('http://localhost:3000/quotes')
const LIKE_URL = Object.freeze('http://localhost:3000/likes')

window.addEventListener('DOMContentLoaded', () => {
  addQuotes();
  addSortButton();

  const form = document.querySelector('#new-quote-form')
  setFormFunctionality(form);
})

function addQuotes(authorSort = false) {
  const ul = document.querySelector('#quote-list')
  while (ul.firstChild) {
    ul.removeChild(ul.firstChild)
  }

  const url = authorSort ? `${QUOTE_URL}?_embed=likes&_sort=author` : `${QUOTE_URL}?_embed=likes`

  return fetch(url)
    .then(resp => resp.json())
    .then(quotes => quotes.forEach(quote => addQuoteCard(quote, ul)))

  // return fetch(`${QUOTE_URL}?_embed=likes`)
  //   .then(resp => resp.json())
  //   .then(quotes => {
  //     if (authorSort) {
  //       quotes.sort((quote1, quote2) => {
  //         if (quote1.author < quote2.author) {
  //             return -1;
  //           }
  //           if (quote1.author > quote2.author) {
  //             return 1;
  //           }
  //           return 0;
  //         })
  //       }
  //     quotes.forEach(quote => addQuoteCard(quote, ul))
  //   })
}

function getQuote(quote) {
  return fetch(`${QUOTE_URL}/${quote.id}?_embed=likes`)
    .then(resp => resp.json());
}

function addQuote(quote) {
  const ul = document.querySelector('#quote-list')

  return fetch(`${QUOTE_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(quote)
  }).then(resp => resp.json())
    .then(returnedQuote => addQuoteCard(returnedQuote, ul));
}

function updateQuote(quote) {
  return fetch(`${QUOTE_URL}/${quote.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(quote)
  }).then(resp => resp.json());
}

function deleteQuote(quote, li) {
  return fetch(`${QUOTE_URL}/${quote.id}?_embed=likes`, {
    method: 'DELETE'
  })
}

function updateLikes(quote, likeButton) {
  return getQuote(quote).then(returnedQuote => {
    const likes = returnedQuote.likes ? returnedQuote.likes.length : 0
    likeButton.children[0].textContent = likes
    return likes
  })
}

function addLike(like, quote, likeButton) {
  return fetch(`${LIKE_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(like)
  }).then(resp => updateLikes(quote, likeButton));
}

function setDeleteFunctionality(deleteButton, quote) {
  deleteButton.addEventListener('click', e => {
    const li = e.target.parentNode.parentNode
    deleteQuote(quote).then(li.parentNode.removeChild(li))
  })
}

function setFormFunctionality(form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const quote = {
      quote: e.target.elements[0].value,
      author: e.target.elements[1].value
    }
    addQuote(quote);
  })
}

function setLikeFunctionality(likeButton, quote) {
  likeButton.addEventListener('click', e => {
    e.preventDefault();

    like = {
      quoteId: quote.id,
      createdAt: Date.now()
    }
    addLike(like, quote, likeButton);
  })
}

function setEditFunctionality(editButton, quote) {
  editButton.addEventListener('click', e => {
    e.preventDefault();
    const div = e.target.parentNode.parentNode.parentNode
    const li = e.target.parentNode.parentNode

    div.removeChild(li);
    div.appendChild(createEditForm(quote, li));
  })
}

function setCancelFunctionality(cancelButton, li) {
  cancelButton.addEventListener('click', e => {
    e.preventDefault();
    const div = e.target.parentNode.parentNode
    const form = e.target.parentNode
 
    div.removeChild(form);
    div.appendChild(li);
  })
}

function setSubmitFunctionality(submitButton, quote) {
  submitButton.addEventListener('click', e => {
    e.preventDefault();
    const div = e.target.parentNode.parentNode
    const form = e.target.parentNode
    
    quote.quote = form.elements[0].value
    quote.author = form.elements[1].value
    delete quote.likes

    updateQuote(quote).then(returnedQuote => {
      quote = returnedQuote
      div.removeChild(form);

      const li = createQuoteCard(quote);
      const likeButton = li.querySelector('button')

      updateLikes(quote, likeButton).then(likes => {
        likeButton.children[0].textContent = likes
        div.appendChild(li);
      })
    })

    return quote;
  })
}

function setSortFunctionality(authorSortButton) {
  authorSortButton.addEventListener('click', e => {
    e.preventDefault();
    if (e.target.textContent === "Sort by Author") {
      e.target.className = 'btn btn-success'
      e.target.textContent = "Sorted by Author"
      addQuotes(true);
    } else {
      e.target.className = 'btn btn-primary'
      e.target.textContent = "Sort by Author"
      addQuotes(false);
    }
    console.log(e.target)
    
  })
}

function createQuoteCard(quote) {
  const li = document.createElement('li')
  const blockquote = document.createElement('blockquote')
  const p = document.createElement('p')
  const footer = document.createElement('footer')
  const br = document.createElement('br')
  const likeButton = document.createElement('button')
  const span = document.createElement('span')
  const deleteButton = document.createElement('button')
  const editButton = document.createElement('button')

  li.className = 'quote-card'
  blockquote.className = "blockquote"
  blockquote.textContent = quote.quote
  p.className = "mb-0"
  footer.className = "blockquote-footer"
  footer.textContent = quote.author
  likeButton.className = 'btn-success'
  likeButton.textContent = 'Likes: '
  span.textContent = quote.likes ? quote.likes.length : 0
  deleteButton.className = 'btn-danger'
  deleteButton.textContent = 'Delete'
  editButton.className = 'btn-info'
  editButton.textContent = 'Edit'

  likeButton.appendChild(span)
  blockquote.append(p, footer, br, likeButton, deleteButton, editButton)
  li.appendChild(blockquote)

  setDeleteFunctionality(deleteButton, quote);
  setLikeFunctionality(likeButton, quote);
  setEditFunctionality(editButton, quote);
  
  return li
}

  // <form id="new-quote-form">
  //     <div class="form-group">
  //       <label for="new-quote">New Quote</label>
  //       <input type="text" class="form-control" id="new-quote" placeholder="Learn. Love. Code.">
  //     </div>
  //     <div class="form-group">
  //       <label for="Author">Author</label>
  //       <input type="text" class="form-control" id="author" placeholder="Flatiron School">
  //     </div>
  //     <button type="submit" class="btn btn-primary">Submit</button>
  //   </form>

function createEditForm(quote, li) { 
  const form = document.createElement('form')
  form.id = 'edit-quote-form'

  const quoteDiv = document.createElement('div')
  const quoteLabel = document.createElement('label')
  const quoteInput = document.createElement('input')

  const authorDiv = document.createElement('div')
  const authorLabel = document.createElement('label')
  const authorInput = document.createElement('input')

  const submitButton = document.createElement('button')
  const cancelButton = document.createElement('button')

  quoteDiv.className = 'form-group'
  authorDiv.className = 'form-group'

  quoteLabel.for = 'edit-quote'
  quoteLabel.textContent = "Edit Quote"
  authorLabel.for = 'edit-author'
  authorLabel.textContent = "Edit Author"

  quoteInput.type = 'text'
  quoteInput.className = 'form-control'
  quoteInput.id = 'edit-quote'
  quoteInput.placeholder = "Learn. Love. Code."
  quoteInput.value = quote.quote

  authorInput.type = 'text'
  authorInput.className = 'form-control'
  authorInput.id = 'edit-author'
  authorInput.placeholder = "Flatiron School"
  authorInput.value = quote.author

  submitButton.type = 'submit'
  submitButton.className = "btn btn-primary"
  submitButton.textContent = "Submit"

  cancelButton.type = 'cancel'
  cancelButton.className = "btn btn-danger"
  cancelButton.textContent = "Cancel"

  quoteDiv.append(quoteLabel, quoteInput);
  authorDiv.append(authorLabel, authorInput);

  form.append(quoteDiv, authorDiv, submitButton, cancelButton);

  setSubmitFunctionality(submitButton, quote);
  setCancelFunctionality(cancelButton, li);

  return form;
}

function addQuoteCard(quote, ul) {
  const div = document.createElement('div')

  div.appendChild(createQuoteCard(quote));
  ul.appendChild(div);
  return quote
}

function addSortButton() {
  const h1 = document.querySelector('h1')
  const div = document.createElement('div')

  const authorSortButtonDiv = document.createElement('div')
  const authorSortButton = document.createElement('button')
  authorSortButton.className = "btn btn-primary"
  authorSortButton.textContent = 'Sort by Author'

  authorSortButtonDiv.appendChild(authorSortButton)
  authorSortButtonDiv.align = "right"

  h1.appendChild(authorSortButtonDiv)

  setSortFunctionality(authorSortButton);
}