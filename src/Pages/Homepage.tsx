import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import axios from "axios";
import CommentForm from "./CommentForm";

interface Tweet {
  id: number;
  content: string;
  username: string;
}

interface Comment {
  id: number;
  content: string;
  username: string;
}

const Homepage = () => {

   const [tweets, setTweets] = useState<Tweet[]>([]);
   const [comments, setComments] = useState<Comment[]>([]);
  
  const [likesCount, setLikesCount] = useState<{ [tweetId: number]: number }>({});
  const [expandedCommentTweetId, setExpandedCommentTweetId] = useState<number | null>(null);

  const apiEndpoint = 'http://localhost:8080';
  const userId = 1; // Replace with actual logged-in user id

  useEffect(() => {
    fetchTweets();
  }, []);

 

  const fetchTweets = async () => {
    try {
      const response = await axios.get(`${apiEndpoint}/api/tweets`);
      console.log(response.data);
      setTweets(response.data.map((tweet: any) => ({
        id: tweet.id,
        content: tweet.content,
        username: tweet.user.username.replace('@gmail.com', ''),
      })));
      // Fetch likes for all tweets
      response.data.forEach((tweet: any) => fetchLikesCount(tweet.id));
    } catch (err: any) {
      console.error(err);
    }
  };


  const fetchCommentsByTweetId = async (tweetId: number) => {
    try {
      const response = await axios.get(`${apiEndpoint}/api/comments/tweet/${tweetId}`);
      console.log(response.data);
      setComments(response.data.map((comment: any) =>({content: comment.content, username: comment.username.replace('@gmail.com', '')}) ));      
      // Fetch likes for all tweets
      response.data.forEach((tweet: any) => fetchLikesCount(tweet.id));
    } catch (err: any) {
      console.error(err);
    }
  };
  // Fetch likes count for a tweet
  const fetchLikesCount = async (tweetId: number) => {
    try {
      const response = await axios.get(`${apiEndpoint}/api/likes/count/tweet/${tweetId}`);
      setLikesCount(prev => ({ ...prev, [tweetId]: response.data }));
    } catch (err) {
      // Optionally handle error
    }
  };

  // Handle like button click
  const handleLike = async (tweetId: number) => {
    try {
      await axios.post(`${apiEndpoint}/api/likes`, { tweetId, userId });
      fetchLikesCount(tweetId);
    } catch (err) {
      // Optionally handle error
    }
  };


  const handleCommentClick = (tweetId: number) => {
    fetchCommentsByTweetId(tweetId);
    setExpandedCommentTweetId(expandedCommentTweetId === tweetId ? null : tweetId);
  };

  const showComments = ()=>{
    console.log("comments", comments)
return comments.length > 0 ? comments.map((comment, index)=>(
   <Paper key={index} elevation={2} sx={{ p: 2, mb: 2, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
    <Typography variant="body1" sx={{ mt: 2, fontWeight:'500' }}>{comment.content}</Typography>
   <Typography variant="body2" sx={{ mt: 2 }} color="primary">{`@${comment.username}`}</Typography>
   </Paper>
  )): <Typography variant="body1" sx={{ mt: 2 }}> No comments found!</Typography>
}

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "50rem",
        overflowY: "auto",
        p: 3,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 3,
        mt: 4,
        mx: "auto",
      }}
    >
      {tweets.map((tweet) => (
        <Paper key={tweet.id} elevation={3} sx={{ p: 4, mb: 2 }}>
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 'bold', textAlign:'end' }}>
            @{tweet.username}
          </Typography>
          <Typography variant="h4" gutterBottom>
            {tweet.content}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton aria-label="like" size="large" onClick={() => handleLike(tweet.id)} sx={{backgroundColor: likesCount[tweet.id] > 0 ? 'red' : 'transparent'}}>
                <FavoriteBorderIcon fontSize="inherit" />
              </IconButton>
              <Typography variant="body2" sx={{ ml: 1, minWidth: 24, fontWeight: 700 }} color="primary">
                {likesCount[tweet.id] ?? 0}
              </Typography>
            </Box>
            <IconButton aria-label="retweet" size="large">
              <RepeatIcon fontSize="inherit" />
            </IconButton>
            <IconButton aria-label="reply" size="large" onClick={() => handleCommentClick(tweet.id)} >
              <ChatBubbleOutlineIcon fontSize="inherit" />
            </IconButton>
          </Box>
          {expandedCommentTweetId === tweet.id && (
            <CommentForm
              tweetId={tweet.id}
              onSubmit={async (data) => {
                try {
                  await axios.post(`${apiEndpoint}/api/comments`, {
                    content: data.comment,
                    tweetId: tweet.id,
                    userId: userId,
                  });
                  alert('Comment posted successfully!');
                } catch (err) {
                  alert('Failed to post comment.');
                }
              }}
            />
          )}
          {expandedCommentTweetId === tweet.id &&showComments()}
        </Paper>
      ))}
    </Box>
  );
};

export default Homepage;
