

const api_key = "de717d7563aed501c9cb445f25d7c454"
const endpoint = "https://api.themoviedb.org/3"
const imgpaths = "https://image.tmdb.org/t/p/original"

const apipaths = {
    fetchallcategories: `${endpoint}/genre/movie/list?api_key=${api_key}`,
    fetchmoviellist: (id) => `${endpoint}/discover/movie?api_key=${api_key}&with_genres=${id}`,
   
    fetchtrending: `${endpoint}/trending/movie/week?api_key=${api_key}&language=en-US`,
  
    searchonyoutube: (query) => `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=AIzaSyD7taC8g8r08AHOD42C2lrZVD_7ACBEULo`
}

function searchmovietrailer(moviename,iframeid) {
    if (!moviename) return;

    fetch(apipaths.searchonyoutube(moviename))
        .then(res => res.json())
        .then(res => {
            console.log(res)
            const bestresult = res.items[0];

            const elements = document.getElementById(iframeid);
            console.log(elements,iframeid);
            const div = document.createElement('div');
            div.innerHTML=`<iframe  width="300px" height="200px" src="https://www.youtube.com/embed/${bestresult.id.videoId}?autoplay=1&control=0"></iframe>`

            elements.append(div); })
}
function buildmoviessection(list, categoryname) {
    // console.log(list, categoryname)

    let moviescontainer = document.querySelector('.moviescontainer');

    const movieslistHTML = list.map(item => {
      
        return `
        <div class="movieitem" onmouseenter="searchmovietrailer('${item.title}','yt${item.id}')">
        <img class="movieitemimg" src="${imgpaths}${item.backdrop_path}" alt="${item.title}" >
        <div class="iframediv" id="yt${item.id}"></div>
        </div>`;
    }).join('');
      


   

    const moviessectionHTML = `  
    <h2 class="moviessectionheading">${categoryname} <span class="explore">Explore All</span></h2>
    <div class="moviesrow">
      ${movieslistHTML}
      </div>`




    const div = document.createElement('div');
    div.className = "moviesection";
    div.innerHTML = moviessectionHTML;
    moviescontainer.append(div);
}

function fetchandbuildmoviesection(fetchurl, categoryname) {
   //  console.log(fetchurl, categoryname);
    return fetch(fetchurl)
        .then(res => res.json())
        .then(res => {
            // console.table(res.results);

            const movies = res.results;
            if (Array.isArray(movies) && movies.length) {
                buildmoviessection(movies, categoryname);
            }

            return movies;
        })



      .catch(err => console.error(err))
}

function fetchandbuildallsection() {
    fetch(apipaths.fetchallcategories).then(res => res.json())
        .then(res => {
            const categories = res.genres;
            console.log(categories)

            if (Array.isArray(categories) && categories.length) {
                categories.forEach(category => {
                    fetchandbuildmoviesection(apipaths.fetchmoviellist(category.id), category.name);
                })
            }
        })
        .catch(err => console.error(err));
}

function buildbannersection(movie) {
    // console.log(movie)
    let bannersection = document.getElementById('bannersection')
    bannersection.style.backgroundImage = `url('${imgpaths}${movie.backdrop_path}')`;
    const div = document.createElement('div')
    div.innerHTML = `
<h2 class="bannertitle">${movie.title}</h2>
<p class="bannerinfo"> release date ${movie.release_date}</p>
<p class="banneroverview">${movie.overview && movie.overview.length > 200 ? movie.overview.slice(0,200).trim()+ '...':movie.overview}</p>
<div class="actionbutton">
<button class="actionb1">play</button>
<button class="actionb1">more info</button>
</div>`
    div.className = "bannercontent";
    bannersection.append(div);
}

function fetchtrendingmovies() {
    fetchandbuildmoviesection(apipaths.fetchtrending, 'trending Now')
        .then(list => {
            const randomIndex = parseInt(Math.random() * list.length);
            buildbannersection(list[randomIndex]);
        }).catch(err => { console.error(err); });
}

function Init() {
    // console.log("load huaa")
    fetchtrendingmovies();
    fetchandbuildallsection();


}


window.addEventListener('load', function () {
    Init();
    this.window.addEventListener('scroll', function () {
        const header = this.document.getElementById('header');
        if (window.scrollY > 5) header.classList.add('bgblack')
        else header.classList.remove('bgblack')
    })
})

