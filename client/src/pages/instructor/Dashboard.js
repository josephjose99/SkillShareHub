import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  School as SchoolIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await axios.get('/api/instructor/dashboard');
        setStats(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error loading dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

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
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Instructor Dashboard
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'primary.light',
              color: 'white'
            }}
          >
            <Box display="flex" alignItems="center" mb={1}>
              <SchoolIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Total Courses</Typography>
            </Box>
            <Typography variant="h4">{stats.stats.totalCourses}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'success.light',
              color: 'white'
            }}
          >
            <Box display="flex" alignItems="center" mb={1}>
              <PeopleIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Total Students</Typography>
            </Box>
            <Typography variant="h4">{stats.stats.totalStudents}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'warning.light',
              color: 'white'
            }}
          >
            <Box display="flex" alignItems="center" mb={1}>
              <MoneyIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Total Revenue</Typography>
            </Box>
            <Typography variant="h4">${stats.stats.totalRevenue}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'info.light',
              color: 'white'
            }}
          >
            <Box display="flex" alignItems="center" mb={1}>
              <TrendingUpIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Average Rating</Typography>
            </Box>
            <Typography variant="h4">
              {stats.coursePerformance[0]?.averageRating || 0}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Enrollments and Course Performance */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Enrollments
              </Typography>
              <List>
                {stats.recentEnrollments.map((enrollment) => (
                  <React.Fragment key={enrollment._id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>{enrollment.user.name[0]}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={enrollment.user.name}
                        secondary={`Enrolled in ${enrollment.course.title}`}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Performing Courses
              </Typography>
              <List>
                {stats.coursePerformance.map((course) => (
                  <React.Fragment key={course._id}>
                    <ListItem>
                      <ListItemText
                        primary={course.title}
                        secondary={`${course.enrolledStudents} students • Rating: ${course.averageRating}`}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 