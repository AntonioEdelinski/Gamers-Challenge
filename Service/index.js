import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const users = [];
const quizQuestions = [
  {
    question: "What is the capital of Skyrim?",
    options: ["Whiterun", "Riften", "Solitude", "Windhelm"],
    correctAnswer: "Solitude",
  },
];

app.post("/register", (req, res) => {
  const { username, password, email } = req.body;

  if (users.some((user) => user.username === username || user.email === email)) {
    return res.status(400).json({ error: "Username or email already taken" });
  }

  const newUser = {
    id: users.length + 1,
    username,
    password, 
    email,
    profile: {
      bio: "",
      avatar: "",
    },
  };

  users.push(newUser);

  res.status(201).json({ id: newUser.id, username: newUser.username });
});

app.get("/profile/:username", (req, res) => {
  const { username } = req.params;

  const user = users.find((u) => u.username === username);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({ username: user.username, profile: user.profile });
});

app.get("/quiz/questions", (req, res) => {
  res.json({ questions: quizQuestions });
});

app.post("/quiz/submit", (req, res) => {
  const userAnswers = req.body.answers;

  const score = calculateScore(userAnswers);

  res.json({ score });
});

app.get("/leaderboard", (req, res) => {
  const leaderboard = [
    { username: "Player1", score: 80 },
    { username: "Player2", score: 75 },
  ];

  res.json({ leaderboard });
});

function calculateScore(userAnswers) {
  const correctAnswers = quizQuestions.filter((q, index) => {
    return q.correctAnswer === userAnswers[index];
  });

  return correctAnswers.length;
}

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
