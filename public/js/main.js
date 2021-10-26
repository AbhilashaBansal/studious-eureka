async function refreshTweets() {
    
    $('.all-tweets-cont').empty();

    let tweets = await axios.get('/api/posts');

    for (let post of tweets.data) {
        let html = createTweetHtml(post)
        $(".all-tweets-cont").prepend(html);
    }
}


refreshTweets();


// create a new tweet
$('#createTweetBtn').click(async () => {
    let tweetText = $('#tweet-text').val();
    // console.log(tweetText);

    let newTweet = await axios.post('/api/post', {content: tweetText});
    // console.log(newTweet);

    $('#tweet-text').val("");
    refreshTweets();
})


// fn to create structure for tweets
function createTweetHtml(tweetData) {

    let postedBy = tweetData.postedBy;

    if(postedBy._id === undefined) {
        return console.log("User object has not been populated");
    }

    let displayName = postedBy.firstName + " " + postedBy.lastName;
    let timestamp = timeDifference(new Date(),new Date(tweetData.createdAt));

    return `<div class='post' data-id='${tweetData._id}'>
                <div class='cont1'>
                    <div class='profile-pic-cont'>
                        <img src='${postedBy.profilePhoto}'>
                    </div>
                    <div class='cont11'>
                        <div class='header1'>
                            <a href='/profile/${postedBy.username}' class='post-displayName'>${displayName}</a>
                            <span class='post-username'>@${postedBy.username}</span>
                            <span class='post-date'>${timestamp}</span>
                        </div>
                        <div class='postBody'>
                            <span>${tweetData.content}</span>
                        </div>
                        <div class='postFooter'>
                            <div class='post-btnCont'>
                                <button>
                                    <i class='far fa-comment'></i>
                                </button>
                            </div>
                            <div class='post-btnCont green'>
                                <button class='retweet'>
                                    <i class='fas fa-retweet'></i>
                                </button>
                            </div>
                            <div class='post-btnCont red'>
                                <button class='likeBtn'>
                                    <i class='far fa-heart'></i>
                                    <span>${tweetData.likes.length}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
    ;
}


// when user likes a post
$('.all-tweets-cont').on('click', '.likeBtn', async(event) => {
    
    let button = $(event.target);
    let postId = getPostIdFromElement(button);
    
    let postData = await axios.patch(`/api/posts/${postId}/like`);
   
    button.find("span").text(postData.data.likes.length);
})


function getPostIdFromElement(element){

    let isRoot = element.hasClass('post');

    let rootElement = isRoot===true?element:element.closest('.post');

    let postId = rootElement.data().id;
    return postId;
}


// time stamp to be displayedo on tweets
function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {

        if(elapsed/1000 < 30){

            return "Just now";
        }

         return Math.round(elapsed/1000) + ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}
