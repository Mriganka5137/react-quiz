import { useEffect, useReducer } from "react";
import Header from "./Header";
import MainSection from "./MainSection";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";

const initialState = {
  questions: [],

  // "loading", "ready", "active", "finished", 'error"
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highestScore: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };

    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "active":
      return { ...state, status: "active" };

    case "newAnswer":
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          question.correctOption === action.payload
            ? state.points + question.points
            : state.points,
      };

    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      };

    case "finish":
      return {
        ...state,
        status: "finished",
        highestScore:
          state.points > state.highestScore ? state.points : state.highestScore,
      };

    case "restart":
      return {
        ...initialState,
        questions: state.questions,
        status: "ready",
      };

    default:
      throw new Error("Action unknown");
  }
}

function App() {
  // using useReducer to handle state
  const [{ questions, status, index, answer, points, highestScore }, dispatch] =
    useReducer(reducer, initialState);

  // fetching the data from the json server
  useEffect(function () {
    fetch("http://localhost:9000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  const numQuestions = questions.length;
  const totalPoints = questions.reduce((prev, curr) => prev + curr.points, 0);
  return (
    <div className="app">
      <Header />
      <MainSection>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              totalPoints={totalPoints}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <NextButton
              dispatch={dispatch}
              answer={answer}
              index={index}
              numQuestions={numQuestions}
            />
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            totalPoints={totalPoints}
            points={points}
            highestScore={highestScore}
            dispatch={dispatch}
          />
        )}
      </MainSection>
    </div>
  );
}

export default App;
