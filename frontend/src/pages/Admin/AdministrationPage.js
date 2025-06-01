import React, { useEffect, useState,useRef,useCallback   } from "react";
import { Search, Plus, Edit, Trash2, Eye, BookOpen, FileText, Users } from "lucide-react";

// API base URL - thay đổi theo môi trường của bạn
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';




// API service functions
const apiService = {
  // Courses
  getAllCourses: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3000/api/admin/courses`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to fetch courses');
    return response.json();
  },

  getCourseDetails: async (courseId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/admin/courses/${courseId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to fetch course details');
    return response.json();
  },

  createCourse: async (courseData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/admin/courses`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(courseData)
    });
    if (!response.ok) throw new Error('Failed to create course');
    return response.json();
  },

  updateCourse: async (courseId, courseData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/admin/courses/${courseId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(courseData)
    });
    if (!response.ok) throw new Error('Failed to update course');
    return response.json();
  },

  deleteCourse: async (courseId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/admin/courses/${courseId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to delete course');
    return response.json();
  },

  // Chapters
  addChapter: async (courseId, chapterData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/admin/courses/${courseId}/chapters`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(chapterData)
    });
    if (!response.ok) throw new Error('Failed to add chapter');
    return response.json();
  },

  // Lessons
  addLesson: async (chapterId, lessonData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/admin/chapters/${chapterId}/lessons`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(lessonData)
    });
    if (!response.ok) throw new Error('Failed to add lesson');
    return response.json();
  }
};

const OptimizedAdminPage = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({});
  
  const itemsPerPage = 5;

  // Load courses on component mount
  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiService.getAllCourses();
      setCourses(data.courses || data);
    } catch (err) {
      setError('Không thể tải danh sách khóa học: ' + err.message);
      console.error('Error loading courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCourseDetails = async (courseId) => {
    try {
      setLoading(true);
      const data = await apiService.getCourseDetails(courseId);
      setChapters(data.chapters || []);
    } catch (err) {
      setError('Không thể tải chi tiết khóa học: ' + err.message);
      console.error('Error loading course details:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter và phân trang
  const filteredCourses = courses.filter(course => 
    course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );



 


  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    setFormData(item || {});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({});
    setError('');
  };



    const handleFormSubmit =useCallback(async (e) => {
      e.preventDefault();
      try {
        setLoading(true);
        setError('');
  
        if (modalType === 'course') {
          if (editingItem) {
            await apiService.updateCourse(editingItem.course_id, formData);
          } else {
            await apiService.createCourse(formData);
          }
          await loadCourses();
  
        } else if (modalType === 'chapter') {
          await apiService.addChapter(selectedCourse.course_id, formData);
          await loadCourseDetails(selectedCourse.course_id);
        } else if (modalType === 'lesson') {
          const chapterId = formData.chapter_id;
          await apiService.addLesson(chapterId, formData);
          await loadCourseDetails(selectedCourse.course_id);
        }
  
        closeModal();
      } catch (err) {
        setError('Có lỗi xảy ra: ' + err.message);
      } finally {
        setLoading(false);
      }
   }, [modalType, editingItem, formData, selectedCourse]);
 

  const handleDelete = async (courseId) => {
    if (window.confirm('Bạn chắc chắn muốn xóa khóa học này?')) {
      try {
        setLoading(true);
        await apiService.deleteCourse(courseId);
        await loadCourses();
      } catch (err) {
        setError('Không thể xóa khóa học: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const viewCourseDetail = async (course) => {
    setSelectedCourse(course);
    await loadCourseDetails(course.course_id);
    setActiveTab('course-detail');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const Pagination = () => (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-gray-600">
        Hiển thị {Math.min((currentPage - 1) * itemsPerPage + 1, filteredCourses.length)} - {Math.min(currentPage * itemsPerPage, filteredCourses.length)} của {filteredCourses.length} khóa học
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Trước
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'hover:bg-gray-50'}`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Sau
        </button>
      </div>
    </div>
  );

  const Modal = () => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {modalType === 'course' ? (editingItem ? 'Sửa Khóa Học' : 'Thêm Khóa Học Mới') : 
               modalType === 'chapter' ? 'Thêm Chương Mới' : 'Thêm Bài Học Mới'}
            </h3>
            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">×</button>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <input
              type="text"
              name="title"
              placeholder={modalType === 'course' ? 'Tên khóa học' : modalType === 'chapter' ? 'Tên chương' : 'Tên bài học'}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.title || ''}
              onChange={handleInputChange}
              required
            />
            
            {modalType === 'course' && (
              <>
                <textarea
                  name="description"
                  placeholder="Mô tả khóa học"
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                />
                
                <input
                  type="number"
                  name="price"
                  placeholder="Giá khóa học"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.price || ''}
                  onChange={handleInputChange}
                  step="0.01"
                />
                
                <select
                  name="level"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.level || 'beginner'}
                  onChange={handleInputChange}
                  required
                >
                  <option value="beginner">Cơ bản</option>
                  <option value="intermediate">Trung cấp</option>
                  <option value="advanced">Nâng cao</option>
                </select>

                <select
                  name="status"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.status || 'draft'}
                  onChange={handleInputChange}
                >
                  <option value="draft">Nháp</option>
                  <option value="published">Đã xuất bản</option>
                  <option value="archived">Lưu trữ</option>
                </select>
              </>
            )}
            
           {modalType === 'lesson' && (
  <>
    {/* Chọn chương */}
    <select
      name="chapter_id"
      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={formData.chapter_id || ''}
      onChange={handleInputChange}
      required
    >
      <option value="">Chọn chương</option>
      {chapters.map((chapter) => (
        <option key={chapter.chapter_id} value={chapter.chapter_id}>
          {chapter.title}
        </option>
      ))}
    </select>

    {/* Tiêu đề bài học */}
    <input
      type="text"
      name="title"
      placeholder="Tiêu đề bài học"
      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={formData.title || ''}
      onChange={handleInputChange}
      required
    />

    {/* Nội dung */}
    <textarea
      name="content"
      placeholder="Nội dung bài học"
      rows="4"
      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={formData.content || ''}
      onChange={handleInputChange}
    />

    {/* URL video */}
    <input
      type="url"
      name="video_url"
      placeholder="URL video (nếu có)"
      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={formData.video_url || ''}
      onChange={handleInputChange}
    />

    {/* Thời lượng (giây) */}
    <input
      type="number"
      name="duration"
      placeholder="Thời lượng (giây)"
      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={formData.duration || ''}
      onChange={handleInputChange}
      min="0"
    />

    {/* Checkbox miễn phí */}
    <label className="flex items-center">
      <input
        type="checkbox"
        name="is_free"
        checked={formData.is_free || false}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, is_free: e.target.checked }))
        }
        className="mr-2"
      />
      Miễn phí
    </label>
  </>
)}

            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                disabled={loading}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Đang xử lý...' : 'Lưu'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const CoursesTab = () => (
    <div>
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Header với search và add button */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Tìm kiếm khóa học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => openModal('course')}
          className="ml-4 flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          disabled={loading}
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm Khóa Học
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
          <div className="flex items-center">
            <BookOpen className="w-8 h-8 mr-3" />
            <div>
              <div className="text-2xl font-bold">{courses.length}</div>
              <div className="text-sm opacity-90">Tổng Khóa Học</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
          <div className="flex items-center">
            <FileText className="w-8 h-8 mr-3" />
            <div>
              <div className="text-2xl font-bold">{courses.reduce((sum, course) => sum + (course.total_chapters || 0), 0)}</div>
              <div className="text-sm opacity-90">Tổng Chương</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
          <div className="flex items-center">
            <Users className="w-8 h-8 mr-3" />
            <div>
              <div className="text-2xl font-bold">{courses.reduce((sum, course) => sum + (course.total_lessons || 0), 0)}</div>
              <div className="text-sm opacity-90">Tổng Bài Học</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg">
          <div className="flex items-center">
            <BookOpen className="w-8 h-8 mr-3" />
            <div>
              <div className="text-2xl font-bold">1,234</div>
              <div className="text-sm opacity-90">Học Viên</div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Đang tải...</p>
        </div>
      )}

      {/* Course table */}
      {!loading && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khóa Học</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày Tạo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành Động</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedCourses.map((course) => (
                <tr key={course.course_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{course.title}</div>
                      <div className="text-sm text-gray-500">{course.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      course.status === 'published' ? 'bg-green-100 text-green-800' :
                      course.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {course.status === 'published' ? 'Đã xuất bản' :
                       course.status === 'draft' ? 'Nháp' : 'Lưu trữ'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {course.price ? `${Number(course.price).toLocaleString('vi-VN')} VND` : 'Miễn phí'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(course.created_at).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => viewCourseDetail(course)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openModal('course', course)}
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(course.course_id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="Xóa"
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {paginatedCourses.length === 0 && !loading && (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Không tìm thấy khóa học</h3>
              <p className="mt-1 text-sm text-gray-500">Hãy thử tìm kiếm với từ khóa khác hoặc tạo khóa học mới.</p>
            </div>
          )}
        </div>
      )}

      {!loading && <Pagination />}
    </div>
  );

  const CourseDetailTab = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => setActiveTab('courses')}
            className="mr-4 text-blue-600 hover:text-blue-800 flex items-center"
          >
            ← Quay lại danh sách
          </button>
          <h2 className="text-2xl font-bold text-gray-900">{selectedCourse?.title}</h2>
        </div>
        <button
          onClick={() => openModal('chapter')}
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          disabled={loading}
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm Chương
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Course info */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{chapters.length}</div>
            <div className="text-sm text-gray-500">Chương</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {chapters.reduce((sum, ch) => sum + (ch.lessons?.length || 0), 0)}
            </div>
            <div className="text-sm text-gray-500">Bài học</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">1,234</div>
            <div className="text-sm text-gray-500">Học viên</div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Đang tải...</p>
        </div>
      )}

      {/* Chapters */}
      {!loading && (
        <div className="space-y-4">
          {chapters.map((chapter, index) => (
            <div key={chapter.chapter_id} className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Chương {index + 1}: {chapter.title}</h3>
                  <button
                    onClick={() => openModal('lesson')}
                    className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Thêm bài học
                  </button>
                </div>
              </div>
              <div className="p-4">
                {chapter.lessons && chapter.lessons.length > 0 ? (
                  <div className="space-y-2">
                    {chapter.lessons.map((lesson, lessonIndex) => (
                      <div key={lesson.lesson_id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div>
                          <span className="text-sm font-medium">Bài {lessonIndex + 1}: {lesson.title}</span>
                          {lesson.duration && (
                            <span className="ml-2 text-xs text-gray-500">
                              ({Math.floor(lesson.duration / 60)}:{(lesson.duration % 60).toString().padStart(2, '0')})
                            </span>
                          )}
                          {lesson.is_free && (
                            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              Miễn phí
                            </span>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-green-600 hover:text-green-800">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-800">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <FileText className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p>Chưa có bài học nào trong chương này</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && chapters.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có chương nào</h3>
          <p className="mt-1 text-sm text-gray-500">Thêm chương đầu tiên cho khóa học này.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Quản Lý Khóa Học</h1>
            <div className="text-sm text-gray-500">
              Xin chào, Admin! 👋
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('courses')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'courses'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Danh Sách Khóa Học
            </button>
            {selectedCourse && (
              <button
                onClick={() => setActiveTab('course-detail')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'course-detail'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Chi Tiết: {selectedCourse.title}
              </button>
            )}
          </nav>
        </div>

        {/* Tab content */}
        {activeTab === 'courses' && <CoursesTab />}
        {activeTab === 'course-detail' && <CourseDetailTab />}
      </div>

      <Modal />
    </div>
  );
};

export default OptimizedAdminPage;