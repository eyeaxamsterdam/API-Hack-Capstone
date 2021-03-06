function searchtrack(song) {
  $.ajax({
    url: `https://api.spotify.com/v1/search?q=${song}&type=track`,
    type: "GET",
    beforeSend: function(xhr) {
      xhr.setRequestHeader("Authorization", "Bearer " + _token);
    },
    success: displayTitles
  });
}

function displayTitles(data) {
  console.log(data.tracks);
  for (let i = 0; i < data.tracks.items.length; i++) {
    let songName = data.tracks.items[i].name;
    let artistName = data.tracks.items[i].artists[0].name;
    let songid = data.tracks.items[i].id;

    $(
      `<p class="selection selection-number" id="${songid}"><span class="song-name">${songName}</span> - <span class="artist-name">${artistName}</span></p>`
    ).appendTo(".search-results");
  }
}

function checkForLyrics() {
  $(`.search-results`).on("click", ".selection-number", function() {
    $.ajax({
      url: "https://api.spotify.com/v1/me/player/play",
      type: "PUT",
      headers: {
        Authorization: `Bearer ${_token}`
      },
      device_ids: ["519cd79dca85a36d01cc67eac1bd23772d72004e"],
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify({
        uris: [`spotify:track:${this.id}`]
      })
    });

    const artistName = $(this)
      .find(".artist-name")
      .text();
    const songName = $(this)
      .find(".song-name")
      .text();

    fetch(
      `https://orion.apiseeds.com/api/music/lyric/${artistName}/${songName}?apikey=IMhMN29mkSHK4OfQsxWIUwylijoGFLTduAvZZH5uQR2IAfMVmsbTuXwhdyBuPmch`
    )
      .then(response => {
        if (!response.ok) {
          throw Error("Lyrics not found");
        }
        return response.json();
      })
      .then(myJson => {
        console.log(myJson.result.track.text);
        $(".lyrics").text(myJson.result.track.text);
      })
      .catch(err => $(".lyrics").html(`<span class="api-error">${err}</span>`));
  });
}

$(".search-btn").on("click", e => {
  e.preventDefault();
  $(".search-results").empty();
  let song = $(".search-box").val();
  searchtrack(song);
});

$("#playpause").click(e => {
  e.preventDefault();
  console.log("paused", $(this));
  $.ajax({
    url: "https://api.spotify.com/v1/me/player/pause",
    type: "PUT",
    headers: {
      Authorization: `Bearer ${_token}`
    },
    device_ids: ["519cd79dca85a36d01cc67eac1bd23772d72004e"]
  });
});
/* 
$('.pause').on('click', e => {
    e.preventDefault();
    $.ajax({
        url: 'https://api.spotify.com/v1/me/player/play',
        type: 'PUT',
        headers: {
          'Authorization': `Bearer ${_token}`
        },
        device_ids:['519cd79dca85a36d01cc67eac1bd23772d72004e'],
    });
});
 */

$(checkForLyrics);
