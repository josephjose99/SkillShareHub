import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Rating,
  Chip,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  PlayCircle as PlayCircleIcon,
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

function CourseDetail() {
  const { id } = useParams();
  const [isEnrolled, setIsEnrolled] = useState(false);

  // Mock course data
  const course = {
    id: parseInt(id),
    title: 'Web Development Bootcamp',
    instructor: 'John Doe',
    rating: 4.5,
    students: 1234,
    price: 49.99,
    description: 'Learn web development from scratch. This comprehensive course covers HTML, CSS, JavaScript, and modern frameworks.',
    image: 'https://source.unsplash.com/random/800x400?web-development',
    duration: '12 weeks',
    level: 'Beginner',
    category: 'Development',
    curriculum: [
      {
        title: 'Introduction to Web Development',
        lessons: [
          'What is Web Development?',
          'Setting up your development environment',
          'Basic HTML structure',
        ],
      },
      {
        title: 'HTML Fundamentals',
        lessons: [
          'HTML elements and attributes',
          'Forms and input types',
          'Semantic HTML',
        ],
      },
      {
        title: 'CSS Styling',
        lessons: [
          'CSS selectors and properties',
          'Box model and layout',
          'Responsive design',
        ],
      },
    ],
  };

  const handleEnroll = () => {
    // TODO: Implement enrollment logic
    setIsEnrolled(true);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        {/* Course Header */}
        <Grid item xs={12}>
          <Box
            sx={{
              position: 'relative',
              height: 400,
              borderRadius: 2,
              overflow: 'hidden',
              mb: 4,
            }}
          >
            <Box
              component="img"
              src={course.image}
              alt={course.title}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                bgcolor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                p: 3,
              }}
            >
              <Typography variant="h3" component="h1" gutterBottom>
                {course.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="subtitle1">
                  By {course.instructor}
                </Typography>
                <Rating value={course.rating} precision={0.5} readOnly />
                <Typography variant="subtitle1">
                  ({course.students} students)
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Course Content */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              About This Course
            </Typography>
            <Typography paragraph>
              {course.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Chip
                icon={<AccessTimeIcon />}
                label={`${course.duration}`}
                variant="outlined"
              />
              <Chip
                icon={<PersonIcon />}
                label={course.level}
                variant="outlined"
              />
              <Chip
                label={course.category}
                variant="outlined"
              />
            </Box>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Course Curriculum
            </Typography>
            {course.curriculum.map((section, index) => (
              <Box key={index} sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  {section.title}
                </Typography>
                <List>
                  {section.lessons.map((lesson, lessonIndex) => (
                    <ListItem key={lessonIndex}>
                      <ListItemIcon>
                        <PlayCircleIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={lesson} />
                    </ListItem>
                  ))}
                </List>
                {index < course.curriculum.length - 1 && <Divider />}
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Enrollment Card */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h4" color="primary" gutterBottom>
              ${course.price}
            </Typography>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleEnroll}
              disabled={isEnrolled}
              sx={{ mb: 2 }}
            >
              {isEnrolled ? 'Enrolled' : 'Enroll Now'}
            </Button>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Full lifetime access" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Certificate of completion" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Downloadable resources" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default CourseDetail; 