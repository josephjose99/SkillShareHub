import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent
} from '@mui/material';
import {
  People as PeopleIcon,
  Star as StarIcon,
  PlayCircle as PlayCircleIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import axios from 'axios';

const CourseAnalytics = () => {
  const { courseId } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(`/api/instructor/courses/${courseId}/analytics`);
        setAnalytics(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error loading course analytics');
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [courseId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Course Analytics: {analytics.course.title}
      </Typography>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <PeopleIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Total Students</Typography>
              </Box>
              <Typography variant="h4">
                {analytics.enrolledStudents.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <StarIcon sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6">Average Rating</Typography>
              </Box>
              <Typography variant="h4">
                {analytics.course.averageRating.toFixed(1)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <PlayCircleIcon sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6">Total Lessons</Typography>
              </Box>
              <Typography variant="h4">{analytics.totalLessons}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <CheckCircleIcon sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="h6">Completion Rate</Typography>
              </Box>
              <Typography variant="h4">
                {((analytics.course.completedLessons / analytics.totalLessons) * 100).toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Enrollments */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Recent Enrollments
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Enrollment Date</TableCell>
                <TableCell>Progress</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {analytics.enrollments.map((enrollment) => (
                <TableRow key={enrollment._id}>
                  <TableCell>{enrollment.user.name}</TableCell>
                  <TableCell>{enrollment.user.email}</TableCell>
                  <TableCell>
                    {new Date(enrollment.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {((enrollment.completedLessons / analytics.totalLessons) * 100).toFixed(1)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Student Progress */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Student Progress
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Completed Lessons</TableCell>
                <TableCell>Progress</TableCell>
                <TableCell>Last Activity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {analytics.enrolledStudents.map((student) => (
                <TableRow key={student._id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>
                    {student.completedLessons?.length || 0} / {analytics.totalLessons}
                  </TableCell>
                  <TableCell>
                    {((student.completedLessons?.length || 0) / analytics.totalLessons * 100).toFixed(1)}%
                  </TableCell>
                  <TableCell>
                    {student.lastActivity
                      ? new Date(student.lastActivity).toLocaleDateString()
                      : 'No activity'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default CourseAnalytics; 