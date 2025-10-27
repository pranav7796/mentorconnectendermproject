import { useState, useEffect } from 'react';
import { mentorAPI, roadmapAPI } from '../services/api';
import '../App.css';

const StudentDashboard = ({ user }) => {
  const [mentors, setMentors] = useState([]);
  const [roadmaps, setRoadmaps] = useState([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('roadmaps');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [mentorsRes, roadmapsRes] = await Promise.all([
        mentorAPI.getAllMentors(),
        roadmapAPI.getAllRoadmaps()
      ]);
      setMentors(mentorsRes.data.data);
      setRoadmaps(roadmapsRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskToggle = async (roadmapId, taskIndex) => {
    const roadmap = roadmaps.find(r => r._id === roadmapId);
    const updatedTasks = [...roadmap.tasks];
    updatedTasks[taskIndex].completed = !updatedTasks[taskIndex].completed;

    try {
      await roadmapAPI.updateRoadmap(roadmapId, { tasks: updatedTasks });
      fetchData();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleAssignmentToggle = async (roadmapId, assignmentIndex) => {
    const roadmap = roadmaps.find(r => r._id === roadmapId);
    const updatedAssignments = [...roadmap.assignments];
    updatedAssignments[assignmentIndex].completed = !updatedAssignments[assignmentIndex].completed;

    try {
      await roadmapAPI.updateRoadmap(roadmapId, { assignments: updatedAssignments });
      fetchData();
    } catch (error) {
      console.error('Error updating assignment:', error);
    }
  };

  const handleAskQuestion = async (roadmapId) => {
    if (!question.trim()) return;

    try {
      await roadmapAPI.addQuestion(roadmapId, question);
      setQuestion('');
      fetchData();
      alert('Question submitted successfully!');
    } catch (error) {
      console.error('Error asking question:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Student Dashboard</h1>
        <p>Welcome back, {user.name}!</p>
      </div>

      <div className="tabs">
        <button
          className={activeTab === 'roadmaps' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('roadmaps')}
        >
          My Roadmaps
        </button>
        <button
          className={activeTab === 'mentors' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('mentors')}
        >
          Find Mentors
        </button>
      </div>

      {activeTab === 'roadmaps' && (
        <div className="roadmaps-section">
          {roadmaps.length === 0 ? (
            <p className="empty-state">No roadmaps assigned yet. Connect with a mentor to get started!</p>
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
                    <p><strong>Mentor:</strong> {roadmap.mentor?.name}</p>
                    <p><strong>Deadline:</strong> {new Date(roadmap.deadline).toLocaleDateString()}</p>
                  </div>

                  {roadmap.score && (
                    <div className="score-section">
                      <p><strong>Score:</strong> {roadmap.score}/100</p>
                      {roadmap.feedback && <p><strong>Feedback:</strong> {roadmap.feedback}</p>}
                    </div>
                  )}

                  <div className="roadmap-details">
                    <h4>Tasks</h4>
                    {roadmap.tasks && roadmap.tasks.length > 0 ? (
                      <ul className="task-list">
                        {roadmap.tasks.map((task, idx) => (
                          <li key={idx}>
                            <label>
                              <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => handleTaskToggle(roadmap._id, idx)}
                              />
                              {task.title}
                            </label>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No tasks yet</p>
                    )}

                    {roadmap.videos && roadmap.videos.length > 0 && (
                      <>
                        <h4>Videos</h4>
                        <ul className="video-list">
                          {roadmap.videos.map((video, idx) => (
                            <li key={idx}>
                              <a href={video.url} target="_blank" rel="noopener noreferrer">
                                {video.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}

                    {roadmap.assignments && roadmap.assignments.length > 0 && (
                      <>
                        <h4>Assignments</h4>
                        <ul className="assignment-list">
                          {roadmap.assignments.map((assignment, idx) => (
                            <li key={idx}>
                              <label>
                                <input
                                  type="checkbox"
                                  checked={assignment.completed}
                                  onChange={() => handleAssignmentToggle(roadmap._id, idx)}
                                />
                                <strong>{assignment.title}</strong>
                              </label>
                              <p>{assignment.description}</p>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}

                    <h4>Questions & Answers</h4>
                    {roadmap.questions && roadmap.questions.length > 0 ? (
                      <div className="questions-list">
                        {roadmap.questions.map((q, idx) => (
                          <div key={idx} className="question-item">
                            <p><strong>Q:</strong> {q.question}</p>
                            {q.answer && <p><strong>A:</strong> {q.answer}</p>}
                            {!q.answer && <p className="pending">Waiting for mentor response...</p>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No questions yet</p>
                    )}

                    <div className="ask-question">
                      <input
                        type="text"
                        placeholder="Ask your mentor a question..."
                        value={selectedRoadmap === roadmap._id ? question : ''}
                        onChange={(e) => {
                          setQuestion(e.target.value);
                          setSelectedRoadmap(roadmap._id);
                        }}
                      />
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleAskQuestion(roadmap._id)}
                      >
                        Ask Question
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'mentors' && (
        <div className="mentors-section">
          <h2>Available Mentors</h2>
          <div className="mentors-grid">
            {mentors.map((mentor) => (
              <div key={mentor._id} className="mentor-card">
                <h3>{mentor.name}</h3>
                <p className="mentor-domain"><strong>Domain:</strong> {mentor.domain}</p>
                <p className="mentor-experience"><strong>Experience:</strong> {mentor.experience} years</p>
                <p className="mentor-bio">{mentor.bio}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
