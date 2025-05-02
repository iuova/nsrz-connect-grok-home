import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  TableContainer,
  Paper,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { News } from '../types';

function Admin() {
  const [news, setNews] = useState<News[]>([]);
  const [newNews, setNewNews] = useState({ title: '', content: '', published: false });
  const [editNews, setEditNews] = useState<News | null>(null);
  const [selectedNews, setSelectedNews] = useState<number[]>([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchNews();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchNews = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/news', { headers: getAuthHeaders() });
      const sortedNews = res.data.sort(
        (a: News, b: News) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setNews(sortedNews);
      console.log('Fetched news:', sortedNews.length, sortedNews.map(n => ({ id: n.id, published: n.published }))); // Для отладки
    } catch (error) {
      console.error('Ошибка загрузки новостей:', error);
    }
  };

  const filteredNewsFull = useMemo(() => {
    let result = news;

    // Поиск по заголовку и содержимому
    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(
        (item) => item.title.toLowerCase().includes(lowerSearch) || item.content.toLowerCase().includes(lowerSearch)
      );
    }

    // Фильтр по дате
    if (startDate) {
      const start = new Date(startDate);
      result = result.filter((item) => new Date(item.created_at) >= start);
    }
    if (endDate) {
      const end = new Date(endDate);
      result = result.filter((item) => new Date(item.created_at) <= end);
    }

    // Фильтр по автору
    if (authorFilter) {
      result = result.filter((item) => item.author_email === authorFilter);
    }

    // Фильтр по статусу
    if (statusFilter !== 'all') {
      result = result.filter((item) => {
        const isPublished = !!item.published; // Приводим к булеву
        return statusFilter === 'published' ? isPublished : !isPublished;
      });
    }

    console.log('Filtered news full length:', result.length, 'Status filter:', statusFilter); // Для отладки
    return result;
  }, [news, search, startDate, endDate, authorFilter, statusFilter]);

  const filteredNews = useMemo(() => {
    return showAll ? filteredNewsFull : filteredNewsFull.slice(0, 5);
  }, [filteredNewsFull, showAll]);

  const authors = useMemo(() => {
    const uniqueAuthors = Array.from(new Set(news.map((item) => item.author_email)));
    return uniqueAuthors.sort();
  }, [news]);

  const handleAddNews = async () => {
    try {
      await axios.post('http://localhost:5000/api/news', newNews, { headers: getAuthHeaders() });
      setNewNews({ title: '', content: '', published: false });
      setOpenAddDialog(false);
      fetchNews();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при добавлении новости');
    }
  };

  const handleUpdateNews = async () => {
    if (!editNews) return;
    try {
      await axios.put(`http://localhost:5000/api/news/${editNews.id}`, editNews, {
        headers: getAuthHeaders(),
      });
      setEditNews(null);
      setOpenEditDialog(false);
      fetchNews();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при обновлении новости');
    }
  };

  const handleDeleteNews = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/news/${id}`, { headers: getAuthHeaders() });
      fetchNews();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при удалении новости');
    }
  };

  const handlePublishMultiple = async () => {
    try {
      await axios.post(
        'http://localhost:5000/api/news/publish',
        { ids: selectedNews },
        { headers: getAuthHeaders() }
      );
      setSelectedNews([]);
      fetchNews();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при публикации новостей');
    }
  };

  const handleSelectNews = (id: number) => {
    setSelectedNews((prev) =>
      prev.includes(id) ? prev.filter((newsId) => newsId !== id) : [...prev, id]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          Управление новостями
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
          <Button
            variant="contained"
            onClick={() => setOpenAddDialog(true)}
            sx={{ bgcolor: '#007aff', '&:hover': { bgcolor: '#005bb5' }, borderRadius: 2 }}
          >
            Добавить новость
          </Button>
          <Button
            variant="contained"
            onClick={handlePublishMultiple}
            disabled={selectedNews.length === 0}
            sx={{ bgcolor: '#007aff', '&:hover': { bgcolor: '#005bb5' }, borderRadius: 2 }}
          >
            Опубликовать выбранные
          </Button>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <TextField
            placeholder="Поиск по новостям"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{
              flexGrow: 1,
              maxWidth: '100%',
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': { borderColor: '#007aff' },
                '&.Mui-focused fieldset': { borderColor: '#007aff' },
              },
            }}
          />
          {filteredNewsFull.length > 5 && !showAll && (
            <Button
              variant="text"
              onClick={() => setShowAll(true)}
              sx={{ color: '#007aff', textTransform: 'none', ml: 2, fontSize: '0.875rem' }}
            >
              Показать все
            </Button>
          )}
          {showAll && (
            <Button
              variant="text"
              onClick={() => setShowAll(false)}
              sx={{ color: '#007aff', textTransform: 'none', ml: 2, fontSize: '0.875rem' }}
            >
              Скрыть
            </Button>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
          <TextField
            label="Дата от"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
            sx={{
              width: 150,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': { borderColor: '#007aff' },
                '&.Mui-focused fieldset': { borderColor: '#007aff' },
              },
            }}
          />
          <TextField
            label="Дата до"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
            sx={{
              width: 150,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': { borderColor: '#007aff' },
                '&.Mui-focused fieldset': { borderColor: '#007aff' },
              },
            }}
          />
          <FormControl sx={{ width: 150 }}>
            <InputLabel
              sx={{ top: -2, '&.Mui-focused': { color: '#007aff' }, fontSize: '0.875rem' }}
            >
              Автор
            </InputLabel>
            <Select
              value={authorFilter}
              onChange={(e) => setAuthorFilter(e.target.value)}
              size="small"
              sx={{
                borderRadius: 2,
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#007aff' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#007aff' },
              }}
            >
              <MenuItem value="">Все</MenuItem>
              {authors.map((author) => (
                <MenuItem key={author} value={author}>
                  {author}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ width: 150 }}>
            <InputLabel
              sx={{ top: -2, '&.Mui-focused': { color: '#007aff' }, fontSize: '0.875rem' }}
            >
              Статус
            </InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              size="small"
              sx={{
                borderRadius: 2,
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#007aff' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#007aff' },
              }}
            >
              <MenuItem value="all">Все</MenuItem>
              <MenuItem value="published">Опубликована</MenuItem>
              <MenuItem value="draft">Черновик</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedNews.length === filteredNews.length && filteredNews.length > 0}
                    onChange={() =>
                      setSelectedNews(
                        selectedNews.length === filteredNews.length
                          ? []
                          : filteredNews.map((item) => item.id)
                      )
                    }
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Заголовок</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Дата</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Автор</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Статус</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredNews.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedNews.includes(item.id)}
                      onChange={() => handleSelectNews(item.id)}
                    />
                  </TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{formatDate(item.created_at)}</TableCell>
                  <TableCell>{item.author_email}</TableCell>
                  <TableCell>{item.published ? 'Опубликована' : 'Черновик'}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        setEditNews(item);
                        setOpenEditDialog(true);
                      }}
                      sx={{ color: '#007aff' }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteNews(item.id)}
                      sx={{ color: '#ff3b30' }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Диалог добавления новости */}
        <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
          <DialogTitle>Добавить новость</DialogTitle>
          <DialogContent>
            <TextField
              label="Заголовок"
              fullWidth
              value={newNews.title}
              onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
              sx={{
                mt: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': { borderColor: '#007aff' },
                  '&.Mui-focused fieldset': { borderColor: '#007aff' },
                },
              }}
            />
            <TextField
              label="Содержимое"
              fullWidth
              multiline
              rows={4}
              value={newNews.content}
              onChange={(e) => setNewNews({ ...newNews, content: e.target.value })}
              sx={{
                mt: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': { borderColor: '#007aff' },
                  '&.Mui-focused fieldset': { borderColor: '#007aff' },
                },
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <Checkbox
                checked={newNews.published}
                onChange={(e) => setNewNews({ ...newNews, published: e.target.checked })}
              />
              <Typography variant="body2">Опубликовать сразу</Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenAddDialog(false)}
              sx={{ color: '#007aff', textTransform: 'none' }}
            >
              Отмена
            </Button>
            <Button
              onClick={handleAddNews}
              variant="contained"
              sx={{ bgcolor: '#007aff', '&:hover': { bgcolor: '#005bb5' }, borderRadius: 2 }}
            >
              Добавить
            </Button>
          </DialogActions>
        </Dialog>

        {/* Диалог редактирования новости */}
        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
          <DialogTitle>Редактировать новость</DialogTitle>
          <DialogContent>
            {editNews && (
              <>
                <TextField
                  label="Заголовок"
                  fullWidth
                  value={editNews.title}
                  onChange={(e) => setEditNews({ ...editNews, title: e.target.value })}
                  sx={{
                    mt: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': { borderColor: '#007aff' },
                      '&.Mui-focused fieldset': { borderColor: '#007aff' },
                    },
                  }}
                />
                <TextField
                  label="Содержимое"
                  fullWidth
                  multiline
                  rows={4}
                  value={editNews.content}
                  onChange={(e) => setEditNews({ ...editNews, content: e.target.value })}
                  sx={{
                    mt: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': { borderColor: '#007aff' },
                      '&.Mui-focused fieldset': { borderColor: '#007aff' },
                    },
                  }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <Checkbox
                    checked={editNews.published}
                    onChange={(e) => setEditNews({ ...editNews, published: e.target.checked })}
                  />
                  <Typography variant="body2">Опубликовать</Typography>
                </Box>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenEditDialog(false)}
              sx={{ color: '#007aff', textTransform: 'none' }}
            >
              Отмена
            </Button>
            <Button
              onClick={handleUpdateNews}
              variant="contained"
              sx={{ bgcolor: '#007aff', '&:hover': { bgcolor: '#005bb5' }, borderRadius: 2 }}
            >
              Сохранить
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

export default Admin;