        const days = ["Sondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrydag", "Saterdag"];
        const months = ["Januarie", "Februarie", "Maart", "April", "Mei", "Junie",
                    "Julie", "Augustus", "September", "Oktober", "November", "Desember"];

        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const dayName = days[today.getDay()];
        const mmm = months[today.getMonth()];
        const ccyy = today.getFullYear();


        document.getElementById("date").innerText = "Vandag is "  + dayName + " " + dd + " " + mmm + " " + ccyy;

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1); // Add 1 day
        const tdayName = days[tomorrow.getDay()];
        const tdd = String(tomorrow.getDate()).padStart(2, '0');
        const tmmm = months[tomorrow.getMonth()];
        const tccyy = tomorrow.getFullYear();
        
        document.getElementById("date2").innerText = "Môre is "  + tdayName + " " + tdd + " " + tmmm + " " + tccyy;
