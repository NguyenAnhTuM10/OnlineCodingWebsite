import React, { useEffect, useState } from "react";
import { Search, Plus, Edit, Trash2, Eye, BookOpen, FileText, Users } from "lucide-react";

// Mock data cho demo
const mockCourses = [
  { course_id: 1, title: "React Cơ Bản", description: "Học React từ đầu", total_chapters: 5, total_lessons: 25, created_at: "2024-01-15" },
  { course_id: 2, title: "Node.js Nâng Cao", description: "Backend với Node.js", total_chapters: 8, total_lessons: 40, created_at: "2024-02-10" },
  { course_id: 3, title: "JavaScript ES6+", description: "JavaScript hiện đại", total_chapters: 6, total_lessons: 30, created_at: "2024-01-20" },
  { course_id: 4, title: "TypeScript Toàn Tập", description: "Từ cơ bản đến nâng cao", total_chapters: 7, total_lessons: 35, created_at: "2024-03-01" },
  { course_id: 5, title: "MongoDB Database", description: "Cơ sở dữ liệu NoSQL", total_chapters: 4, total_lessons: 20, created_at: "2024-02-28" },
];

const mockChapters = [
  { chapter_id: 1, title: "Giới thiệu React", lessons: [
    { lesson_id: 1, title: "React là gì?" },
    { lesson_id: 2, title: "Cài đặt môi trường" },
  ]},
  { chapter_id: 2, title: "Components & Props", lessons: [
    { lesson_id: 3, title: "Tạo Component đầu tiên" },
    { lesson_id: 4, title: "Props và State" },
  ]},
];

const OptimizedAdminPage = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState(mockCourses);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'course', 'chapter', 'lesson'
  const [editingItem, setEditingItem] = useState(null);
  
  const itemsPerPage = 5;

  // Filter và phân trang
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const viewCourseDetail = (course) => {
    setSelectedCourse(course);
    setChapters(mockChapters); // Mock data
    setActiveTab('course-detail');
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
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {modalType === 'course' ? (editingItem ? 'Sửa Khóa Học' : 'Thêm Khóa Học Mới') : 
               modalType === 'chapter' ? 'Thêm Chương Mới' : 'Thêm Bài Học Mới'}
            </h3>
            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">×</button>
          </div>
          
          <div className="space-y-4">
            <input
              type="text"
              placeholder={modalType === 'course' ? 'Tên khóa học' : modalType === 'chapter' ? 'Tên chương' : 'Tên bài học'}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue={editingItem?.title || ''}
            />
            {modalType === 'course' && (
              <textarea
                placeholder="Mô tả khóa học"
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue={editingItem?.description || ''}
              />
            )}
            {modalType === 'lesson' && (
              <textarea
                placeholder="Nội dung bài học"
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="button"
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CoursesTab = () => (
    <div>
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
              <div className="text-2xl font-bold">{courses.reduce((sum, course) => sum + course.total_chapters, 0)}</div>
              <div className="text-sm opacity-90">Tổng Chương</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
          <div className="flex items-center">
            <Users className="w-8 h-8 mr-3" />
            <div>
              <div className="text-2xl font-bold">{courses.reduce((sum, course) => sum + course.total_lessons, 0)}</div>
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

      {/* Course table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khóa Học</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chương</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bài Học</th>
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
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {course.total_chapters} chương
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {course.total_lessons} bài
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{course.created_at}</td>
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
                      onClick={() => {
                        if (window.confirm('Bạn chắc chắn muốn xóa khóa học này?')) {
                          setCourses(courses.filter(c => c.course_id !== course.course_id));
                        }
                      }}
                      className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {paginatedCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Không tìm thấy khóa học</h3>
            <p className="mt-1 text-sm text-gray-500">Hãy thử tìm kiếm với từ khóa khác hoặc tạo khóa học mới.</p>
          </div>
        )}
      </div>

      <Pagination />
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
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm Chương
        </button>
      </div>

      {/* Course info */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{chapters.length}</div>
            <div className="text-sm text-gray-500">Chương</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{chapters.reduce((sum, ch) => sum + ch.lessons.length, 0)}</div>
            <div className="text-sm text-gray-500">Bài học</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">1,234</div>
            <div className="text-sm text-gray-500">Học viên</div>
          </div>
        </div>
      </div>

      {/* Chapters */}
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
              {chapter.lessons.length > 0 ? (
                <div className="space-y-2">
                  {chapter.lessons.map((lesson, lessonIndex) => (
                    <div key={lesson.lesson_id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="text-sm">Bài {lessonIndex + 1}: {lesson.title}</span>
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

      {chapters.length === 0 && (
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