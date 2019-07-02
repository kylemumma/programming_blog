import React from 'react';
import Header from './components/header.js';
import PostsBody from './components/postsBody.js';
import request from 'superagent';

// take timestamp as param and returns date
function getDateFromTimestamp(timestamp) {
    let date = new Date(timestamp * 1000);

    let months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    let day = date.getDate();
    let month_index = date.getMonth();
    let year = date.getFullYear();

    return `${months[month_index]} ${day} ${year}`
}

const instagramApiUrl = 'https://www.instagram.com/kylemummacodes/?__a=1';

// returns 12 most recent ig posts for kylemummacodes
async function getInstagramData() {
    const response = await fetch(instagramApiUrl);
    const instagramData = await response.json();

    // gets array of 12 most recent posts
    return instagramData.graphql.user.edge_owner_to_timeline_media.edges;
}

// returns the most recent post to kylemummacodes
async function getMostRecentPost() {
    const instagramData = await getInstagramData();
    let mostRecentPost = instagramData[0].node;

    let postBody = mostRecentPost.edge_media_to_caption.edges[0].node.text;

    if(postBody.includes('<')){
      return {
        id: mostRecentPost.id,
        date_posted: getDateFromTimestamp(mostRecentPost.taken_at_timestamp),
        title: postBody.substring(postBody.indexOf('<') + 1, postBody.indexOf('>')),
        day: postBody.substring(postBody.indexOf('[') + 1, postBody.indexOf(']')),
        image: mostRecentPost.display_url,
        caption: postBody.substring(postBody.indexOf(']') + 2, postBody.length) 
      };
    }
    return false;
}

async function updateDatabase() {
  const mostRecentPost = await getMostRecentPost();

  // a post of false means it was not formatted right and not meant
  // to be added to the db
  if(mostRecentPost !== false){
    //api post request to post the most recent post
    request
    .post('http://localhost:5000/posts')
    .send(JSON.stringify(mostRecentPost))
    .set('Content-Type', 'application/json')
    .then(res => {
      console.log(res.status);
    });
  }
}

async function getAllPosts() {
  const databaseURL = 'http://localhost:5000/posts';
  const response = await fetch(databaseURL);
  const postsData = await response.json();

  return postsData;
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: []
    }
  }

  componentDidMount() {
    // makes api call to instagram to post the most recent post to api
    updateDatabase()
    .then(res => {
      // gets all posts from api
      getAllPosts()
      .then(res => {
        // sets state of posts to all the posts from the api
        this.setState({
          posts: res
        });
      })
    });
  }

  render() {
    return (
      <div className="container">
        <Header />
        <PostsBody posts={this.state.posts}/>
      </div>
    );
  }
}

export default App;
