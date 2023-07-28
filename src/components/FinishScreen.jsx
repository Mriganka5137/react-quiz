function FinishScreen({ totalPoints, points, highestScore, dispatch }) {
  const percentage = Math.ceil((points / totalPoints) * 100);
  let emoji;
  if (percentage === 100) emoji = "🎊";
  if (percentage >= 80 && percentage < 100) emoji = "👉👈";
  if (percentage >= 50 && percentage < 80) emoji = "🙇‍♂️";
  if (percentage >= 30 && percentage < 50) emoji = "🫥";
  if (percentage > 10 && percentage < 30) emoji = "🥵";
  if (percentage === 0) emoji = "🤮🫣";
  return (
    <>
      <p className="result">
        <span>{emoji}</span> You scored {points} out of {totalPoints} points (
        {percentage}%)
      </p>
      <p className="highscore">Highest Score ({highestScore} Points)</p>

      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "restart" })}
      >
        Restart
      </button>
    </>
  );
}

export default FinishScreen;
