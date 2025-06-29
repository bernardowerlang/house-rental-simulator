# House Rental Tax Simulator

A comprehensive web application to simulate and compare the financial impact of renting out your house under different tax regimes (Individual vs Corporate) in Brazil.

## 📖 Usage Guides

- **📖 [Complete Usage Guide (English)](./docs/USAGE-EN.md)**
- **📋 [Guia Completo de Uso (Português)](./docs/USAGE-PT.md)**

---

### 🏠 About the Project

This advanced tax simulator helps homeowners decide the most profitable way to rent out their property by comparing Individual Person (Carnê-Leão progressive tax) vs Corporate (Simples Nacional + Pro-labore) tax regimes. The application performs detailed calculations including all taxes, costs, and provides strategic recommendations.

### ✨ Key Features

#### 📊 **Tax Regime Comparison**
- **Individual Person (PF)**: Carnê-Leão progressive tax calculation with monthly deductions
- **Corporate (PJ)**: Simples Nacional 6% + Pro-labore taxes (INSS + IRPF)
- Real-time comparison with best option recommendation

#### 💰 **Advanced Tax Calculations**
- **Pro-labore Strategy**: 28% of revenue with optimized invoice splitting
- **Multiple Invoices**: Split revenue across multiple invoices to reduce pro-labore taxes
- **Progressive Tax Tables**: **Updated 2025 Brazilian tax brackets (IRPF effective May 2025)**
- **Social Security (INSS)**: **Progressive 2025 brackets (7.5% to 14%) with R$ 8,157.41 ceiling**
- **Income Tax (IRPF)**: Progressive calculation on net pro-labore using 2025 tables

#### 📈 **Comprehensive Cost Analysis**
- **Detailed Cost Breakdown**: Visual breakdown of all costs
- **Alternative Housing**: Total accommodation costs during rental period
- **Property Fixed Costs**: IPTU, HOA, insurance, maintenance
- **Monthly vs Total**: Clear distinction between monthly and period totals

#### 🎯 **Smart Features**
- **Best Option Detection**: Automatic recommendation based on final profit
- **Real-time Calculations**: Instant updates as you type
- **Bilingual Interface**: Complete Portuguese/English support
- **Responsive Design**: Works perfectly on desktop and mobile
- **Example Data**: Load sample scenarios to understand the tool

### 🚀 Installation & Setup

#### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn

#### Installation
1. Clone the repository:
```bash
git clone https://github.com/your-username/house-rental-simulator.git
cd house-rental-simulator
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser at `http://localhost:5173`

#### Build for Production
```bash
npm run build
```

#### Preview Production Build
```bash
npm run preview
```

### 📖 Documentation

For detailed instructions on how to use the simulator:
- **📖 [Complete Usage Guide (English)](./docs/USAGE-EN.md)**
- **📋 [Guia Completo de Uso (Português)](./docs/USAGE-PT.md)**

### 🛠️ Technologies Used

- **React 18** with TypeScript
- **Tailwind CSS** for modern styling
- **Vite** for fast development and building
- **Lucide React** for beautiful icons
- **Custom i18n** implementation for bilingual support

### 📁 Project Structure

```
├── docs/                    # Documentation
│   ├── USAGE-EN.md         # Usage guide (English)
│   └── USAGE-PT.md         # Usage guide (Portuguese)
├── src/
│   ├── components/          # Reusable React components
│   │   ├── InputForm.tsx   # Data input form
│   │   └── ComparisonPanel.tsx # Results comparison
│   ├── hooks/              # Custom hooks
│   │   ├── useCalculations.ts  # Tax calculation logic
│   │   └── useTranslation.ts   # i18n hook
│   ├── i18n/               # Internationalization
│   │   ├── en/             # English translations
│   │   ├── pt/             # Portuguese translations
│   │   ├── index.ts        # i18n configuration
│   │   └── types.ts        # Translation types
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts        # Main types
│   ├── utils/              # Utility functions
│   │   └── calculations.ts # Tax calculation utilities
│   ├── constants/          # Constants and tax tables
│   │   └── taxTables.ts    # 2025 Brazilian tax tables
│   └── App.tsx             # Main application component
├── README.md               # This file
└── package.json            # Project dependencies
```

### 🤝 Contributing

Contributions are welcome! Please feel free to:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 📝 Development Guidelines

- Follow TypeScript best practices
- Use functional components with hooks
- Maintain responsive design principles
- Write clear, descriptive commit messages
- Update documentation when adding features

### 👨‍💻 Author

Developed by Bernardo Werlang

### 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**⚠️ Important Disclaimer**: This application is a simulation tool based on **2025 Brazilian tax legislation** (IRPF and INSS progressive tables). For important financial and tax decisions, always consult a qualified accountant or tax advisor.
