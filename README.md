# House Rental Simulator

**[English](#english) | [Português](#português)**

A modern web application to simulate the financial impact of renting out your own house while temporarily staying elsewhere.

---

## English

### 🏠 About the Project

This simulator was developed to help people who want to rent out their house and need to stay in another location temporarily. The application calculates all costs involved and shows whether the operation will be profitable or not.

### ✨ Features

- **Revenue Calculation**: Monthly rent value multiplied by period
- **Expense Calculation**:
  - Taxes (Individual and Corporate regimes)
  - Real estate agency fees
  - Alternative housing costs
  - Utility differences (electricity, water)
  - Internet differences
  - Maintenance and repairs
  - House insurance
  - Other expenses
- **Tax Regime Comparison**: Individual (Carnê-Leão) vs Corporate (Simples Nacional)
- **ROI Analysis**: Return on investment calculation
- **Smart Alerts**: Tips based on results
- **Multi-language Support**: Portuguese and English
- **Responsive Interface**: Works on desktop and mobile

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

4. Open your browser at `http://localhost:5173`

#### How to Fill in the Data

1. **Basic Data**:
   - Monthly rent value you plan to charge
   - Period in months you plan to rent

2. **Alternative Housing Costs**:
   - How much you'll spend per month to stay elsewhere

3. **Utilities**:
   - Compare electricity/water costs of your house vs. alternative location
   - Compare internet costs

4. **Fees and Other Costs**:
   - Income Tax (Individual or Corporate regime)
   - Real estate agency fee (default 8%)
   - Monthly maintenance costs
   - House insurance
   - Other expenses

### 📊 Interpreting Results

- **Total Revenue**: Gross amount you'll receive
- **Total Expenses**: Sum of all costs
- **Net Profit**: Revenue - Expenses
- **ROI**: Return percentage on rent value

#### Indicators:

- 🟢 **ROI > 10%**: Good deal
- 🟡 **ROI 0-10%**: Low ROI, evaluate if it's worth it
- 🔴 **ROI < 0%**: Loss, review values

### 🛠️ Technologies Used

- **React 18**: Main framework
- **TypeScript**: Static typing
- **Tailwind CSS**: Styling
- **Vite**: Bundler and dev server
- **Lucide React**: Icons

### 📈 Future Features

- [ ] Monthly evolution charts
- [ ] PDF report export
- [ ] Scenario comparison
- [ ] Simulation history
- [ ] More detailed tax calculator
- [ ] Integration with real estate price APIs

### 🤝 Contributions

Contributions are welcome! Feel free to:

1. Fork the project
2. Create a branch for your feature
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

### 📝 License

This project is under the MIT license. See the LICENSE file for more details.

### 👨‍💻 Author

Developed by Bernardo Werlang

---

**Important**: This application is just a simulation tool. For important financial decisions, always consult an accountant or financial advisor.

---

## Português

### 🏠 Sobre o Projeto

Este simulador foi desenvolvido para ajudar pessoas que querem alugar sua casa e precisam se hospedar em outro local temporariamente. A aplicação calcula todos os custos envolvidos e mostra se a operação será lucrativa ou não.

### ✨ Funcionalidades

- **Cálculo de Receita**: Valor do aluguel mensal multiplicado pelo período
- **Cálculo de Despesas**:
  - Impostos (regimes Individual e Empresarial)
  - Taxa da imobiliária
  - Custos de moradia alternativa
  - Diferenças de utilidades (luz, água)
  - Diferenças de internet
  - Manutenção e reparos
  - Seguro da casa
  - Outras despesas
- **Comparação de Regimes Tributários**: Individual (Carnê-Leão) vs Empresarial (Simples Nacional)
- **Análise de ROI**: Retorno sobre investimento
- **Alertas Inteligentes**: Dicas baseadas nos resultados
- **Suporte Multi-idioma**: Português e inglês
- **Interface Responsiva**: Funciona em desktop e mobile

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

4. Abra o navegador em `http://localhost:5173`

#### Como Preencher os Dados

1. **Dados Básicos**:
   - Valor do aluguel mensal que você pretende cobrar
   - Período em meses que pretende alugar

2. **Custos de Moradia Alternativa**:
   - Quanto você gastará por mês para se hospedar em outro lugar

3. **Utilidades**:
   - Compare os custos de luz/água da sua casa vs. local alternativo
   - Compare os custos de internet

4. **Taxas e Outros Custos**:
   - Imposto de Renda (regime Individual ou Empresarial)
   - Taxa da imobiliária (padrão 8%)
   - Custos mensais de manutenção
   - Seguro da casa
   - Outras despesas

### 📊 Interpretando os Resultados

- **Receita Total**: Valor bruto que você receberá
- **Despesas Totais**: Soma de todos os custos
- **Lucro Líquido**: Receita - Despesas
- **ROI**: Percentual de retorno sobre o valor do aluguel

#### Indicadores:

- 🟢 **ROI > 10%**: Bom negócio
- 🟡 **ROI 0-10%**: ROI baixo, avaliar se vale a pena
- 🔴 **ROI < 0%**: Prejuízo, revisar valores

### 🛠️ Tecnologias Utilizadas

- **React 18**: Framework principal
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Estilização
- **Vite**: Bundler e dev server
- **Lucide React**: Ícones

### 📈 Funcionalidades Futuras

- [ ] Gráficos de evolução mensal
- [ ] Exportação de relatórios em PDF
- [ ] Comparação de cenários
- [ ] Histórico de simulações
- [ ] Calculadora de impostos mais detalhada
- [ ] Integração com APIs de preços de imóveis

### 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature
3. Fazer commit das mudanças
4. Fazer push para a branch
5. Abrir um Pull Request

### 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

### 👨‍💻 Autor

Desenvolvido por Bernardo Werlang

---

**Importante**: Esta aplicação é apenas uma ferramenta de simulação. Para decisões financeiras importantes, consulte sempre um contador ou consultor financeiro.
