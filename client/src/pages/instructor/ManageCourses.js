import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Analytics as AnalyticsIcon,
  Add as AddIcon
} from '@mui/icons-material';
import axios from 'axios';

const ManageCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/instructor/courses');
      setCourses(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error loading courses');
      setLoading(false);
    }
  };

  const handleDeleteClick = (course) => {
    setCourseToDelete(course);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/api/courses/${courseToDelete._id}`);
      setCourses(courses.filter(course => course._id !== courseToDelete._id));
      setDeleteDialogOpen(false);
      setCourseToDelete(null);
    } catch (err) {
      setError('Error deleting course');
    }
  };

  const handleEditClick = (courseId) => {
    navigate(`/instructor/courses/${courseId}/edit`);
  };

  const handleAnalyticsClick = (courseId) => {
    navigate(`/instructor/courses/${courseId}/analytics`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">Manage Courses</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/instructor/courses/create')}
        >
          Create New Course
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course._id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={course.thumbnail || 'https://via.placeholder.com/300x140'}
                alt={course.title}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {course.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {course.description}
                </Typography>
                <Box display="flex" gap={1} mb={2}>
                  <Chip
                    label={course.category}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    label={course.level}
                    size="small"
                    color="secondary"
                    variant="outlined"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {course.enrolledStudents.length} students enrolled
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Rating: {course.averageRating.toFixed(1)} ({course.totalRatings} ratings)
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton
                  color="primary"
                  onClick={() => handleEditClick(course._id)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="info"
                  onClick={() => handleAnalyticsClick(course._id)}
                >
                  <AnalyticsIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => handleDeleteClick(course)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Course</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{courseToDelete?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageCourses; 