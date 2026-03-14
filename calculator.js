// Main Calculator Logic
document.addEventListener('DOMContentLoaded', () => {
    const mainResultDisplay = document.getElementById('main-result');
    const stepByStepArea = document.getElementById('step-by-step-area');
    const historyList = document.getElementById('history-list');
    const historyPanel = document.getElementById('history-panel');
    const historyToggle = document.getElementById('history-toggle');
    const clearHistoryBtn = document.getElementById('clear-history');
    const keypadContainer = document.getElementById('keypad-container');
    const resultActions = document.getElementById('result-actions');
    const newOperationBtn = document.getElementById('new-operation');

    let currentInput = '0';
    let previousInput = '';
    let currentOperator = null;
    let history = [];
    let isNewOperation = true; // Flag to reset input after calculation

    // Initialization
    loadHistory();
    initTheme();

    // Event Listeners for Keypad
    document.querySelectorAll('.calculator-keypad button').forEach(button => {
        button.addEventListener('click', () => handleInput(button));
    });

    // History Toggle
    historyToggle.addEventListener('click', () => {
        historyPanel.classList.toggle('hidden');
    });

    // Clear History
    clearHistoryBtn.addEventListener('click', () => {
        history = [];
        saveHistory();
        renderHistory();
        historyPanel.classList.add('hidden');
    });

    // New Operation
    newOperationBtn.addEventListener('click', () => {
        showKeypadView();
        clearAll();
    });

    function showResultView() {
        keypadContainer.classList.add('hidden');
        resultActions.classList.remove('hidden');
    }

    function showKeypadView() {
        keypadContainer.classList.remove('hidden');
        resultActions.classList.add('hidden');
    }

    function handleInput(button) {
        const action = button.dataset.action;
        const value = button.dataset.value;

        if (value !== undefined) {
            handleNumber(value);
        } else if (action === 'add' || action === 'subtract' || action === 'multiply' || action === 'divide') {
            handleOperator(action);
        } else if (action === 'calculate') {
            calculate();
        } else if (action === 'clear-all') {
            clearAll();
        } else if (action === 'delete') {
            deleteLast();
        } else if (action === 'sqrt') {
            calculateSpecial('sqrt');
        } else if (action === 'square') {
            calculateSpecial('square');
        } else if (action === 'factorize') {
            calculateSpecial('factorize');
        }

        updateDisplay();
    }

    function handleNumber(num) {
        if (isNewOperation) {
            currentInput = num === '.' ? '0.' : num;
            isNewOperation = false;
            // Clear step by step area on new number entry if previous was a calculation
            if (previousInput === '' && currentOperator === null) {
                stepByStepArea.innerHTML = '';
            }
        } else {
            if (num === '.' && currentInput.includes('.')) return; // Prevent multiple decimals
            if (currentInput === '0' && num !== '.') {
                currentInput = num; // Replace initial zero
            } else {
                currentInput += num;
            }
        }
    }

    function handleOperator(op) {
        if (currentOperator !== null && !isNewOperation) {
            calculate(false); // Calculate intermediate result without showing steps yet
        }
        previousInput = currentInput;
        currentOperator = op;
        isNewOperation = true;

        // Setup initial display for operator
        const opSymbol = getOperatorSymbol(op);
        const totalWidth = currentInput.length + 1;
        stepByStepArea.innerHTML = `<div style="display: flex; flex-direction: column; align-items: flex-end; padding: 10px; font-family: var(--font-chalk);">
            ${StepByStep._renderRow(currentInput.padStart(totalWidth, ' '), 'chalk-white', { operator: opSymbol })}
        </div>`;
    }

    function calculate(showSteps = true) {
        if (currentOperator === null || isNewOperation) return;

        let result;
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);

        if (isNaN(prev) || isNaN(current)) return;

        switch (currentOperator) {
            case 'add':
                result = prev + current;
                if (showSteps) StepByStep.renderAddition(previousInput, currentInput, stepByStepArea);
                break;
            case 'subtract':
                result = prev - current;
                if (showSteps) StepByStep.renderSubtraction(previousInput, currentInput, stepByStepArea);
                break;
            case 'multiply':
                result = prev * current;
                if (showSteps) StepByStep.renderMultiplication(previousInput, currentInput, stepByStepArea);
                break;
            case 'divide':
                if (current === 0) {
                    currentInput = "Error";
                    isNewOperation = true;
                    updateDisplay();
                    return;
                }
                result = prev / current;
                if (showSteps) StepByStep.renderDivision(previousInput, currentInput, stepByStepArea);
                break;
            default:
                return;
        }

        // Format result to prevent floating point issues (e.g. 0.1+0.2 = 0.3)
        result = Math.round(result * 100000000) / 100000000;

        // Save to history
        const opStr = `${previousInput} ${getOperatorSymbol(currentOperator)} ${currentInput} = ${result}`;
        addToHistory(opStr);

        currentInput = result.toString();
        currentOperator = null;
        previousInput = '';
        isNewOperation = true;

        if (showSteps) showResultView();
    }

    function calculateSpecial(type) {
        const val = parseFloat(currentInput);
        if (isNaN(val)) return;

        if (type === 'sqrt') {
            if (val < 0) {
                currentInput = "Error";
            } else {
                const result = Math.sqrt(val);
                StepByStep.renderSquareRoot(val, result, stepByStepArea);
                currentInput = (Math.round(result * 100000) / 100000).toString();
                addToHistory(`√${val} = ${currentInput}`);
            }
        } else if (type === 'square') {
            const result = val * val;
            stepByStepArea.innerHTML = `<div style="padding-bottom:10px;">
                <div style="color: var(--chalk-blue)">${val}² = <span style="color: var(--chalk-white)">${result}</span></div>
            </div>`;
            currentInput = (Math.round(result * 100000) / 100000).toString();
            addToHistory(`${val}² = ${currentInput}`);
        } else if (type === 'factorize') {
            // Only integers
            if (!Number.isInteger(val) || val <= 1) {
                currentInput = "Error";
                stepByStepArea.innerHTML = "Solo enteros > 1";
                isNewOperation = true;
                updateDisplay();
                return;
            }
            const factors = StepByStep.renderFactorization(val, stepByStepArea);
            addToHistory(`Fact(${val}) = ${factors.join(' × ')}`);
            currentInput = val.toString(); // Keeps original number in display
        }

        isNewOperation = true;
        currentOperator = null;
        previousInput = '';
        showResultView();
    }

    function clearAll() {
        currentInput = '0';
        previousInput = '';
        currentOperator = null;
        isNewOperation = true;
        stepByStepArea.innerHTML = '';
    }

    function deleteLast() {
        if (isNewOperation) return;
        currentInput = currentInput.slice(0, -1);
        if (currentInput === '') currentInput = '0';
    }

    function updateDisplay() {
        mainResultDisplay.textContent = currentInput;
    }

    function getOperatorSymbol(action) {
        switch (action) {
            case 'add': return '+';
            case 'subtract': return '−';
            case 'multiply': return '×';
            case 'divide': return '÷';
            default: return '';
        }
    }

    // --- History Functions ---
    function addToHistory(entry) {
        history.unshift(entry); // Add to beginning
        if (history.length > 20) history.pop(); // Keep last 20
        saveHistory();
        renderHistory();
    }

    function saveHistory() {
        localStorage.setItem('alicia_calc_history', JSON.stringify(history));
    }

    function loadHistory() {
        const stored = localStorage.getItem('alicia_calc_history');
        if (stored) {
            try {
                history = JSON.parse(stored);
                renderHistory();
            } catch (e) {
                history = [];
            }
        }
    }

    function renderHistory() {
        historyList.innerHTML = '';
        if (history.length === 0) {
            historyList.innerHTML = '<li>No hay historial</li>'; // Fallback text, handled generic enough
            return;
        }
        history.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            li.addEventListener('click', () => {
                // Allows clicking history to load result as new input
                const res = item.split('=').pop().trim();
                if (!isNaN(res)) {
                    currentInput = res;
                    isNewOperation = true;
                    updateDisplay();
                    historyPanel.classList.add('hidden');
                }
            });
            historyList.appendChild(li);
        });
    }

    // Add keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.key >= '0' && e.key <= '9' || e.key === '.') handleNumber(e.key);
        else if (e.key === '+') handleOperator('add');
        else if (e.key === '-') handleOperator('subtract');
        else if (e.key === '*') handleOperator('multiply');
        else if (e.key === '/') handleOperator('divide');
        else if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); calculate(); }
        else if (e.key === 'Backspace') deleteLast();
        else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') clearAll();

        updateDisplay();
    });

    // Theme Toggle Functions
    function initTheme() {
        const themeBtn = document.getElementById('theme-toggle');
        if (!themeBtn) return;

        // Load preference
        if (localStorage.getItem('alicia_theme') === 'light') {
            document.body.classList.add('light-mode');
            themeBtn.textContent = '🌙 Modo Oscuro';
        }

        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');

            // Adjust button text based on language (rough check based on URL)
            const isEnglish = window.location.pathname.includes('/en/');

            if (isLight) {
                localStorage.setItem('alicia_theme', 'light');
                themeBtn.textContent = isEnglish ? '🌙 Dark Mode' : '🌙 Modo Oscuro';
            } else {
                localStorage.setItem('alicia_theme', 'dark');
                themeBtn.textContent = isEnglish ? '☀️ Light Mode' : '☀️ Modo Claro';
            }
        });
    }

});
