import { useState, useEffect } from 'react';
import { roadmapAPI, mentorAPI } from '../services/api';
import '../App.css';

const MentorDashboard = ({ user }) => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [students, setStudents] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    student: '',
    deadline: '',
    tasks: [{ title: '' }],
    videos: [{ title: '', url: '' }],
    assignments: [{ title: '', description: '' }]
  });
  const [evaluationData, setEvaluationData] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [roadmapsRes, studentsRes] = await Promise.all([
        roadmapAPI.getAllRoadmaps(),
        mentorAPI.getStudents()
      ]);
      
      setRoadmaps(roadmapsRes.data.data);
      setStudents(studentsRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTaskChange = (index, value) => {
    const updatedTasks = [...formData.tasks];
    updatedTasks[index].title = value;
    setFormData({ ...formData, tasks: updatedTasks });
  };

  const addTask = () => {
    setFormData({
      ...formData,
      tasks: [...formData.tasks, { title: '' }]
    });
  };

  const handleVideoChange = (index, field, value) => {
    const updatedVideos = [...formData.videos];
    updatedVideos[index][field] = value;
    setFormData({ ...formData, videos: updatedVideos });
  };

  const addVideo = () => {
    setFormData({
      ...formData,
      videos: [...formData.videos, { title: '', url: '' }]
    });
  };

  const handleAssignmentChange = (index, field, value) => {
    const updatedAssignments = [...formData.assignments];
    updatedAssignments[index][field] = value;
    setFormData({ ...formData, assignments: updatedAssignments });
  };

  const addAssignment = () => {
    setFormData({
      ...formData,
      assignments: [...formData.assignments, { title: '', description: '' }]
    });
  };

  const handleCreateRoadmap = async (e) => {
    e.preventDefault();
    try {
      await roadmapAPI.createRoadmap(formData);
      alert('Roadmap created successfully!');
      setShowCreateForm(false);
      setFormData({
        title: '',
        description: '',
        student: '',
        deadline: '',
        tasks: [{ title: '' }],
        videos: [{ title: '', url: '' }],
        assignments: [{ title: '', description: '' }]
      });
      fetchData();
    } catch (error) {
      console.error('Error creating roadmap:', error);
      alert('Failed to create roadmap');
    }
  };

  const handleEvaluate = async (roadmapId) => {
    const data = evaluationData[roadmapId];
    if (!data || !data.score) {
      alert('Please enter a score');
      return;
    }

    try {
      await roadmapAPI.updateRoadmap(roadmapId, {
        score: parseInt(data.score),
        feedback: data.feedback || '',
        status: 'evaluated'
      });
      alert('Evaluation submitted successfully!');
      setEvaluationData({ ...evaluationData, [roadmapId]: {} });
      fetchData();
    } catch (error) {
      console.error('Error evaluating:', error);
    }
  };

  const handleAnswerQuestion = async (roadmapId, questionId, answer) => {
    if (!answer.trim()) {
      alert('Please enter an answer');
      return;
    }

    try {
      await roadmapAPI.answerQuestion(roadmapId, questionId, answer);
      alert('Answer submitted successfully!');
      fetchData();
    } catch (error) {
      console.error('Error answering question:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Mentor Dashboard</h1>
        <p>Welcome, {user.name}!</p>
        <button className="btn btn-primary" onClick={() => setShowCreateForm(!showCreateForm)}>
          {showCreateForm ? 'Cancel' : 'Create New Roadmap'}
        </button>
      </div>

      {showCreateForm && (
        <div className="create-form-container">
          <h2>Create New Roadmap</h2>
          <form onSubmit={handleCreateRoadmap} className="roadmap-form">
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Student</label>
              <select
                name="student"
                value={formData.student}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a student</option>
                {students.map(student => (
                  <option key={student._id} value={student._id}>
                    {student.name} ({student.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Deadline</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-section">
              <h3>Tasks</h3>
              {formData.tasks.map((task, index) => (
                <div key={index} className="form-group">
                  <input
                    type="text"
                    placeholder={`Task ${index + 1}`}
                    value={task.title}
                    onChange={(e) => handleTaskChange(index, e.target.value)}
                  />
                </div>
              ))}
              <button type="button" className="btn btn-secondary" onClick={addTask}>
                Add Task
              </button>
            </div>

            <div className="form-section">
              <h3>Videos</h3>
              {formData.videos.map((video, index) => (
                <div key={index} className="video-input-group">
                  <input
                    type="text"
                    placeholder="Video title"
                    value={video.title}
                    onChange={(e) => handleVideoChange(index, 'title', e.target.value)}
                  />
                  <input
                    type="url"
                    placeholder="Video URL"
                    value={video.url}
                    onChange={(e) => handleVideoChange(index, 'url', e.target.value)}
                  />
                </div>
              ))}
              <button type="button" className="btn btn-secondary" onClick={addVideo}>
                Add Video
              </button>
            </div>

            <div className="form-section">
              <h3>Assignments</h3>
              {formData.assignments.map((assignment, index) => (
                <div key={index} className="assignment-input-group">
                  <input
                    type="text"
                    placeholder="Assignment title"
                    value={assignment.title}
                    onChange={(e) => handleAssignmentChange(index, 'title', e.target.value)}
                  />
                  <textarea
                    placeholder="Assignment description"
                    value={assignment.description}
                    onChange={(e) => handleAssignmentChange(index, 'description', e.target.value)}
                    rows="2"
                  />
                </div>
              ))}
              <button type="button" className="btn btn-secondary" onClick={addAssignment}>
                Add Assignment
              </button>
            </div>

            <button type="submit" className="btn btn-primary">Create Roadmap</button>
          </form>
        </div>
      )}

      <div className="roadmaps-section">
        <h2>My Assigned Roadmaps</h2>
        {roadmaps.length === 0 ? (
          <p className="empty-state">No roadmaps created yet. Create one to get started!</p>
        ) : (
          <div className="roadmaps-grid">
            {roadmaps.map((roadmap) => (
              <div key={roadmap._id} className="roadmap-card">
                <div className="roadmap-header">
                  <h3>{roadmap.title}</h3>
                  <span className={`status-badge ${roadmap.status}`}>{roadmap.status}</span>
                </div>

                <p className="roadmap-description">{roadmap.description}</p>
                
                <div className="roadmap-meta">
                  <p><strong>Student:</strong> {roadmap.student?.name}</p>
                  <p><strong>Deadline:</strong> {new Date(roadmap.deadline).toLocaleDateString()}</p>
                </div>

                <div className="roadmap-progress">
                  <h4>Progress</h4>
                  <p>Tasks: {roadmap.tasks?.filter(t => t.completed).length}/{roadmap.tasks?.length || 0} completed</p>
                  <p>Assignments: {roadmap.assignments?.filter(a => a.completed).length}/{roadmap.assignments?.length || 0} completed</p>
                </div>

                {roadmap.questions && roadmap.questions.length > 0 && (
                  <div className="questions-section">
                    <h4>Student Questions</h4>
                    {roadmap.questions.map((q) => (
                      <div key={q._id} className="question-item">
                        <p><strong>Q:</strong> {q.question}</p>
                        {q.answer ? (
                          <p><strong>A:</strong> {q.answer}</p>
                        ) : (
                          <div className="answer-form">
                            <textarea
                              placeholder="Type your answer..."
                              id={`answer-${q._id}`}
                              rows="2"
                            />
                            <button
                              className="btn btn-secondary"
                              onClick={() => {
                                const answer = document.getElementById(`answer-${q._id}`).value;
                                handleAnswerQuestion(roadmap._id, q._id, answer);
                              }}
                            >
                              Submit Answer
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {roadmap.status === 'completed' && !roadmap.score && (
                  <div className="evaluation-section">
                    <h4>Evaluate Student</h4>
                    <div className="form-group">
                      <label>Score (0-100)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={evaluationData[roadmap._id]?.score || ''}
                        onChange={(e) =>
                          setEvaluationData({
                            ...evaluationData,
                            [roadmap._id]: {
                              ...evaluationData[roadmap._id],
                              score: e.target.value
                            }
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Feedback</label>
                      <textarea
                        rows="3"
                        value={evaluationData[roadmap._id]?.feedback || ''}
                        onChange={(e) =>
                          setEvaluationData({
                            ...evaluationData,
                            [roadmap._id]: {
                              ...evaluationData[roadmap._id],
                              feedback: e.target.value
                            }
                          })
                        }
                      />
                    </div>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleEvaluate(roadmap._id)}
                    >
                      Submit Evaluation
                    </button>
                  </div>
                )}

                {roadmap.score && (
                  <div className="score-section">
                    <p><strong>Score:</strong> {roadmap.score}/100</p>
                    {roadmap.feedback && <p><strong>Feedback:</strong> {roadmap.feedback}</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorDashboard;
