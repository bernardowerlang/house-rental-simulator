# Simulador de Aluguel da Casa

Uma aplicação web moderna para simular os gastos e ganhos ao alugar sua própria casa e ficar temporariamente em outro lugar.

## 🏠 Sobre o Projeto

Este simulador foi desenvolvido para ajudar pessoas que querem alugar sua casa e precisam se hospedar em outro local temporariamente. A aplicação calcula todos os custos envolvidos e mostra se a operação será lucrativa ou não.

## ✨ Funcionalidades

- **Cálculo de Receita**: Valor do aluguel mensal multiplicado pelo período
- **Cálculo de Despesas**:
  - Impostos (IR)
  - Taxa da imobiliária
  - Custos de moradia alternativa
  - Diferenças de utilidades (luz, água)
  - Diferenças de internet
  - Manutenção e reparos
  - Seguro da casa
  - Outras despesas
- **Análise de ROI**: Retorno sobre investimento
- **Alertas Inteligentes**: Dicas baseadas nos resultados
- **Interface Responsiva**: Funciona em desktop e mobile

## 🚀 Como Usar

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
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

### Como Preencher os Dados

1. **Dados Básicos**:
   - Valor do aluguel mensal que você pretende cobrar
   - Período em meses que pretende alugar

2. **Custos de Moradia Alternativa**:
   - Quanto você gastará por mês para se hospedar em outro lugar

3. **Utilidades**:
   - Compare os custos de luz/água da sua casa vs. local alternativo
   - Compare os custos de internet

4. **Taxas e Outros Custos**:
   - Imposto de Renda (padrão 27.5%)
   - Taxa da imobiliária (padrão 8%)
   - Custos mensais de manutenção
   - Seguro da casa
   - Outras despesas

## 📊 Interpretando os Resultados

- **Receita Total**: Valor bruto que você receberá
- **Despesas Totais**: Soma de todos os custos
- **Lucro Líquido**: Receita - Despesas
- **ROI**: Percentual de retorno sobre o valor do aluguel

### Indicadores:

- 🟢 **ROI > 10%**: Bom negócio
- 🟡 **ROI 0-10%**: ROI baixo, avaliar se vale a pena
- 🔴 **ROI < 0%**: Prejuízo, revisar valores

## 🛠️ Tecnologias Utilizadas

- **React 18**: Framework principal
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Estilização
- **Vite**: Bundler e dev server
- **Lucide React**: Ícones

## 📈 Funcionalidades Futuras

- [ ] Gráficos de evolução mensal
- [ ] Exportação de relatórios em PDF
- [ ] Comparação de cenários
- [ ] Histórico de simulações
- [ ] Calculadora de impostos mais detalhada
- [ ] Integração com APIs de preços de imóveis

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature
3. Fazer commit das mudanças
4. Fazer push para a branch
5. Abrir um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 👨‍💻 Autor

Desenvolvido por Bernardo Werlang

---

**Importante**: Esta aplicação é apenas uma ferramenta de simulação. Para decisões financeiras importantes, consulte sempre um contador ou consultor financeiro.
