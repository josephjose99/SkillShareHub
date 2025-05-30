import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const steps = ['Basic Information', 'Course Content', 'Pricing & Publishing'];

const CreateCourse = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      category: '',
      level: '',
      price: '',
      thumbnail: '',
      modules: [{ title: '', lessons: [{ title: '', content: '', duration: '' }] }]
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      description: Yup.string().required('Description is required'),
      category: Yup.string().required('Category is required'),
      level: Yup.string().required('Level is required'),
      price: Yup.number().required('Price is required').min(0, 'Price must be positive'),
      thumbnail: Yup.string().url('Must be a valid URL'),
      modules: Yup.array().of(
        Yup.object({
          title: Yup.string().required('Module title is required'),
          lessons: Yup.array().of(
            Yup.object({
              title: Yup.string().required('Lesson title is required'),
              content: Yup.string().required('Lesson content is required'),
              duration: Yup.string().required('Duration is required')
            })
          )
        })
      )
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        await axios.post('/api/courses', values);
        navigate('/instructor/courses');
      } catch (err) {
        setError(err.response?.data?.message || 'Error creating course');
      } finally {
        setLoading(false);
      }
    }
  });

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const addModule = () => {
    formik.setFieldValue('modules', [
      ...formik.values.modules,
      { title: '', lessons: [{ title: '', content: '', duration: '' }] }
    ]);
  };

  const addLesson = (moduleIndex) => {
    const updatedModules = [...formik.values.modules];
    updatedModules[moduleIndex].lessons.push({ title: '', content: '', duration: '' });
    formik.setFieldValue('modules', updatedModules);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Course Title"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Course Description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Category"
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
                error={formik.touched.category && Boolean(formik.errors.category)}
                helperText={formik.touched.category && formik.errors.category}
              >
                <MenuItem value="programming">Programming</MenuItem>
                <MenuItem value="design">Design</MenuItem>
                <MenuItem value="business">Business</MenuItem>
                <MenuItem value="marketing">Marketing</MenuItem>
                <MenuItem value="music">Music</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Level"
                name="level"
                value={formik.values.level}
                onChange={formik.handleChange}
                error={formik.touched.level && Boolean(formik.errors.level)}
                helperText={formik.touched.level && formik.errors.level}
              >
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Box>
            {formik.values.modules.map((module, moduleIndex) => (
              <Paper key={moduleIndex} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Module {moduleIndex + 1}
                </Typography>
                <TextField
                  fullWidth
                  label="Module Title"
                  name={`modules.${moduleIndex}.title`}
                  value={module.title}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.modules?.[moduleIndex]?.title &&
                    Boolean(formik.errors.modules?.[moduleIndex]?.title)
                  }
                  helperText={
                    formik.touched.modules?.[moduleIndex]?.title &&
                    formik.errors.modules?.[moduleIndex]?.title
                  }
                  sx={{ mb: 2 }}
                />
                {module.lessons.map((lesson, lessonIndex) => (
                  <Box key={lessonIndex} sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Lesson {lessonIndex + 1}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Lesson Title"
                          name={`modules.${moduleIndex}.lessons.${lessonIndex}.title`}
                          value={lesson.title}
                          onChange={formik.handleChange}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          label="Lesson Content"
                          name={`modules.${moduleIndex}.lessons.${lessonIndex}.content`}
                          value={lesson.content}
                          onChange={formik.handleChange}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Duration (minutes)"
                          name={`modules.${moduleIndex}.lessons.${lessonIndex}.duration`}
                          value={lesson.duration}
                          onChange={formik.handleChange}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                ))}
                <Button
                  variant="outlined"
                  onClick={() => addLesson(moduleIndex)}
                  sx={{ mt: 2 }}
                >
                  Add Lesson
                </Button>
              </Paper>
            ))}
            <Button variant="outlined" onClick={addModule} sx={{ mt: 2 }}>
              Add Module
            </Button>
          </Box>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price ($)"
                name="price"
                type="number"
                value={formik.values.price}
                onChange={formik.handleChange}
                error={formik.touched.price && Boolean(formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Thumbnail URL"
                name="thumbnail"
                value={formik.values.thumbnail}
                onChange={formik.handleChange}
                error={formik.touched.thumbnail && Boolean(formik.errors.thumbnail)}
                helperText={formik.touched.thumbnail && formik.errors.thumbnail}
              />
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create New Course
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box component="form" onSubmit={formik.handleSubmit}>
          {renderStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
            >
              Back
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Create Course'}
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateCourse; 