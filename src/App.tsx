import React, { useState } from "react";
// Components
import QuestionCard from "./components/QuestionCard";
import { fetchQuizQuestions } from "./components/Api";
//Types
import { QuestionState, Difficulty } from "./components/Api";
//Styles
import { GlobalStyle, Wrapper } from "./styles/App.styles";

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
};
const TOTAL_QUESTIONS = 10;
function App() {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);

    try {
      const newQuestions = await fetchQuizQuestions(
        TOTAL_QUESTIONS,
        Difficulty.EASY
      );
      setQuestions(newQuestions);
      setScore(0);
      setUserAnswers([]);
      setNumber(0);
      setLoading(false);
    } catch (err) {
      window.alert(err);
    }
  };
  const checkAnswer = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      //grab user answers
      const answer = e.currentTarget.value;
      //check answer against correct_answer
      const correct = questions[number].correct_answer === answer;
      //update scores if answer is correct
      if (correct) {
        setScore((prev) => prev + 1);
      }
      //save answer in the array of user answers
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswers((prev) => [...prev, answerObject]);
    }
  };
  /**
   * @dev displayNextQuestion - function to display next
   * question if not the last question
   */
  const displayNextQuestion = async () => {
    const nextQuestion = number + 1;
    if (nextQuestion === TOTAL_QUESTIONS) {
      setGameOver(true);
    } else {
      setNumber(nextQuestion);
    }
  };
  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <h1>React Quiz</h1>
        {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
          <button className="start" onClick={startTrivia}>
            Start
          </button>
        ) : null}

        {!gameOver ? <p className="score">Score:{score}</p> : null}
        {loading ? <p>Loading Questions</p> : null}
        {!gameOver && !loading && (
          <QuestionCard
            questionNumber={number + 1}
            totalQuestions={TOTAL_QUESTIONS}
            question={questions[number].question}
            answers={questions[number].answers}
            userAnswer={userAnswers ? userAnswers[number] : undefined}
            callback={checkAnswer}
          />
        )}
        {!gameOver &&
        !loading &&
        userAnswers.length === number + 1 &&
        number !== TOTAL_QUESTIONS - 1 ? (
          <button className="next" onClick={displayNextQuestion}>
            Next Question
          </button>
        ) : null}
      </Wrapper>
    </>
  );
}

export default App;
