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
      setNews(res.data.sort((a: News, b: News) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    } catch (error) {
      console.error('Ошибка загрузки новостей:', error);
    }
  };

  const filteredNews = useMemo(() => {
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
      result = result.filter((item) => new Date(item.created_at) >= new Date(startDate));
    }
    if (endDate) {
      result = result.filter((item) => new Date(item.created_at) <= new Date(endDate));
    }

    // Фильтр по автору
    if (authorFilter) {
      result = result.filter((item) => item.author_email === authorFilter);
    }

    // Фильтр по статусу
    if (statusFilter !== 'all') {
      result = result.filter((item) => item.published === (statusFilter === 'published'));
    }

    return showAll ? result : result.slice(0, 5);
  }, [news, search, startDate, endDate, authorFilter, statusFilter, showAll]);

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
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Управление новостями
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <TextField
            label="Поиск по новостям"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: 200 }}
          />
          <TextField
            label="Дата от"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 150 }}
          />
          <TextField
            label="Дата до"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 150 }}
          />
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Автор</InputLabel>
            <Select
              value={authorFilter}
              onChange={(e) => setAuthorFilter(e.target.value)}
              label="Автор"
            >
              <MenuItem value="">Все</MenuItem>
              {authors.map((author) => (
                <MenuItem key={author} value={author}>
                  {author}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Статус</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Статус"
            >
              <MenuItem value="all">Все</MenuItem>
              <MenuItem value="published">Опубликована</MenuItem>
              <MenuItem value="draft">Черновик</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            onClick={() => setOpenAddDialog(true)}
            sx={{ bgcolor: '#007aff', '&:hover': { bgcolor: '#005bb5' } }}
          >
            Добавить новость
          </Button>
          <Button
            variant="contained"
            onClick={handlePublishMultiple}
            disabled={selectedNews.length === 0}
            sx={{ ml: 2, bgcolor: '#007aff', '&:hover': { bgcolor: '#005bb5' } }}
          >
            Опубликовать выбранные
          </Button>
          {!showAll && filteredNews.length > 5 && (
            <Button
              variant="text"
              onClick={() => setShowAll(true)}
              sx={{ ml: 2, color: '#007aff' }}
            >
              Показать все
            </Button>
          )}
          {showAll && (
            <Button
              variant="text"
              onClick={() => setShowAll(false)}
              sx={{ ml: 2, color: '#007aff' }}
            >
              Скрыть
            </Button>
          )}
        </Box>
        <TableContainer component={Paper}>
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
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteNews(item.id)}
                      sx={{ color: '#ff3b30' }}
                    >
                      <DeleteIcon />
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
            />
            <Box sx={{ mb: 2 }}>
              <TextField
                label="Содержимое"
                fullWidth
                multiline
                rows={4}
                value={newNews.content}
                onChange={(e) => setNewNews({ ...newNews, content: e.target.value })}
              />
            </Box>
            <Checkbox
              checked={newNews.published}
              onChange={(e) => setNewNews({ ...newNews, published: e.target.checked })}
            />
            <Typography variant="caption">Опубликовать сразу</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddDialog(false)}>Отмена</Button>
            <Button onClick={handleAddNews} variant="contained">
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
                />
                <Box sx={{ mb: 2 }}>
                  <TextField
                    label="Содержимое"
                    fullWidth
                    multiline
                    rows={4}
                    value={editNews.content}
                    onChange={(e) => setEditNews({ ...editNews, content: e.target.value })}
                  />
                </Box>
                <Checkbox
                  checked={editNews.published}
                  onChange={(e) => setEditNews({ ...editNews, published: e.target.checked })}
                />
                <Typography variant="caption">Опубликовать</Typography>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditDialog(false)}>Отмена</Button>
            <Button onClick={handleUpdateNews} variant="contained">
              Сохранить
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

export default Admin;