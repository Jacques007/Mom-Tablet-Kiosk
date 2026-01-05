        const days = ["Sondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrydag", "Saterdag"];
        const months = ["Januarie", "Februarie", "Maart", "April", "Mei", "Junie",
                    "Julie", "Augustus", "September", "Oktober", "November", "Desember"];

        const dtoday = new Date();
        const dd = String(dtoday.getDate());
        const dayName = days[dtoday.getDay()];
        const mmm = months[dtoday.getMonth()];
        const ccyy = dtoday.getFullYear();


        document.getElementById("date").innerText = "Vandag is "  + dayName + " " + dd + " " + mmm;

        const tomorrow = new Date(dtoday);
        tomorrow.setDate(dtoday.getDate() + 1); // Add 1 day
        const tdayName = days[tomorrow.getDay()];
        const tdd = String(tomorrow.getDate());
        const tmmm = months[tomorrow.getMonth()];
        const tccyy = tomorrow.getFullYear();
        
        document.getElementById("date2").innerText = "Môre is "  + tdayName + " " + tdd + " " + tmmm;
