# SmartTax - AI-Powered Tax Filing Assistant

A full-stack tax preparation platform that enables users to calculate federal/state taxes, estimate refunds, and auto-generate IRS forms.

![SmartTax Screenshot](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)

## Features

- **Step-by-Step Tax Wizard**: TurboTax-inspired guided interview flow
- **Federal Tax Calculations**: 2024 tax brackets for all filing statuses
- **State Tax Support**: California, New York, Texas, Florida, Washington
- **Income Sources**: W-2, 1099, interest, dividends, capital gains, business, rental
- **Deductions**: Standard and itemized (SALT, mortgage, charitable, medical)
- **Tax Credits**: Child Tax Credit, education, energy, foreign tax credits
- **Form Generation**: Auto-generate Form 1040 and supporting schedules
- **Real-time Calculations**: See refund/tax owed as you enter data
- **Responsive Design**: Works on desktop and mobile

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand with persistence
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/smarttax.git

# Navigate to project folder
cd smarttax

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/ui/        # shadcn/ui components (40+)
├── hooks/
│   └── useTaxStore.ts    # Global state with Zustand
├── lib/
│   └── taxEngine.ts      # Tax calculation engine
│       ├── Federal tax brackets (2024)
│       ├── State tax brackets
│       ├── FICA calculations
│       └── Credit calculations
├── sections/
│   ├── steps/            # Wizard steps
│   │   ├── WelcomeStep.tsx
│   │   ├── PersonalInfoStep.tsx
│   │   ├── FilingStatusStep.tsx
│   │   ├── DependentsStep.tsx
│   │   ├── IncomeW2Step.tsx
│   │   ├── IncomeOtherStep.tsx
│   │   ├── DeductionsStep.tsx
│   │   ├── CreditsStep.tsx
│   │   ├── ReviewStep.tsx
│   │   └── ResultsStep.tsx
│   ├── WizardContainer.tsx
│   └── WizardProgress.tsx
├── types/
│   └── index.ts          # TypeScript interfaces
├── App.tsx
└── main.tsx
```

## Tax Calculations

### Federal Tax Brackets (2024)

| Filing Status | 10% | 12% | 22% | 24% | 32% | 35% | 37% |
|--------------|-----|-----|-----|-----|-----|-----|-----|
| Single | $0-$11,600 | $11,601-$47,150 | $47,151-$100,525 | $100,526-$191,950 | $191,951-$243,725 | $243,726-$609,350 | $609,351+ |
| Married Filing Jointly | $0-$23,200 | $23,201-$94,300 | $94,301-$201,050 | $201,051-$383,900 | $383,901-$487,450 | $487,451-$731,200 | $731,201+ |

### Standard Deductions (2024)

- Single: $14,600
- Married Filing Jointly: $29,200
- Married Filing Separately: $14,600
- Head of Household: $21,900

## Key Components

### Tax Engine (`lib/taxEngine.ts`)

The core calculation engine handles:
- Progressive tax bracket calculations
- State-specific tax rules
- FICA (Social Security + Medicare) taxes
- Tax credit calculations with phaseouts
- AGI and taxable income computations

### State Management (`hooks/useTaxStore.ts`)

Zustand store manages:
- Personal information
- Income data (W-2s, 1099s, other sources)
- Deductions (standard vs itemized)
- Tax credits
- Calculation results
- Wizard progress

## Screenshots

### Welcome Screen
Guided onboarding with required documents checklist

### Income Entry
W-2 form input with all boxes (1-19)

### Deduction Comparison
Side-by-side standard vs itemized deduction comparison

### Tax Results
Refund/amount owed with detailed breakdown and tax bracket visualization

## Disclaimer

This is a demonstration project for educational purposes. Tax calculations are estimates based on 2024 IRS guidelines. Always consult a qualified tax professional for official tax advice.

## License

MIT License - feel free to use this project for learning and portfolio purposes.

## Author

**Gowtham Boddu**
- B.Tech in Electronics and Communication Engineering
- AWS Certified Cloud Practitioner
- Salesforce Certified AI Associate

---

Built with React, TypeScript, and Tailwind CSS
