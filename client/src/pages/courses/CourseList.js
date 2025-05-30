import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  TextField,
  MenuItem,
  Rating,
  Chip,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function CourseList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');

  // Mock data for courses
  const courses = [
    {
      id: 1,
      title: 'Web Development Bootcamp',
      instructor: 'John Doe',
      rating: 4.5,
      students: 1234,
      price: 49.99,
      category: 'development',
      image: 'https://source.unsplash.com/random/300x200?web-development',
    },
    {
      id: 2,
      title: 'Data Science Fundamentals',
      instructor: 'Jane Smith',
      rating: 4.8,
      students: 856,
      price: 59.99,
      category: 'data-science',
      image: 'https://source.unsplash.com/random/300x200?data-science',
    },
    {
      id: 3,
      title: 'Digital Marketing Masterclass',
      instructor: 'Mike Johnson',
      rating: 4.3,
      students: 567,
      price: 39.99,
      category: 'marketing',
      image: 'https://source.unsplash.com/random/300x200?marketing',
    },
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'development', label: 'Development' },
    { value: 'data-science', label: 'Data Science' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'design', label: 'Design' },
  ];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || course.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Browse Courses
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={4}>
        {filteredCourses.map((course) => (
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" color="primary">
                    ${course.price}
                  </Typography>
                  <Chip
                    label={categories.find(c => c.value === course.category)?.label}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default CourseList; 