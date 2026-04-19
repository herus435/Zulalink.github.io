document.addEventListener('DOMContentLoaded', () => {
    
    /* =========================================
       MODÜL 1: LOJİK MİKROİŞLEM SİMÜLATÖRÜ
       ========================================= */
    const calculateBtn = document.getElementById('calculateBtn');
    
    calculateBtn.addEventListener('click', () => {
        const aStr = document.getElementById('inputA').value;
        const bStr = document.getElementById('inputB').value;
        const operation = document.getElementById('operation').value;
        const resultSpan = document.getElementById('result');
        const explanationP = document.getElementById('explanation');

        // Geçerli binary kontrolü
        const isValidBinary = (str) => /^[01]{1,4}$/.test(str);
        
        if (!isValidBinary(aStr) || (!isValidBinary(bStr) && operation !== 'NOT')) {
            alert("Lütfen sadece 0 ve 1 içeren geçerli 4-bit değerler girin.");
            return;
        }

        const a = parseInt(aStr, 2);
        const b = parseInt(bStr, 2);
        let res = 0;
        let explanation = "";

        switch (operation) {
            case 'AND':
                res = a & b;
                explanation = "AND işlemi: Maskeleme (Mask) için kullanılır. B saklayıcısındaki 0 olan bitler, A saklayıcısındaki ilgili bitleri sıfırlar.";
                break;
            case 'OR':
                res = a | b;
                explanation = "OR işlemi: Seçici Birleme (Selective-set) için kullanılır. B saklayıcısındaki 1 olan bitler, A saklayıcısında karşılık gelen bitleri 1 yapar.";
                break;
            case 'XOR':
                res = a ^ b;
                explanation = "XOR işlemi: Seçici Tümleme (Selective-complement) için kullanılır. B'deki 1 olan bitler A'nın ilgili bitlerini tersine çevirir.";
                break;
            case 'NOT':
                res = (~a) & 15; // 4-bit limit
                explanation = "NOT işlemi: Sadece A saklayıcısındaki tüm bitlerin tümleyenini (tersini) alır.";
                break;
        }

        let binaryResult = res.toString(2).padStart(4, '0');
        resultSpan.textContent = binaryResult;
        explanationP.textContent = explanation;
    });


    /* =========================================
       MODÜL 2: MİNİ OYUN (VERİYOLU USTASI)
       ========================================= */
    const registers = [
        { name: 'AR (Address Reg)', code: '001' },
        { name: 'PC (Program Counter)', code: '010' },
        { name: 'DR (Data Reg)', code: '011' },
        { name: 'AC (Accumulator)', code: '100' },
        { name: 'IR (Instruction Reg)', code: '101' },
        { name: 'TR (Temporary Reg)', code: '110' },
        { name: 'Bellek (Memory)', code: '111' }
    ];

    let score = 0;
    let timeLeft = 30;
    let gameInterval;
    let currentTarget = null;

    const scoreEl = document.getElementById('score');
    const timeEl = document.getElementById('time');
    const targetEl = document.getElementById('target-register');
    const feedbackEl = document.getElementById('game-feedback');
    const routeBtn = document.getElementById('route-btn');
    const startBtn = document.getElementById('start-game-btn');
    const bitBtns = document.querySelectorAll('.bit-btn');

    // Bit butonlarını 0/1 yapma mantığı
    bitBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (routeBtn.disabled) return;
            
            if (e.target.innerText === '0') {
                e.target.innerText = '1';
                e.target.classList.add('active');
            } else {
                e.target.innerText = '0';
                e.target.classList.remove('active');
            }
        });
    });

    function nextRound() {
        const randomIndex = Math.floor(Math.random() * registers.length);
        currentTarget = registers[randomIndex];
        targetEl.innerText = currentTarget.name;
        
        bitBtns.forEach(btn => {
            btn.innerText = '0';
            btn.classList.remove('active');
        });
    }

    function startGame() {
        score = 0;
        timeLeft = 30;
        scoreEl.innerText = score;
        timeEl.innerText = timeLeft;
        feedbackEl.innerText = "";
        
        startBtn.style.display = 'none';
        routeBtn.disabled = false;
        
        nextRound();

        gameInterval = setInterval(() => {
            timeLeft--;
            timeEl.innerText = timeLeft;
            
            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);
    }

    function endGame() {
        clearInterval(gameInterval);
        routeBtn.disabled = true;
        startBtn.style.display = 'block';
        startBtn.innerText = "Tekrar Oyna";
        targetEl.innerText = "Oyun Bitti!";
        feedbackEl.innerText = `Süren doldu! Toplam Skor: ${score}`;
        feedbackEl.style.color = "#f1c40f";
    }

    routeBtn.addEventListener('click', () => {
        const s2 = document.getElementById('s2').innerText;
        const s1 = document.getElementById('s1').innerText;
        const s0 = document.getElementById('s0').innerText;
        const userCode = s2 + s1 + s0;

        if (userCode === currentTarget.code) {
            score += 10;
            feedbackEl.innerText = "Doğru bağlantı! +10 Puan";
            feedbackEl.style.color = "#2ecc71";
            timeLeft += 2; // Doğru bilince ekstra süre
        } else {
            score -= 5;
            feedbackEl.innerText = `Hata! ${currentTarget.name} için kod ${currentTarget.code} olmalıydı. -5 Puan`;
            feedbackEl.style.color = "#e74c3c";
        }
        
        scoreEl.innerText = score;
        timeEl.innerText = timeLeft; // Kazanılan süreyi anında ekranda göster
        nextRound();
    });

    startBtn.addEventListener('click', startGame);
});
