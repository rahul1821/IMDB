

let currentMovieStack = [];

const homeButton = document.querySelector("#home-button");
const searchBox = document.querySelector("#search-box");
const goToFavouriteButton = document.querySelector("#goto-favourites-button");
const movieCardContainer = document.querySelector("#movie-card-container")

// simple function to show an alert when we need 
function showAlert(message){
	alert(message);
}


// create move cards using elements of currentMovieStack array 
function renderList(actionForButton){
	movieCardContainer.innerHTML = '';

	for(let i = 0; i<currentMovieStack.length; i++){

		//*** */ creating div element for movie card and setting class and id to it
		let movieCard = document.createElement('div');
		movieCard.classList.add("movie-card");

		//**** */ templet for interHtml of movie card which sets image, title and rating of particular movie
		movieCard.innerHTML = `
		<div class="card mx-2 my-2" style="width: 18rem;">
            <img src="${'https://image.tmdb.org/t/p/w500' + currentMovieStack[i].poster_path}" class="card-img-top" alt="${currentMovieStack[i].title}">
            
            <div class="card-body">
                <h6 class="card-title" style="margin-top:-10px;">${currentMovieStack[i].title}</h6>
                <p class="card-text" style="margin-top: -10px;">Rating ${currentMovieStack[i].vote_average}</p>
                <button id="${currentMovieStack[i].id}" onclick="getMovieInDetail(this)" type="button" class="btn btn-outline-success">More Detail</button>
                
                <button onclick="${actionForButton}(this)" class="add-to-favourite-button text-icon-button btn btn-outline-danger " data-id="${currentMovieStack[i].id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star" style="margin-top:-5px;" viewBox="0 0 16 16">
  <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
</svg><span>${actionForButton}</span>
		            </button>
            </div>
        </div>
		`;
		movieCardContainer.append(movieCard); //appending card to the movie container view
		
	}
}


// if any thing wrong by using this function we print message to the main screen
function printError(message){
	const errorDiv = document.createElement("div");
	errorDiv.innerHTML = message;
	errorDiv.style.height = "100%";
	errorDiv.style.fontSize = "5rem";
	errorDiv.style.margin = "auto";
	movieCardContainer.innerHTML = "";
	movieCardContainer.append(errorDiv);
}

// gets tranding movies from the server and renders as movie cards
function getTrandingMovies(){
	const tmdb = fetch("https://api.themoviedb.org/3/trending/movie/day?api_key=2cc850c5c02ffa1e779f62476c31b97e")
	.then((response) => response.json())
	.then((data) => {
		currentMovieStack = data.results;
		renderList("favourite");
	})
	.catch((err) => printError(err));
}
getTrandingMovies();

// when we clicked on home button this fetches trending movies and renders on web-page
homeButton.addEventListener('click', getTrandingMovies);




// search box event listner check for any key press and search the movie according and show on web-page
searchBox.addEventListener('keyup' , ()=>{
	let searchString = searchBox.value;
	
	if(searchString.length > 0){
		let searchStringURI = encodeURI(searchString);
		const searchResult = fetch(`https://api.themoviedb.org/3/search/movie?api_key=2cc850c5c02ffa1e779f62476c31b97e&language=en-US&page=1&include_adult=false&query=${searchStringURI}`)
			.then((response) => response.json())
			.then((data) =>{
				currentMovieStack = data.results;
				renderList("favourite");
			})
			.catch((err) => printError(err));
	}
})


// function to add movie into favourite section
function favourite(element){
	let id = element.dataset.id;
	for(let i = 0; i< currentMovieStack.length; i++){
		if(currentMovieStack[i].id == id){
			let favouriteMoviesAkash = JSON.parse(localStorage.getItem("favouriteMoviesAkash"));
			
			if(favouriteMoviesAkash == null){
				favouriteMoviesAkash = [];
			}

			favouriteMoviesAkash.unshift(currentMovieStack[i]);
			localStorage.setItem("favouriteMoviesAkash", JSON.stringify(favouriteMoviesAkash));

			showAlert(currentMovieStack[i].title + " added to favourite")
			return;
		}
	}
}

// when Favourites movie button click it shows the favourite moves 
goToFavouriteButton.addEventListener('click', ()=>{
	let favouriteMoviesAkash = JSON.parse(localStorage.getItem("favouriteMoviesAkash"));
	if(favouriteMoviesAkash == null || favouriteMoviesAkash.length < 1){
		showAlert("you have not added any movie to favourite");
		return;
	}

	currentMovieStack = favouriteMoviesAkash;
	renderList("remove");
})


// remove movies from favourite section
function remove(element){
	let id = element.dataset.id;
	let favouriteMoviesAkash = JSON.parse(localStorage.getItem("favouriteMoviesAkash"));
	let newFavouriteMovies = [];
	for(let i = 0; i<favouriteMoviesAkash.length; i++){
		if(favouriteMoviesAkash[i].id == id){
			continue;
		}
		newFavouriteMovies.push(favouriteMoviesAkash[i]);
	}
	
	localStorage.setItem("favouriteMoviesAkash", JSON.stringify(newFavouriteMovies));
	currentMovieStack = newFavouriteMovies;
	renderList("remove");
}



// renders movie details on web-page
function renderMovieInDetail(movie){
	console.log(movie);
	movieCardContainer.innerHTML = '';
	
	let movieDetailCard = document.createElement('div');
	movieDetailCard.classList.add('detail-movie-card');

	movieDetailCard.innerHTML = `
  <div style="background-color:black; color:white;">
  <center><img src="${'https://image.tmdb.org/t/p/w500' + movie.backdrop_path}" class="detail-movie-background" style= "margin-left: auto;margin-right: auto;width: 70%;"></center>
	<center><img src="${'https://image.tmdb.org/t/p/w500' + movie.poster_path}" class="detail-movie-poster" style="height: 200px;margin-top: -100px; margin-left: auto; margin-right: ; width: 30%;"></center>
  <center>
        <h1>${movie.title}</h1>
        <h3 >Rating: ${movie.vote_average}</h6>
        <h5> Release Date: ${movie.release_date}, Runtime: ${movie.runtime} minutes, Tagline: ${movie.tagline}</h5>
    </center>
    <div class="detials">
            <p style="color:blue; display: flex;height: auto;width: 50%;margin-right: auto;margin-left: auto;justify-content: center;text-align: justify;text-justify: inter-word;">${movie.overview}</p>      
    </div>
    </div>

		
	`;

	movieCardContainer.append(movieDetailCard);
}


// fetch the defails of of move and send it to renderMovieDetails to display
function getMovieInDetail(element){

	fetch(`https://api.themoviedb.org/3/movie/${element.getAttribute('id')}?api_key=2cc850c5c02ffa1e779f62476c31b97e&language=en-US`)
		.then((response) => response.json())
		.then((data) => renderMovieInDetail(data))
		.catch((err) => printError(err));

}


function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}