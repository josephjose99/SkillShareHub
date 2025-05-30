import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Divider,
  Button,
  Drawer,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  PlayCircleOutline,
  CheckCircle,
  Menu as MenuIcon,
  ChevronLeft,
  ChevronRight
} from '@mui/icons-material';

const LessonPlayer = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(new Set());

  // Mock data - replace with API call
  const course = {
    id: courseId,
    title: 'Complete Web Development Bootcamp',
    modules: [
      {
        id: 1,
        title: 'Introduction to Web Development',
        lessons: [
          {
            id: 1,
            title: 'What is Web Development?',
            duration: '15:00',
            videoUrl: 'https://example.com/video1.mp4',
            content: 'In this lesson, we will explore the fundamentals of web development...'
          },
          {
            id: 2,
            title: 'Setting up your development environment',
            duration: '20:00',
            videoUrl: 'https://example.com/video2.mp4',
            content: 'Learn how to set up your development environment...'
          }
        ]
      },
      {
        id: 2,
        title: 'HTML Fundamentals',
        lessons: [
          {
            id: 3,
            title: 'HTML Document Structure',
            duration: '25:00',
            videoUrl: 'https://example.com/video3.mp4',
            content: 'Understanding the basic structure of HTML documents...'
          },
          {
            id: 4,
            title: 'HTML Elements and Tags',
            duration: '30:00',
            videoUrl: 'https://example.com/video4.mp4',
            content: 'Learn about different HTML elements and their usage...'
          }
        ]
      }
    ]
  };

  useEffect(() => {
    // Find current lesson
    const lesson = course.modules
      .flatMap(module => module.lessons)
      .find(lesson => lesson.id === parseInt(lessonId));
    setCurrentLesson(lesson);
  }, [courseId, lessonId]);

  const handleLessonComplete = () => {
    setCompletedLessons(prev => new Set([...prev, currentLesson.id]));
  };

  const handleNextLesson = () => {
    const allLessons = course.modules.flatMap(module => module.lessons);
    const currentIndex = allLessons.findIndex(lesson => lesson.id === currentLesson.id);
    if (currentIndex < allLessons.length - 1) {
      navigate(`/courses/${courseId}/lessons/${allLessons[currentIndex + 1].id}`);
    }
  };

  const handlePreviousLesson = () => {
    const allLessons = course.modules.flatMap(module => module.lessons);
    const currentIndex = allLessons.findIndex(lesson => lesson.id === currentLesson.id);
    if (currentIndex > 0) {
      navigate(`/courses/${courseId}/lessons/${allLessons[currentIndex - 1].id}`);
    }
  };

  const drawer = (
    <Box sx={{ width: 320, height: '100%', overflow: 'auto' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6">Course Content</Typography>
        {isMobile && (
          <IconButton onClick={() => setDrawerOpen(false)}>
            <ChevronLeft />
          </IconButton>
        )}
      </Box>
      <Divider />
      <List>
        {course.modules.map((module) => (
          <React.Fragment key={module.id}>
            <ListItem>
              <ListItemText
                primary={module.title}
                primaryTypographyProps={{ fontWeight: 'bold' }}
              />
            </ListItem>
            {module.lessons.map((lesson) => (
              <ListItem
                key={lesson.id}
                button
                selected={lesson.id === currentLesson?.id}
                onClick={() => {
                  navigate(`/courses/${courseId}/lessons/${lesson.id}`);
                  if (isMobile) setDrawerOpen(false);
                }}
                sx={{ pl: 4 }}
              >
                <ListItemIcon>
                  {completedLessons.has(lesson.id) ? (
                    <CheckCircle color="success" />
                  ) : (
                    <PlayCircleOutline />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={lesson.title}
                  secondary={lesson.duration}
                />
              </ListItem>
            ))}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );

  if (!currentLesson) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
      {/* Course Navigation Drawer */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            position: 'relative',
            height: '100%'
          }
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <Container maxWidth="lg" sx={{ height: '100%', py: 3 }}>
          <Grid container spacing={3} sx={{ height: '100%' }}>
            {/* Video Player */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2, mb: 3 }}>
                <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                  <video
                    controls
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%'
                    }}
                    src={currentLesson.videoUrl}
                  />
                </Box>
              </Paper>
            </Grid>

            {/* Lesson Content */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5">{currentLesson.title}</Typography>
                  <Box>
                    <Button
                      variant="outlined"
                      startIcon={<ChevronLeft />}
                      onClick={handlePreviousLesson}
                      sx={{ mr: 1 }}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="contained"
                      endIcon={<ChevronRight />}
                      onClick={handleNextLesson}
                    >
                      Next
                    </Button>
                  </Box>
                </Box>
                <Typography variant="body1" paragraph>
                  {currentLesson.content}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleLessonComplete}
                  disabled={completedLessons.has(currentLesson.id)}
                >
                  Mark as Complete
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Mobile Menu Button */}
      {isMobile && (
        <IconButton
          sx={{
            position: 'fixed',
            top: 80,
            left: 16,
            zIndex: theme.zIndex.drawer + 1,
            bgcolor: 'background.paper',
            boxShadow: 1
          }}
          onClick={() => setDrawerOpen(true)}
        >
          <MenuIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default LessonPlayer; 