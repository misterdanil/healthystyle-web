import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Paper,
  Stack,
  IconButton,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import { Add, Delete, DragIndicator } from "@mui/icons-material";
import { Autocomplete } from '@mui/material';

import Textarea from '@mui/joy/Textarea';
import { fetchCategoriesRequest, addArticleRequest, fetchArticlesByTitleRequest } from "../healthSlice";

import { v4 as uuidv4 } from 'uuid';

const CreateArticle = () => {
  const dispatch = useDispatch();
  
  const categories = useSelector((state) => state.health.categories);
  const articles = useSelector((state) => state.health.articles);

  const [title, setTitle] = useState("");
  const [image, setImage] = useState({file: null, source: {description: '', link: ''}});
  const [category, setCategory] = useState("");
  const [fragments, setFragments] = useState([{ order: 1, title: "", orders: [] }]);
  const [sources, setSources] = useState([{ order: 1, source: {description: "", link: "" }}]);

  const articleOptions = [
    { id: 1, title: "Healthy Living", author: "John Doe", createdAt: "2024-05-01" },
    { id: 2, title: "Fitness Journey", author: "Jane Smith", createdAt: "2024-06-10" },
  ];

  useEffect(() => {
      dispatch(fetchCategoriesRequest({title: category, page: 0, limit: 25}));
      }, [dispatch]);

  useEffect(() => {
      dispatch(fetchArticlesByTitleRequest({title: title, page: 0, limit: 25}));
      }, [title]);

  const handleAddFragment = () => {
    setFragments([...fragments, { order: fragments.length + 1, title: "", orders: [] }]);
  };

  const handleSortFragments = () => {
    fragments.sort((a, b) => {
      return a.order - b.order;
    });
    setFragments([...fragments]);
  };

  const handleRemoveFragment = (index) => {
    fragments.splice(index, 1);
    setFragments(fragments);
  };

  const handleAddSource = () => {
    setSources([...sources, {order: sources.length + 1, source: {description: "", link: "" }}]);
  };

  const handleRemoveSource = (index) => {
    sources.splice(index, 1);
    sources.forEach(s => {
      if(s.order > sources[index].order) {
        s.order = s.order - 1;
      }
    });
    setSources(sources);
  };

  const handleAddOrder = (index) => {
    const newFragments = [...fragments];
    newFragments[index].orders.push({
      id: uuidv4(),
      type: "text",
      order: newFragments[index].orders.length + 1,
      articleId: null,
      image: {file: null, source: {description: '', link: ''}},
      name: '',
      description: '',
      rollElements: [],
      parts: [{type: 'normal', text: '', order: 1}]
    });
    setFragments(newFragments);
  };

  const handleRemoveOrder = (index, orderIndex) => {
    const currentFragments = [...fragments];
    currentFragments[index].orders.splice(orderIndex, 1);
    const orders = currentFragments[index].orders;
    orders.forEach(o => {
      if(o.order > orders[orderIndex].order) {
        o.order = o.order - 1;
      }
    });
    setFragments(currentFragments);
  };

  const handleOrderChange = (index, orderIndex, type, field, value) => {
    const currentFragments = [...fragments];
    // if(field == 'file') {
    //   if(type == null) {
    //     setImageFile(value);
    //   }
    //   else {
    //     setFragmentImageFiles(...fragmentImageFiles,).
    //   }
    // }
    if(type !== null) {
      currentFragments[index].orders[orderIndex][type][field] = value;
    }
    else {
      currentFragments[index].orders[orderIndex][field] = value;
    }
    setFragments(currentFragments);
  };

  const handleTextPartChange = (index, orderIndex, partIndex, field, value) => {
    const currentFragments = [...fragments];
    currentFragments[index].orders[orderIndex].parts[partIndex][field] = value;
    setFragments(currentFragments);
  };

  const handleRollElementChange = (index, orderIndex, rollElementIndex, field, value) => {
    const currentFragments = [...fragments];
    currentFragments[index].orders[orderIndex].rollElements[rollElementIndex][field] = value;
    setFragments(currentFragments);
  };

  const handleAddRollElement = (index, orderIndex) => {
    const currentFragments = [...fragments];
    currentFragments[index].orders[orderIndex].rollElements.push({ text: "", order: currentFragments[index].orders[orderIndex].rollElements.length + 1 });
    setFragments(currentFragments);
  };

  const handleAddTextPart = (index, orderIndex) => {
    const currentFragments = [...fragments];
    currentFragments[index].orders[orderIndex].parts.push({ type: 'text', text: "", order: currentFragments[index].orders[orderIndex].parts.length + 1 });
    setFragments(currentFragments);
  };

  const handleDeleteRollElement = (index, orderIndex, rollElementIndex) => {
    const currentFragments = [...fragments];
    const rollElements = currentFragments[index].orders[orderIndex].rollElements;
    rollElements.forEach(re => {
      if(re.order > rollElements[rollElementIndex].order) {
        re.order = re.order - 1;
      }
    });
    rollElements.splice(rollElementIndex, 1);
    
    
    setFragments(currentFragments);
  };

  const handleChangeSourceField = (index, field, value) => {
    const currentSources = [...sources];
    currentSources[index]['source'][field] = value;
    setSources(currentSources);
  }

  const handleChangeImageField = (field, value) => {
    image[field] = value;
    setImage({...image});
  }

  const handleChangeImageSourceField = (field, value) => {
    image.source[field] = value;
    setImage({...image});
  }

  const handleChangeOrderImageSourceField = (index, orderIndex, field, value) => {
    const currentFragments = [...fragments];
    currentFragments[index].orders[orderIndex].image.source[field] = value;
    setFragments(currentFragments);
  }

  const handleRemoveImage = () => {
    image.file = null;
    setImage({...image});
  }

  const handleSortList = (index, orderIndex) => {
    fragments[index].orders[orderIndex].rollElements.sort((a, b) => {
      return a.order - b.order;
    });
    setFragments([...fragments]);
  };

  const handleAddArticle = () => {
    const article = {
      title: title,
      image: image,
      fragments: fragments,
      sources: sources,
    }

    const imageFile = image.file;
    image.file = null;

    const formData = new FormData();
    formData.append('imageFile', imageFile);
    fragments.forEach(fr => {
      fr.orders.forEach(or => {
        if(or.type == 'image') {
          formData.append(or.id, or.image.file);
          or.image.file = null;
        }
      });
    });
    formData.append('article', JSON.stringify(article));
    
    dispatch(addArticleRequest({article: formData, category: category}));
  }

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom color="primary">
        Создание новой статьи
      </Typography>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 4, mb: 4 }}>
        <Stack spacing={3}>
          <TextField
            label="Article Title"
            multiline={true}

            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" color="primary">Просмотр изображения</Typography>
            {image.file !== null && <img src={URL.createObjectURL(image.file)} alt="Предпросмотр" width="100%" />}
          </Box>
          <Stack direction="row" spacing={2}>
          <Button variant="outlined" component="label">
            Загрузить изображение статьи
            <input
              type="file"
              hidden
              onChange={(e) => handleChangeImageField('file', e.target.files[0])}
            />
          </Button>
          {image.file !== null && <IconButton color="error" onClick={() => handleRemoveImage()}>
                <Delete />
              </IconButton>}
              </Stack>
          {image.file !== null && <Stack spacing={3}>
          <TextField
                label="Описание источника изображения"
                value={image.description}
                onChange={(e) => {
                  handleChangeImageSourceField('description', e.target.value);
                }}
                fullWidth
              />
              <TextField
                label="Ссылка на источник изображения"
                value={image.link}
                onChange={(e) => handleChangeImageSourceField('link', e.target.value)}
                fullWidth
              />
</Stack>}
  <Divider />

          <FormControl fullWidth>
            <Autocomplete
              options={categories}
              getOptionLabel={(op) => op.title}
              sx={{ width: 300 }}
              onChange= {(e, category) => {
                setCategory(category.id);
              }}
              renderInput={(params) => <TextField {...params} label="Категория" />}
          />
          </FormControl>

          <Typography variant="h6">Источники</Typography>
          {sources.map((source, index) => (
            <Box key={index} display="flex" alignItems="center" gap={2}>
              <TextField
                label="Описание источника"
                value={source.description}
                onChange={(e) => {
                  handleChangeSourceField(index, 'description', e.target.value);
                }}
                fullWidth
              />
              <TextField
                label="Ссылка на источник"
                value={source.url}
                onChange={(e) => handleChangeSourceField(index, 'link', e.target.value)}
                fullWidth
              />
              <IconButton color="error" onClick={() => handleRemoveSource(index)}>
                <Delete />
              </IconButton>
            </Box>
          ))}
          <Button variant="outlined" onClick={handleAddSource} startIcon={<Add />}>
            Добавить источник
          </Button>
        </Stack>
      </Paper>

      <Stack spacing={4}>
        {fragments.map((fragment, index) => (
          <Paper key={index} elevation={2} sx={{ p: 3, borderRadius: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" color="primary">
                Фрагмент №{index + 1}
              </Typography>
              <IconButton color="error" onClick={() => handleRemoveFragment(index)}>
                <Delete />
              </IconButton>
            </Box>

            <TextField
              label="Порядок фрагмента"
              type="number"
              value={fragment.order}
              onChange={(e) => {
                const updated = [...fragments];
                updated[index].order = parseInt(e.target.value);
                setFragments(updated);
              }}
              fullWidth
              sx={{ mt: 2 }}
            />

            <TextField
              label="Заголовок фрагмента"
              value={fragment.title}
              onChange={(e) => {
                const updated = [...fragments];
                updated[index].title = e.target.value;
                setFragments(updated);
              }}
              fullWidth
              sx={{ mt: 2 }}
            />

            <Divider sx={{ my: 2 }} />

            {fragment.orders.map((order, orderIndex) => (
  <Box key={orderIndex} sx={{ p: 2, border: '1px solid #ccc', borderRadius: 2, mb: 2 }}>
    <FormControl fullWidth sx={{ mb: 2 }}>
      <InputLabel>Часть</InputLabel>
      <Select
        value={order.type}
        label="Тип части"
        onChange={(e) => handleOrderChange(index, orderIndex, null, 'type', e.target.value)}
      >
        <MenuItem value="text">Текст</MenuItem>
        <MenuItem value="image">Изображение</MenuItem>
        <MenuItem value="quote">Цитата</MenuItem>
        <MenuItem value="roll">Список</MenuItem>
        <MenuItem value="link">Ссылка на статью</MenuItem>
      </Select>
    </FormControl>

    {/* Текст */}
    {order.type === 'text' && (
      <Stack>
      {order.parts.map((part, partIndex) =>
      <>
        <FormControl fullWidth sx={{ mb: 2 }} key={partIndex}>
          <InputLabel>Text Format</InputLabel>
          <Select
            value={order.format}
            label="Text Format"
            onChange={(e) => handleTextPartChange(index, orderIndex, partIndex, 'type', e.target.value)}
          >
            <MenuItem value="normal">Обычный</MenuItem>
            <MenuItem value="bold">Жирный</MenuItem>
            <MenuItem value="cursive">Курсивный</MenuItem>
            <MenuItem value="link">Ссылка</MenuItem>
          </Select>
        </FormControl>
        
        <Textarea
          minRows={10}
          size="md"
          variant="outlined"
          placeholder="Текст"
          value={part.value}
          onChange={(e) => handleTextPartChange(index, orderIndex, partIndex, 'text', e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          />

        {part.type === 'link' && (
          <TextField
            label="Ссылка"
            value={order.url}
            onChange={(e) => handleTextPartChange(index, orderIndex, partIndex, 'link', e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
        )}
      </>
    )
}
<Button variant="contained" onClick={(e) => handleAddTextPart(index, orderIndex)} startIcon={<Add />}>
          Добавить текстовую часть
        </Button>
</Stack>
)}

    {/* Список */}
    {order.type === 'roll' && (
      <>
        <Typography variant="subtitle1" color="primary">List Items</Typography>
        {order.rollElements.map((element, elIndex) => (
          <Box key={elIndex} display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
            <TextField
              label={`Item ${element.order}`}
              value={element.text}
              onChange={(e) => handleRollElementChange(index, orderIndex, elIndex, 'text', e.target.value)}
              fullWidth
            />
            <TextField
              label="Order"
              type="number"
              value={element.order}
              onChange={(e) => handleRollElementChange(index, orderIndex, elIndex, 'order', e.target.value)}
            />
            <IconButton color="error" onClick={() => handleDeleteRollElement(index, orderIndex, elIndex)}>
              <Delete />
            </IconButton>
          </Box>
        ))}
        <Stack direction='row' spacing={2}>
        <Button variant="outlined" onClick={() => handleAddRollElement(index, orderIndex)} startIcon={<Add />}>
          Добавить элемент в список
        </Button>
        <Button variant="outlined" onClick={() => handleSortList(index, orderIndex)} startIcon={<RefreshIcon />}>
          Обновить порядок
        </Button>
        </Stack>
      </>
    )}

    {/* Ссылка на статью */}
    {order.type === 'link' && (
      <>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <Autocomplete
              disablePortal
              options={articles}
              getOptionLabel={(article) => article.title + ' - ' + article.author + ' (' + article.createdOn + ')'}
              sx={{ width: 300 }}
              onChange= {(e, article) => {
                handleOrderChange(index, orderIndex, null, 'articleId', article != null ? article.id : null)
              }}
              renderInput={(params) => <TextField {...params} label="Статья" value={title} onChange={(e) => setTitle(e.target.value)} />}
          />
        </FormControl>
      </>
    )}

    {/* Цитата */}
    {order.type === 'quote' && (
      <>
        <TextField
          label="Author Name"
          value={order.name}
          onChange={(e) => handleOrderChange(index, orderIndex, null, 'name', e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Quote Text"
          value={order.description}
          onChange={(e) => handleOrderChange(index, orderIndex, null, 'description', e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
      </>
    )}

    {/* Изображение */}
    {order.type === 'image' && (
      <>
        <Button variant="outlined" component="label" sx={{ mb: 2 }}>
          Choose Image
          <input
            type="file"
            hidden
            onChange={(e) => handleOrderChange(index, orderIndex, order.type, 'file', e.target.files[0])}
          />
        </Button>

        {order.image && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" color="primary">Просмотр изображения</Typography>
            {order.image.file !== null && <img src={URL.createObjectURL(order.image.file)} alt="Предпросмотр" width="100%" />}
          </Box>
        )}

        <TextField
          label="Описание источника изображения"
          value={order.image.description}
          onChange={(e) => handleChangeOrderImageSourceField(index, orderIndex, 'description', e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Источник изображения"
          value={order.image.link}
          onChange={(e) => handleChangeOrderImageSourceField(index, orderIndex, 'link', e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
      </>
    )}

    {/* Удаление части */}
    <IconButton color="error" onClick={() => handleRemoveOrder(index, orderIndex)}>
      <Delete />
    </IconButton>
  </Box>
))}



            <Button variant="outlined" startIcon={<Add />} onClick={() => handleAddOrder(index)} sx={{ mt: 2 }}>
              Добавить часть
            </Button>
          </Paper>
        ))}
        <Stack direction="row" spacing={2}>
        <Button variant="contained" onClick={handleAddFragment} startIcon={<Add />}>
          Добавить фрагмент
        </Button>
        <Button variant="contained" onClick={handleSortFragments} startIcon={<Add />}>
          Обновить порядок
        </Button>
        </Stack>
      </Stack>

      <Button variant="contained" color="success" size="large" sx={{ mt: 5 }} onClick={() => handleAddArticle()}>
        Сохранить статью
      </Button>
    </Container>
  );
};

export default CreateArticle;
