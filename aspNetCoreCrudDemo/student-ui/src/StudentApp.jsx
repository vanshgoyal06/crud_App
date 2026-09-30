import { useEffect, useState } from 'react';
import api from './api';

const STUDENTS_URL = '/students';

const emptyForm = { name: '', email: '', course: '', enrollmentDate: '' };

export default function StudentApp({ username, onLogout }) {
    const [students, setStudents] = useState([]);
    const [formData, setFormData] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null); // null = "add" mode, otherwise "edit" mode

    const fetchStudents = async () => {
        try {
            const response = await api.get(STUDENTS_URL);
            setStudents(response.data);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const resetForm = () => {
        setFormData(emptyForm);
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            name: formData.name,
            email: formData.email,
            course: formData.course,
            enrollmentDate: new Date(formData.enrollmentDate).toISOString()
        };

        try {
            if (editingId) {
                // Update existing student
                await api.put(`${STUDENTS_URL}/${editingId}`, {
                    studentID: editingId,
                    ...payload
                });
                alert('Student updated successfully!');
            } else {
                // Create new student
                await api.post(STUDENTS_URL, payload);
                alert('Student added successfully!');
            }
            resetForm();
            fetchStudents();
        } catch (error) {
            console.error('Error saving student:', error);
            alert(`Failed to ${editingId ? 'update' : 'add'} student. Check F12 Console for details.`);
        }
    };

    const handleEditClick = (student) => {
        const id = student.studentID || student.studentId || student.id;
        setEditingId(id);
        setFormData({
            name: student.name,
            email: student.email,
            course: student.course,
            // yyyy-MM-dd for the date input
            enrollmentDate: new Date(student.enrollmentDate).toISOString().split('T')[0]
        });
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`${STUDENTS_URL}/${id}`);
            if (editingId === id) resetForm(); // don't leave a stale edit form open
            fetchStudents();
        } catch (error) {
            console.error('Error deleting student:', error);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial', color: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Student Management UI</h2>
                <div>
                    <span style={{ marginRight: '10px' }}>Logged in as {username}</span>
                    <button onClick={onLogout}>Log Out</button>
                </div>
            </div>

            <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input name="course" placeholder="Course" value={formData.course} onChange={handleChange} required />
                <input name="enrollmentDate" type="date" value={formData.enrollmentDate} onChange={handleChange} required />
                <button type="submit">{editingId ? 'Update Student' : 'Add Student'}</button>
                {editingId && (
                    <button type="button" onClick={resetForm}>Cancel</button>
                )}
            </form>

            <table border="1" cellPadding="8" cellSpacing="0" style={{ color: '#fff' }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Course</th>
                        <th>Enrollment Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => {
                        // Handle C# casing variation (StudentID vs studentID vs id)
                        const id = student.studentID || student.studentId || student.id;
                        return (
                            <tr key={id}>
                                <td>{id}</td>
                                <td>{student.name}</td>
                                <td>{student.email}</td>
                                <td>{student.course}</td>
                                <td>{new Date(student.enrollmentDate).toLocaleDateString()}</td>
                                <td>
                                    <button onClick={() => handleEditClick(student)}>Edit</button>{' '}
                                    <button onClick={() => handleDelete(id)}>Delete</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
