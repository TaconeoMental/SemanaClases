var href = document.getElementsByClassName("file ical")[0].href
fetch(href).then(r => r.text()).then(d => addNumSemana(d))

function parseDate(str) {
        year = Number(str.substring(0, 4))
        month = Number(str.substring(4, 6))
        day = Number(str.substring(6, 8))

        date = new Date(year, month - 1, day)
        return date
}

function inicioSemana(d1) {
        let dia = 24 * 60 * 60 * 1000
        const diaSemana = d1.getDay()
        return new Date(d1.getTime() - Math.abs(0 - diaSemana) * dia)
}

function semanasEntre(d1, d2) {
        let semana = 7 * 24 * 60 * 60 * 1000
        return Math.round((inicioSemana(d2) - inicioSemana(d1)) / semana);
}

function addNumSemana(texto) {
        lineas = texto.split("\n")
        var date;
        var hoy = new Date()

        for (var i = 0; i < lineas.length; i++) {
                if (lineas[i].includes("DTSTART")) {
                        date = parseDate(lineas[i].split(":")[1].split("T")[0])
                        break
                }
        }
        const diff = semanasEntre(date, hoy) - 1
        const add = " (" + diff.toString() + ")"

        // Insertamos el texto en la página
        document.getElementById("body").getElementsByTagName("h1")[0].append(add)
}
