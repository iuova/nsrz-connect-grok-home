import { useEffect, useState } from 'react';
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
} from '@mui/material';
import { News } from '../types';

function Admin() {
  const [news, setNews] = useState<News[]>([]);
  const [newNews, setNewNews] = useState({ title: '', content: '', published: false });
  const [editNews, setEditNews] = useState<News | null>(null);
  const [selectedNews, setSelectedNews] = useState<number[]>([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    const res = await axios.get('http://localhost:5000/api/news');
    setNews(res.data);
  };

  const handleAddNews = async () => {
    try {
      await axios.post('http://localhost:5000/api/news', newNews);
      setNewNews({ title: '', content: '', published: false });
      setOpenAddDialog(false);
      fetchNews();
    } catch (error) {
      alert('Ошибка при добавлении новости');
    }
  };

  const handleUpdateNews = async () => {
    if (!editNews) return;
    try {
      await axios.put(`http://localhost:5000/api/news/${editNews.id}`, editNews);
      setEditNews(null);
      setOpenEditDialog(false);
      fetchNews();
    } catch (error) {
      alert('Ошибка при обновлении новости');
    }
  };

  const handleDeleteNews = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/news/${id}`);
      fetchNews();
    } catch (error) {
      alert('Ошибка при удалении новости');
    }
  };

  const handlePublishMultiple = async () => {
    try {
      await axios.post('http://localhost:5000/api/news/publish', { ids: selectedNews });
      setSelectedNews([]);
      fetchNews();
    } catch (error) {
      alert('Ошибка при публикации новостей');
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
          Администрирование
        </Typography>
        <Button
          variant="contained"
          onClick={() => setOpenAddDialog(true)}
          sx={{ mb: 3, bgcolor: '#007aff', '&:hover': { bgcolor: '#005bb5' } }}
        >
          Добавить новость
        </Button>
        <Button
          variant="contained"
          onClick={handlePublishMultiple}
          disabled={selectedNews.length === 0}
          sx={{ mb: 3, ml: 2, bgcolor: '#007aff', '&:hover': { bgcolor: '#005bb5' } }}
        >
          Опубликовать выбранные
        </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedNews.length === news.length && news.length > 0}
                    onChange={() =>
                      setSelectedNews(
                        selectedNews.length === news.length ? [] : news.map((item) => item.id)
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
              {news.map((item) => (
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
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setEditNews(item);
                        setOpenEditDialog(true);
                      }}
                      sx={{ mr: 1 }}
                    >
                      Редактировать
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteNews(item.id)}
                    >
                      Удалить
                    </Button>
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
              margin="normal"
              value={newNews.title}
              onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
            />
            <TextField
              label="Содержимое"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              value={newNews.content}
              onChange={(e) => setNewNews({ ...newNews, content: e.target.value })}
            />
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
                  margin="normal"
                  value={editNews.title}
                  onChange={(e) => setEditNews({ ...editNews, title: e.target.value })}
                />
                <TextField
                  label="Содержимое"
                  fullWidth
                  margin="normal"
                  multiline
                  rows={4}
                  value={editNews.content}
                  onChange={(e) => setEditNews({ ...editNews, content: e.target.value })}
                />
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