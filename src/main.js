import './style.css'
import { Calculator, Clock, MapPin, DollarSign } from 'lucide'
import { calculateBonus } from './calculator.js'
import { formatCurrency, validateInput } from './utils.js'

// Bonus calculation data
const bonusData = [
    { category: "Task", minimum: 45, rate: 3.5, actual: null },
    { category: "Task", minimum: 60, rate: 5.50, actual: null },
    { category: "Task", minimum: 90, rate: 8.50, actual: null },
    { category: "Time duration, h", minimum: 55, rate: 0.50, actual: null },
    { category: "Time duration, h", minimum: 70, rate: 0.80, actual: null },
    { category: "Time duration, h", minimum: 110, rate: 1, actual: null },
    { category: "Distance, km", minimum: 2000, rate: 45, actual: null },
    { category: "Distance, km", minimum: 3000, rate: 90, actual: null },
    { category: "Distance, km", minimum: 4000, rate: 134, actual: null }
];

// Create the main application HTML
document.querySelector('#app').innerHTML = `
  <div class="container">
    <header class="header">
      <div class="header-content">
        <div class="header-icon">
          ${Calculator({ size: 32, color: '#3b82f6' })}
        </div>
        <div>
          <h1 class="title">Salary Bonus Calculator</h1>
          <p class="subtitle">Calculate your performance-based bonus</p>
        </div>
      </div>
    </header>

    <main class="main-content">
      <div class="calculator-card">
        <form id="calculator-form" class="form">
          <div class="input-grid">
            <div class="input-group">
              <label for="task-input" class="label">
                <div class="label-content">
                  ${Calculator({ size: 20, color: '#6b7280' })}
                  <span>Tasks Completed</span>
                </div>
              </label>
              <input 
                type="number" 
                id="task-input" 
                class="input" 
                placeholder="Enter number of tasks"
                min="0"
                step="1"
              />
            </div>

            <div class="input-group">
              <label for="time-input" class="label">
                <div class="label-content">
                  ${Clock({ size: 20, color: '#6b7280' })}
                  <span>Time Duration (hours)</span>
                </div>
              </label>
              <input 
                type="number" 
                id="time-input" 
                class="input" 
                placeholder="Enter hours worked"
                min="0"
                step="0.1"
              />
            </div>

            <div class="input-group">
              <label for="distance-input" class="label">
                <div class="label-content">
                  ${MapPin({ size: 20, color: '#6b7280' })}
                  <span>Distance (km)</span>
                </div>
              </label>
              <input 
                type="number" 
                id="distance-input" 
                class="input" 
                placeholder="Enter distance traveled"
                min="0"
                step="1"
              />
            </div>
          </div>

          <button type="submit" class="calculate-btn">
            ${DollarSign({ size: 20 })}
            <span>Calculate Bonus</span>
          </button>
        </form>

        <div id="results" class="results hidden">
          <h3 class="results-title">Bonus Calculation Results</h3>
          <div id="results-content" class="results-content"></div>
          <div id="total-bonus" class="total-bonus"></div>
        </div>

        <div id="error-message" class="error-message hidden"></div>
      </div>

      <div class="info-card">
        <h3 class="info-title">Bonus Structure</h3>
        <div class="bonus-structure">
          <div class="structure-section">
            <h4>Tasks</h4>
            <ul>
              <li>45+ tasks: €3.50 per task</li>
              <li>60+ tasks: €5.50 per task</li>
              <li>90+ tasks: €8.50 per task</li>
            </ul>
          </div>
          <div class="structure-section">
            <h4>Time Duration</h4>
            <ul>
              <li>55+ hours: €0.50 per hour</li>
              <li>70+ hours: €0.80 per hour</li>
              <li>110+ hours: €1.00 per hour</li>
            </ul>
          </div>
          <div class="structure-section">
            <h4>Distance</h4>
            <ul>
              <li>2000+ km: €45 bonus</li>
              <li>3000+ km: €90 bonus</li>
              <li>4000+ km: €134 bonus</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  </div>
`;

// Get form elements
const form = document.getElementById('calculator-form');
const taskInput = document.getElementById('task-input');
const timeInput = document.getElementById('time-input');
const distanceInput = document.getElementById('distance-input');
const resultsDiv = document.getElementById('results');
const resultsContent = document.getElementById('results-content');
const totalBonusDiv = document.getElementById('total-bonus');
const errorMessage = document.getElementById('error-message');

// Handle form submission
form.addEventListener('submit', (e) => {
  e.preventDefault();
  calculateAndDisplayResults();
});

// Add real-time validation
[taskInput, timeInput, distanceInput].forEach(input => {
  input.addEventListener('input', () => {
    clearError();
    if (input.value && !validateInput(input.value)) {
      showError('Please enter valid positive numbers');
    }
  });
});

function calculateAndDisplayResults() {
  try {
    const taskValue = parseFloat(taskInput.value) || 0;
    const timeValue = parseFloat(timeInput.value) || 0;
    const distanceValue = parseFloat(distanceInput.value) || 0;

    // Validate inputs
    if (!validateInput(taskValue) || !validateInput(timeValue) || !validateInput(distanceValue)) {
      showError('Please enter valid positive numbers for all fields');
      return;
    }

    if (taskValue === 0 && timeValue === 0 && distanceValue === 0) {
      showError('Please enter at least one value to calculate bonus');
      return;
    }

    // Update data with actual values
    const updatedData = bonusData.map(item => ({
      ...item,
      actual: item.category === "Task" ? taskValue :
              item.category === "Time duration, h" ? timeValue :
              distanceValue
    }));

    // Calculate bonuses
    const results = updatedData.map(item => ({
      ...item,
      bonus: calculateBonus(item, item.actual)
    }));

    displayResults(results);
    clearError();

  } catch (error) {
    showError('An error occurred while calculating. Please check your inputs.');
  }
}

function displayResults(results) {
  const resultsByCategory = {};
  let totalBonus = 0;

  // Group results by category and find the highest bonus for each
  results.forEach(result => {
    if (!resultsByCategory[result.category] || result.bonus > resultsByCategory[result.category].bonus) {
      resultsByCategory[result.category] = result;
    }
  });

  // Generate HTML for results
  const resultsHTML = Object.values(resultsByCategory).map(result => {
    if (result.bonus > 0) {
      totalBonus += result.bonus;
      return `
        <div class="result-item">
          <div class="result-header">
            <span class="result-category">${result.category}</span>
            <span class="result-bonus">${formatCurrency(result.bonus)}</span>
          </div>
          <div class="result-details">
            Actual: ${result.actual} | Minimum: ${result.minimum} | Rate: ${formatCurrency(result.rate)}
          </div>
        </div>
      `;
    } else {
      return `
        <div class="result-item no-bonus">
          <div class="result-header">
            <span class="result-category">${result.category}</span>
            <span class="result-bonus">No bonus</span>
          </div>
          <div class="result-details">
            Actual: ${result.actual} | Minimum required: ${result.minimum}
          </div>
        </div>
      `;
    }
  }).join('');

  resultsContent.innerHTML = resultsHTML;
  totalBonusDiv.innerHTML = `
    <div class="total-amount">
      <span>Total Bonus:</span>
      <span class="total-value">${formatCurrency(totalBonus)}</span>
    </div>
  `;

  resultsDiv.classList.remove('hidden');
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove('hidden');
  resultsDiv.classList.add('hidden');
}

function clearError() {
  errorMessage.classList.add('hidden');
}