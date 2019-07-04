// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
const baseURL = 'http://localhost:3000/quotes?_embed=likes';

//http call to get the quotes from the backend
const fetchAll = () => {
    fetch(baseURL)
        .then(res => res.json())
        // .then(data => console.log(data))
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                // console.table(data[i]);
                renderQuotes(data[i])
            }
        })
}

const listContainer = document.getElementById('quote-list');
const form = document.getElementById('new-quote-form');

//dom manipulation to render quotes and relevant data
const renderQuotes = (quotesObj) => {
    const btnContainer = document.createElement('div');
    btnContainer.classList.add('col-sm-12', 'text-center');
    const list = document.createElement('li');
    list.className = 'list-group-item';
    const block = document.createElement('blockquote');
    const para = document.createElement('p');
    para.innerText = quotesObj.quote;
    const footer = document.createElement('footer');
    const deleteBtn = document.createElement('button');
    const likeBtn = document.createElement('button');
    const p = document.createElement('small');
    p.innerText = 'Likes: '
    const small = document.createElement('small');
    small.innerText = `${quotesObj.likes.length}`;
    likeBtn.innerText = 'Like';
    likeBtn.classList.add('btn', 'btn-primary', 'like-btn');
    deleteBtn.innerText = 'Delete';
    deleteBtn.classList.add('btn', 'btn-danger');
    btnContainer.append(likeBtn, p, small, deleteBtn);
    footer.innerText = quotesObj.author;
    block.append(para, footer);
    list.append(block, btnContainer);
    listContainer.append(list);

    deleteBtn.addEventListener('click', () => {
        deleteQuote(quotesObj);
        location.reload(true);
    })

    likeFunc(quotesObj, likeBtn);
}

const likeFunc = (quote, likeButtton) => {
    const quoteId = quote.id
    likeButtton.addEventListener('click', (event) => {
        createLike({quoteId});
        location.reload(true);
    })
}

const createLike = (quoteId) => {
    return fetch('http://localhost:3000/likes', {
        method: 'POST',
        body: JSON.stringify(quoteId),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

const deleteQuote = (quotesObj) => {
    console.log('ALERT : DELETE BUTTON CLICKED');
    return fetch(`http://localhost:3000/quotes/${quotesObj.id}/?_embed=likes`, {
        method: 'DELETE'
    }).then(res => res.json())
}

//save/post new quote to backend
const postQuote = (quote) => {
    return fetch(baseURL, {
        method: 'POST',
        body: JSON.stringify(quote),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(newQuote => newQuote.json())
}

//get data from form to add new quote
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const [inputQuote, inputAuthor] = event.target;
    const newQuote = {
        quote: inputQuote.value,
        author: inputAuthor.value,
        likes: []
    }
    postQuote(newQuote).then(renderQuotes)
    console.log("form submitted");
    
})


//get existing quotes
window.addEventListener('DOMContentLoaded', () => {
    fetchAll()
})