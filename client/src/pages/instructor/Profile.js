import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  CircularProgress,
  Alert
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/instructor/profile');
        setProfile(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error loading profile data');
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: profile?.name || '',
      bio: profile?.bio || '',
      profilePicture: profile?.profilePicture || ''
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      bio: Yup.string().required('Bio is required'),
      profilePicture: Yup.string().url('Must be a valid URL')
    }),
    onSubmit: async (values) => {
      try {
        await axios.put('/api/instructor/profile', values);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch (err) {
        setError('Error updating profile');
        setTimeout(() => setError(null), 3000);
      }
    }
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Instructor Profile
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Profile updated successfully
          </Alert>
        )}

        <Box component="form" onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} display="flex" justifyContent="center">
              <Avatar
                src={formik.values.profilePicture}
                sx={{ width: 120, height: 120, mb: 2 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Bio"
                name="bio"
                value={formik.values.bio}
                onChange={formik.handleChange}
                error={formik.touched.bio && Boolean(formik.errors.bio)}
                helperText={formik.touched.bio && formik.errors.bio}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Profile Picture URL"
                name="profilePicture"
                value={formik.values.profilePicture}
                onChange={formik.handleChange}
                error={formik.touched.profilePicture && Boolean(formik.errors.profilePicture)}
                helperText={formik.touched.profilePicture && formik.errors.profilePicture}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
              >
                Update Profile
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Course Statistics */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Course Statistics
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6">{profile?.createdCourses?.length || 0}</Typography>
                <Typography color="textSecondary">Total Courses</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6">
                  {profile?.createdCourses?.reduce(
                    (acc, course) => acc + course.enrolledStudents.length,
                    0
                  ) || 0}
                </Typography>
                <Typography color="textSecondary">Total Students</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6">
                  {profile?.createdCourses?.reduce(
                    (acc, course) => acc + course.averageRating,
                    0
                  ) / (profile?.createdCourses?.length || 1) || 0}
                </Typography>
                <Typography color="textSecondary">Average Rating</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile; 