document.addEventListener('DOMContentLoaded', () => {
    const calculateBtn = document.getElementById('calculateBtn');
    
    calculateBtn.addEventListener('click', () => {
        const aStr = document.getElementById('inputA').value;
        const bStr = document.getElementById('inputB').value;
        const operation = document.getElementById('operation').value;
        const resultSpan = document.getElementById('result');
        const explanationP = document.getElementById('explanation');

        // Sadece 1 ve 0 girildiğini kontrol et
        const isValidBinary = (str) => /^[01]{1,4}$/.test(str);
        
        if (!isValidBinary(aStr) || (!isValidBinary(bStr) && operation !== 'NOT')) {
            alert("Lütfen sadece 0 ve 1 içeren geçerli 4-bit değerler girin.");
            return;
        }

        // String'leri integer'a çevir
        const a = parseInt(aStr, 2);
        const b = parseInt(bStr, 2);
        let res = 0;
        let explanation = "";

        // İşlem mantığı
        switch (operation) {
            case 'AND':
                res = a & b;
                explanation = "AND işlemi: Maskeleme (Mask) için kullanılır. B saklayıcısındaki 0 olan bitler, A saklayıcısındaki ilgili bitleri sıfırlar (maskeler).";
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
                // 4-bit ile sınırlamak için & 15 (yani 1111) kullanıyoruz
                res = (~a) & 15;
                explanation = "NOT işlemi: A saklayıcısındaki tüm bitlerin tümleyenini (tersini) alır.";
                break;
        }

        // Sonucu tekrar 4-bitlik binary string'e çevir
        let binaryResult = res.toString(2).padStart(4, '0');
        
        // Ekrana yazdır
        resultSpan.textContent = binaryResult;
        explanationP.textContent = explanation;
    });
});
