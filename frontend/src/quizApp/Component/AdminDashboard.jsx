import React, { useState } from "react";
import Question from "../Quiz/Question";


const AdminDashboard = ({ questions, onEdit, onRemove }) => {
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);

  const handleEdit = (question) => {
    onEdit(question);
    setEditingQuestion(null);
  };

  const handleRemove = (index) => {
    onRemove(index);
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Admin</h1>
      {questions.map((question, index) => (
        <div key={index} className="mb-4">
          {editingQuestion === index ? (
            <Question
              question={question}
              onEdit={handleEdit}
              onCancel={() => setEditingQuestion(null)}
            />
          ) : (
            <div>
              <h2 className="text-2xl font-bold mb-2">{question.text}</h2>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                onClick={() => setEditingQuestion(index)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleRemove(index)}
              >
                Remove
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};



export default AdminDashboard;
