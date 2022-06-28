const localStorageKey = "BOOKSHELF_APP";

/* 

---------> Function <-----------

*/

// Insert the data into localStorage
const insertDataToLocalStorage = (data) => {
    let bookshelf = []

    if(localStorage.getItem(localStorageKey) === null){
        localStorage.setItem(localStorageKey, 0)
    } else {
        bookshelf = JSON.parse(localStorage.getItem(localStorageKey))
    }

    bookshelf.unshift(data)
    localStorage.setItem(localStorageKey, JSON.stringify(bookshelf))

    showData(getDataFromLocalStorage())
}

// Get all data from localStorage
function getDataFromLocalStorage () {
    return JSON.parse(localStorage.getItem(localStorageKey)) || []
}


// render data into html
function showData(bookshelf = []){
    let uncompleted = document.getElementById('incompleteBookshelfList')
    let completed = document.getElementById('completeBookshelfList')

    // Only get book data where is completed
    const uncompletedBook = bookshelf.filter(book => !book.isCompleted)

    // Only get book data where is uncompleted
    const completedBook = bookshelf.filter(book => book.isCompleted)

    // Mapping uncompleted data into html
    const setUncompletedBook = uncompletedBook.map(({ id,title,author, releaseYear }) => {
            const myArticle = document.createElement('article');
            myArticle.setAttribute('class', 'book_item');
    
            myArticle.innerHTML = `
                <h3>${title}</h3>
                <p>Penulis: ${author}</p>
                <p>Tahun: ${releaseYear}</p>
            
                <div class="action">
                    <button class="green" onclick="setBookCompleted(${id})">Tandai selesai dibaca</button>
                    <button class="red" onclick="deleteBook(${id})">Hapus buku</button>
                </div>
            `
    
            return myArticle
        })

    // Insert the mapped data into the parent element
    setUncompletedBook.forEach(item => {
        uncompleted.append(item)
    })

    // Mapping completed data into html
    const setCompletedBook = completedBook.map(({ id, title, author, releaseYear }) => {
            const myArticle = document.createElement('article');
            myArticle.setAttribute('class', 'book_item');
    
            myArticle.innerHTML = `
                <h3>${title}</h3>
                <p>Penulis: ${author}</p>
                <p>Tahun: ${releaseYear}</p>
            
                <div class="action">
                    <button class="green" onclick="setBookUncompleted(${id})">Tandai belum selesai dibaca</button>
                    <button class="red" onclick="deleteBook(${id})">Hapus buku</button>
                </div>
            `
    
            return myArticle
        })

    // Insert the mapped data into the parent element
    setCompletedBook.forEach(item => {
        completed.append(item)
    })
}


// Set book as completed
function setBookCompleted(id){
    let confirmation = confirm('Tandai selesai dibaca  ?')

    // When user click OK
    if(confirmation){
        const getTheBook = getDataFromLocalStorage().filter(book => book.id === id)

        const setBookCompleted = {
            id: getTheBook[0].id,
            title: getTheBook[0].title,
            author: getTheBook[0].author,
            releaseYear: getTheBook[0].releaseYear,
            isCompleted: true
        }

        const bookData = getDataFromLocalStorage().filter(book => book.id !== id)
        localStorage.setItem(localStorageKey, JSON.stringify(bookData))

        insertDataToLocalStorage(setBookCompleted)

    // When user click cancel
    } else{
        return;
    }
    
    // Reload Page
    location.reload()
}

// Set Book as uncompleted
function setBookUncompleted(id){
    let confirmation = confirm('Tandai belum selesai dibaca  ?')

    // When user click OK
    if(confirmation){
        const getTheBook = getDataFromLocalStorage().filter(book => book.id === id)

        const setBookUncompleted = {
            id: getTheBook[0].id,
            title: getTheBook[0].title,
            author: getTheBook[0].author,
            releaseYear: getTheBook[0].releaseYear,
            isCompleted: false
        }

        const bookData = getDataFromLocalStorage().filter(book => book.id !== id)
        localStorage.setItem(localStorageKey, JSON.stringify(bookData))

        insertDataToLocalStorage(setBookUncompleted)

    // When user click cancel
    } else{
        return;
    }
    
    // Reload Page
    location.reload()
}

// Delete Book
function deleteBook(id){
    const getBookTitle = getDataFromLocalStorage().filter(book => book.id === id)

    // Give confirmation to user
    let confirmation = confirm(`Hapus buku ${getBookTitle[0].title}`)

    // When user click OK
    if(confirmation){
        const bookData = getDataFromLocalStorage().filter(book => book.id !== id)
        localStorage.setItem(localStorageKey, JSON.stringify(bookData))
    }
    
    // Reload Page
    location.reload()
}


// Mapping search result into html
function searchResult(book = []){
    const bookResult = document.getElementById('searchResult')
    bookResult.innerHTML = ''
    const result = book.map(({title, author, isCompleted, releaseYear}) => {
        const myArticle = document.createElement('article')
        myArticle.setAttribute('class', 'book_item')

        myArticle.innerHTML = `
            <h3>${title}</h3>
            <p>Penulis: ${author}</p>
            <p>Tahun: ${releaseYear}</p>
            <p>Rak: ${isCompleted ? 'Selesai dibaca' : 'Belum selesai dibaca'}</p>
        `
        return myArticle
    })

    result.forEach(item => {
        bookResult.append(item)
    })
}

/* 

---------> Event Listener <-----------

*/

// When page load
window.addEventListener('load', () => {
    showData(getDataFromLocalStorage())
})


// create submit listener to add a book into bookshelf
const inputBookForm = document.getElementById('inputBook');
inputBookForm.addEventListener('submit', function(e){
    e.preventDefault();

    // Get the input field
    let bookTitle = document.getElementById('inputBookTitle').value;
    let bookAuthor = document.getElementById('inputBookAuthor').value;
    let bookYear = document.getElementById('inputBookYear').value;
    let bookIsComplete = document.getElementById('inputBookIsComplete').checked;
    
    // Put data into localStorage
    const newBook = {id: +new Date(), title: bookTitle, author: bookAuthor, releaseYear: bookYear, isCompleted: bookIsComplete}
    insertDataToLocalStorage(newBook);

    // Give feedback for user
    alert(`${bookTitle} added successfuly!`)

    // Reset form
    inputBookForm.reset()
    
    location.reload()
})

// Search Book 
const searchBookForm = document.getElementById('searchBook')
searchBookForm.addEventListener('submit', function(e){
    e.preventDefault();
    
    if(localStorage.getItem(localStorageKey) === null){
       return alert('Buku tidak ada')
    }

    const searchInput = document.getElementById('searchBookTitle').value

    const getResult = getDataFromLocalStorage().filter((book) => {
        const formattedTitle = book.title.toLowerCase()
        const formattedInput = searchInput.toLowerCase()

        if(formattedTitle.includes(formattedInput) || formattedTitle === formattedInput){
            return book
        }
    })

    searchResult(getResult)
})