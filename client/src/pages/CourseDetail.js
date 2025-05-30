import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Rating,
  Chip,
  Avatar,
  Tabs,
  Tab,
  Card,
  CardContent
} from '@mui/material';
import {
  PlayCircleOutline,
  AccessTime,
  People,
  Star,
  ExpandMore,
  ExpandLess
} from '@mui/icons-material';
import Reviews from '../components/Reviews';
import PaymentModal from '../components/PaymentModal';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expandedModule, setExpandedModule] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  // Mock data - replace with API call
  const course = {
    id: 1,
    title: 'Complete Web Development Bootcamp',
    description: 'Learn web development from scratch with HTML, CSS, JavaScript, and more. This comprehensive course will take you from beginner to professional developer.',
    instructor: {
      name: 'John Doe',
      avatar: 'https://via.placeholder.com/150',
      bio: 'Senior Web Developer with 10+ years of experience'
    },
    rating: 4.8,
    totalRatings: 1234,
    price: 99.99,
    category: 'programming',
    level: 'beginner',
    thumbnail: 'https://via.placeholder.com/800x400',
    enrolledStudents: 5000,
    totalDuration: '40 hours',
    lastUpdated: '2024-03-20',
    modules: [
      {
        id: 1,
        title: 'Introduction to Web Development',
        lessons: [
          { id: 1, title: 'What is Web Development?', duration: '15:00' },
          { id: 2, title: 'Setting up your development environment', duration: '20:00' }
        ]
      },
      {
        id: 2,
        title: 'HTML Fundamentals',
        lessons: [
          { id: 3, title: 'HTML Document Structure', duration: '25:00' },
          { id: 4, title: 'HTML Elements and Tags', duration: '30:00' }
        ]
      }
    ],
    requirements: [
      'No prior programming experience needed',
      'A computer with internet connection',
      'Basic computer skills'
    ],
    whatYouWillLearn: [
      'Build responsive websites',
      'Create dynamic web applications',
      'Understand modern web development practices'
    ]
  };

  const handleModuleExpand = (moduleId) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEnroll = () => {
    setPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    // Refresh course data or redirect to course content
    navigate(`/courses/${id}/lessons/1`);
  };

  return (
    <Container>
      {/* Course Header */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>
              {course.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {course.description}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <Rating value={course.rating} precision={0.5} readOnly />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({course.totalRatings} ratings)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                {course.enrolledStudents} students
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    style={{ width: '100%', borderRadius: '4px' }}
                  />
                </Box>
                <Typography variant="h5" color="primary" gutterBottom>
                  ${course.price}
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleEnroll}
                  sx={{ mb: 2 }}
                >
                  Enroll Now
                </Button>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <AccessTime />
                    </ListItemIcon>
                    <ListItemText
                      primary="Duration"
                      secondary={course.totalDuration}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <People />
                    </ListItemIcon>
                    <ListItemText
                      primary="Students"
                      secondary={course.enrolledStudents}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Star />
                    </ListItemIcon>
                    <ListItemText
                      primary="Last Updated"
                      secondary={course.lastUpdated}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Course Content */}
      <Box sx={{ mb: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Curriculum" />
          <Tab label="Overview" />
          <Tab label="Instructor" />
          <Tab label="Reviews" />
        </Tabs>

        <Box sx={{ mt: 3 }}>
          {tabValue === 0 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Course Content
              </Typography>
              <List>
                {course.modules.map((module) => (
                  <React.Fragment key={module.id}>
                    <ListItem
                      button
                      onClick={() => handleModuleExpand(module.id)}
                      sx={{
                        bgcolor: 'background.default',
                        borderRadius: 1,
                        mb: 1
                      }}
                    >
                      <ListItemIcon>
                        {expandedModule === module.id ? (
                          <ExpandLess />
                        ) : (
                          <ExpandMore />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={module.title}
                        secondary={`${module.lessons.length} lessons`}
                      />
                    </ListItem>
                    {expandedModule === module.id && (
                      <List component="div" disablePadding>
                        {module.lessons.map((lesson) => (
                          <ListItem
                            key={lesson.id}
                            sx={{ pl: 4 }}
                            button
                            onClick={() => navigate(`/courses/${id}/lessons/${lesson.id}`)}
                          >
                            <ListItemIcon>
                              <PlayCircleOutline />
                            </ListItemIcon>
                            <ListItemText
                              primary={lesson.title}
                              secondary={lesson.duration}
                            />
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          )}

          {tabValue === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    What you'll learn
                  </Typography>
                  <List>
                    {course.whatYouWillLearn.map((item, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <Star color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={item} />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Requirements
                  </Typography>
                  <List>
                    {course.requirements.map((item, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <Star color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={item} />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
            </Grid>
          )}

          {tabValue === 2 && (
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  sx={{ width: 100, height: 100, mr: 3 }}
                />
                <Box>
                  <Typography variant="h6">{course.instructor.name}</Typography>
                  <Typography variant="body1" color="text.secondary">
                    {course.instructor.bio}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          )}

          {tabValue === 3 && (
            <Paper sx={{ p: 3 }}>
              <Reviews courseId={id} />
            </Paper>
          )}
        </Box>
      </Box>

      {/* Add PaymentModal */}
      <PaymentModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        course={course}
        onSuccess={handlePaymentSuccess}
      />
    </Container>
  );
};

export default CourseDetail; 