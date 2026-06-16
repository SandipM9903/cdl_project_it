import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import UserHeaderNav from "./UserHeaderNav";

const QuizPage = () => {
  const [quizList, setQuizList] = useState([]);
  const [selectedTechnology, setSelectedTechnology] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState("");
  const [quizQuest, setQuizQuest] = useState([]);
  const [totalMarks, setTotalMarks] = useState(0);
  const [result, setResult] = useState(null);

  const location = useLocation();
  const usernameOrEmail = location.state?.usernameOrEmail;

  useEffect(() => {
    fetchQuizList();
  }, []);

  useEffect(() => {
    if (selectedQuiz) {
      fetchQuizQuest(selectedQuiz);
    }
  }, [selectedQuiz]);

  useEffect(() => {
    console.log("Selected Marks Ussefeffect:", totalMarks);
  }, [totalMarks]);

  const fetchQuizList = async () => {
    try {
      const response = await axios.get("http://localhost:8082/api/quizzes");
      setQuizList(response.data);
    } catch (error) {
      setError("Failed to fetch quiz list");
    }
  };

  const fetchQuizQuest = async (quizId) => {
    try {
      const response = await axios.get(
        `http://localhost:8082/api/quizzes/getQuizQuestById/${quizId}`
      );
      setQuizQuest(response.data);
      setSelectedOptions([]);
    } catch (error) {
      setError("Failed to fetch quiz questions");
    }
  };

  const handleTechnologyChange = (e) => {
    setSelectedTechnology(e.target.value);
    setSelectedQuiz("");
    setQuizQuest([]);
  };

  const handleQuizChange = (e) => {
    setSelectedQuiz(e.target.value);
  };

  const handleOptionChange = (questionId, optionNumber) => {
    setSelectedOptions((prevSelectedOptions) => {
      const updatedOptions = [...prevSelectedOptions];
      const questionIndex = updatedOptions.findIndex(
        (option) => option.questionId === questionId
      );

      if (questionIndex !== -1) {
        updatedOptions[questionIndex] = { questionId, optionNumber };
      } else {
        updatedOptions.push({ questionId, optionNumber });
      }

      return updatedOptions;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      let marks = 0;
  
      for (const userAnswer of selectedOptions) {
        const { questionId, optionNumber } = userAnswer;
  
        const userAnswers = {
          userId: 1, // Replace with the actual user ID
          questionId: questionId,
          selectedOption: optionNumber,
        };
  
        const response = await axios.post(
          "http://localhost:8082/api/user-answers",
          userAnswers
        );
  
        const selectedQuestion = quizQuest.find(
          (question) => question.id === questionId
        );
  
        if (selectedQuestion.correctOption === optionNumber) {
          marks += 1;
        }
      }
  
      setTotalMarks(marks);
  
      if (selectedQuiz) {
        const quizName = quizList.find((quiz) => quiz.id === selectedQuiz)?.quizName;
        const totalQuestions = quizQuest.length;
        const correctAnswers = marks;
        const wrongAnswers = totalQuestions - correctAnswers;
  
        setResult({ quizName, totalQuestions, correctAnswers, wrongAnswers });
      } else {
        setError("Failed to submit quiz: No quiz selected");
      }
    } catch (error) {
      setError("Failed to submit quiz: " + error.message);
    }
  };
  

  if (error) {
    return <div>{error}</div>;
  }

  const distinctTechnologies = [
    ...new Set(quizList.map((quiz) => quiz.technology)),
  ];

  return (
    <div>
      <UserHeaderNav usernameOrEmail={usernameOrEmail} />
      <div className="container">
        <h2 className="mt-3">Quiz</h2>
        {result ? (
          <div className="card mt-3">
            <div className="card-header">
              <h5>Quiz Result</h5>
              
            </div>
            <div className="card-body">
              <p>Quiz Name: {result.quizName}</p>
              <p>Total Questions: {result.totalQuestions}</p>
              <p>Correct Answers: {result.correctAnswers}</p>
              <p>Wrong Answers: {result.wrongAnswers}</p>
            </div>
          </div>
        ) : (
          <form className="mt-3">
            <div className="mb-3">
              <label className="form-label">Select Technology:</label>
              <select
                className="form-select"
                value={selectedTechnology}
                onChange={handleTechnologyChange}
              >
                <option value="">Select</option>
                {distinctTechnologies.map((technology) => (
                  <option key={technology} value={technology}>
                    {technology}
                  </option>
                ))}
              </select>
            </div>
            {selectedTechnology && (
              <div className="mb-3">
                <label className="form-label">Select Quiz:</label>
                <select
                  className="form-select"
                  value={selectedQuiz}
                  onChange={handleQuizChange}
                >
                  <option value="">Select</option>
                  {quizList
                    .filter((quiz) => quiz.technology === selectedTechnology)
                    .map((quiz) => (
                      <option key={quiz.id} value={quiz.id}>
                        {quiz.quizName}
                      </option>
                    ))}
                </select>
              </div>
            )}
            {selectedQuiz && quizQuest.length > 0 && (
              <div>
                <h4>Quiz Questions:</h4>
                {quizQuest.map((question) => (
                  <div key={question.id} className="mb-3">
                    <h4>{question.questionText}</h4>
                    <ul className="list-group">
                      <li className="list-group-item">
                        <label className="form-check-label">
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={1}
                            checked={
                              selectedOptions.find(
                                (selectedOption) =>
                                  selectedOption.questionId === question.id &&
                                  selectedOption.optionNumber === 1
                              ) !== undefined
                            }
                            onChange={() => handleOptionChange(question.id, 1)}
                            className="form-check-input"
                          />
                          {question.option1}
                        </label>
                      </li>
                      <li className="list-group-item">
                        <label className="form-check-label">
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={2}
                            checked={
                              selectedOptions.find(
                                (selectedOption) =>
                                  selectedOption.questionId === question.id &&
                                  selectedOption.optionNumber === 2
                              ) !== undefined
                            }
                            onChange={() => handleOptionChange(question.id, 2)}
                            className="form-check-input"
                          />
                          {question.option2}
                        </label>
                      </li>
                      <li className="list-group-item">
                        <label className="form-check-label">
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={3}
                            checked={
                              selectedOptions.find(
                                (selectedOption) =>
                                  selectedOption.questionId === question.id &&
                                  selectedOption.optionNumber === 3
                              ) !== undefined
                            }
                            onChange={() => handleOptionChange(question.id, 3)}
                            className="form-check-input"
                          />
                          {question.option3}
                        </label>
                      </li>
                      <li className="list-group-item">
                        <label className="form-check-label">
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={4}
                            checked={
                              selectedOptions.find(
                                (selectedOption) =>
                                  selectedOption.questionId === question.id &&
                                  selectedOption.optionNumber === 4
                              ) !== undefined
                            }
                            onChange={() => handleOptionChange(question.id, 4)}
                            className="form-check-input"
                          />
                          {question.option4}
                        </label>
                      </li>
                    </ul>
                  </div>
                ))}
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
