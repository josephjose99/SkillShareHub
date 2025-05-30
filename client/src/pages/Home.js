import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Rating,
} from '@mui/material';

function Home() {
  // Mock data for featured courses
  const featuredCourses = [
    {
      id: 1,
      title: 'Web Development Bootcamp',
      instructor: 'John Doe',
      rating: 4.5,
      students: 1234,
      price: 49.99,
      image: 'https://source.unsplash.com/random/300x200?web-development',
    },
    {
      id: 2,
      title: 'Data Science Fundamentals',
      instructor: 'Jane Smith',
      rating: 4.8,
      students: 856,
      price: 59.99,
      image: 'https://source.unsplash.com/random/300x200?data-science',
    },
    {
      id: 3,
      title: 'Digital Marketing Masterclass',
      instructor: 'Mike Johnson',
      rating: 4.3,
      students: 567,
      price: 39.99,
      image: 'https://source.unsplash.com/random/300x200?marketing',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6,
          borderRadius: 2,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom>
                Learn New Skills Online
              </Typography>
              <Typography variant="h5" paragraph>
                Discover top courses in programming, design, marketing, and more.
              </Typography>
              <Button
                component={RouterLink}
                to="/courses"
                variant="contained"
                color="secondary"
                size="large"
                sx={{ mt: 2 }}
              >
                Browse Courses
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://source.unsplash.com/random/600x400?education"
                alt="Learning"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Featured Courses Section */}
      <Container maxWidth="lg">
        <Typography variant="h4" component="h2" gutterBottom>
          Featured Courses
        </Typography>
        <Grid container spacing={4}>
          {featuredCourses.map((course) => (
            <Grid item key={course.id} xs={12} sm={6} md={4}>
              <Card
                component={RouterLink}
                to={`/courses/${course.id}`}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  textDecoration: 'none',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.2s ease-in-out',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={course.image}
                  alt={course.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h3">
                    {course.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {course.instructor}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={course.rating} precision={0.5} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({course.students} students)
                    </Typography>
                  </Box>
                  <Typography variant="h6" color="primary">
                    ${course.price}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default Home; 