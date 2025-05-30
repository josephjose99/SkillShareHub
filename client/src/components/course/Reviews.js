import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Rating,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Flag as FlagIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../common/LoadingSpinner';
import LazyImage from '../common/LazyImage';

const MotionListItem = motion(ListItem);

const Reviews = ({ courseId }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuth();
  const { showToast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 0, review: '' });
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [reportReason, setReportReason] = useState('');

  useEffect(() => {
    fetchReviews();
  }, [courseId]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`/api/courses/${courseId}/reviews`);
      setReviews(response.data);
      setLoading(false);
    } catch (error) {
      setError('Error fetching reviews');
      setLoading(false);
      showToast('Failed to load reviews', 'error');
    }
  };

  const handleReviewSubmit = async () => {
    try {
      await axios.post(`/api/courses/${courseId}/reviews`, newReview);
      setReviewDialogOpen(false);
      setNewReview({ rating: 0, review: '' });
      fetchReviews();
      showToast('Review submitted successfully', 'success');
    } catch (error) {
      showToast('Error submitting review', 'error');
    }
  };

  const handleHelpfulVote = async (reviewId, isHelpful) => {
    try {
      await axios.post(`/api/courses/${courseId}/reviews/${reviewId}/vote`, {
        isHelpful,
      });
      fetchReviews();
      showToast('Vote recorded', 'success');
    } catch (error) {
      showToast('Error voting on review', 'error');
    }
  };

  const handleReportReview = async () => {
    try {
      await axios.post(
        `/api/courses/${courseId}/reviews/${selectedReview._id}/report`,
        {
          reason: reportReason,
        }
      );
      setReportDialogOpen(false);
      setReportReason('');
      setSelectedReview(null);
      showToast('Review reported successfully', 'success');
    } catch (error) {
      showToast('Error reporting review', 'error');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading reviews..." />;
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  const averageRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  return (
    <Box sx={{ p: { xs: 1, sm: 2 } }}>
      <Paper
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 3,
          borderRadius: 2,
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        }}
      >
        <Typography variant="h6" gutterBottom>
          Course Reviews
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 2,
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1, sm: 2 },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Rating value={averageRating} readOnly precision={0.5} />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ ml: 1 }}
            >
              ({reviews.length} reviews)
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={() => setReviewDialogOpen(true)}
            sx={{ ml: { sm: 'auto' } }}
          >
            Write a Review
          </Button>
        </Box>

        <AnimatePresence>
          <List>
            {reviews.map((review) => (
              <MotionListItem
                key={review._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                alignItems="flex-start"
                secondaryAction={
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <IconButton
                      onClick={() => handleHelpfulVote(review._id, true)}
                      color={review.userVote === 'helpful' ? 'primary' : 'default'}
                      size={isMobile ? 'small' : 'medium'}
                    >
                      <ThumbUpIcon />
                    </IconButton>
                    <Typography variant="caption" sx={{ mr: 1 }}>
                      {review.helpfulVotes}
                    </Typography>
                    <IconButton
                      onClick={() => handleHelpfulVote(review._id, false)}
                      color={review.userVote === 'unhelpful' ? 'primary' : 'default'}
                      size={isMobile ? 'small' : 'medium'}
                    >
                      <ThumbDownIcon />
                    </IconButton>
                    {user && user.role === 'admin' && (
                      <IconButton
                        onClick={() => {
                          setSelectedReview(review);
                          setReportDialogOpen(true);
                        }}
                        size={isMobile ? 'small' : 'medium'}
                      >
                        <FlagIcon />
                      </IconButton>
                    )}
                  </Box>
                }
              >
                <ListItemAvatar>
                  <Avatar
                    src={review.user.avatar}
                    alt={review.user.name}
                    sx={{ width: 40, height: 40 }}
                  >
                    {review.user.name[0]}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 1,
                      }}
                    >
                      <Typography component="span" variant="subtitle1">
                        {review.user.name}
                      </Typography>
                      <Rating
                        value={review.rating}
                        readOnly
                        size="small"
                        sx={{ ml: 1 }}
                      />
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
                        {new Date(review.createdAt).toLocaleDateString()}
                      </Typography>
                      {review.review}
                    </>
                  }
                />
              </MotionListItem>
            ))}
          </List>
        </AnimatePresence>
      </Paper>

      {/* Review Dialog */}
      <Dialog
        open={reviewDialogOpen}
        onClose={() => setReviewDialogOpen(false)}
        fullScreen={isMobile}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Write a Review</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              pt: 2,
            }}
          >
            <Rating
              value={newReview.rating}
              onChange={(event, newValue) => {
                setNewReview({ ...newReview, rating: newValue });
              }}
              size="large"
            />
            <TextField
              multiline
              rows={4}
              label="Your Review"
              value={newReview.review}
              onChange={(e) =>
                setNewReview({ ...newReview, review: e.target.value })
              }
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleReviewSubmit}
            variant="contained"
            disabled={!newReview.rating || !newReview.review}
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>

      {/* Report Dialog */}
      <Dialog
        open={reportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
        fullScreen={isMobile}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Report Review</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Reason for Report"
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleReportReview}
            variant="contained"
            color="error"
            disabled={!reportReason}
          >
            Submit Report
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Reviews; 