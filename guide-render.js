document.addEventListener('DOMContentLoaded', () => {
    // Helper to render math strings into perfect flex columns so Caveat (proportional font) aligns perfectly
    const renderMathLine = (str, color, isMathLine = false, config = {}) => {
        const {
            fontSize = '1.2rem',
            charWidth = '0.8rem',
            marginBottom = '2px',
            operator = '',
            opColor = 'chalk-white'
        } = config;

        let chars = str.split('');
        let html = `<div style="display: flex; justify-content: flex-end; color: var(--${color}); font-size: ${fontSize}; line-height: 1; padding: 0; ${isMathLine ? 'border-bottom: 2px solid var(--chalk-white); margin-bottom: 4px;' : `margin-bottom: ${marginBottom};`}">`;

        if (operator) {
            html += `<span style="color: var(--${opColor}); margin-right: auto;">${operator}</span>`;
        }

        chars.forEach(c => {
            if (c === ' ') {
                html += `<span style="width: ${charWidth}; display: inline-block;"></span>`;
            } else {
                html += `<span style="width: ${charWidth}; text-align: center; display: inline-block;">${c}</span>`;
            }
        });
        html += `</div>`;
        return html;
    };

    setTimeout(() => {
        const sub1 = document.getElementById('guide-sub-1');
        const mul1 = document.getElementById('guide-mul-1');
        const div1 = document.getElementById('guide-div-1');
        const add2 = document.getElementById('guide-add-2');
        const hist2 = document.getElementById('guide-hist-2');

        // Increase right padding so all these align closer to center instead of hard right edge
        const padRight = 'padding-right: 15px;';

        if (sub1) {
            const config = { fontSize: '2rem', charWidth: '1.5rem', marginBottom: '8px' };
            sub1.innerHTML = `
            <div style="color: var(--chalk-yellow); font-size: 2rem; text-align: right; width: 100%; font-family: var(--font-chalk); position: absolute; top: 23px; right: 70px;">3045-987</div>
            <div class="step-by-step-area" style="padding-bottom:0; min-height:auto; display:flex; flex-direction:column; width: 100%; justify-content: center; margin-top: 30px; ${padRight}">
                <div style="display:flex; justify-content:flex-end; color:var(--chalk-red); font-size:1.1rem; line-height: 1; margin-bottom: 2px;">
                    <span style="width:1.1rem"></span><span style="width:1.5rem;text-align:center;">2</span><span style="width:1.5rem;text-align:center;">9</span><span style="width:1.5rem;text-align:center;">13</span><span style="width:1.4rem;text-align:center;">15</span>
                </div>
                ${renderMathLine('3045', 'chalk-yellow', false, config)}
                ${renderMathLine(' 987', 'chalk-yellow', true, { ...config, operator: '−' })}
                ${renderMathLine('2058', 'chalk-green', false, config)}
            </div>`.replace(/\n\s*/g, '');
        }

        if (mul1) {
            const config = { fontSize: '1.7rem', charWidth: '1.3rem', marginBottom: '2px' };
            mul1.innerHTML = `
            <div style="color: var(--chalk-yellow); font-size: 2rem; text-align: right; width: 100%; font-family: var(--font-chalk); position: absolute; top: 20px; right: 85px;">456×23</div>
            <div class="step-by-step-area" style="padding-bottom:0; min-height:auto; display:flex; flex-direction:column; width: 100%; justify-content: center; margin-top: 30px; ${padRight}">
                ${renderMathLine('   456', 'chalk-blue', false, config)}
                ${renderMathLine('    23', 'chalk-blue', true, { ...config, operator: '×' })}
                ${renderMathLine('  1368', 'chalk-green', false, config)}
                ${renderMathLine('  912 ', 'chalk-green', true, config)}
                ${renderMathLine(' 10488', 'chalk-yellow', false, config)}
            </div>`.replace(/\n\s*/g, '');
        }

        if (div1) {
            const config = { fontSize: '1.25rem', charWidth: '1rem', marginBottom: '2px' };
            div1.innerHTML = `
            <div style="color: var(--chalk-yellow); font-size: 1.9rem; text-align: right; width: 100%; font-family: var(--font-chalk); position: absolute; top: 30px; right: 150px;">339÷3</div>
            <div class="step-by-step-area" style="padding-bottom:0; min-height:auto; display:flex; flex-direction:column; justify-content:center; margin-top: 20px; align-items:center; padding-right: 50px;">
                <div style="display: flex; flex-direction: column; align-items: flex-end; font-family: var(--font-chalk);">
                    ${renderMathLine('113', 'chalk-blue', false, config)}
                    <div style="display: flex; justify-content: flex-end; align-items: flex-end;">
                        <div style="color: var(--chalk-red); font-size: 1.2rem; margin-right: 5px; line-height: 1;">3</div>
                        <div style="border-left: 2px solid var(--chalk-white); border-top: 2px solid var(--chalk-white); padding-left: 5px; border-top-left-radius: 4px;">
                            ${renderMathLine('339', 'chalk-white', false, config)}
                        </div>
                    </div>
                    <div style="padding-right: 0px; display: flex; flex-direction: column;">
                        ${renderMathLine('3  ', 'chalk-yellow', true, { ...config, operator: '−' })}
                        ${renderMathLine(' 03 ', 'chalk-green', false, config)}
                        ${renderMathLine('  3 ', 'chalk-yellow', true, { ...config, operator: '−' })}
                        ${renderMathLine('  09', 'chalk-green', false, config)}
                        ${renderMathLine('   9', 'chalk-yellow', true, { ...config, operator: '−' })}
                        ${renderMathLine('   0', 'chalk-green', false, config)}
                    </div>
                </div>
            </div>`.replace(/\n\s*/g, '');
        }

        if (add2) {
            const config = { fontSize: '2rem', charWidth: '1.5rem', marginBottom: '8px' };
            add2.innerHTML = `
            <div style="color: var(--chalk-yellow); font-size: 2rem; text-align: right; width: 100%; font-family: var(--font-chalk); position: absolute; top: 22px; right: 60px;">9876+5432</div>
            <div class="step-by-step-area" style="padding-bottom:0; min-height:auto; display:flex; flex-direction:column; width: 100%; justify-content: center; margin-top: 30px; ${padRight}">
                <div style="display:flex; justify-content:flex-end; color:var(--chalk-red); font-size:1.2rem; line-height: 1; margin-bottom: 2px;">
                    <span style="width:1.1rem"></span><span style="width:1.9rem;text-align:center;">1</span><span style="width:0.4rem;text-align:center;">1</span><span style="width:2.7rem;text-align:center;">1</span><span style="width:2.3rem"></span>
                </div>
                ${renderMathLine(' 9876', 'chalk-yellow', false, config)}
                ${renderMathLine(' 5432', 'chalk-yellow', true, { ...config, operator: '+' })}
                ${renderMathLine('15308', 'chalk-green', false, config)}
            </div>`.replace(/\n\s*/g, '');
        }
        if (hist2) {
            hist2.innerHTML = `
            <div style="flex:1; display:flex; flex-direction:column; justify-content:center; align-items:flex-end; padding-top: 35px; width: 100%; ${padRight}">
                <ul style="list-style:none; padding:0; text-align:right; width:100%; font-family: var(--font-chalk); font-size: 1.3rem; color: var(--chalk-white); letter-spacing: 1.5px;">
                    <li style="color: var(--chalk-blue); margin-bottom: 4px; line-height: 1.1;">9876 + 5432 = 15308</li>
                    <li style="color: var(--chalk-green); margin-bottom: 4px; line-height: 1.1;">3045 - 987 = 2058</li>
                    <li style="color: var(--chalk-yellow); margin-bottom: 4px; line-height: 1.1;">456 × 23 = 10488</li>
                    <li style="color: var(--chalk-red); margin-bottom: 4px; line-height: 1.1;">339 ÷ 3 = 113</li>
                    <li style="color: var(--chalk-blue); margin-bottom: 4px; line-height: 1.1;">√144 = 12</li>
                    <li style="color: var(--chalk-green); margin-bottom: 4px; line-height: 1.1;">25² = 625</li>
                    <li style="color: var(--chalk-yellow); margin-bottom: 4px; line-height: 1.1;">800 × 5 = 4000</li>
                </ul>
            </div>`.replace(/\n\s*/g, '');
        }
    }, 200);
});
