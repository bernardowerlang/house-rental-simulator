# House Rental Tax Simulator

**[English](#english) | [Português](#português)**

A comprehensive web application to simulate and compare the financial impact of renting out your house under different tax regimes (Individual vs Corporate) in Brazil.

---

## English

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

### 🚀 How to Use

#### Prerequisites
- Node.js (version 16 or higher)
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

3. Run the project:
```bash
npm run dev
```

4. Open your browser at `http://localhost:3000`

#### Using the Simulator

1. **📝 Input Data Tab**:
   - **Monthly Rent**: Gross monthly rental value
   - **Rental Period**: Duration in months
   - **Number of Invoices**: Total invoices to split revenue (for tax optimization)
   - **Alternative Housing Cost**: Total cost of your accommodation
   - **Monthly Property Costs**: IPTU, HOA, insurance, maintenance
   - **Monthly Deductions (PF only)**: Deductible expenses for individual tax

2. **📊 Comparison Tab**:
   - View detailed comparison between Individual and Corporate
   - See tax breakdowns, net income, and final profit
   - Analyze cost breakdowns with visual cards
   - Get personalized recommendations

### 📊 Understanding Results

#### **🆕 2025 Tax Updates**
This simulator uses the **latest 2025 Brazilian tax tables**:

**IRPF (Income Tax) - Effective May 2025:**
- Tax-free: Up to R$ 2,428.80
- 7.5%: R$ 2,428.81 to R$ 2,826.65
- 15%: R$ 2,826.66 to R$ 3,751.05  
- 22.5%: R$ 3,751.06 to R$ 4,664.68
- 27.5%: Above R$ 4,664.68

**INSS (Social Security) - 2025 Progressive Brackets:**
- 7.5%: Up to R$ 1,518.00
- 9%: R$ 1,518.01 to R$ 2,793.88
- 12%: R$ 2,793.89 to R$ 4,190.83
- 14%: R$ 4,190.84 to R$ 8,157.41 (ceiling)

#### **Individual Person (PF)**
- **Tax Base**: Monthly rent minus deductions
- **Tax Calculation**: Progressive table (Carnê-Leão)
- **Final Profit**: Net income minus total costs

#### **Corporate (PJ)**  
- **Simples Nacional**: 6% on gross revenue
- **Pro-labore**: 28% of revenue subject to INSS + IRPF
- **Tax Optimization**: Multiple invoices reduce individual pro-labore amounts
- **Final Profit**: Net income after all taxes minus total costs

#### **Key Indicators**
- 🟢 **Positive Final Profit**: Profitable operation
- � **Negative Final Profit**: Loss, review parameters
- � **Best Option**: Highest final profit between PF and PJ

### 🛠️ Technologies Used

- **React 18** with TypeScript
- **Tailwind CSS** for modern styling
- **Vite** for fast development
- **Lucide React** for beautiful icons
- **Custom i18n** implementation

### 🤝 Contributions

Contributions are welcome! Feel free to:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 👨‍💻 Author

Developed by Bernardo Werlang

---

**⚠️ Important Disclaimer**: This application is a simulation tool based on **2025 Brazilian tax legislation** (IRPF and INSS progressive tables). For important financial and tax decisions, always consult a qualified accountant or tax advisor.

---

## Português

### 🏠 Sobre o Projeto

Este simulador tributário avançado ajuda proprietários a decidir a forma mais lucrativa de alugar seu imóvel, comparando os regimes de Pessoa Física (Carnê-Leão progressivo) vs Pessoa Jurídica (Simples Nacional + Pró-labore). A aplicação realiza cálculos detalhados incluindo todos os impostos, custos e fornece recomendações estratégicas.

### ✨ Principais Funcionalidades

#### 📊 **Comparação de Regimes Tributários**
- **Pessoa Física (PF)**: Cálculo do Carnê-Leão progressivo com deduções mensais
- **Pessoa Jurídica (PJ)**: Simples Nacional 6% + impostos do pró-labore (INSS + IRPF)
- Comparação em tempo real com recomendação da melhor opção

#### 💰 **Cálculos Tributários Avançados**
- **Estratégia de Pró-labore**: 28% do faturamento com divisão otimizada de notas fiscais
- **Múltiplas Notas Fiscais**: Divida a receita em várias notas para reduzir impostos do pró-labore
- **Tabelas Progressivas**: **Faixas de IR brasileiras atualizadas para 2025 (IRPF vigente desde maio/2025)**
- **INSS**: **Faixas progressivas 2025 (7,5% a 14%) com teto de R$ 8.157,41**
- **IRPF**: Cálculo progressivo sobre pró-labore líquido usando tabelas 2025

#### 📈 **Análise Abrangente de Custos**
- **Breakdown Detalhado**: Visualização detalhada de todos os custos
- **Moradia Alternativa**: Custos totais de hospedagem durante o período
- **Custos Fixos do Imóvel**: IPTU, condomínio, seguro, manutenção
- **Mensal vs Total**: Distinção clara entre valores mensais e do período

#### 🎯 **Recursos Inteligentes**
- **Detecção da Melhor Opção**: Recomendação automática baseada no lucro final
- **Cálculos em Tempo Real**: Atualizações instantâneas conforme você digita
- **Interface Bilíngue**: Suporte completo português/inglês
- **Design Responsivo**: Funciona perfeitamente em desktop e mobile
- **Dados de Exemplo**: Carregue cenários de amostra para entender a ferramenta

### 🚀 Como Usar

#### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

#### Instalação
1. Clone o repositório:
```bash
git clone https://github.com/your-username/house-rental-simulator.git
cd house-rental-simulator
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o projeto:
```bash
npm run dev
```

4. Abra o navegador em `http://localhost:3000`

#### Usando o Simulador

1. **📝 Aba Dados de Entrada**:
   - **Aluguel Mensal**: Valor bruto mensal do aluguel
   - **Período de Aluguel**: Duração em meses
   - **Número de Notas Fiscais**: Total de notas para dividir a receita (otimização tributária)
   - **Custo Moradia Alternativa**: Custo total da sua hospedagem
   - **Custos Mensais do Imóvel**: IPTU, condomínio, seguro, manutenção
   - **Deduções Mensais (só PF)**: Despesas dedutíveis para pessoa física

2. **📊 Aba Comparativo**:
   - Visualize comparação detalhada entre Pessoa Física e Jurídica
   - Veja breakdown dos impostos, receita líquida e lucro final
   - Analise breakdown de custos com cards visuais
   - Obtenha recomendações personalizadas

### 📊 Entendendo os Resultados

#### **🆕 Atualizações Tributárias 2025**
Este simulador utiliza as **mais recentes tabelas tributárias brasileiras de 2025**:

**IRPF (Imposto de Renda) - Vigente desde maio/2025:**
- Isento: Até R$ 2.428,80
- 7,5%: R$ 2.428,81 a R$ 2.826,65
- 15%: R$ 2.826,66 a R$ 3.751,05
- 22,5%: R$ 3.751,06 a R$ 4.664,68
- 27,5%: Acima de R$ 4.664,68

**INSS (Previdência Social) - Faixas Progressivas 2025:**
- 7,5%: Até R$ 1.518,00
- 9%: R$ 1.518,01 a R$ 2.793,88
- 12%: R$ 2.793,89 a R$ 4.190,83
- 14%: R$ 4.190,84 a R$ 8.157,41 (teto)

#### **Pessoa Física (PF)**
- **Base de Cálculo**: Aluguel mensal menos deduções
- **Cálculo do Imposto**: Tabela progressiva (Carnê-Leão)
- **Lucro Final**: Receita líquida menos custos totais

#### **Pessoa Jurídica (PJ)**
- **Simples Nacional**: 6% sobre receita bruta
- **Pró-labore**: 28% da receita sujeita a INSS + IRPF
- **Otimização Tributária**: Múltiplas notas reduzem valores individuais do pró-labore
- **Lucro Final**: Receita líquida após todos os impostos menos custos totais

#### **Indicadores Principais**
- 🟢 **Lucro Final Positivo**: Operação lucrativa
- 🔴 **Lucro Final Negativo**: Prejuízo, revise parâmetros
- 👑 **Melhor Opção**: Maior lucro final entre PF e PJ

### 🛠️ Tecnologias Utilizadas

- **React 18** com TypeScript
- **Tailwind CSS** para estilização moderna
- **Vite** para desenvolvimento rápido
- **Lucide React** para ícones bonitos
- **Implementação i18n** personalizada

### 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Fazer commit das mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Fazer push para a branch (`git push origin feature/MinhaFeature`)
5. Abrir um Pull Request

### � Estrutura do Projeto

```
src/
├── components/          # Componentes React reutilizáveis
├── hooks/              # Hooks customizados (cálculos e i18n)
├── i18n/               # Sistema de internacionalização
├── types/              # Tipos TypeScript
├── utils/              # Funções utilitárias
├── constants/          # Constantes e tabelas tributárias
└── App.tsx             # Componente principal
```

### �👨‍💻 Autor

Desenvolvido por Bernardo Werlang

---

**⚠️ Aviso Importante**: Esta aplicação é uma ferramenta de simulação baseada na **legislação tributária brasileira de 2025** (tabelas progressivas de IRPF e INSS). Para decisões financeiras e tributárias importantes, consulte sempre um contador ou consultor tributário qualificado.
