// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
const QUOTES_URL = "http://localhost:3000/quotes";
const LIKES_URL = "http://localhost:3000/likes";
const quoteList = document.querySelector('#quote-list')
const quoteBox = document.querySelector('#quote-list').parentElement;
const form = document.querySelector('#new-quote-form')

document.addEventListener('DOMContentLoaded', (e)=>{

const setFormListener = () => {
   const quoteContent = document.querySelector('input#new-quote');
   const quoteAuthor = document.querySelector('input#author');
   form.addEventListener('submit', (event) => {
      event.preventDefault();
      newQuote(quoteContent.value, quoteAuthor.value);
   });
};

setFormListener();

fetch(`${QUOTES_URL}?_embed=likes`)
.then(data => data.json())
.then(results => renderAllQuotes(results))

const renderAllQuotes = (quotesData) => {
   for(const quote of quotesData){
      renderQuote(quote);
   }
};

const renderQuote = (quote) => {
      let newLi = document.createElement('li');
      newLi.className = 'quote-card';
      newLi.id = `list_item_${quote.id}`;
      let blkQuote = document.createElement('blockquote');
      blkQuote.className = "blockquote";
      let newP = document.createElement('p');
      newP.className = "mb-0";
      newP.innerText = quote.quote;
      let newFooter = document.createElement('footer');
      newFooter.className = "blockquote-footer";
      newFooter.innerText = quote.author;
      let likesFooter = document.createElement('footer');
      likesFooter.className = "blockquote-footer";
      likesFooter.id = `likeFoot_${quote.id}`
      likeNumber = (quote.likes === undefined) ? 0 : quote.likes.length;
      likesFooter.innerText =`Likes received: ${likeNumber}`;
      let likeBtn = document.createElement('button');
      likeBtn.id = `like_${quote.id}`;
      likeBtn.className = 'btn-success';
      likeBtn.innerText = "like";
      likeBtn.addEventListener('click', (e) => {likeQuote(quote, likeBtn, likesFooter)});
      let deleteBtn = document.createElement('button');
      deleteBtn.id = `delete_${quote.id}`;
      deleteBtn.className = 'btn-success';
      deleteBtn.innerText = "delete";
      deleteBtn.addEventListener('click', (e) => {deleteQuote(quote, deleteBtn)});
      newLi.append(blkQuote, newP, newFooter, likesFooter, likeBtn, deleteBtn);
      quoteList.append(newLi);
};

const newQuote = (content, author) => {
   console.log(content);
   console.log(author);
   configOpt = {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         'Accept': 'application/json'
      },
      body: JSON.stringify({quote: content, author: author})
   }
   fetch(QUOTES_URL, configOpt)
   .then(data => data.json())
   .then(results => renderQuote(results))
};

const likeQuote = (quote, button, footer) => {
   let time = Date.now();
   configOpt = {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         'Accept': 'application/json'
      },
      body: JSON.stringify({quoteId: quote.id, createdAt: time})
   }
   fetch(LIKES_URL, configOpt)
   .then(data => data.json())
   .then(results => updateLikes(results, quote, footer))
};
// try to fetch the quote data in the .then statement.




const updateLikes = (newLikeData, quote, footer) => {
   fetch(LIKES_URL)
   .then(data => data.json())
   .then(results => updateLikesDom(results, quote, footer))
};
   
const updateLikesDom = (results, quote, footer)  => {
   quoteNumber = (quote.likes !== undefined ? quote.likes.length : 0 )
   footer.innerText = `Likes received: ${quoteNumber + 1}`;
};

const deleteQuote = (quote, button) => {
   console.log(quote);
   quoteItem = document.querySelector(`#list_item_${quote.id}`);
   quoteItem.remove();

   fetch(`${QUOTES_URL}/${quote.id}`, {method: 'DELETE'})
   .then(data => data.json())
   .then(console.log('Quote has been successfully deleted.'))
};


});