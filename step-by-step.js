// Step-by-Step Visualization Logic
const StepByStep = {

    // Generic helper for high-quality math line rendering
    _renderRow: (data, color, options = {}) => {
        const {
            fontSize = '3.2rem', // Boosted for even better visibility
            charWidth = '1.8rem', // Keeping spacing constant as requested
            marginBottom = '16px',
            isMathLine = false,
            operator = '',
            opColor = 'chalk-white'
        } = options;

        let items = Array.isArray(data) ? data : data.split('');
        let html = `<div style="display: flex; justify-content: flex-end; color: var(--${color}); font-size: ${fontSize}; line-height: 1; margin-bottom: ${marginBottom}; ${isMathLine ? 'border-bottom: 2px solid var(--chalk-white); padding-bottom: 4px;' : ''}">`;

        if (operator) {
            html += `<span style="color: var(--${opColor}); margin-right: auto;">${operator}</span>`;
        }

        items.forEach(c => {
            if (c === ' ' || c === '' || c === null) {
                html += `<span style="width: ${charWidth}; display: inline-block;"></span>`;
            } else {
                html += `<span style="width: ${charWidth}; text-align: center; display: inline-block;">${c}</span>`;
            }
        });
        html += `</div>`;
        return html;
    },

    // Function to generate styled HTML for carrying digits (top row)
    _createCarryRow: (carries, padSize) => {
        let str = ' '.repeat(padSize);
        carries.forEach(c => {
            str += c > 0 ? c.toString() : ' ';
        });
        // Carries are usually smaller but still need spacing
        return StepByStep._renderRow(str, 'chalk-red', { fontSize: '2.0rem', charWidth: '1.8rem', marginBottom: '8px' });
    },

    renderAddition: (num1Str, num2Str, container) => {
        // Only providing detailed step by step for integers for simplicity in this demo, otherwise standard view
        if (num1Str.includes('.') || num2Str.includes('.')) {
            container.innerHTML = `<div style="padding-bottom:10px;">
                <div>&nbsp;&nbsp;${num1Str}</div>
                <div class="step-math-line"><span class="step-operator">+</span> ${num2Str}</div>
            </div>`.replace(/\n\s*/g, '');
            return;
        }

        let n1 = num1Str.split('').reverse().map(Number);
        let n2 = num2Str.split('').reverse().map(Number);
        const maxLength = Math.max(n1.length, n2.length);

        let carries = new Array(maxLength + 1).fill(0);
        let sum = [];
        let carry = 0;

        for (let i = 0; i < maxLength; i++) {
            let d1 = i < n1.length ? n1[i] : 0;
            let d2 = i < n2.length ? n2[i] : 0;
            let s = d1 + d2 + carry;
            if (s > 9) {
                sum.push(s % 10);
                carry = Math.floor(s / 10);
                carries[maxLength - 1 - i] = carry; // Store to print correctly LTR
            } else {
                sum.push(s);
                carry = 0;
                carries[maxLength - 1 - i] = 0;
            }
        }
        if (carry > 0) {
            sum.push(carry);
        }

        // Generate HTML Layout
        const totalWidth = Math.max(num1Str.length, num2Str.length) + 1; // +1 for operator space

        let html = '<div style="display: inline-flex; flex-direction: column; align-items: flex-end; padding: 10px; font-family: var(--font-chalk); min-width: 100%;">';

        // Carries
        if (carries.some(c => c > 0)) {
            html += StepByStep._createCarryRow(carries, totalWidth - carries.length);
        }

        // Num 1
        html += StepByStep._renderRow(num1Str.padStart(totalWidth, ' '), 'chalk-white');
        // Operator + Num 2
        html += StepByStep._renderRow(num2Str.padStart(totalWidth - 1, ' '), 'chalk-white', { isMathLine: true, operator: '+', opColor: 'chalk-white' });
        // Result
        const finalSum = sum.reverse().join('');
        html += StepByStep._renderRow(finalSum.padStart(totalWidth, ' '), 'chalk-green');

        html += '</div>';
        container.innerHTML = html;
    },

    renderSubtraction: (num1Str, num2Str, container) => {
        if (num1Str.includes('.') || num2Str.includes('.')) {
            container.innerHTML = `<div style="padding-bottom:10px;">
                <div>&nbsp;&nbsp;${num1Str}</div>
                <div class="step-math-line"><span class="step-operator">−</span> ${num2Str}</div>
            </div>`.replace(/\n\s*/g, '');
            return;
        }

        const n1 = num1Str.split('').reverse().map(Number);
        const n2 = num2Str.split('').reverse().map(Number);
        const maxLength = Math.max(n1.length, n2.length);

        const totalWidth = maxLength + 1;
        let borrows = new Array(maxLength).fill(null);
        let digits = [...n1];

        // Ensure digits has enough length
        while (digits.length < maxLength) digits.push(0);

        for (let i = 0; i < maxLength; i++) {
            let d2 = i < n2.length ? n2[i] : 0;
            if (digits[i] < d2) {
                // Find next non-zero digit to borrow from
                let j = i + 1;
                while (j < digits.length && digits[j] === 0) {
                    j++;
                }
                
                if (j < digits.length) {
                    // Start borrowing backward
                    for (let k = j; k > i; k--) {
                        digits[k]--;
                        borrows[k] = digits[k];
                        digits[k - 1] += 10;
                        borrows[k - 1] = digits[k - 1];
                    }
                }
            }
        }

        let html = '<div style="display: inline-flex; flex-direction: column; align-items: flex-end; padding: 10px; font-family: var(--font-chalk); min-width: 100%;">';

        // Render Borrows
        if (borrows.some(b => b !== null)) {
            const borrowItems = new Array(totalWidth).fill(' ');
            const reversedBorrows = [...borrows].reverse();
            for (let i = 0; i < reversedBorrows.length; i++) {
                if (reversedBorrows[i] !== null) {
                    borrowItems[totalWidth - reversedBorrows.length + i] = reversedBorrows[i].toString();
                }
            }
            html += StepByStep._renderRow(borrowItems, 'chalk-red', { fontSize: '1.6rem', charWidth: '1.8rem', marginBottom: '4px' });
        }

        html += StepByStep._renderRow(num1Str.padStart(totalWidth, ' '), 'chalk-white');
        html += StepByStep._renderRow(num2Str.padStart(totalWidth - 1, ' '), 'chalk-white', { isMathLine: true, operator: '−', opColor: 'chalk-white' });

        const result = (parseFloat(num1Str) - parseFloat(num2Str)).toString();
        html += StepByStep._renderRow(result.padStart(totalWidth, ' '), 'chalk-green');

        html += '</div>';
        container.innerHTML = html;
    },

    renderMultiplication: (num1Str, num2Str, container) => {
        if (num1Str.includes('.')) num1Str = num1Str;

        const n1 = parseFloat(num1Str);
        const digits2 = num2Str.split('').map(Number);
        const result = (n1 * parseFloat(num2Str)).toString();

        const totalWidth = Math.max(num1Str.length, num2Str.length, result.length) + 1;

        let html = `<div style="display: inline-flex; flex-direction: column; align-items: flex-end; padding: 10px; font-family: var(--font-chalk); min-width: 100%;">`;
        html += StepByStep._renderRow(num1Str.padStart(totalWidth, ' '), 'chalk-white');
        html += StepByStep._renderRow(num2Str.padStart(totalWidth - 1, ' '), 'chalk-white', { isMathLine: true, operator: '×', opColor: 'chalk-white' });

        if (digits2.length > 1) {
            for (let i = digits2.length - 1; i >= 0; i--) {
                const d = digits2[i];
                let partialVal = (n1 * d).toString();
                const paddingRight = (digits2.length - 1) - i;

                // Pad with spaces for the partial result alignment
                let str = partialVal.padStart(totalWidth - paddingRight, ' ') + ' '.repeat(paddingRight);

                html += StepByStep._renderRow(str, 'chalk-yellow', {
                    isMathLine: (i === 0),
                    marginBottom: (i === 0) ? '12px' : '4px'
                });
            }
        }

        html += StepByStep._renderRow(result.padStart(totalWidth, ' '), 'chalk-green');
        html += `</div>`;
        container.innerHTML = html;
    },

    renderDivision: (num1Str, num2Str, container) => {
        const dividend = parseInt(num1Str);
        const divisor = parseInt(num2Str);
        const quotientStr = Math.floor(dividend / divisor).toString();
        const dividendStr = dividend.toString();

        // Local helper to keep division consistent with new large styling
        const __renderDivisionRow = (str, color, isMathLine = false, operator = '', opColor = '') => {
            return StepByStep._renderRow(str, color, {
                fontSize: '2.8rem',
                charWidth: '1.8rem',
                marginBottom: '8px',
                isMathLine,
                operator,
                opColor
            });
        };

        let html = `<div style="display: inline-flex; flex-direction: column; align-items: flex-end; padding: 10px; font-family: var(--font-chalk); overflow-x: auto; min-width: 100%;">`;

        // 1. Render the Quotient on top (right-aligned to perfectly match the dividend width below it)
        const qPadding = dividendStr.length - quotientStr.length;
        const qPadded = ' '.repeat(Math.max(0, qPadding)) + quotientStr;
        html += __renderDivisionRow(qPadded, 'chalk-blue');

        // 2. Render the Divisor | Dividend container line
        html += `<div style="display: flex; justify-content: flex-end; align-items: stretch;">`;
        // Divisor on the outside left
        html += `<div style="color: var(--chalk-red); font-size: 2.8rem; margin-right: 15px; line-height: 1; display: flex; align-items: flex-end;">${divisor}</div>`;
        // Dividend inside the box border
        html += `<div style="border-left: 3px solid var(--chalk-white); border-top: 3px solid var(--chalk-white); padding-left: 10px; border-top-left-radius: 6px;">`;
        html += __renderDivisionRow(dividendStr, 'chalk-white');
        html += `</div></div>`; // End Dividend wrapper and row grid

        // 3. Render the step-by-step subtractions underneath the dividend
        html += `<div style="padding-right: 0px; display: flex; flex-direction: column;">`;

        let currentDividendPart = "";
        let stepsHtml = "";
        let padSpaces = 0;

        for (let i = 0; i < dividendStr.length; i++) {
            currentDividendPart += dividendStr[i];
            let currentVal = parseInt(currentDividendPart);

            if (currentVal >= divisor || i === dividendStr.length - 1) {
                let qDigit = Math.floor(currentVal / divisor);
                let subtractVal = qDigit * divisor;
                let remainder = currentVal - subtractVal;

                // Only render steps if we actually performed a subtraction (prevent zeroes unless it's the final end)
                if (qDigit > 0 || i === dividendStr.length - 1) {
                    // The subtraction block
                    let padSub = ' '.repeat(padSpaces) + subtractVal.toString() + ' '.repeat(dividendStr.length - 1 - i);
                    stepsHtml += __renderDivisionRow(padSub, 'chalk-yellow', true, '−', 'chalk-white');

                    // The new remainder block for the next cycle
                    currentDividendPart = remainder.toString();

                    // Bring down the next digit visually if there are more
                    let nextValStr = currentDividendPart;
                    if (i < dividendStr.length - 1) {
                        nextValStr += dividendStr[i + 1];
                    }

                    // Padding for alignment
                    padSpaces = i + 1 - nextValStr.length + (nextValStr.length > dividendStr.length ? 1 : 0);
                    if (padSpaces < 0) padSpaces = 0;
                    let padRemainder = ' '.repeat(padSpaces) + (i === dividendStr.length - 1 ? currentDividendPart : nextValStr) + ' '.repeat(Math.max(0, dividendStr.length - 1 - i - 1));

                    stepsHtml += __renderDivisionRow(padRemainder, 'chalk-green');
                }
            }
        }

        html += stepsHtml;
        html += `</div>`; // End Subtractions Column
        html += `</div>`; // End overall container

        container.innerHTML = html;
    },

    renderSquareRoot: (val, result, container) => {
        container.innerHTML = `<div style="padding-bottom:10px;">
            <div style="font-size: 3.2rem; color: var(--chalk-blue)">√<span style="border-top: 2px solid var(--chalk-blue)">${val}</span></div>
        </div>`.replace(/\n\s*/g, '');
    },

    renderFactorization: (val, container) => {
        let n = parseInt(val);
        let factors = [];
        let html = `<table style="margin-left:auto; text-align:right; border-collapse: collapse; font-size:1.5rem; line-height:1.2;">`;

        // simple test division
        let divisor = 2;
        while (n > 1) {
            if (n % divisor === 0) {
                html += `<tr><td style="padding: 0 10px;">${n}</td><td style="border-left: 2px solid var(--chalk-white); padding: 0 10px; color: var(--chalk-green);">${divisor}</td></tr>`;
                factors.push(divisor);
                n = n / divisor;
            } else {
                divisor++;
            }
        }
        html += `<tr><td style="padding: 0 10px;">1</td><td style="border-left: 2px solid var(--chalk-white); padding: 0 10px;">&nbsp;</td></tr>`;
        html += `</table>`;

        container.innerHTML = html;
        return factors;
    }
};
