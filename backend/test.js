import express from 'express';
const app = express();

// Sample user data with hierarchical structure
const users = [
  { id: 1, name: 'User 1', parentId: null },
  { id: 2, name: 'User 2', parentId: 1 },
  { id: 3, name: 'User 3', parentId: 1 },
  { id: 4, name: 'User 5', parentId: 2 },
  { id: 5, name: 'User 6', parentId: 3 },
  { id: 6, name: 'User 7', parentId: 3 },
  { id: 7, name: 'User 8', parentId: 4 },
  { id: 8, name: 'User 9', parentId: 5 },
  { id: 9, name: 'User 10', parentId: 6 },
  // Add more users and their parent relationships here
];

// Calculate commission using recursion
function calculateCommission(userId, amount, level) {
  if (level === 0) return 0;
  const commissionRate = getCommissionRate(level);
  const parent = users.find(user => user.id === userId);
  if (!parent) return 0;
  const commission = (commissionRate / 100) * amount;
  return commission + calculateCommission(parent.parentId, amount, level - 1);
}

function getCommissionRate(level) {
  const commissionRates = [25, 18, 14, 10, 7, 4, 2, 1];
  if (level <= commissionRates.length) {
    return commissionRates[level - 1];
  }
  return 0;
}

// Calculate commission for a user at a specific level
app.get('/calculate-commission/:userId/:amount/:level', (req, res) => {
  const userId = parseInt(req.params.userId);
  const amount = parseFloat(req.params.amount);
  const level = parseInt(req.params.level);

  const commission = calculateCommission(userId, amount, level);
  res.json({ userId, amount, level, commission });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
