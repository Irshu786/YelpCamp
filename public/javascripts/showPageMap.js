mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: campground.geometry.coordinates,
    zoom: 6,
    projection: 'globe'
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 2 })
            .setHTML(
                `<h3>${campground.title}</h3><p>${campground.location}</p>`
            )
    )
    .addTo(map)


/*   -------------------
campground.geometry.coordinates
campground = JSON.parse(campground);
let campground = '<%-JSON.stringify(campground)%>'

const campgrounds = { features: JSON.parse(campgroundsRaw) };
 const campgroundsRaw = '<%-JSON.stringify(campgrounds)%>'

const campgrounds = { features : JSON.parse(campgrounds) }

.Popup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${campground.title}<p> ${campground.location} </p></h3>`
            )
    )

<script>
        const mapToken = '<%-process.env.MAPBOX_TOKEN%>';
    </script>
    <script src="/javascripts/showPageMap.js"></script>

[-113.1331, 47.0202]

<script>
       const mapToken = '<%-process.env.MAPBOX_TOKEN%>';
       const campground = '<%- JSON.stringify(campground) %>'
       campground = JSON.parse(campground)
   </script>
   <script src="/javascripts/showPageMap.js">
   </script>
   

// campground.geometry.coordinates,
//const campground = '<% -campground %>';

 
new mapboxgl.Marker()
.setLngLat(campground.geometry.coordinates)
.addTo(map)


const campground = JSON.parse('<%- campground %>');

const campground = require('../../controllers/campgrounds');
const campground1 = JSON.stringify(campground);
const mapToken = process.env.MAPBOX_TOKEN;
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: campground1.geometry.coordinates,
    zoom: 4
});

console.log(center);



*/