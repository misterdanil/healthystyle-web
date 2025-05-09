import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  TextField,
  Autocomplete,
  Select,
  MenuItem,
  Card,
  CardMedia,
  CardContent,
  Stack,
  Link,
  Rating,
  InputLabel,
  FormControl,
  Divider,
  Paper,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { fetchCategoriesRequest, fetchFilteredArticlesRequest } from "../healthSlice";

const Articles = () => {
  const PERIOD_OPTIONS = new Map();
  PERIOD_OPTIONS.set(1, {name: "День", period: "DAY"});
  PERIOD_OPTIONS.set(2, {name: "Неделя", period: "WEEK"});
  PERIOD_OPTIONS.set(3, {name: "Месяц", period:"MONTH"});
  PERIOD_OPTIONS.set(4, {name: "Год", period:"YEAR"});
  PERIOD_OPTIONS.set(5, {name: "Всё время", period:"ALL_TIME"});

  const SORT_OPTIONS = new Map();
  SORT_OPTIONS.set(1, {name: "Самые просматриваемые", sort: "MOST_WATCHED"});
  SORT_OPTIONS.set(2, {name: "Самые оцененные", sort: "MOST_MARKED"});

  const dispatch = useDispatch();
    
  const categories = useSelector((state) => state.health.categories);
  const articles = useSelector((state) => state.health.articles);
  
  const [texts, setTexts] = useState(new Map());
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState('');
  const [selectedPeriodSort, setSelectedPeriodSort] = useState(1);
  const [selectedSort, setSelectedSort] = useState(1);

   useEffect(() => {
         dispatch(fetchCategoriesRequest({title: category, page: 0, limit: 25}));
    }, []);

   useEffect(() => {
          dispatch(fetchFilteredArticlesRequest({categoryId: category, title: title, sort: SORT_OPTIONS.get(selectedSort).sort, period: PERIOD_OPTIONS.get(selectedPeriodSort).period, page: 0, limit: 25}));
    }, [category, title, selectedPeriodSort, selectedSort]);
  
    useEffect(() => {
          articles.map(article => fetchFirstText(article.id))
    }, [articles]);

    const fetchFirstText = async (articleId)=>{
        let res = await fetch("http://localhost:3000/articles/" + articleId + '/texts?' + new URLSearchParams({
          first: true
        }));
        console.log(res);
        if(res.status == 404) {
          return;
        }
        const data = await res.json();
        texts.set(articleId, data);
        setTexts(new Map(texts));
}

  return (
    <Container maxWidth="xl" sx={{ mt: 6, mb: 6 }}>
      <Stack spacing={4}>
        <TextField
          label="Поиск по заголовку"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
        />

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Autocomplete
            options={categories}
            getOptionLabel={(op) => op.title}
            onChange={(e, category) => category != null ? setCategory(category.id) : setCategory('')}
            renderInput={(params) => <TextField {...params} label="Категория" />}
            sx={{ flex: 1 }}
          />

          <FormControl fullWidth sx={{ flex: 1 }}>
            <Select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
            >
              {Array.from(SORT_OPTIONS).map(([key, value]) => (
                                    <MenuItem key={key} value={key}>
                                      {value.name}
                                    </MenuItem>
                                  ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ flex: 1 }}>
            <Select
              value={selectedPeriodSort}
              onChange={(e) => setSelectedPeriodSort(e.target.value)}
            >
              {Array.from(PERIOD_OPTIONS).map(([key, value]) => (
                                    <MenuItem key={key} value={key}>
                                      {value.name}
                                    </MenuItem>
                                  ))}
            </Select>
          </FormControl>
        </Stack>

        <Stack spacing={4}>
          {articles && articles.map((article) => (
            <Paper
              key={article.id}
              elevation={3}
              sx={{ p: 2, borderRadius: 3, overflow: "hidden" }}
            >
              <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                <CardMedia
                  component="img"
                  image={'http://localhost:3001/files/' + article.image.imageId}
                  alt={article.title}
                  sx={{ width: '50%', height: '50%', borderRadius: 2, objectFit: "cover" }}
                />
                <Box sx={{ flex: 1 }}>
                  <Link variant="h5" fontWeight={700} gutterBottom href={"/articles/" + article.id}>
                    {article.title}
                  </Link>
                    {texts.has(article.id) && texts.get(article.id).textParts.map(tp => 
                      <Typography display="inline" color="text.secondary" gutterBottom>
                        {tp.value}
                      </Typography>
                    )}
                  <Stack direction="row" spacing={2} alignItems="center" mt={2}>
                    <Rating value={article.averageMark} precision={0.1} readOnly />
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <VisibilityIcon fontSize="small" />
                      <Typography variant="caption">{article.countViews}</Typography>
                    </Stack>
                  </Stack>
                </Box>
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Stack>
    </Container>
  );
};

export default Articles;
