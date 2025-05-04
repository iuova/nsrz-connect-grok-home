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
  Pagination,
  Tabs,
  Tab,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import { News, User } from '../types';

// Утилита для перевода кодов ролей в человекочитаемый вид
const roleToRu: Record<User['role'], string> = {
  admin: 'Администратор',
  employee: 'Сотрудник',
  news_manager: 'Менеджер новостей',
};

// Компонент для управления новостями
function NewsManagement() {
  const [news, setNews] = useState<News[]>([]);
  const [newNews, setNewNews] = useState({ title: '', content: '', published: false });
  const [editNews, setEditNews] = useState<News | null>(null);
  const [selectedNews, setSelectedNews] = useState<number[]>([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: 'title' | 'created_at' | 'author_email' | 'published';
    direction: 'asc' | 'desc';
  }>({ key: 'created_at', direction: 'desc' });

  const itemsPerPage = 5;

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
      setNews(res.data);
    } catch (error) {
      console.error('Ошибка загрузки новостей:', error);
    }
  };

  const sortedAndFilteredNews = useMemo(() => {
    let result = [...news];
    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(
        (item) => item.title.toLowerCase().includes(lowerSearch) || item.content.toLowerCase().includes(lowerSearch)
      );
    }
    if (startDate) {
      const start = new Date(startDate);
      result = result.filter((item) => new Date(item.created_at) >= start);
    }
    if (endDate) {
      const end = new Date(endDate);
      result = result.filter((item) => new Date(item.created_at) <= end);
    }
    if (authorFilter) {
      result = result.filter((item) => item.author_email === authorFilter);
    }
    if (statusFilter !== 'all') {
      result = result.filter((item) => {
        const isPublished = !!item.published;
        return statusFilter === 'published' ? isPublished : !isPublished;
      });
    }
    result.sort((a, b) => {
      const direction = sortConfig.direction === 'asc' ? 1 : -1;
      switch (sortConfig.key) {
        case 'title':
          return direction * a.title.localeCompare(b.title);
        case 'created_at':
          return direction * (new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        case 'author_email':
          return direction * a.author_email.localeCompare(b.author_email);
        case 'published':
          return direction * ((a.published ? 1 : 0) - (b.published ? 1 : 0));
        default:
          return 0;
      }
    });
    return result;
  }, [news, search, startDate, endDate, authorFilter, statusFilter, sortConfig]);

  const paginatedNews = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return sortedAndFilteredNews.slice(start, end);
  }, [sortedAndFilteredNews, page]);

  const pageCount = Math.ceil(sortedAndFilteredNews.length / itemsPerPage);

  const authors = useMemo(() => {
    const uniqueAuthors = Array.from(new Set(news.map((item) => item.author_email)));
    return uniqueAuthors.sort();
  }, [news]);

  const handleSort = (key: 'title' | 'created_at' | 'author_email' | 'published') => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
    setPage(1);
  };

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
    return date.toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box>
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
          <InputLabel sx={{ top: -2, '&.Mui-focused': { color: '#007aff' }, fontSize: '0.875rem' }}>
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
          <InputLabel sx={{ top: -2, '&.Mui-focused': { color: '#007aff' }, fontSize: '0.875rem' }}>
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
                  checked={selectedNews.length === paginatedNews.length && paginatedNews.length > 0}
                  onChange={() =>
                    setSelectedNews(
                      selectedNews.length === paginatedNews.length
                        ? []
                        : paginatedNews.map((item) => item.id)
                    )
                  }
                />
              </TableCell>
              <TableCell sx={{ fontWeight: 600, cursor: 'pointer' }} onClick={() => handleSort('title')}>
                Заголовок
                {sortConfig.key === 'title' &&
                  (sortConfig.direction === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />)}
              </TableCell>
              <TableCell sx={{ fontWeight: 600, cursor: 'pointer' }} onClick={() => handleSort('created_at')}>
                Дата
                {sortConfig.key === 'created_at' &&
                  (sortConfig.direction === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />)}
              </TableCell>
              <TableCell sx={{ fontWeight: 600, cursor: 'pointer' }} onClick={() => handleSort('author_email')}>
                Автор
                {sortConfig.key === 'author_email' &&
                  (sortConfig.direction === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />)}
              </TableCell>
              <TableCell sx={{ fontWeight: 600, cursor: 'pointer' }} onClick={() => handleSort('published')}>
                Статус
                {sortConfig.key === 'published' &&
                  (sortConfig.direction === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />)}
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedNews.map((item) => (
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
                  <IconButton onClick={() => handleDeleteNews(item.id)} sx={{ color: '#ff3b30' }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {pageCount > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_e, value) => setPage(value)}
            color="primary"
            sx={{
              '& .MuiPaginationItem-root': {
                color: '#007aff',
                '&.Mui-selected': {
                  bgcolor: '#007aff',
                  color: '#fff',
                  '&:hover': { bgcolor: '#005bb5' },
                },
                '&:hover': { bgcolor: 'rgba(0, 122, 255, 0.1)' },
              },
            }}
          />
        </Box>
      )}
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
  );
}

// Компонент для управления пользователями
function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({ email: '', lastname: '', firstname: '', midlename: '', password: '', role: 'user' });
  const [editUser, setEditUser] = useState<User | null>(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/users', { headers: getAuthHeaders() });
      setUsers(res.data);
      setError(null);
    } catch (error: any) {
      console.error('Ошибка загрузки пользователей:', error);
      setError(error.response?.data?.error || 'Не удалось загрузить пользователей');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    try {
      await axios.post('http://localhost:5000/api/users', newUser, { headers: getAuthHeaders() });
      setNewUser({ email: '', lastname: '', firstname: '', midlename: '', password: '', role: 'employee' });
      setOpenAddDialog(false);
      fetchUsers();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при добавлении пользователя');
    }
  };

  const handleUpdateUser = async () => {
    if (!editUser) return;
    try {
      const updateData: any = { email: editUser.email, lastname: editUser.lastname, firstname: editUser.firstname, midlename: editUser.midlename, role: editUser.role };
      if (editUser.password) {
        updateData.password = editUser.password;
      }
      await axios.put(`http://localhost:5000/api/users/${editUser.id}`, updateData, {
        headers: getAuthHeaders(),
      });
      setEditUser(null);
      setOpenEditDialog(false);
      fetchUsers();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при обновлении пользователя');
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, { headers: getAuthHeaders() });
      fetchUsers();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при удалении пользователя');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
        <Button
          variant="contained"
          onClick={() => setOpenAddDialog(true)}
          sx={{ bgcolor: '#007aff', '&:hover': { bgcolor: '#005bb5' }, borderRadius: 2 }}
        >
          Добавить пользователя
        </Button>
      </Box>
      {loading ? (
        <Typography variant="body1" sx={{ mt: 2 }}>
          Загрузка пользователей...
        </Typography>
      ) : error ? (
        <Typography variant="body1" color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      ) : users.length === 0 ? (
        <Typography variant="body1" sx={{ mt: 2 }}>
          Нет зарегистрированных пользователей
        </Typography>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Фамилия</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Имя</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Роль</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.lastname}</TableCell>
                  <TableCell>{user.firstname}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{roleToRu[user.role]}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        setEditUser({ ...user, password: '' });
                        setOpenEditDialog(true);
                      }}
                      sx={{ color: '#007aff' }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteUser(user.id)} sx={{ color: '#ff3b30' }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Добавление пользователя</DialogTitle>
        <DialogContent>
        <TextField
            label="Фамилия"
            fullWidth
            value={newUser.lastname}
            onChange={(e) => setNewUser({ ...newUser, lastname: e.target.value })}
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
            label="Имя"
            fullWidth
            value={newUser.firstname}
            onChange={(e) => setNewUser({ ...newUser, firstname: e.target.value })}
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
            label="Отчество"
            fullWidth
            value={newUser.midlename}
            onChange={(e) => setNewUser({ ...newUser, midlename: e.target.value })}
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
            label="Email"
            fullWidth
            value={newUser.email || ""}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
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
            label="Пароль"
            type="password"
            fullWidth
            value={newUser.password || ""}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            sx={{
              mt: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': { borderColor: '#007aff' },
                '&.Mui-focused fieldset': { borderColor: '#007aff' },
              },
            }}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <Select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              sx={{
                borderRadius: 2,
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#007aff' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#007aff' },
              }}
            >
              <MenuItem value="employee">Сотрудник</MenuItem>
              <MenuItem value="admin">Администратор</MenuItem>
              <MenuItem value="news_manager">Менеджер новостей</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenAddDialog(false)}
            sx={{ color: '#007aff', textTransform: 'none' }}
          >
            Отмена
          </Button>
          <Button
            onClick={handleAddUser}
            variant="contained"
            sx={{ bgcolor: '#007aff', '&:hover': { bgcolor: '#005bb5' }, borderRadius: 2 }}
          >
            Добавить
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Редактировать пользователя</DialogTitle>
        <DialogContent>
          {editUser && (
            <>
              <TextField
                label="Фамилия"
                fullWidth
                value={editUser.lastname}
                onChange={(e) => setEditUser({ ...editUser, lastname: e.target.value })}
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
                label="Имя"
                fullWidth
                value={editUser.firstname}
                onChange={(e) => setEditUser({ ...editUser, firstname: e.target.value })}
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
                label="Отчество"
                fullWidth
                value={editUser.midlename}
                onChange={(e) => setEditUser({ ...editUser, midlename: e.target.value })}
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
                label="Email"
                fullWidth
                value={editUser.email}
                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
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
                label="Новый пароль (оставьте пустым, чтобы не менять)"
                type="password"
                fullWidth
                value={editUser.password || ''}
                onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
                sx={{
                  mt: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': { borderColor: '#007aff' },
                    '&.Mui-focused fieldset': { borderColor: '#007aff' },
                  },
                }}
              />
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel sx={{ '&.Mui-focused': { color: '#007aff' } }}>Роль</InputLabel>
                <Select
                  value={editUser.role}
                  onChange={(e) => setEditUser({ ...editUser, role: e.target.value as "employee" | "admin" | "news_manager" })}
                >
                  <MenuItem value="employee">Сотрудник</MenuItem>
                  <MenuItem value="admin">Администратор</MenuItem>
                  <MenuItem value="news_manager">Менеджер новостей</MenuItem>
                </Select>
              </FormControl>
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
            onClick={handleUpdateUser}
            variant="contained"
            sx={{ bgcolor: '#007aff', '&:hover': { bgcolor: '#005bb5' }, borderRadius: 2 }}
          >
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// Главный компонент Admin
function Admin() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          Администрирование
        </Typography>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            mb: 3,
            '& .MuiTab-root': {
              textTransform: 'none',
              color: '#007aff',
              '&:hover': { bgcolor: 'rgba(0, 122, 255, 0.1)' },
            },
            '& .Mui-selected': {
              color: '#007aff',
              fontWeight: 600,
            },
            '& .MuiTabs-indicator': {
              bgcolor: '#007aff',
            },
          }}
        >
          <Tab label="Управление новостями" />
          <Tab label="Управление пользователями" />
        </Tabs>
        {tabValue === 0 && <NewsManagement />}
        {tabValue === 1 && <UserManagement />}
      </Box>
    </Container>
  );
}

export default Admin;
