var href = document.getElementsByClassName("file ical")[0].href
fetch(href).then(r => r.text()).then(d => addNumSemana(d))

function parseDate(str) {
        year = Number(str.substring(0, 4))
        month = Number(str.substring(4, 6))
        day = Number(str.substring(6, 8))

        date = new Date(year, month - 1, day)
        return date
}

// basicamente me devuelve todas las fechas que corresponden a la semana de
// "date"
function getWeek(date) {
        var dia = date.getDay()
        var diff = date.getDate() - dia + (dia == 0 ? -6 : 1)
        var lunes = new Date(date.setDate(diff)), semana = [new Date(lunes)]
        while (lunes.setDate(lunes.getDate() + 1) && lunes.getDay() !== 1) {
                semana.push(new Date(lunes))
        }
        return semana
}

function sonMismaFecha(d1, d2) {
        dia1 = new Date(d1)
        dia2 = new Date(d2)
        dia1.setHours(0, 0, 0, 0)
        dia2.setHours(0, 0, 0, 0)
        return +dia1 == +dia2
}

// Podría extender la clase Date, pero qué paja B)
function estanEnMismaSemana(d1, d2) {
        var semana_d1 = getWeek(d1)
        dia2 = new Date(d2)
        dia2.setHours(0, 0, 0, 0)

        for (var dia of semana_d1) {
                dia.setHours(0, 0, 0, 0)
                if (sonMismaFecha(dia, d2)) {
                        return true
                }
        }
        return false
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

function reduceWeek(fechas) {
        var actual = fechas[0]
        var filtradas = []

        var i = 1
        while (i < fechas.length) {

                // Esta condición es redundante, pero cuando no la pongo se
                // muere todo aaaaa
                while (estanEnMismaSemana(actual, fechas[i]) || sonMismaFecha(actual, fechas[i])) {
                        actual = fechas[i]
                        i += 1
                }
                filtradas.push(actual)
                actual = fechas[i]
                i += 1
        }
        return filtradas
}

function esSemanaConClases(fecha, semanas) {
        for (var dia of semanas) {
                if (estanEnMismaSemana(dia, fecha)) {
                        return true
                }
        }
        return false
}

function recesosHasta(actual, clases) {
        var recesos = 0
        var semanas_entre = 0

        var i = 0
        while (i < clases.length) {
                console.log(actual)
                console.log(clases[i])
                console.log(clases[i] > actual || estanEnMismaSemana(clases[i], actual))
                if ( clases[i] > actual || estanEnMismaSemana(clases[i], actual)) {
                        return recesos
                }

                semanas_entre = semanasEntre(clases[i], clases[i + 1])
                console.log(semanas_entre)
                recesos += semanas_entre - 1
                console.log(`recesos: ${recesos}`)
                i += semanas_entre
        }
        return recesos
}

function addNumSemana(texto) {
        var fecha_horario_dom = document.getElementById("body").getElementsByTagName("h1")[0]

        // Porque no somos tontos y usamos el sistema dd/mm/yyyy tenemos que
        // hacer esto aaaaa
        var partes_fecha = fecha_horario_dom.innerText.split(" ")[2].split("/")

        var fecha_actual = new Date(partes_fecha[2], partes_fecha[1] - 1, partes_fecha[0])
        var date;

        // Parseamos los datos de iCal
        var eventos = ICAL.parse(texto)[2]

        // Hacemos un arreglo solo con las fechas de los eventos. El resto de
        // la metadata no nos importa.
        var fechas = []
        eventos.forEach(e => fechas.push(new Date(e[1][4][3])))
        fechas.sort(function(d1, d2){
                return d1 - d2
        })

        var fechas_filt = reduceWeek(fechas)
        var semanas_total = semanasEntre(fechas_filt[0], fecha_actual) + 1 // +1 porque queremos tomar en cuenta la actual
        var recesos_pasados = recesosHasta(fecha_actual, fechas_filt)
        var hay_clases = esSemanaConClases(fecha_actual, fechas_filt)

        console.log(recesos_pasados)

        var texto = hay_clases? semanas_total - recesos_pasados:"No hay clases"

        const add = " (" + texto + ")"

        // Insertamos el texto en la página
        fecha_horario_dom.append(add)
}
