function parse(input) {
    let output = `"${input}"`
    if (input.startsWith('EUR ')) {
        output = `"${input.replace('EUR ', '').split('.').join('')}"`
    }
    return output
}

function table_csv(t) {
    let x = []
    t.querySelectorAll('tr').forEach((r) => {
        let y = []
        r.querySelectorAll('td, th').forEach((c) => {
            y.push(parse(c.textContent))
        })
        x.push(y)
    })
    let l = x[0].length
    x.forEach((r, i) => {
        if (!(r.length === l)) {
            r.unshift('')
        }
        x[i] = r.join(',')
    })
    x.pop()  // Get rid of the final row containing the button
    return x.join('\n')
}

function go(e) {
    let t = e.target.closest('table')
    let b = document.createElement('a')
    b.setAttribute('download', 'export.csv')
    b.href = `data:text/csv,${encodeURIComponent(table_csv(t))}`
    b.innerHTML = 'Download'
    t.querySelector('tr:last-of-type button').remove()
    t.querySelector('tr:last-of-type td').appendChild(b)
}

document.querySelectorAll('table tbody').forEach((t) => {
    t.insertAdjacentHTML('beforeend', `
        <tr><td><button>Exporteer</button></td></tr>
    `)
    t.querySelector('tr:last-of-type > td > button').addEventListener('click', go)
})
