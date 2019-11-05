const QUOTES_URL = 'http://localhost:3000/quotes?_embed=likes'
const LIKES_URL = 'http://localhost:3000/likes'

fetch(QUOTES_URL)
  .then(response => response.json(
  ))
  .then(sortQuotes)

function getQuote (id) {
  return fetch(`http://localhost:3000/quotes/${id}?_embed=likes`)
    .then(response => response.json())
}

function sortQuotes (quoteArray) {
  quoteArray.forEach(quote => {
    createQuoteCard(quote)
  })
}
function createQuoteCard (quoteObj) {
  ul = document.querySelector('#quote-list')
  li = document.createElement('li')
  li.classList.add('quote-card')

  blockquote = document.createElement('blockquote')

  p = document.createElement('p')
  p.classList.add('mb-0')
  p.innerText = quoteObj.quote

  footer = document.createElement('footer')
  footer.classList.add('blockquote-footer')
  footer.innerText = quoteObj.author

  br = document.createElement('br')

  likeButton = document.createElement('button')
  likeButton.classList.add('btn-success')
  likeButton.innerText = 'Likes: '
  likeSpan = document.createElement('span')
  likeSpan.innerText = quoteObj.likes.length
  likeButton.append(likeSpan)

  deleteButton = document.createElement('button')
  deleteButton.classList.add('btn-danger')
  deleteButton.innerText = 'Delete'

  editButton = document.createElement('button')
  editButton.classList.add('btn-info')
  editButton.innerText = 'Edit'

  // const form = createForm(quoteObj, p, footer)

  editForm = document.createElement('form')
  editForm.style.display = 'none'
  editForm.innerHTML =
  `<form id="new-quote-form">
    <div class="form-group">
    <label for="edit-quote">Edit Quote</label>
    <input type="text" class="form-control" id="edited-quote" value="${quoteObj.quote}">
    </div>
    <div class="form-group">
    <label for="Author">Author</label>
    <input type="text" class="form-control" id="author" value="${quoteObj.author}">
    </div>
    <button type="submit" class="btn btn-primary">Submit</button>
    </form>`
  editForm.addEventListener('submit', e => {
    e.preventDefault()
    quoteObj.author = e.target[1].value
    quoteObj.quote = e.target[0].value
    updateQuoteBackend(quoteObj, e, footer)
  })
  li.append(editForm)

  blockquote.append(p, footer, br, likeButton, editButton, deleteButton)
  li.append(blockquote)
  ul.append(li)

  createLikeFunctionality(likeButton, quoteObj)
  createDeleteFunctionality(deleteButton, quoteObj)
  createEditFunctionality(editButton, editForm)
}

function updateQuoteBackend (quoteObj, e) {
  return fetch(`http://localhost:3000/quotes/${quoteObj.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(quoteObj)
  }).then(response => response.json())
    .then(quoteObj => updateQuoteFrontend(quoteObj, e))
}

function updateQuoteFrontend (quoteObj, e) {
  e.target.style.display = 'none'
  e.target.parentNode.lastElementChild.firstElementChild.innerText = quoteObj.quote
  e.target.parentNode.lastElementChild.children[1].innerText = quoteObj.author
}

function createLikeFunctionality (likeButton, quoteObj) {
  likeButton.addEventListener('click', e => {
    return fetch(LIKES_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ quoteId: quoteObj.id })
    }).then(response => response.json())
      .then(likeObj => {
        getQuote(quoteObj.id)
          .then(quote => quote.likes.length)
          .then(likeNumber => addLikeFrontEnd(likeButton, likeNumber))
      })
  })
}

function createDeleteFunctionality (deleteButton, quoteObj) {
  deleteButton.addEventListener('click', e => {
    return fetch(`http://localhost:3000/quotes/${quoteObj.id}`, {
      method: 'DELETE'
    }
    ).then(response => response.json())
      .then(removeElementFromFrontEnd(deleteButton))
  }
  )
}

function createEditFunctionality (editButton, form) {
  let editForm = false
  editButton.addEventListener('click', () => {
    editForm = (form.style.display === 'block')
    editForm = !editForm
    if (editForm === true) {
      form.style.display = 'block'
    } else {
      form.style.display = 'none'
    }
  })
}
function removeElementFromFrontEnd (deleteButton) {
  deleteButton.parentNode.parentNode.remove()
}

function addLikeFrontEnd (likeButton, likeNumber) {
  likeButton.firstElementChild.innerText = likeNumber
}

function addListenerToForm () {
  form = document.querySelector('#new-quote-form')
  form.addEventListener('submit', e => {
    e.preventDefault()
    author = e.target[1].value
    quote = e.target[0].value

    addNewQuote(author, quote)
  })
}
function addNewQuote (authorValue, quoteValue) {
  const quoteObj = {
    author: authorValue,
    quote: quoteValue,
    likes: []
  }
  addQuoteToBackend(quoteObj)
}

function addQuoteToBackend (quoteObj) {
  return fetch(QUOTES_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(quoteObj)
  }).then(response => response.json())
    .then(createQuoteCard)
}

addListenerToForm()

