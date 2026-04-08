document.addEventListener('DOMContentLoaded', () => {
    // 1. Retrieve data from LocalStorage
    const plantName = localStorage.getItem('targetPlantName') || 'Your Plant';
    const targetIp = localStorage.getItem('targetIp') || '192.168.1.100';

    document.getElementById('displayPlantName').innerText = plantName;
    document.getElementById('ipDisplay').innerText = targetIp;

    // 2. Set up DOM references for metrics
    const valTemp = document.getElementById('valTemp');
    const valHum = document.getElementById('valHum');
    const valMoist = document.getElementById('valMoist');
    const valLux = document.getElementById('valLux');
    const valPh = document.getElementById('valPh');
    const valCo2 = document.getElementById('valCo2');
    
    const phMarker = document.getElementById('phMarker');
    const valN = document.getElementById('valN');
    const valP = document.getElementById('valP');
    const valK = document.getElementById('valK');
    const moistInsight = document.getElementById('moistInsight');

    // 3. Initial Mock Data State
    let state = {
        temp: 24.5,
        hum: 45,
        moist: 62,
        lux: 12000,
        ph: 6.5,
        co2: 400,
        n: 70, // %
        p: 50, // %
        k: 80  // %
    };

    // 4. Update Function
    function updateMetrics() {
        // Add subtle random walk to the mock data
        state.temp += (Math.random() * 0.4 - 0.2);
        state.hum += (Math.random() * 2 - 1);
        state.moist += (Math.random() * 1.5 - 0.5);
        state.lux += (Math.random() * 400 - 200);
        state.ph += (Math.random() * 0.04 - 0.02);
        state.co2 += (Math.random() * 10 - 5);
        
        // Boundaries
        state.moist = Math.max(0, Math.min(100, state.moist));
        state.lux = Math.max(0, state.lux);
        state.ph = Math.max(0, Math.min(14, state.ph));
        state.co2 = Math.max(300, state.co2);

        // Render values
        valTemp.innerText = state.temp.toFixed(1);
        valHum.innerText = Math.round(state.hum);
        valMoist.innerText = Math.round(state.moist);
        valLux.innerText = Math.round(state.lux);
        valPh.innerText = state.ph.toFixed(1);
        valCo2.innerText = Math.round(state.co2);

        // Visual Graph Mappings
        const phPercent = (state.ph / 14) * 100;
        phMarker.style.left = `${phPercent}%`;

        valN.style.width = `${state.n}%`;
        valP.style.width = `${state.p}%`;
        valK.style.width = `${state.k}%`;

        // Insight Text
        if (state.moist < 30) {
            moistInsight.innerText = "Needs Water!";
            moistInsight.style.color = "#ef4444";
        } else if (state.moist > 80) {
            moistInsight.innerText = "Overwatered";
            moistInsight.style.color = "#f59e0b";
        } else {
            moistInsight.innerText = "Optimal Range";
            moistInsight.style.color = "var(--primary-green)";
        }
    }

    // Run first update and set interval
    updateMetrics();
    setInterval(updateMetrics, 2000);
});
