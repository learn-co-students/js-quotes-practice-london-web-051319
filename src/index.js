// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 

window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');

    const allQuotesUrl = 'http://localhost:3000/quotes?_embed=likes'
    const allLikesUrl = 'http://localhost:3000/likes'

    function getAllQuotes(){
        fetch(allQuotesUrl)
            .then(function(response) {
                return response.json();
            })
            .then(function(allQuotes) {
                renderAllQuotes(allQuotes);
            });
    }

    function renderAllQuotes(allQuotes){
        const quoteList = document.querySelector('#quote-list')
        quoteList.innerHTML = " "

        for (let element in allQuotes){
            const li = document.createElement('li')
            const bq = document.createElement('blockquote')
            const p = document.createElement('p')
            const footer = document.createElement('footer')
            const br = document.createElement('br')
            const button1 = document.createElement('button')
            const button2 = document.createElement('button')

            li.className = 'quote-card'
            bq.className = 'blockquote'
            p.className = 'mb-0'
            footer.className = 'blockquote-footer'
            button1.className = 'btn-success'
            button2.className = 'btn-danger'

            button1.innerHTML = `Likes: <span>${allQuotes[element].likes.length}</span>`
            button1.id = `like${element}`
            button2.innerHTML = 'Delete'

            bq.append(p, footer, br, button1, button2)
            li.append(bq)
            
            p.append(allQuotes[element].quote)
            footer.append(allQuotes[element].author)
            quoteList.append(li)

            

            // for like button
            let quote = allQuotes[element]
            addToLike(quote, button1)
            addToDelete(quote, button2)
        }

        listenToForm(allQuotes)

    }

    function addToLike(quote, button1){
        button1.addEventListener("click", e => {
            event.preventDefault()
            // update front end
            // console.log(li)

            let now = Math.floor(Date.now() / 1000)
            const likeObj = {
                'quoteId': quote.id,
                'createdAt': now
            }

            return fetch(allLikesUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(likeObj)
            })
            .then(response => response.json())
            // .then(button1.innerHTML = `Likes: ${quote.likes.length + 1}`)
            .then(getAllQuotes)  
        })
    }

    function addToDelete(quote, button2){
        
        button2.addEventListener("click", e => {
            console.log(quote)
            console.log(button2)
            return fetch(`http://localhost:3000/quotes/${quote.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(getAllQuotes) 
        })

    }

    // function clearQuotes(){
    //     const quoteList = document.querySelector('#quote-list')
    //     quoteList.innerHTML = ""
    // }

    // function renderLike(quote){
    //     let successSelect = document.querySelector()
    //         // this is selecting the first one for the whole document.
    //     successSelect.innerHTML = `Likes: <span>${}</span>`
    // }

    function listenToForm(allQuotes){
        console.log(allQuotes)
        document.addEventListener("submit", event => {
            event.preventDefault();
            // do a post here to add quote
            const newQuote = event.target[0].value
            const newAuthor = event.target[1].value
            const newQuoteObj = {
                'quote': newQuote,
                'author': newAuthor
            }
            console.log(newQuoteObj)

            return fetch(allQuotesUrl, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(newQuoteObj)

            })
            .then(response => response.json())
            .then(getAllQuotes)
        })
    }

    

















    getAllQuotes();

});