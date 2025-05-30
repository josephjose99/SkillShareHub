import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  EmojiEvents as CertificateIcon
} from '@mui/icons-material';
import axios from 'axios';

const CourseProgress = ({ courseId }) => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizOpen, setQuizOpen] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  useEffect(() => {
    fetchProgress();
  }, [courseId]);

  const fetchProgress = async () => {
    try {
      const response = await axios.get(`/api/progress/courses/${courseId}/progress`);
      setProgress(response.data);
      setLoading(false);
    } catch (error) {
      setError('Error fetching course progress');
      setLoading(false);
    }
  };

  const handleLessonComplete = async (moduleIndex, lessonIndex) => {
    try {
      const lesson = progress.modules[moduleIndex].lessons[lessonIndex];
      await axios.post(
        `/api/progress/courses/${courseId}/lessons/${lesson._id}/progress`
      );
      fetchProgress();
    } catch (error) {
      setError('Error updating lesson progress');
    }
  };

  const handleQuizStart = (moduleIndex, lessonIndex) => {
    const lesson = progress.modules[moduleIndex].lessons[lessonIndex];
    setCurrentQuiz({
      moduleIndex,
      lessonIndex,
      ...lesson.quiz
    });
    setSelectedAnswers(new Array(lesson.quiz.questions.length).fill(null));
    setQuizOpen(true);
    setQuizSubmitted(false);
    setQuizResult(null);
  };

  const handleQuizSubmit = async () => {
    try {
      const response = await axios.post(
        `/api/progress/courses/${courseId}/lessons/${currentQuiz._id}/quiz`,
        { answers: selectedAnswers }
      );
      setQuizResult(response.data);
      setQuizSubmitted(true);
      fetchProgress();
    } catch (error) {
      setError('Error submitting quiz');
    }
  };

  const handleDownloadCertificate = () => {
    window.open(`/api/progress/courses/${courseId}/certificate`, '_blank');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Course Progress
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ flexGrow: 1, mr: 2 }}>
            <LinearProgress
              variant="determinate"
              value={progress.overall}
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {Math.round(progress.overall)}%
          </Typography>
        </Box>

        {progress.certificateIssued && (
          <Button
            variant="contained"
            startIcon={<CertificateIcon />}
            onClick={handleDownloadCertificate}
            sx={{ mb: 2 }}
          >
            Download Certificate
          </Button>
        )}
      </Paper>

      {progress.modules.map((module, moduleIndex) => (
        <Paper key={moduleIndex} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {module.title}
          </Typography>
          <List>
            {module.lessons.map((lesson, lessonIndex) => (
              <ListItem
                key={lessonIndex}
                secondaryAction={
                  lesson.quiz && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleQuizStart(moduleIndex, lessonIndex)}
                      disabled={!lesson.completed}
                    >
                      Take Quiz
                    </Button>
                  )
                }
              >
                <ListItemIcon>
                  {lesson.completed ? (
                    <CheckCircleIcon color="success" />
                  ) : (
                    <RadioButtonUncheckedIcon />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={lesson.title}
                  secondary={
                    lesson.quizScore !== undefined
                      ? `Quiz Score: ${lesson.quizScore}%`
                      : null
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      ))}

      <Dialog open={quizOpen} onClose={() => setQuizOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Quiz: {currentQuiz?.title}</DialogTitle>
        <DialogContent>
          {currentQuiz?.questions.map((question, index) => (
            <FormControl key={index} component="fieldset" sx={{ mb: 3 }}>
              <FormLabel component="legend">{question.question}</FormLabel>
              <RadioGroup
                value={selectedAnswers[index] || ''}
                onChange={(e) => {
                  const newAnswers = [...selectedAnswers];
                  newAnswers[index] = Number(e.target.value);
                  setSelectedAnswers(newAnswers);
                }}
              >
                {question.options.map((option, optionIndex) => (
                  <FormControlLabel
                    key={optionIndex}
                    value={optionIndex}
                    control={<Radio />}
                    label={option}
                    disabled={quizSubmitted}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          ))}

          {quizResult && (
            <Alert
              severity={quizResult.passed ? 'success' : 'error'}
              sx={{ mt: 2 }}
            >
              {quizResult.passed
                ? `Congratulations! You passed with a score of ${quizResult.score}%`
                : `You scored ${quizResult.score}%. You need ${currentQuiz.passingScore}% to pass.`}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQuizOpen(false)}>Close</Button>
          {!quizSubmitted && (
            <Button
              onClick={handleQuizSubmit}
              variant="contained"
              disabled={selectedAnswers.includes(null)}
            >
              Submit Quiz
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CourseProgress; 