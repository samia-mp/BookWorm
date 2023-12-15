// Loading the embedded viewer API 
google.books.load();
    
    //The initialize function will load a book to the viewer on the page by by referring to the URL parameter that was allocated earlier, specifially the 'id' key. 
    function initialize() {
        /*window.location.search will return the query string of the current page*/
        let queryString = window.location.search;
        
        let urlParams = new URLSearchParams(queryString);
        
        let bookId = urlParams.get('id'); // Get the book ID from the URL
        
        let viewer = new google.books.DefaultViewer(document.getElementById('viewerCanvas'));
        viewer.load(`${bookId}`);
        
      }

/*This function is used once the API has fully loaded in order to call the initialize function*/
google.books.setOnLoadCallback(initialize);