import React, { useState } from 'react';
import {
  Box,
  Typography,
  Rating,
  Avatar,
  TextField,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Paper
} from '@mui/material';
import { Star } from '@mui/icons-material';

const Reviews = ({ courseId }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  // Mock data - replace with API call
  const reviews = [
    {
      id: 1,
      user: {
        name: 'Alice Johnson',
        avatar: 'https://via.placeholder.com/40'
      },
      rating: 5,
      comment: 'Excellent course! The instructor explains everything clearly and the content is well-structured.',
      date: '2024-03-15'
    },
    {
      id: 2,
      user: {
        name: 'Bob Smith',
        avatar: 'https://via.placeholder.com/40'
      },
      rating: 4,
      comment: 'Great course for beginners. I learned a lot about web development.',
      date: '2024-03-10'
    }
  ];

  const handleSubmitReview = (e) => {
    e.preventDefault();
    // Implement review submission logic
    console.log('Submitting review:', { courseId, rating, review });
    setRating(0);
    setReview('');
  };

  return (
    <Box>
      {/* Add Review Form */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Write a Review
        </Typography>
        <form onSubmit={handleSubmitReview}>
          <Box sx={{ mb: 2 }}>
            <Typography component="legend">Rating</Typography>
            <Rating
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
              precision={0.5}
            />
          </Box>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            label="Your Review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={!rating || !review.trim()}
          >
            Submit Review
          </Button>
        </form>
      </Paper>

      {/* Reviews List */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Student Reviews
        </Typography>
        <List>
          {reviews.map((review, index) => (
            <React.Fragment key={review.id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar src={review.user.avatar} alt={review.user.name} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ mr: 1 }}>
                        {review.user.name}
                      </Typography>
                      <Rating value={review.rating} size="small" readOnly />
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                        sx={{ display: 'block', mb: 1 }}
                      >
                        {review.comment}
                      </Typography>
                      <Typography
                        component="span"
                        variant="caption"
                        color="text.secondary"
                      >
                        {new Date(review.date).toLocaleDateString()}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              {index < reviews.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default Reviews; 