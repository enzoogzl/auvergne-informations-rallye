let items=[],map,markers=[];
const $=id=>document.getElementById(id);
const fmt=d=>new Intl.DateTimeFormat('fr-FR',{day:'2-digit',month:'long',year:'numeric'}).format(new Date(d+'T12:00:00'));
function initMap(){map=L.map('map',{scrollWheelZoom:false}).setView([45.6,4.6],7);L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'&copy; OpenStreetMap'}).addTo(map)}
function draw(){
 $('events').innerHTML=items.map(e=>`<article class="event"><time>${fmt(e.date)}${e.endDate&&e.endDate!==e.date?' — '+fmt(e.endDate):''}</time><small>${e.status.toUpperCase()}</small><h3>${e.name}</h3><p>⌖ ${e.place}<br>${e.description}</p><a href="${e.url}" target="_blank" rel="noopener">SOURCE ORGANISATEUR / LIGUE ↗</a></article>`).join('');
 markers.forEach(m=>map.removeLayer(m));markers=[];
 items.forEach(e=>{let m=L.circleMarker([e.lat,e.lon],{radius:8,color:'#d8bd7d',weight:2,fillColor:'#b08c4a',fillOpacity:1}).addTo(map);m.bindPopup(`<b>${e.name}</b><br>${fmt(e.date)}<br>${e.place}<br><small>Repère indicatif — pas un tracé officiel.</small>`);markers.push(m)});
 $('maplist').innerHTML=items.map(e=>`<div class="map-item" data-lat="${e.lat}" data-lon="${e.lon}"><small>${fmt(e.date)} · ${e.place}</small><b>${e.name}</b></div>`).join('');
 document.querySelectorAll('.map-item').forEach(el=>el.addEventListener('click',()=>{map.setView([+el.dataset.lat,+el.dataset.lon],10);let m=markers.find(x=>x.getLatLng().lat===+el.dataset.lat);if(m)m.openPopup()}));
}
$('locate').addEventListener('click',()=>{if(!navigator.geolocation)return alert('Géolocalisation indisponible.');navigator.geolocation.getCurrentPosition(p=>{map.setView([p.coords.latitude,p.coords.longitude],9);L.circleMarker([p.coords.latitude,p.coords.longitude],{radius:7,color:'#fff',fillColor:'#b08c4a',fillOpacity:1}).addTo(map).bindPopup('Votre position').openPopup()},()=>alert('Autorisez la localisation dans votre navigateur pour utiliser cette fonction.'))});
$('menu').addEventListener('click',()=>{let n=$('nav');n.style.display=n.style.display==='flex'?'none':'flex'});
(async()=>{initMap();try{let r=await fetch('data/events.json');items=await r.json();draw()}catch(e){$('events').innerHTML='<p class="muted">Calendrier momentanément indisponible.</p>'}})();
