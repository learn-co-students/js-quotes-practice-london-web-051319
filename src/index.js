const QUOTELIST = document.querySelector("#quote-list")
const QUOTEFORM = document.querySelector("#new-quote-form")
const QUOTEURL = "http://localhost:3000/quotes?_embed=likes"
const QUOTEDELETEURL = "http://localhost:3000/quotes"
const SUBMITBUTTON = document.querySelector(".btn.btn-primary")
const LIKEURL = "http://localhost:3000/likes"

const NEWQUOTE = document.querySelector("#new-quote")
const NEWAUTHOR = document.querySelector("#author")


fetch(QUOTEURL)
  .then(response => response.json())
  .then(data => {data.forEach(quoteData => { createQuoteBox(quoteData)
  })
})

function createQuoteBox(quoteData){
    li = document.createElement("li")

    blockquote = document.createElement("blockquote")
    blockquote.className = 'blockquote'

    p = document.createElement("p")
    p.className = 'mb-0'
    p.innerText = quoteData.quote

    footer = document.createElement("footer")
    footer.className = 'blockquote-footer'
    footer.innerText = quoteData.author

    br = document.createElement("br")

    likeButton = document.createElement("button")
    likeButton.className = "btn-success"
    span = document.createElement("span")
    span.innerText = `${quoteData.likes.length} Likes`
    likeButton.append(span)
    handleLike(likeButton, quoteData, li)

    deleteButton = document.createElement("button")
    deleteButton.className = "btn-danger"
    deleteButton.innerText = 'Delete'
    handleDelete(deleteButton, quoteData, li)

    li.append(blockquote, p, footer, br, likeButton, deleteButton)
    QUOTELIST.append(li)
}

SUBMITBUTTON.addEventListener('click', event => {
    event.preventDefault()
    const quote = NEWQUOTE.value
    const author = NEWAUTHOR.value

    const quoteData = { quote, author, likes: [] }
    saveQuote(quoteData)
})

function saveQuote(quoteData){
    fetch(QUOTEURL, {
        method: 'post',
        body: JSON.stringify(quoteData),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(res => res.json())
        .then(quote => createQuoteBox(quote))
}

function handleDelete(deleteButton, quoteData, li){
    deleteButton.addEventListener('click', event => {
        deleteQuote(quoteData).then(li.remove())
    })
}

function deleteQuote(quoteData){
    return fetch(`${QUOTEDELETEURL}/${quoteData.id}`, {
        method: "delete",
        headers: {
          "Content-Type": "application/json"
        }
    });
}

function handleLike(likeButton, quoteData, li){
    likeButton.addEventListener('click', event => {
        updateQuote(quoteData).then(likeObject => quoteData.likes.push(likeObject)).then(newLength => likeButton.innerText = `${newLength} Likes`)
    })
}

function updateQuote(quoteData){
    likeData = {quoteId: quoteData.id}
    return fetch(`${LIKEURL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(likeData)
    })
      .then(res => res.json())
  }