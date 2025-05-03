// static/script.js

// =============================================================================
// DATA & FUNGSI PERHITUNGAN (TERJEMAHAN DARI PYTHON)
// =============================================================================

const subtestsData = {
    "2023": {
        "PU": { min_score: 200.00, max_score: 905.66, total_questions: 30 },
        "PK": { min_score: 249.08, max_score: 1000.00, total_questions: 15 },
        "PPU": { min_score: 200.00, max_score: 870.73, total_questions: 20 },
        "PBM": { min_score: 200.00, max_score: 924.30, total_questions: 20 },
        "LBI": { min_score: 200.00, max_score: 856.73, total_questions: 30 },
        "LBE": { min_score: 250.71, max_score: 880.80, total_questions: 20 },
        "PM": { min_score: 269.35, max_score: 1000.00, total_questions: 20 },
    },
    "2024": {
        "PU": { min_score: 131.21, max_score: 1000.00, total_questions: 30 },
        "PK": { min_score: 192.00, max_score: 1000.00, total_questions: 20 },
        "PPU": { min_score: 159.87, max_score: 1000.00, total_questions: 20 },
        "PBM": { min_score: 160.53, max_score: 1000.00, total_questions: 20 },
        "LBI": { min_score: 126.31, max_score: 1000.00, total_questions: 25 },
        "LBE": { min_score: 233.76, max_score: 1000.00, total_questions: 20 },
        "PM": { min_score: 242.38, max_score: 1000.00, total_questions: 20 },
    },
    "2025": {
        "PU": { min_score: 131.21, max_score: 1000.00, total_questions: 30 },
        "PK": { min_score: 192.00, max_score: 1000.00, total_questions: 20 },
        "PPU": { min_score: 159.87, max_score: 1000.00, total_questions: 20 },
        "PBM": { min_score: 160.53, max_score: 1000.00, total_questions: 20 },
        "LBI": { min_score: 126.31, max_score: 1000.00, total_questions: 30 },
        "LBE": { min_score: 233.76, max_score: 1000.00, total_questions: 20 },
        "PM": { min_score: 242.38, max_score: 1000.00, total_questions: 20 },
    },
};

// --- Fungsi Perhitungan Skor ---
function calculateScore2023(correctAnswers, sub) {
    const m = (sub.max_score - sub.min_score) / sub.total_questions;
    const score = m * correctAnswers + sub.min_score;
    return Math.round(score * 100) / 100; // Round to 2 decimal places
}

function calculateScore2024(correctAnswers, sub) {
    const m = (sub.max_score - sub.min_score) / sub.total_questions;
    const score = m * correctAnswers + sub.min_score;
    return Math.round(score * 100) / 100;
}

function calculateScore2025(correctAnswers, sub) {
    const m = (sub.max_score - sub.min_score) / sub.total_questions;
    const score = m * correctAnswers + sub.min_score;
    return Math.round(score * 100) / 100;
}

// --- Fungsi Perhitungan Jawaban Benar ---
function calculateCorrect2023(score, sub) {
    if (score < sub.min_score || score > sub.max_score) {
        return null; // Sesuai dengan logika Python asli
    }
    const m = (sub.max_score - sub.min_score) / sub.total_questions;
    if (m === 0) return null; // Hindari pembagian dengan nol
    return Math.round((score - sub.min_score) / m);
}

function calculateCorrect2024(score, sub) {
    if (score < sub.min_score || score > sub.max_score) {
        return null; // Sesuai dengan logika Python asli
    }
    const m = (sub.max_score - sub.min_score) / sub.total_questions;
    if (m === 0) return null;
    const correct = (score - sub.min_score) / m;
    return Math.round(correct);
}

function calculateCorrect2025(score, sub) {
    // Tidak perlu cek range di sini karena input sudah divalidasi, tapi bisa ditambahkan jika perlu
    const m = (sub.max_score - sub.min_score) / sub.total_questions;
    if (m === 0) return 0; // Atau handle error lain
    const correctAnswers = (score - sub.min_score) / m;
    // Terapkan clamping (pembatasan) seperti di Python
    return Math.max(0, Math.min(Math.round(correctAnswers), sub.total_questions));
}

// --- Mapping Fungsi Kalkulasi per Tahun ---
const calcFunctions = {
    "2023": { scoreFunc: calculateScore2023, correctFunc: calculateCorrect2023 },
    "2024": { scoreFunc: calculateScore2024, correctFunc: calculateCorrect2024 },
    "2025": { scoreFunc: calculateScore2025, correctFunc: calculateCorrect2025 },
};

/**
 * Menghitung kuartil (Q1, Median, Q3) dari array skor menggunakan interpolasi linear.
 * (Implementasi JS pengganti numpy.percentile)
 * @param {number[]} scores - Array skor numerik yang sudah divalidasi.
 * @returns {object} Object berisi { q1: number|null, median: number|null, q3: number|null }
 */
function calculateQuartiles(scores) {
    if (!scores || scores.length < 3) { // Butuh minimal data untuk kuartil
        return { q1: null, median: null, q3: null };
    }

    // 1. Urutkan data
    const sortedScores = [...scores].sort((a, b) => a - b);
    const n = sortedScores.length;

    // Helper function untuk menghitung persentil dengan interpolasi linear
    function getPercentile(p) {
        // Hitung posisi index (0-based)
        const pos = (n - 1) * p;
        const baseIndex = Math.floor(pos);
        const frac = pos - baseIndex;

        if (baseIndex + 1 < n) {
            // Interpolasi linear antara dua nilai
            return sortedScores[baseIndex] + frac * (sortedScores[baseIndex + 1] - sortedScores[baseIndex]);
        } else {
            // Jika di ujung array, kembalikan nilai terakhir
            return sortedScores[baseIndex];
        }
    }

    try {
        const q1 = getPercentile(0.25);
        const median = getPercentile(0.50);
        const q3 = getPercentile(0.75);
        return {
            q1: Math.round(q1 * 100) / 100,
            median: Math.round(median * 100) / 100,
            q3: Math.round(q3 * 100) / 100,
        };
    } catch (e) {
        console.error("Error calculating quartiles:", e);
        return { q1: null, median: null, q3: null };
    }
}


// =============================================================================
// LOGIKA FRONTEND & DOM MANIPULATION
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
    // --- Referensi Elemen DOM ---
    const yearSelect = document.getElementById('year-select');
    const modeRadios = document.querySelectorAll('input[name="mode"]');
    const inputFieldsContainer = document.getElementById('input-fields-container');
    const calculatorForm = document.getElementById('calculator-form');
    const loadingIndicator = document.getElementById('loading-indicator');
    const calculateButton = document.getElementById('calculate-button');
    const resultsSection = document.getElementById('results-section');
    const resultsTableBody = document.querySelector('#results-table tbody');
    const errorMessageDiv = document.getElementById('error-message');
    const scoreChartCanvas = document.getElementById('scoreChart');

    // Referensi elemen spesifik di area ringkasan
    const summaryTotalScoreEl = document.getElementById('summary-total-score');
    const summaryAverageScoreEl = document.getElementById('summary-average-score');
    const summaryCorrectVsTotalEl = document.getElementById('summary-correct-vs-total');
    const summaryPercentageEl = document.getElementById('summary-percentage');
    const summaryQ1El = document.getElementById('summary-q1');
    const summaryMedianEl = document.getElementById('summary-median');
    const summaryQ3El = document.getElementById('summary-q3');

    let currentSubtests = {}; // Menyimpan detail subtes tahun terpilih (dari subtestsData)
    let scoreChart = null; // Variabel untuk menyimpan instance grafik Chart.js

    // --- Fungsi-fungsi ---

    /**
     * Memperbarui field input di form berdasarkan tahun dan mode terpilih,
     * menggunakan data yang sudah ada di `subtestsData`.
     */
    function updateInputFields() {
        const selectedYear = yearSelect.value;
        const selectedMode = document.querySelector('input[name="mode"]:checked').value;

        // Bersihkan field sebelumnya
        inputFieldsContainer.innerHTML = '';
        currentSubtests = subtestsData[selectedYear] || {}; // Ambil data dari objek JS

        if (Object.keys(currentSubtests).length === 0) {
            inputFieldsContainer.innerHTML = '<p class="placeholder-text error-message">Data not found for selected year.</p>';
            return;
        }

        // Buat field input baru
        const stepValue = selectedMode === '1' ? '1' : '0.01';

        for (const subName in currentSubtests) {
            const sub = currentSubtests[subName];
            const fieldGroup = document.createElement('div');
            fieldGroup.className = 'input-field-group';

            const label = document.createElement('label');
            label.htmlFor = `input-${subName}`;
            label.textContent = `${subName}:`;

            const input = document.createElement('input');
            input.type = 'number';
            input.id = `input-${subName}`;
            input.name = subName;
            input.step = stepValue;
            input.required = true;

            if (selectedMode === '1') {
                input.min = 0;
                input.max = sub.total_questions;
                input.placeholder = `0 - ${sub.total_questions}`;
            } else { // Mode 2
                input.min = sub.min_score.toFixed(2);
                input.max = sub.max_score.toFixed(2);
                input.placeholder = `${sub.min_score.toFixed(2)} - ${sub.max_score.toFixed(2)}`;
            }

            fieldGroup.appendChild(label);
            fieldGroup.appendChild(input);
            inputFieldsContainer.appendChild(fieldGroup);
        }
    }

    /**
     * Menangani submit form: mengambil input, menjalankan kalkulasi client-side,
     * dan menampilkan hasil.
     */
    function handleFormSubmit(event) {
        event.preventDefault(); // Cegah reload halaman

        // UI Feedback
        loadingIndicator.style.display = 'flex';
        calculateButton.disabled = true;
        resultsSection.style.display = 'none';
        errorMessageDiv.style.display = 'none';
        errorMessageDiv.textContent = '';

        // Simulasi delay agar loading terlihat (opsional)
        setTimeout(() => {
            try {
                // Ambil tahun dan mode terpilih
                const selectedYear = yearSelect.value;
                const selectedMode = document.querySelector('input[name="mode"]:checked').value;

                // Dapatkan data subtes dan fungsi kalkulasi yang relevan dari objek JS
                const subtests = subtestsData[selectedYear];
                const { scoreFunc, correctFunc } = calcFunctions[selectedYear];

                if (!subtests || !scoreFunc || !correctFunc) {
                    throw new Error(`Calculation data not available for year ${selectedYear}`);
                }

                const results = {};
                const validScores = [];
                let totalScoreSum = 0.0; // Untuk summary total score (jika relevan)
                let totalCorrectCalculated = 0;
                let totalQuestionsAll = 0;
                let numProcessedSubtests = 0;

                // Hitung total soal untuk persentase
                for (const subName in subtests) {
                    totalQuestionsAll += subtests[subName].total_questions;
                }

                // Iterasi melalui subtes untuk tahun terpilih
                for (const subName in subtests) {
                    const sub = subtests[subName];
                    const inputElement = document.getElementById(`input-${subName}`);
                    const inputValueStr = inputElement ? inputElement.value.trim() : '';

                    // Hanya proses jika ada input
                    if (inputValueStr !== '') {
                        numProcessedSubtests++; // Hitung subtes yang diproses
                        if (selectedMode === '1') { // Mode: Hitung Skor dari Jawaban Benar
                            try {
                                const correct = parseInt(inputValueStr, 10);
                                if (isNaN(correct) || correct < 0 || correct > sub.total_questions) {
                                    throw new Error(`Input for ${subName} must be an integer between 0 and ${sub.total_questions}.`);
                                }
                                const score = scoreFunc(correct, sub);
                                results[subName] = { score: score, correct: correct, total: sub.total_questions };
                                validScores.push(score);
                                totalScoreSum += score;
                                totalCorrectCalculated += correct;
                            } catch (e) {
                                results[subName] = { score: "Input Error", correct: inputValueStr, total: sub.total_questions, error: e.message };
                            }
                        } else { // Mode: Hitung Jawaban Benar dari Skor
                            try {
                                const score = parseFloat(inputValueStr);
                                if (isNaN(score) || score < sub.min_score || score > sub.max_score) {
                                    throw new Error(`Input for ${subName} must be a number between ${sub.min_score.toFixed(2)} and ${sub.max_score.toFixed(2)}.`);
                                }
                                const correct = correctFunc(score, sub);
                                results[subName] = { score: score, correct: correct, total: sub.total_questions };
                                validScores.push(score); // Tambahkan skor input ke list
                                totalScoreSum += score; // Jumlahkan skor input
                                if (correct !== null) {
                                    totalCorrectCalculated += correct;
                                }
                            } catch (e) {
                                results[subName] = { score: inputValueStr, correct: "Input Error", total: sub.total_questions, error: e.message };
                            }
                        }
                    } else {
                        // Jika input kosong, tandai sebagai tidak diproses atau beri nilai default jika perlu
                        // results[subName] = { score: 'N/A', correct: 'N/A', total: sub.total_questions, notes: 'No input' };
                    }
                } // Akhir loop subtes

                // Hitung Statistik Ringkasan
                const averageScore = numProcessedSubtests > 0 ? totalScoreSum / numProcessedSubtests : 0.0;
                const percentageCorrect = totalQuestionsAll > 0 ? (totalCorrectCalculated / totalQuestionsAll) * 100 : 0.0;
                const quartiles = calculateQuartiles(validScores);

                const summary = {
                    total_score: totalScoreSum, // Mungkin kurang bermakna di Mode 2, tapi kita tampilkan
                    average_score: averageScore,
                    total_correct: totalCorrectCalculated,
                    total_questions: totalQuestionsAll,
                    percentage_correct: percentageCorrect,
                    quartiles: quartiles
                };

                // Tampilkan hasil
                displayResults({ results, summary });
                resultsSection.style.display = 'block';

            } catch (error) {
                // Tangani error kalkulasi umum
                console.error('General Calculation Error:', error);
                errorMessageDiv.textContent = `Calculation Failed: ${error.message}`;
                errorMessageDiv.style.display = 'block';
                resultsSection.style.display = 'block'; // Tampilkan bagian hasil agar error terlihat
                resultsTableBody.innerHTML = ''; // Kosongkan tabel
                clearSummaryFields();
                updateScoreChart([], []); // Kosongkan grafik
            } finally {
                // UI Feedback
                loadingIndicator.style.display = 'none';
                calculateButton.disabled = false;
            }
        }, 300); // Akhir setTimeout (simulasi delay)
    }

    /**
     * Menampilkan hasil perhitungan di tabel, ringkasan statistik,
     * dan memperbarui grafik batang skor.
     * (Fungsi ini sama seperti di jawaban Flask sebelumnya)
     */
    function displayResults(data) {
        // ... (Salin kode fungsi displayResults dari jawaban Flask sebelumnya)
        // Membersihkan tabel, mengisi tabel, mengisi ringkasan, memanggil updateScoreChart
        // Bersihkan isi tabel dan pesan error sebelumnya
        resultsTableBody.innerHTML = '';
        errorMessageDiv.style.display = 'none'; // Sembunyikan error global jika sukses
        errorMessageDiv.textContent = '';

        const validScores = []; // Untuk chart dan statistik
        const labels = []; // Nama subtest untuk chart

        // Isi tabel hasil dan kumpulkan data untuk grafik
        if (data.results && Object.keys(data.results).length > 0) {
            for (const subName in data.results) {
                const res = data.results[subName];
                const row = resultsTableBody.insertRow(); // Buat baris baru di tabel

                // Buat sel untuk setiap kolom
                row.insertCell().textContent = subName;
                const scoreCell = row.insertCell();
                const correctCell = row.insertCell();
                const totalQsCell = row.insertCell(); // Total Questions
                const notesCell = row.insertCell();

                totalQsCell.textContent = res.total ?? 'N/A'; // Tampilkan total soal

                // Periksa apakah ada error spesifik untuk subtes ini
                if (res.error) {
                    // Tampilkan input asli dan pesan error
                    scoreCell.textContent = res.score; // Skor/Input asli
                    correctCell.textContent = res.correct; // Jawaban benar/Input asli
                    scoreCell.classList.add('error-input'); // Tambahkan kelas CSS error
                    correctCell.classList.add('error-input');
                    notesCell.textContent = `${res.error}`; // Tampilkan pesan error di kolom Notes
                    notesCell.classList.add('error-input');
                } else {
                    // Jika tidak ada error, tampilkan hasil perhitungan
                    const scoreValue = typeof res.score === 'number' ? res.score : null;
                    scoreCell.textContent = scoreValue !== null ? scoreValue.toFixed(2) : 'N/A'; // Format skor
                    correctCell.textContent = res.correct !== null ? res.correct : 'N/A'; // Tampilkan jawaban benar
                    notesCell.textContent = '-'; // Tidak ada catatan/error

                    // Jika skor valid, tambahkan ke data untuk grafik
                    if (scoreValue !== null) {
                        validScores.push(scoreValue);
                        labels.push(subName);
                    }
                }
            }
        } else {
             resultsTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:#868e96;">No detailed results data received or calculated.</td></tr>';
        }

        // Isi area ringkasan statistik
        if (data.summary) {
            const summary = data.summary;
            summaryTotalScoreEl.textContent = summary.total_score?.toFixed(2) ?? 'N/A';
            summaryAverageScoreEl.textContent = summary.average_score?.toFixed(2) ?? 'N/A';
            summaryCorrectVsTotalEl.textContent = `${summary.total_correct ?? 'N/A'} / ${summary.total_questions ?? 'N/A'}`;
            summaryPercentageEl.textContent = `${summary.percentage_correct?.toFixed(2) ?? 'N/A'}%`;

            // Tampilkan Kuartil
            summaryQ1El.textContent = summary.quartiles?.q1?.toFixed(2) ?? 'N/A';
            summaryMedianEl.textContent = summary.quartiles?.median?.toFixed(2) ?? 'N/A';
            summaryQ3El.textContent = summary.quartiles?.q3?.toFixed(2) ?? 'N/A';
        } else {
            clearSummaryFields();
        }

        // Perbarui atau buat grafik batang skor
        updateScoreChart(labels, validScores);
    }


    /**
     * Fungsi helper untuk mengosongkan semua field di area ringkasan.
     * (Sama seperti sebelumnya)
     */
    function clearSummaryFields() {
         // ... (Salin kode fungsi clearSummaryFields dari jawaban Flask sebelumnya)
        summaryTotalScoreEl.textContent = 'N/A';
        summaryAverageScoreEl.textContent = 'N/A';
        summaryCorrectVsTotalEl.textContent = 'N/A / N/A';
        summaryPercentageEl.textContent = 'N/A%';
        summaryQ1El.textContent = 'N/A';
        summaryMedianEl.textContent = 'N/A';
        summaryQ3El.textContent = 'N/A';
    }

    /**
     * Membuat atau memperbarui instance grafik batang Chart.js.
     * (Sama seperti sebelumnya)
     */
    function updateScoreChart(labels, scores) {
        // ... (Salin kode fungsi updateScoreChart dari jawaban Flask sebelumnya)
         const ctx = scoreChartCanvas.getContext('2d');
        if (scoreChart) {
            scoreChart.destroy();
            scoreChart = null;
        }
        if (!labels || labels.length === 0 || !scores || scores.length === 0 || labels.length !== scores.length) {
             ctx.clearRect(0, 0, scoreChartCanvas.width, scoreChartCanvas.height);
             ctx.font = "16px Roboto";
             ctx.fillStyle = "#868e96";
             ctx.textAlign = "center";
             ctx.fillText("No valid score data to display chart.", scoreChartCanvas.width / 2, 40);
            return;
         }
        scoreChart = new Chart(ctx, {
            type: 'bar',
            data: { /* ... data ... */
                labels: labels,
                datasets: [{
                    label: 'Score',
                    data: scores,
                    backgroundColor: 'rgba(77, 171, 247, 0.6)',
                    borderColor: 'rgba(77, 171, 247, 1)',
                    borderWidth: 1,
                    borderRadius: 4,
                }]
             },
            options: { /* ... options ... */
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'x',
                scales: { y: { /* ... */ }, x: { /* ... */ } },
                plugins: { legend: { display: false }, tooltip: { /* ... callbacks ... */ } },
                animation: { duration: 800, easing: 'easeOutQuart' }
             }
        });
    }

    // --- Event Listeners ---
    yearSelect.addEventListener('change', updateInputFields);
    modeRadios.forEach(radio => radio.addEventListener('change', updateInputFields));
    calculatorForm.addEventListener('submit', handleFormSubmit);

    // --- Initial Load ---
    updateInputFields(); // Muat field input untuk pertama kali

}); // Akhir DOMContentLoaded
