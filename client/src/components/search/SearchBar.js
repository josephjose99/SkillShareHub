import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Autocomplete,
  Paper,
  Typography,
  Chip,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [popularSearches, setPopularSearches] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    level: '',
    priceRange: [0, 1000],
    minRating: 0
  });

  // Fetch popular searches
  useEffect(() => {
    const fetchPopularSearches = async () => {
      try {
        const response = await axios.get('/api/search/popular');
        setPopularSearches(response.data);
      } catch (error) {
        console.error('Error fetching popular searches:', error);
      }
    };

    fetchPopularSearches();
  }, []);

  // Fetch search suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length >= 2) {
        try {
          const response = await axios.get(`/api/search/suggestions?query=${searchQuery}`);
          setSuggestions(response.data);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      } else {
        setSuggestions([]);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearch = () => {
    const queryParams = new URLSearchParams({
      query: searchQuery,
      ...filters,
      minPrice: filters.priceRange[0],
      maxPrice: filters.priceRange[1]
    });

    navigate(`/search?${queryParams.toString()}`);
  };

  const handleClear = () => {
    setSearchQuery('');
    setFilters({
      category: '',
      level: '',
      priceRange: [0, 1000],
      minRating: 0
    });
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', p: 2 }}>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <Autocomplete
              freeSolo
              options={suggestions.map(s => s.title)}
              value={searchQuery}
              onChange={(event, newValue) => setSearchQuery(newValue)}
              onInputChange={(event, newValue) => setSearchQuery(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  placeholder="Search courses..."
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {searchQuery && (
                          <IconButton onClick={handleClear} size="small">
                            <ClearIcon />
                          </IconButton>
                        )}
                        <IconButton onClick={handleSearch} color="primary">
                          <SearchIcon />
                        </IconButton>
                      </>
                    )
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {popularSearches.map((term) => (
                <Chip
                  key={term}
                  label={term}
                  onClick={() => {
                    setSearchQuery(term);
                    handleSearch();
                  }}
                  variant="outlined"
                />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                label="Category"
              >
                <MenuItem value="">All Categories</MenuItem>
                <MenuItem value="programming">Programming</MenuItem>
                <MenuItem value="design">Design</MenuItem>
                <MenuItem value="business">Business</MenuItem>
                <MenuItem value="marketing">Marketing</MenuItem>
                <MenuItem value="music">Music</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Level</InputLabel>
              <Select
                value={filters.level}
                onChange={(e) => setFilters({ ...filters, level: e.target.value })}
                label="Level"
              >
                <MenuItem value="">All Levels</MenuItem>
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Typography gutterBottom>Price Range</Typography>
            <Slider
              value={filters.priceRange}
              onChange={(e, newValue) => setFilters({ ...filters, priceRange: newValue })}
              valueLabelDisplay="auto"
              min={0}
              max={1000}
              step={10}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography gutterBottom>Minimum Rating</Typography>
            <Slider
              value={filters.minRating}
              onChange={(e, newValue) => setFilters({ ...filters, minRating: newValue })}
              valueLabelDisplay="auto"
              min={0}
              max={5}
              step={0.5}
              marks
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default SearchBar; 