import { useState } from 'react';
import axios from 'axios';
import  '../Component/Spotify.css'; // Import CSS file for styling

const Sportify = () => {
  const endPoint = "https://accounts.spotify.com/api/token";
  const clientId = "68646eb158ca455490d1ddba2b98326c";
  const clientSecret = "8b543bef076d49ffb47f27ef314f0d2d";
  const playlistId = "37i9dQZF1DX8091X7wyurB"; // Replace with the actual playlist ID

  const [playlistInfo, setPlaylistInfo] = useState(null);

  const getToken = () => {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const data = new URLSearchParams();
    data.append('client_id', clientId);
    data.append('client_secret', clientSecret);
    data.append('grant_type', 'client_credentials');

    // Send POST request to get access token
    axios.post(endPoint, data, { headers })
      .then(response => {
        const accessToken = response.data.access_token;

        // Set the headers for the playlist request
        const playlistHeaders = {
          'Authorization': `Bearer ${accessToken}`,
        };

        // Send GET request to get playlist information
        axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, { headers: playlistHeaders })
          .then(playlistResponse => {
            // Handle the playlist response
            setPlaylistInfo(playlistResponse.data);
            console.log(playlistResponse.data);
          })
          .catch(playlistError => {
            // Handle playlist errors
            console.error('Error fetching playlist:', playlistError);
          });
      })
      .catch(error => {
        // Handle errors
        console.error('Error fetching token:', error);
      });
  };

  return (
    <main className="sportify-container">
      <div className="background-image"></div> {/* Background image */}
      <h1>Sportify</h1>
      <button className="get-music-btn" onClick={getToken}>Get Music</button>

      {playlistInfo && (
        <div className="playlist-info">
          <h2>Playlist Information:</h2>
          <p><h1>Title:</h1> {playlistInfo.name}</p>
          <p><h1>Owner:</h1> {playlistInfo.owner.display_name}</p>
          <p><h1>Total Tracks:</h1> {playlistInfo.tracks.total}</p>

          <h3>Tracks:</h3>
          {playlistInfo.tracks.items.map((track, i) => (
            <div key={i} className="track">
              <p><h1>Title:</h1> {track.track.name}</p>
              <p><h1>Artist(s):</h1> {track.track.artists.map(artist => artist.name).join(', ')}</p>
              <p><h1>Album:</h1> {track.track.album.name}</p>
              <p><h1>Duration:</h1> {track.track.duration_ms} ms</p>
              <div className="audio-container">
                {track.track.preview_url && (
                  <audio key={i} src={track.track.preview_url} controls className="styled-audio"></audio>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default Sportify;
