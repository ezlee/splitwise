# Splitwise Clone

A modern bill-splitting application built with React, TypeScript, and TailwindCSS.

## Features

- ✅ **Expense Management**: Add, view, and delete expenses
- ✅ **Smart Splitting**: Split expenses equally among multiple people
- ✅ **Balance Tracking**: Real-time balance calculations for all users
- ✅ **Categories**: Organize expenses by category (food, transport, entertainment, etc.)
- ✅ **Modern UI**: Clean, responsive design with TailwindCSS
- ✅ **TypeScript**: Full type safety throughout the application

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: TailwindCSS with custom components
- **Icons**: Lucide React
- **Build Tool**: Vite
- **State Management**: React hooks (useState, useEffect)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd splitwise
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Adding Expenses

1. Click the "Add Expense" button in the top right
2. Fill in the expense details:
   - Description
   - Amount
   - Date
   - Category
   - Who paid
   - Who to split between
3. Click "Add Expense" to save

### Viewing Balances

1. Click on the "Balance" tab
2. See your personal balance (what you owe/are owed)
3. View group summary and individual balances

### Managing Expenses

1. Click on the "Expenses" tab
2. View all recent expenses with details
3. Delete expenses using the trash icon
4. Edit expenses (currently logged to console)

## Project Structure

```
src/
├── components/
│   ├── ExpenseForm.tsx      # Form for adding new expenses
│   ├── ExpenseList.tsx      # List of all expenses
│   └── BalanceSummary.tsx   # Balance overview component
├── types.ts                 # TypeScript type definitions
├── utils.ts                 # Utility functions for calculations
├── App.tsx                  # Main application component
├── main.tsx                 # Application entry point
└── index.css                # Global styles and TailwindCSS
```

## Key Features Explained

### Balance Calculation

The app automatically calculates balances using a simple algorithm:
- Each person starts with a balance of 0
- When someone pays for an expense, their balance increases by the full amount
- Each person included in the split has their balance decreased by their share
- Positive balance = you are owed money
- Negative balance = you owe money

### Expense Splitting

Currently supports equal splitting among selected users. The amount is divided equally among all selected participants.

### Categories

Expenses can be categorized for better organization:
- General
- Food & Dining
- Transportation
- Entertainment
- Utilities
- Shopping
- Healthcare
- Other

## Future Enhancements

- [ ] User authentication and profiles
- [ ] Group management
- [ ] Unequal splitting (by percentage or custom amounts)
- [ ] Expense receipts and attachments
- [ ] Settlement tracking
- [ ] Notifications and reminders
- [ ] Data persistence with backend
- [ ] Mobile app
- [ ] Export functionality
- [ ] Advanced reporting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Built as a learning project to understand React and TypeScript
- UI inspired by Splitwise's clean design
- Icons provided by Lucide React
