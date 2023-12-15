function createBookFactsContainer(titleInfo, authorsInfo, bookPublishedDateInfo,industryIdentifiers){
    /*Creating a div element with class name : bookFactsContainer.
    <div class="bookFactsContainer""></div>
    */
    let bookFactsContainer = document.createElement('div');
    bookFactsContainer.className = 'bookFactsContainer';

    /*Creating a <p> element with class name : bookTitle. As a child of the previous element, that will contain the book title as text.
    <p class="bookTitle">Title: ...  </p>
    */
    let bookTitle = document.createElement('p');
    bookTitle.innerText = `Title: ${titleInfo}`;
    bookTitle.className = 'bookTitle';
    bookFactsContainer.appendChild(bookTitle);

    /*Creating a <p> element with class name : bookTitle. As a child of the 'bookFactsContainer', that will contain the book's author as text.  
    <p class="bookAuthors"> Author/s: ... </p>
    */
    if(authorsInfo.length > 0 ){
        let bookAuthors = document.createElement('p');
        bookAuthors.innerText = `Author/s: ${authorsInfo.join(', ')}`;
        bookAuthors.className = 'bookAuthors';
        bookFactsContainer.appendChild(bookAuthors);
    }

    /*Creating a <p> element with class name : bookPublishedDate. As a child of the 'bookFactsContainer', that will contain the book's published date as text
    <p class="bookPlushedDate"> Publish Date: ... </p>
    */
    let bookPublishedDate = document.createElement('p');
    bookPublishedDate.innerText = `Publish Date: ${bookPublishedDateInfo}`;
    bookPublishedDate.className = 'bookPublishedDate';
    bookFactsContainer.appendChild(bookPublishedDate);

    /*Creating <p> elements: 
    <p>ISBN_10: ...</p>
    <p>ISBN_13: ...</p>
    */
    if(industryIdentifiers.length > 0){
        
        for(let i=0;i<=1;i++){
            let bookIdentifiers = document.createElement('p');
            bookIdentifiers.innerText = `${industryIdentifiers[i].type}: ${industryIdentifiers[i].identifier}`;
            bookFactsContainer.appendChild(bookIdentifiers);
        }
    }

    /* Creating this: <div class="starsContainer">Your Rating:   </div> */
    let starsContainer = document.createElement('div');
    starsContainer.className = 'starsContainer';
    starsContainer.innerText='Your Rating:';
    bookFactsContainer.appendChild(starsContainer);

     /* Creating this: <i class="fa-regular fa-star"></i>. This is from the Font Awesome libary & toolKit*/
    for(let i=0; i<4; i++){
        let star = document.createElement('i');
        star.className='fa-solid fa-star';
        starsContainer.appendChild(star);
    }

     /*Creating a delete button*/
    removeBookFeature(industryIdentifiers[0].identifier,bookFactsContainer);
     

    /*Returning a reference of the the bookFactsContainer object*/
    return bookFactsContainer;
}

/*This fucntion will remove a book from the locally stored array & refresh the page when it does*/
function removeBookFeature(bookISBN,bookFactsContainer){
    let deleteOption = document.createElement('input');
    deleteOption.setAttribute('type','button');
    deleteOption.setAttribute('value','Remove Book');
    deleteOption.className='removeButton';
    deleteOption.onclick = function(){
        let favoritesArray = JSON.parse(localStorage.getItem('storedFavoritesArray'));
        let itemToBeDeleted = favoritesArray.indexOf(bookISBN);
        favoritesArray.splice(itemToBeDeleted,1);
        localStorage.setItem('storedFavoritesArray', JSON.stringify(favoritesArray));
        alert(`You removed a book from your favorites`);
        location.reload();
        
    };
    bookFactsContainer.appendChild(deleteOption);
}

/*This fucntion will add an event listener to all <i> elements provided by Font Awesome*/
function addEventListenersToStars(stars) {
    for (let starIndex = 0; starIndex < stars.length; starIndex++) {
        stars[starIndex].addEventListener('click', function () {
            console.log(`Star ${starIndex + 1} clicked`);

            for (let i = 0; i < stars.length; i++) {
                if (i <= starIndex) {
                    stars[i].classList.add('active');
                } else {
                    stars[i].classList.remove('active');
                }
            }
        });
    }
}


function createBookImageDiv(thumbnailLink){
    /*Creating <div> elements where each book thumbnail will be placed */
    let bookImageContainer = document.createElement('div');
    bookImageContainer.className ='bookImageContainer';

    /* Creating an <img> element, within the bookImagecontainer object, where the book cover will be placed.
    <img src="thumbnailLink">
    */

    let bookImage = document.createElement('img');
    bookImage.src = thumbnailLink;

    bookImageContainer.appendChild(bookImage);


    return bookImageContainer;
}


let favoritesArray = JSON.parse(localStorage.getItem('storedFavoritesArray'));
if (favoritesArray.length >=1){

    for(let i =0; i< favoritesArray.length; i++){
        let query= favoritesArray[i];

        function start(){
            gapi.client.init({
                'apiKey': 'AIzaSyCc6gZwjBm2hDgyJGgUA_aFyM3KbfzGwGQ',
                'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/books/v1/rest'],
            }).then(function(){
                /*Executes the API request and returns a promise generated by the API request.
                The method name gapi.client.books.volumes.list makes an API request to the Google Books API. It'll search for books based 
                on the query AKA "q" making sure the 'intitle' template string gets the value from the locally stored data 'mytext' and matches books to that title. 
                */

                return gapi.client.books.volumes.list({
                
                    q:`isbn:${query}`,

                });
            }).then(function(response){
                /*
                The response argument it's an object that represents the response from an API call
                In the case that the API call was successful:
                */
                let bookArray = response.result.items;
                console.log(response);
                console.log(response.result);
                console.log(bookArray);
                let contentDiv = document.getElementById('content');

                if(bookArray){
                    bookArray.forEach(function(book){


                        let thumbnailInfo = book.volumeInfo && book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail;
                        let authorsInfo = book.volumeInfo && book.volumeInfo.authors;
                        let titleInfo = book.volumeInfo && book.volumeInfo.title;
                        let industryIdentifiersInfo = book.volumeInfo && book.volumeInfo.industryIdentifiers;
                        
                        if(thumbnailInfo && titleInfo && authorsInfo && industryIdentifiersInfo){
                            
                            let thumbnailLink = book.volumeInfo.imageLinks.thumbnail;
                            let title = book.volumeInfo.title;
                            let authors = book.volumeInfo.authors;
                            let publishedDate = book.volumeInfo.publishedDate;
                            let industryIdentifiers = book.volumeInfo.industryIdentifiers;
                            

                            /*bookContainer hold a reference to the the new <div> element that was created and apped it under the parent <div>/contentDiv.
                            <div class="book-container" style="display:flex"></div>
                            */
                            let bookContainer = document.createElement('div');
                            bookContainer.style.display = 'flex';
                            bookContainer.className ='book-container';
                            contentDiv.appendChild(bookContainer);

                            /*bookImageStructure holds a reference to the newly created <div> elements that help display book's image by calling the createBookImageDiv() function.*/
                            let bookImageStructure = createBookImageDiv(thumbnailLink);
                            bookContainer.appendChild(bookImageStructure);

                            /*bookFacstsStructure holds a reference to the newly created <div> elements that help display book's image by calling the createBookFactsContainer() function.*/
                            let bookFactsStructure = createBookFactsContainer(title,authors,publishedDate,industryIdentifiers);
                            bookContainer.appendChild(bookFactsStructure);

                            
                            let stars=bookContainer.querySelectorAll('.starsContainer i');//hold a reference to the returned node list containing all selected elements
                            addEventListenersToStars(stars);
                        }
                            
                    });
                }
            },function(reason){
                /*
                In the case the API call was unsucessful:
                */
                alert('Error: '+ reason.result.error.message);
            });
        };

        gapi.load('client',start);
    }
    
}
else{
    alert('You have not added any books to your favorites yet');
}




